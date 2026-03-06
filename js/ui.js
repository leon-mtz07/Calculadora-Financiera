/**
 * BA II Plus UI Controller
 * Handles all key press events and routes to engine/worksheets
 */

'use strict';

(function () {
    const E = CalcEngine;
    const W = Worksheets;
    const s = E.state;

    // ===== Key Mapping =====
    // Maps data-key to {primary, secondary} handlers
    const keyMap = {
        // Row 1
        '2ND':   { pri: toggle2nd },
        'ENTER': { pri: enterKey, sec: quitWorksheet },
        'UP':    { pri: arrowUp, sec: setKey },
        'DOWN':  { pri: arrowDown, sec: deleteKey },
        'ONOFF': { pri: toggleOnOff, sec: insertKey },

        // Row 2 - TVM
        'N':   { pri: tvmN, sec: xPY },
        'IY':  { pri: tvmIY, sec: openPY },
        'PV':  { pri: tvmPV, sec: openAmort },
        'PMT': { pri: tvmPMT, sec: toggleBGN },
        'FV':  { pri: tvmFV, sec: clearTVM },

        // Row 3
        'CPT':    { pri: cptKey },
        'LPAREN': { pri: () => E.openParen(), sec: nPrKey },
        'RPAREN': { pri: () => E.closeParen(), sec: nCrKey },
        'STO':    { pri: stoKey, sec: constantKey },
        'RCL':    { pri: rclKey, sec: ansKey },

        // Row 4
        'SIGN': { pri: () => E.changeSign(), sec: openCF },
        'CEC':  { pri: cecKey, sec: clearWork },
        'BKSP': { pri: () => E.backspace() },
        'DIV':  { pri: () => doOp('/'), sec: openIconv },
        'MUL':  { pri: () => doOp('*'), sec: openMem },

        // Row 5
        'YX':  { pri: () => doOp('^'), sec: () => E.mathReciprocal() },
        '7':   { pri: () => digit('7'), sec: openData },
        '8':   { pri: () => digit('8'), sec: openStat },
        '9':   { pri: () => digit('9'), sec: openPctChange },
        'SUB': { pri: () => doOp('-'), sec: openFormat },

        // Row 6
        'SQRT': { pri: () => E.mathSqrt(), sec: () => E.mathSquare() },
        '4':    { pri: () => digit('4'), sec: openDate },
        '5':    { pri: () => digit('5'), sec: openProfit },
        '6':    { pri: () => digit('6'), sec: openBreakeven },
        'ADD':  { pri: () => doOp('+'), sec: resetCalc },

        // Row 7
        'LN':  { pri: () => E.mathLn(), sec: () => E.mathExp() },
        '1':   { pri: () => digit('1'), sec: openBond },
        '2':   { pri: () => digit('2'), sec: openDepr },
        '3':   { pri: () => digit('3'), sec: () => E.mathFactorial() },
        'EQ':  { pri: () => E.executeEquals(), sec: openNPV },

        // Row 8
        'SIN': { pri: () => E.mathSin(), sec: () => { s.invActive = true; E.mathSin(); } },
        'COS': { pri: () => E.mathCos(), sec: () => { s.invActive = true; E.mathCos(); } },
        'TAN': { pri: () => E.mathTan(), sec: () => { s.invActive = true; E.mathTan(); } },
        '0':   { pri: () => digit('0'), sec: openIRR },
        'DOT': { pri: () => E.inputDecimal(), sec: () => E.mathRandom() },

        // Row 9 - Extra
        'INV':   { pri: () => { s.invActive = !s.invActive; E.updateDisplay(); } },
        'HYP':   { pri: () => { s.hypActive = !s.hypActive; E.updateDisplay(); } },
        'PCT':   { pri: () => E.percent() },
        'ROUND': { pri: () => E.mathRound() },
        'EE':    { pri: eeKey }
    };

    // ===== Helpers =====
    function toggle2nd() {
        s.secondActive = !s.secondActive;
        document.getElementById('keyboard').classList.toggle('second-active', s.secondActive);
        E.updateDisplay();
    }

    function digit(d) {
        if (s.stoActive) {
            let n = parseInt(d);
            if (n >= 0 && n <= 9) {
                if (s.stoOp) {
                    E.storeMemoryOp(s.stoOp, n);
                    s.stoOp = null;
                } else {
                    E.storeMemory(n);
                }
                s.stoActive = false;
                s.label = '';
                E.updateDisplay();
                return;
            }
        }
        if (s.rclActive) {
            let n = parseInt(d);
            if (n >= 0 && n <= 9) {
                E.recallMemory(n);
                s.rclActive = false;
                s.label = '';
                E.updateDisplay();
                return;
            }
        }
        E.inputDigit(d);
    }

    function doOp(op) {
        if (s.stoActive) {
            s.stoOp = op;
            return;
        }
        if (s.cptActive) {
            // CPT + operator doesn't make sense, cancel CPT
            s.cptActive = false;
        }
        // Handle nPr/nCr as binary operators
        E.executeOp(op);
    }

    function enterKey() {
        // In worksheet context, ENTER assigns value
        // In normal context, nothing special (or acts like =)
        if (s.activeWorksheet) {
            // ENTER in worksheet - value assigned
            return;
        }
        // Just finalize input without evaluating
        s.inputMode = false;
        E.updateDisplay();
    }

    function quitWorksheet() {
        s.activeWorksheet = null;
        s.worksheetIndex = 0;
        W.hide();
        s.label = '';
        s.assignIndicator = '';
        E.updateDisplay();
    }

    function arrowUp() {
        // Navigation in worksheets - handled by worksheet panels
    }

    function arrowDown() {
        // Navigation in worksheets - handled by worksheet panels
    }

    function setKey() {
        // SET toggles settings in worksheets
    }

    function deleteKey() {
        // DEL in cash flow / stat data
    }

    function insertKey() {
        // INS in cash flow / stat data
    }

    function toggleOnOff() {
        s.on = !s.on;
        document.querySelector('.calculator').classList.toggle('off', !s.on);
        if (s.on) {
            E.updateDisplay();
        }
    }

    // ===== TVM Keys =====
    function tvmN() {
        if (s.cptActive) {
            let result = E.tvmSolve('N');
            if (isNaN(result)) { E.showError('Error'); s.cptActive = false; return; }
            s.tvm.N = result;
            s.tvmComputed.N = true;
            s.cptActive = false;
            E.setDisplayValue(result, 'N=', '*');
        } else {
            let val = E.getDisplayValue();
            s.tvm.N = val;
            s.tvmComputed.N = false;
            E.setDisplayValue(val, 'N=', '=');
        }
    }

    function tvmIY() {
        if (s.cptActive) {
            let result = E.tvmSolve('IY');
            if (isNaN(result)) { E.showError('Error'); s.cptActive = false; return; }
            s.tvm.IY = result;
            s.tvmComputed.IY = true;
            s.cptActive = false;
            E.setDisplayValue(result, 'I/Y=', '*');
        } else {
            let val = E.getDisplayValue();
            s.tvm.IY = val;
            s.tvmComputed.IY = false;
            E.setDisplayValue(val, 'I/Y=', '=');
        }
    }

    function tvmPV() {
        if (s.cptActive) {
            let result = E.tvmSolve('PV');
            if (isNaN(result)) { E.showError('Error'); s.cptActive = false; return; }
            s.tvm.PV = result;
            s.tvmComputed.PV = true;
            s.cptActive = false;
            E.setDisplayValue(result, 'PV=', '*');
        } else {
            let val = E.getDisplayValue();
            s.tvm.PV = val;
            s.tvmComputed.PV = false;
            E.setDisplayValue(val, 'PV=', '=');
        }
    }

    function tvmPMT() {
        if (s.cptActive) {
            let result = E.tvmSolve('PMT');
            if (isNaN(result)) { E.showError('Error'); s.cptActive = false; return; }
            s.tvm.PMT = result;
            s.tvmComputed.PMT = true;
            s.cptActive = false;
            E.setDisplayValue(result, 'PMT=', '*');
        } else {
            let val = E.getDisplayValue();
            s.tvm.PMT = val;
            s.tvmComputed.PMT = false;
            E.setDisplayValue(val, 'PMT=', '=');
        }
    }

    function tvmFV() {
        if (s.cptActive) {
            let result = E.tvmSolve('FV');
            if (isNaN(result)) { E.showError('Error'); s.cptActive = false; return; }
            s.tvm.FV = result;
            s.tvmComputed.FV = true;
            s.cptActive = false;
            E.setDisplayValue(result, 'FV=', '*');
        } else {
            let val = E.getDisplayValue();
            s.tvm.FV = val;
            s.tvmComputed.FV = false;
            E.setDisplayValue(val, 'FV=', '=');
        }
    }

    function xPY() {
        // Multiply N by P/Y
        let val = E.getDisplayValue();
        let result = val * s.PY;
        s.tvm.N = result;
        E.setDisplayValue(result, 'N=', '=');
    }

    function openPY() {
        W.openPY();
    }

    function openAmort() {
        W.openAmort();
    }

    function toggleBGN() {
        s.beginMode = !s.beginMode;
        E.setDisplayValue(s.beginMode ? 1 : 0, s.beginMode ? 'BGN' : 'END', '');
        E.updateDisplay();
    }

    function clearTVM() {
        s.tvm = { N: 0, IY: 0, PV: 0, PMT: 0, FV: 0 };
        s.tvmComputed = { N: false, IY: false, PV: false, PMT: false, FV: false };
        E.clearEntry();
    }

    // ===== CPT =====
    function cptKey() {
        s.cptActive = true;
        E.updateDisplay();
    }

    // ===== STO / RCL =====
    function stoKey() {
        s.stoActive = true;
        s.stoOp = null;
        s.label = 'STO ';
        E.updateDisplay();
    }

    function rclKey() {
        s.rclActive = true;
        s.label = 'RCL ';
        E.updateDisplay();
    }

    function constantKey() {
        // Store constant: next operation and value become the constant
        s.constant = { pending: true };
        s.label = 'K ';
        E.updateDisplay();
    }

    function ansKey() {
        E.setDisplayValue(s.lastResult, 'ANS=', '');
    }

    // ===== CE/C =====
    function cecKey() {
        if (s.inputMode || s.display !== '0') {
            E.clearEntry();
        } else {
            E.clearAll();
        }
    }

    function clearWork() {
        // Clear current worksheet
        if (s.activeWorksheet === 'CF') {
            s.cashFlows = [0];
            s.cashFlowFreq = [1];
        } else if (s.activeWorksheet === 'DATA' || s.activeWorksheet === 'STAT') {
            s.statData = [];
        }
        E.clearEntry();
    }

    // ===== nPr / nCr =====
    function nPrKey() {
        // Works as binary: user enters n, presses nPr, enters r, presses =
        doOp('nPr');
    }

    function nCrKey() {
        doOp('nCr');
    }

    // ===== EE (Scientific Notation Entry) =====
    function eeKey() {
        if (!s.on) return;
        if (s.inputMode) {
            if (!s.display.includes('E')) {
                s.display += 'E+';
            }
            E.updateDisplay();
        }
    }

    // ===== Worksheet Openers =====
    function openCF() { W.openCashFlow(); }
    function openIconv() { W.openIconv(); }
    function openMem() { W.openMemory(); }
    function openData() { W.openData(); }
    function openStat() { W.openStat(); }
    function openPctChange() { W.openPctChange(); }
    function openFormat() { W.openFormat(); }
    function openDate() { W.openDate(); }
    function openProfit() { W.openProfit(); }
    function openBreakeven() { W.openBreakeven(); }
    function openBond() { W.openBond(); }
    function openDepr() { W.openDepr(); }
    function openNPV() { W.openCashFlow(); }
    function openIRR() { W.openCashFlow(); }

    function resetCalc() {
        if (confirm('¿Restablecer toda la calculadora a valores de fábrica?')) {
            E.fullReset();
        }
    }

    // ===== Key Press Handler =====
    function handleKeyPress(keyId) {
        if (!s.on && keyId !== 'ONOFF') return;

        let mapping = keyMap[keyId];
        if (!mapping) return;

        if (s.secondActive && mapping.sec) {
            s.secondActive = false;
            document.getElementById('keyboard').classList.remove('second-active');
            mapping.sec();
        } else if (mapping.pri) {
            if (keyId !== '2ND') {
                s.secondActive = false;
                document.getElementById('keyboard').classList.remove('second-active');
            }
            mapping.pri();
        }
    }

    // ===== Event Binding =====
    function init() {
        // Button clicks
        document.querySelectorAll('.key').forEach(btn => {
            let keyId = btn.getAttribute('data-key');

            // Prevent double-firing on touch devices
            btn.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                handleKeyPress(keyId);
            });
        });

        // Worksheet close button
        document.getElementById('ws-close').addEventListener('click', () => {
            W.hide();
            s.activeWorksheet = null;
        });

        // Close worksheet on overlay click
        document.getElementById('ws-overlay').addEventListener('click', (e) => {
            if (e.target === document.getElementById('ws-overlay')) {
                W.hide();
                s.activeWorksheet = null;
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
            if (document.activeElement && document.activeElement.tagName === 'SELECT') return;

            let key = e.key;
            let mapped = null;

            if (key >= '0' && key <= '9') mapped = key;
            else if (key === '.') mapped = 'DOT';
            else if (key === '+') mapped = 'ADD';
            else if (key === '-') mapped = 'SUB';
            else if (key === '*') mapped = 'MUL';
            else if (key === '/') { mapped = 'DIV'; e.preventDefault(); }
            else if (key === 'Enter' || key === '=') mapped = 'EQ';
            else if (key === 'Backspace') mapped = 'BKSP';
            else if (key === 'Escape') mapped = 'CEC';
            else if (key === '(') mapped = 'LPAREN';
            else if (key === ')') mapped = 'RPAREN';
            else if (key === 'n' || key === 'N') mapped = 'N';
            else if (key === 'p' || key === 'P') mapped = 'PV';
            else if (key === 'f' || key === 'F') mapped = 'FV';
            else if (key === 'i' || key === 'I') mapped = 'IY';
            else if (key === 'm' || key === 'M') mapped = 'PMT';
            else if (key === 'c' || key === 'C') mapped = 'CPT';

            if (mapped) {
                e.preventDefault();
                handleKeyPress(mapped);
            }
        });

        // Prevent context menu on long press
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.calculator')) {
                e.preventDefault();
            }
        });

        // Initial display
        E.updateDisplay();
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
