/**
 * BA II Plus Calculator Engine
 * Core calculation engine with full arithmetic, memory, TVM, and financial functions
 */

'use strict';

const CalcEngine = (function () {
    // ===== Internal State =====
    const state = {
        on: true,
        display: '0',
        label: '',
        assignIndicator: '',
        inputMode: false,     // true when user is typing a number
        decimalEntered: false,
        lastResult: 0,        // last computed result (ANS)
        currentValue: 0,      // value on display as number

        // Operator stack for AOS/Chain
        operatorStack: [],    // {op, value}
        pendingOp: null,
        pendingValue: 0,
        parenDepth: 0,
        parenStack: [],       // saves state when ( is pressed

        // Mode
        secondActive: false,
        cptActive: false,
        stoActive: false,
        stoOp: null,
        rclActive: false,
        invActive: false,
        hypActive: false,

        // Settings
        calcMode: 'AOS',     // 'CHN' or 'AOS'
        decimals: 9,          // 0-9, 9 = floating
        angleUnit: 'DEG',     // 'DEG' or 'RAD'
        dateFormat: 'US',     // 'US' or 'EU'
        separator: 'US',      // 'US' or 'EU'

        // Memory
        memory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // M0-M9

        // TVM
        tvm: { N: 0, IY: 0, PV: 0, PMT: 0, FV: 0 },
        tvmComputed: { N: false, IY: false, PV: false, PMT: false, FV: false },
        PY: 1,    // Payments per year
        CY: 1,    // Compounding periods per year
        beginMode: false, // BGN vs END

        // Cash Flow
        cashFlows: [0],       // CF0 ... CF24
        cashFlowFreq: [1],    // F01 ... F24

        // Amortization
        amortP1: 1,
        amortP2: 1,

        // Bond
        bond: {
            SDT: '01-01-2026',
            CPN: 0,
            RDT: '01-01-2036',
            RV: 100,
            dayCount: 'ACT',  // 'ACT' or '360'
            couponFreq: 2,    // 1 or 2
            YLD: 0,
            PRI: 0,
            AI: 0
        },

        // Depreciation
        depr: {
            method: 'SL',
            CST: 0,
            SAL: 0,
            LIF: 0,
            YR: 1,
            DB: 200,
            DEP: 0,
            RBV: 0,
            RDV: 0
        },

        // Statistics
        statData: [],  // [{x, y}]
        statModel: 'LIN',  // LIN, LOG, EXP, PWR

        // Percent Change
        pctChange: { OLD: 0, NEW: 0, PCH: 0, PD: 1 },

        // Interest Conversion
        iconv: { NOM: 0, EFF: 0, CY: 1 },

        // Date
        dateCalc: { DT1: '01-01-2026', DT2: '01-01-2026', DBD: 0, method: 'ACT' },

        // Profit Margin
        profit: { CST: 0, SEL: 0, MAR: 0 },

        // Breakeven
        breakeven: { FC: 0, VC: 0, P: 0, PFT: 0, Q: 0 },

        // Constant
        constant: null,  // {op, value}

        // Active worksheet
        activeWorksheet: null,
        worksheetIndex: 0,
    };

    // ===== Display =====
    function formatNumber(val) {
        if (val === undefined || val === null || isNaN(val)) return 'Error';
        if (!isFinite(val)) return val > 0 ? '9.999999E+99' : '-9.999999E+99';

        let dec = state.decimals;
        let absVal = Math.abs(val);

        // Scientific notation for very large or very small numbers
        if (absVal !== 0 && (absVal >= 1e10 || absVal < 1e-9)) {
            let exp = Math.floor(Math.log10(absVal));
            let mantissa = val / Math.pow(10, exp);
            let mantDec = dec === 9 ? 6 : Math.min(dec, 6);
            return mantissa.toFixed(mantDec) + 'E' + (exp >= 0 ? '+' : '') + exp;
        }

        if (dec === 9) {
            // Floating decimal: show up to 9 significant digits, trim trailing zeros
            let s = val.toPrecision(10);
            let num = parseFloat(s);
            s = String(num);
            // Limit to 10 display chars
            if (s.replace('-', '').replace('.', '').length > 10) {
                s = num.toPrecision(9);
                s = String(parseFloat(s));
            }
            return s;
        } else {
            let s = val.toFixed(dec);
            // Limit display
            if (s.replace('-', '').replace('.', '').length > 10) {
                let exp = Math.floor(Math.log10(Math.abs(val)));
                let mantissa = val / Math.pow(10, exp);
                return mantissa.toFixed(Math.min(dec, 5)) + 'E' + (exp >= 0 ? '+' : '') + exp;
            }
            return s;
        }
    }

    function applySeparator(str) {
        if (state.separator === 'EU') {
            // Swap . and ,
            str = str.replace(/\./g, '#').replace(/,/g, '.').replace(/#/g, ',');
        }
        return str;
    }

    function updateDisplay() {
        if (!state.on) return;
        const el = document.getElementById('display-value');
        const lbl = document.getElementById('display-label');
        const asgn = document.getElementById('display-assign');
        if (el) {
            let txt = state.inputMode ? state.display : formatNumber(state.currentValue);
            el.textContent = applySeparator(txt);
        }
        if (lbl) lbl.textContent = state.label;
        if (asgn) asgn.textContent = state.assignIndicator;
        updateIndicators();
    }

    function updateIndicators() {
        const setInd = (id, visible) => {
            const el = document.getElementById(id);
            if (el) el.classList.toggle('hidden', !visible);
        };
        setInd('ind-2nd', state.secondActive);
        setInd('ind-inv', state.invActive);
        setInd('ind-hyp', state.hypActive);
        setInd('ind-compute', state.cptActive);
        setInd('ind-enter', false);
        setInd('ind-set', false);
        setInd('ind-bgn', state.beginMode);
        setInd('ind-rad', state.angleUnit === 'RAD');
        setInd('ind-up', state.activeWorksheet !== null);
        setInd('ind-down', state.activeWorksheet !== null);
    }

    function getDisplayValue() {
        if (state.inputMode) {
            return parseFloat(state.display) || 0;
        }
        return state.currentValue;
    }

    function setDisplayValue(val, label, assign) {
        state.currentValue = val;
        state.inputMode = false;
        state.decimalEntered = false;
        state.display = formatNumber(val);
        if (label !== undefined) state.label = label;
        if (assign !== undefined) state.assignIndicator = assign;
        updateDisplay();
    }

    function showError(msg) {
        state.currentValue = 0;
        state.inputMode = false;
        state.display = msg || 'Error';
        const el = document.getElementById('display-value');
        if (el) el.textContent = state.display;
    }

    // ===== Input Handling =====
    function inputDigit(d) {
        if (!state.on) return;
        clearModifiers();

        if (!state.inputMode) {
            state.display = d;
            state.inputMode = true;
            state.decimalEntered = false;
            state.label = '';
            state.assignIndicator = '';
        } else {
            if (state.display === '0' && d !== '.') {
                state.display = d;
            } else {
                if (state.display.replace('-', '').replace('.', '').length >= 10) return;
                state.display += d;
            }
        }
        if (d === '.') state.decimalEntered = true;
        state.currentValue = parseFloat(state.display) || 0;
        updateDisplay();
    }

    function inputDecimal() {
        if (!state.on) return;
        clearModifiers();
        if (!state.inputMode) {
            state.display = '0.';
            state.inputMode = true;
            state.decimalEntered = true;
            state.label = '';
            state.assignIndicator = '';
        } else if (!state.decimalEntered) {
            state.display += '.';
            state.decimalEntered = true;
        }
        state.currentValue = parseFloat(state.display) || 0;
        updateDisplay();
    }

    function backspace() {
        if (!state.on || !state.inputMode) return;
        if (state.display.length <= 1 || (state.display.length === 2 && state.display[0] === '-')) {
            state.display = '0';
            state.decimalEntered = false;
        } else {
            let removed = state.display[state.display.length - 1];
            state.display = state.display.slice(0, -1);
            if (removed === '.') state.decimalEntered = false;
        }
        state.currentValue = parseFloat(state.display) || 0;
        updateDisplay();
    }

    function changeSign() {
        if (!state.on) return;
        if (state.inputMode) {
            if (state.display[0] === '-') {
                state.display = state.display.substring(1);
            } else if (state.display !== '0') {
                state.display = '-' + state.display;
            }
            state.currentValue = parseFloat(state.display) || 0;
        } else {
            state.currentValue = -state.currentValue;
        }
        updateDisplay();
    }

    function clearEntry() {
        if (!state.on) return;
        state.display = '0';
        state.inputMode = false;
        state.decimalEntered = false;
        state.currentValue = 0;
        state.label = '';
        state.assignIndicator = '';
        updateDisplay();
    }

    function clearAll() {
        if (!state.on) return;
        clearEntry();
        state.operatorStack = [];
        state.pendingOp = null;
        state.pendingValue = 0;
        state.parenDepth = 0;
        state.parenStack = [];
        state.cptActive = false;
        state.secondActive = false;
        state.stoActive = false;
        state.rclActive = false;
        state.invActive = false;
        state.hypActive = false;
        updateDisplay();
    }

    function clearModifiers() {
        state.cptActive = false;
    }

    // ===== Arithmetic =====
    const opPrecedence = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3, 'nPr': 3, 'nCr': 3 };

    function applyOp(op, a, b) {
        switch (op) {
            case '+': return a + b;
            case '-': return a - b;
            case '*': return a * b;
            case '/': return b === 0 ? NaN : a / b;
            case '^': return Math.pow(a, b);
            case 'nPr': return nPrCalc(a, b);
            case 'nCr': return nCrCalc(a, b);
        }
        return b;
    }

    function factorialCalc(n) {
        if (n < 0 || n !== Math.floor(n) || n > 69) return NaN;
        let r = 1;
        for (let i = 2; i <= n; i++) r *= i;
        return r;
    }

    function nPrCalc(n, r) {
        if (n < 0 || r < 0 || r > n || n !== Math.floor(n) || r !== Math.floor(r)) return NaN;
        return factorialCalc(n) / factorialCalc(n - r);
    }

    function nCrCalc(n, r) {
        if (n < 0 || r < 0 || r > n || n !== Math.floor(n) || r !== Math.floor(r)) return NaN;
        return factorialCalc(n) / (factorialCalc(r) * factorialCalc(n - r));
    }

    function executeOp(op) {
        if (!state.on) return;
        clearModifiers();
        let val = getDisplayValue();

        if (state.calcMode === 'CHN') {
            // Chain mode: evaluate left to right
            if (state.pendingOp) {
                val = applyOp(state.pendingOp, state.pendingValue, val);
                if (isNaN(val)) { showError('Error'); return; }
            }
            state.pendingOp = op;
            state.pendingValue = val;
            state.currentValue = val;
        } else {
            // AOS mode: respect precedence
            while (state.operatorStack.length > 0) {
                let top = state.operatorStack[state.operatorStack.length - 1];
                if (top.paren) break;
                if (opPrecedence[top.op] >= opPrecedence[op]) {
                    state.operatorStack.pop();
                    val = applyOp(top.op, top.value, val);
                    if (isNaN(val) || !isFinite(val)) { showError('Error'); return; }
                } else {
                    break;
                }
            }
            state.operatorStack.push({ op: op, value: val });
            state.currentValue = val;
        }

        state.inputMode = false;
        state.decimalEntered = false;
        state.label = '';
        state.assignIndicator = '';
        updateDisplay();
    }

    function executeEquals() {
        if (!state.on) return;
        clearModifiers();
        let val = getDisplayValue();

        if (state.calcMode === 'CHN') {
            if (state.pendingOp) {
                val = applyOp(state.pendingOp, state.pendingValue, val);
                state.pendingOp = null;
            }
        } else {
            // AOS: evaluate all remaining operators
            while (state.operatorStack.length > 0) {
                let top = state.operatorStack.pop();
                if (top.paren) continue;
                val = applyOp(top.op, top.value, val);
            }
        }

        if (isNaN(val) || !isFinite(val)) {
            showError('Error');
            return;
        }

        state.lastResult = val;
        state.parenDepth = 0;
        state.parenStack = [];
        setDisplayValue(val, '', '');
    }

    function openParen() {
        if (!state.on) return;
        clearModifiers();
        if (state.parenDepth >= 15) return;

        // Save current operator state
        state.parenStack.push({
            operatorStack: [...state.operatorStack],
            pendingOp: state.pendingOp,
            pendingValue: state.pendingValue
        });

        state.operatorStack = [];
        state.pendingOp = null;
        state.pendingValue = 0;
        state.parenDepth++;
        state.inputMode = false;
        updateDisplay();
    }

    function closeParen() {
        if (!state.on || state.parenDepth === 0) return;
        clearModifiers();
        let val = getDisplayValue();

        if (state.calcMode === 'CHN') {
            if (state.pendingOp) {
                val = applyOp(state.pendingOp, state.pendingValue, val);
                state.pendingOp = null;
            }
        } else {
            while (state.operatorStack.length > 0) {
                let top = state.operatorStack.pop();
                if (top.paren) break;
                val = applyOp(top.op, top.value, val);
            }
        }

        let saved = state.parenStack.pop();
        if (saved) {
            state.operatorStack = saved.operatorStack;
            state.pendingOp = saved.pendingOp;
            state.pendingValue = saved.pendingValue;
        }
        state.parenDepth--;

        if (isNaN(val)) { showError('Error'); return; }
        setDisplayValue(val);
    }

    function percent() {
        if (!state.on) return;
        let val = getDisplayValue();
        // Percentage of the pending value
        if (state.pendingOp === '+' || state.pendingOp === '-' ||
            (state.operatorStack.length > 0 && (state.operatorStack[state.operatorStack.length - 1].op === '+' || state.operatorStack[state.operatorStack.length - 1].op === '-'))) {
            let base = state.calcMode === 'CHN' ? state.pendingValue :
                (state.operatorStack.length > 0 ? state.operatorStack[state.operatorStack.length - 1].value : 0);
            val = base * val / 100;
        } else {
            val = val / 100;
        }
        setDisplayValue(val);
    }

    // ===== Scientific Functions =====
    function toRadians(deg) { return deg * Math.PI / 180; }
    function toDegrees(rad) { return rad * 180 / Math.PI; }

    function applyUnary(fn) {
        if (!state.on) return;
        let val = getDisplayValue();
        let result;

        try {
            result = fn(val);
        } catch (e) {
            showError('Error');
            return;
        }

        if (isNaN(result) || !isFinite(result)) {
            showError('Error');
            return;
        }

        state.lastResult = result;
        setDisplayValue(result, '', '');
    }

    function mathSqrt() {
        applyUnary(v => {
            if (v < 0) return NaN;
            return Math.sqrt(v);
        });
    }

    function mathSquare() {
        applyUnary(v => v * v);
    }

    function mathReciprocal() {
        applyUnary(v => {
            if (v === 0) return NaN;
            return 1 / v;
        });
    }

    function mathLn() {
        applyUnary(v => {
            if (v <= 0) return NaN;
            return Math.log(v);
        });
    }

    function mathExp() {
        applyUnary(v => Math.exp(v));
    }

    function mathFactorial() {
        applyUnary(v => factorialCalc(v));
    }

    function mathSin() {
        applyUnary(v => {
            let angle = state.angleUnit === 'DEG' ? toRadians(v) : v;
            if (state.hypActive) {
                state.hypActive = false;
                return state.invActive ? (state.invActive = false, Math.asinh(v)) : Math.sinh(v);
            }
            if (state.invActive) {
                state.invActive = false;
                let r = Math.asin(v);
                return state.angleUnit === 'DEG' ? toDegrees(r) : r;
            }
            return Math.sin(angle);
        });
    }

    function mathCos() {
        applyUnary(v => {
            let angle = state.angleUnit === 'DEG' ? toRadians(v) : v;
            if (state.hypActive) {
                state.hypActive = false;
                return state.invActive ? (state.invActive = false, Math.acosh(v)) : Math.cosh(v);
            }
            if (state.invActive) {
                state.invActive = false;
                let r = Math.acos(v);
                return state.angleUnit === 'DEG' ? toDegrees(r) : r;
            }
            return Math.cos(angle);
        });
    }

    function mathTan() {
        applyUnary(v => {
            let angle = state.angleUnit === 'DEG' ? toRadians(v) : v;
            if (state.hypActive) {
                state.hypActive = false;
                return state.invActive ? (state.invActive = false, Math.atanh(v)) : Math.tanh(v);
            }
            if (state.invActive) {
                state.invActive = false;
                let r = Math.atan(v);
                return state.angleUnit === 'DEG' ? toDegrees(r) : r;
            }
            return Math.tan(angle);
        });
    }

    function mathRandom() {
        setDisplayValue(Math.random(), '', '');
    }

    function mathRound() {
        let val = getDisplayValue();
        let dec = state.decimals === 9 ? 9 : state.decimals;
        let factor = Math.pow(10, dec);
        setDisplayValue(Math.round(val * factor) / factor, '', '');
    }

    // ===== Memory =====
    function storeMemory(n) {
        if (n < 0 || n > 9) return;
        state.memory[n] = getDisplayValue();
        state.stoActive = false;
        state.label = '';
        state.assignIndicator = '';
        updateDisplay();
    }

    function recallMemory(n) {
        if (n < 0 || n > 9) return;
        setDisplayValue(state.memory[n], '', '');
        state.rclActive = false;
    }

    function storeMemoryOp(op, n) {
        if (n < 0 || n > 9) return;
        let val = getDisplayValue();
        switch (op) {
            case '+': state.memory[n] += val; break;
            case '-': state.memory[n] -= val; break;
            case '*': state.memory[n] *= val; break;
            case '/': state.memory[n] = val !== 0 ? state.memory[n] / val : NaN; break;
            case '^': state.memory[n] = Math.pow(state.memory[n], val); break;
        }
        state.stoActive = false;
        updateDisplay();
    }

    // ===== TVM Solver =====
    function tvmSolve(unknown) {
        let N = state.tvm.N;
        let IY = state.tvm.IY;
        let PV = state.tvm.PV;
        let PMT = state.tvm.PMT;
        let FV = state.tvm.FV;
        let PY = state.PY;
        let CY = state.CY;
        let bgn = state.beginMode ? 1 : 0;

        // Rate per period
        let i = (IY / 100) / CY;
        // Effective rate per payment period
        let periodsPerPayment = CY / PY;
        let ratePerPeriod;

        if (PY === CY) {
            ratePerPeriod = IY / 100 / PY;
        } else {
            ratePerPeriod = Math.pow(1 + i, periodsPerPayment) - 1;
        }

        switch (unknown) {
            case 'N':
                return solveTvmN(ratePerPeriod, PV, PMT, FV, bgn);
            case 'IY':
                return solveTvmIY(N, PV, PMT, FV, PY, CY, bgn);
            case 'PV':
                return solveTvmPV(N, ratePerPeriod, PMT, FV, bgn);
            case 'PMT':
                return solveTvmPMT(N, ratePerPeriod, PV, FV, bgn);
            case 'FV':
                return solveTvmFV(N, ratePerPeriod, PV, PMT, bgn);
        }
        return NaN;
    }

    function solveTvmN(r, PV, PMT, FV, bgn) {
        if (r === 0) {
            if (PMT === 0) return NaN;
            return -(PV + FV) / PMT;
        }
        let adj = bgn ? (1 + r) : 1;
        let num = Math.log((-FV * r + PMT * adj) / (PV * r + PMT * adj));
        let den = Math.log(1 + r);
        if (den === 0) return NaN;
        return num / den;
    }

    function solveTvmPV(N, r, PMT, FV, bgn) {
        if (r === 0) {
            return -(PMT * N + FV);
        }
        let adj = bgn ? (1 + r) : 1;
        let pvif = Math.pow(1 + r, -N);
        let fvifa = (1 - pvif) / r;
        return -(PMT * adj * fvifa + FV * pvif);
    }

    function solveTvmPMT(N, r, PV, FV, bgn) {
        if (r === 0) {
            if (N === 0) return NaN;
            return -(PV + FV) / N;
        }
        let adj = bgn ? (1 + r) : 1;
        let pvif = Math.pow(1 + r, -N);
        let fvifa = (1 - pvif) / r;
        return -(PV + FV * pvif) / (fvifa * adj);
    }

    function solveTvmFV(N, r, PV, PMT, bgn) {
        if (r === 0) {
            return -(PV + PMT * N);
        }
        let adj = bgn ? (1 + r) : 1;
        let fvif = Math.pow(1 + r, N);
        let fvifa = (fvif - 1) / r;
        return -(PV * fvif + PMT * adj * fvifa);
    }

    function solveTvmIY(N, PV, PMT, FV, PY, CY, bgn) {
        // Newton-Raphson to find rate
        let guess = 0.1 / PY;
        let maxIter = 200;
        let tol = 1e-12;

        for (let iter = 0; iter < maxIter; iter++) {
            let r = guess;
            let adj = bgn ? (1 + r) : 1;

            let fvif, fvifa, dfvif, dfvifa;

            if (Math.abs(r) < 1e-14) {
                // Very close to zero rate
                fvif = 1;
                fvifa = N;
                dfvif = N;
                dfvifa = N * (N - 1) / 2;
            } else {
                fvif = Math.pow(1 + r, N);
                fvifa = (fvif - 1) / r;
                dfvif = N * Math.pow(1 + r, N - 1);
                dfvifa = (dfvif * r - (fvif - 1)) / (r * r);
            }

            let f = PV * fvif + PMT * adj * fvifa + FV;
            let df = PV * dfvif + PMT * adj * dfvifa;
            if (bgn) {
                df += PMT * fvifa;
            }

            if (Math.abs(f) < tol) break;
            if (Math.abs(df) < 1e-20) return NaN;

            let newGuess = guess - f / df;
            if (Math.abs(newGuess - guess) < tol) {
                guess = newGuess;
                break;
            }
            guess = newGuess;
        }

        // Convert back to annual nominal rate
        let ratePerPeriod = guess;
        let iy;
        if (PY === CY) {
            iy = ratePerPeriod * PY * 100;
        } else {
            let effectivePerCY = Math.pow(1 + ratePerPeriod, PY / CY) - 1;
            iy = effectivePerCY * CY * 100;
        }
        return iy;
    }

    // ===== Amortization =====
    function computeAmortization(p1, p2) {
        let N = state.tvm.N;
        let r = (state.tvm.IY / 100) / state.PY;
        let PV = state.tvm.PV;
        let PMT = state.tvm.PMT;
        let bgn = state.beginMode ? 1 : 0;

        if (r === 0) {
            let totalPrn = PMT * (p2 - p1 + 1);
            let bal = PV + PMT * p2;
            return { BAL: bal, PRN: totalPrn, INT: 0 };
        }

        let balance = PV;
        let totalInt = 0;
        let totalPrn = 0;

        // Calculate balance at period p1-1
        for (let p = 1; p < p1; p++) {
            let interest = balance * r;
            let principal = PMT - interest;
            if (bgn) {
                principal = PMT - (balance + PMT) * r;
                interest = (balance + PMT) * r;
            }
            balance += principal;
        }

        // Calculate from p1 to p2
        for (let p = p1; p <= p2; p++) {
            let interest, principal;
            if (bgn) {
                interest = (balance + PMT) * r;
                principal = PMT - interest;
            } else {
                interest = balance * r;
                principal = PMT - interest;
            }
            totalInt += interest;
            totalPrn += principal;
            balance += principal;
        }

        // Round to decimals
        let dec = state.decimals === 9 ? 2 : state.decimals;
        let factor = Math.pow(10, dec);
        return {
            BAL: Math.round(balance * factor) / factor,
            PRN: Math.round(totalPrn * factor) / factor,
            INT: Math.round(totalInt * factor) / factor
        };
    }

    // ===== Cash Flow Analysis =====
    function expandCashFlows() {
        let flows = [state.cashFlows[0]];
        for (let i = 1; i < state.cashFlows.length; i++) {
            let freq = state.cashFlowFreq[i] || 1;
            for (let j = 0; j < freq; j++) {
                flows.push(state.cashFlows[i]);
            }
        }
        return flows;
    }

    function computeNPV(rate) {
        let flows = expandCashFlows();
        let r = rate / 100;
        let npv = 0;
        for (let t = 0; t < flows.length; t++) {
            npv += flows[t] / Math.pow(1 + r, t);
        }
        return npv;
    }

    function computeIRR() {
        let flows = expandCashFlows();
        if (flows.length < 2) return NaN;

        // Newton-Raphson
        let guess = 0.1;
        let maxIter = 300;
        let tol = 1e-10;

        for (let iter = 0; iter < maxIter; iter++) {
            let r = guess;
            let npv = 0;
            let dnpv = 0;

            for (let t = 0; t < flows.length; t++) {
                let disc = Math.pow(1 + r, t);
                npv += flows[t] / disc;
                if (t > 0) {
                    dnpv -= t * flows[t] / Math.pow(1 + r, t + 1);
                }
            }

            if (Math.abs(npv) < tol) return guess * 100;
            if (Math.abs(dnpv) < 1e-20) {
                // Try different starting point
                guess += 0.05;
                continue;
            }

            let newGuess = guess - npv / dnpv;

            if (newGuess < -0.99) newGuess = guess / 2;

            if (Math.abs(newGuess - guess) < tol) return newGuess * 100;
            guess = newGuess;
        }

        return NaN;
    }

    // ===== Bond =====
    function computeBond(solve) {
        let b = state.bond;
        let cpn = b.CPN / (b.couponFreq === 2 ? 2 : 1);
        let rv = b.RV;
        let y = b.YLD / (b.couponFreq === 2 ? 200 : 100);

        // Parse dates
        let sdt = parseDate(b.SDT);
        let rdt = parseDate(b.RDT);
        if (!sdt || !rdt) return NaN;

        // Approximate number of coupon periods
        let diffYears = (rdt - sdt) / (365.25 * 24 * 60 * 60 * 1000);
        let N = Math.ceil(diffYears * b.couponFreq);

        // Fraction of period elapsed
        let E = b.dayCount === '360' ? 180 : (b.couponFreq === 2 ? 182.5 : 365);
        let DSC = E; // Simplified: days to next coupon
        let A = 0; // Accrued days

        if (solve === 'PRI') {
            if (N <= 0) return NaN;
            let price = 0;
            for (let i = 1; i <= N; i++) {
                price += cpn / Math.pow(1 + y, i);
            }
            price += rv / Math.pow(1 + y, N);
            b.PRI = price;
            b.AI = cpn * (A / E);
            return price;
        } else if (solve === 'YLD') {
            // Newton-Raphson to find yield
            let price = b.PRI;
            let guess = 0.05 / b.couponFreq;
            let maxIter = 200;
            let tol = 1e-10;

            for (let iter = 0; iter < maxIter; iter++) {
                let r = guess;
                let pv = 0, dpv = 0;
                for (let i = 1; i <= N; i++) {
                    pv += cpn / Math.pow(1 + r, i);
                    dpv -= i * cpn / Math.pow(1 + r, i + 1);
                }
                pv += rv / Math.pow(1 + r, N);
                dpv -= N * rv / Math.pow(1 + r, N + 1);

                let f = pv - price;
                if (Math.abs(f) < tol) break;
                if (Math.abs(dpv) < 1e-20) return NaN;
                guess = guess - f / dpv;
            }

            b.YLD = guess * (b.couponFreq === 2 ? 200 : 100);
            b.AI = cpn * (A / E);
            return b.YLD;
        }
        return NaN;
    }

    function parseDate(str) {
        if (!str) return null;
        let parts = str.split('-');
        if (parts.length !== 3) return null;
        let m, d, y;
        if (state.dateFormat === 'US') {
            m = parseInt(parts[0]); d = parseInt(parts[1]); y = parseInt(parts[2]);
        } else {
            d = parseInt(parts[0]); m = parseInt(parts[1]); y = parseInt(parts[2]);
        }
        return new Date(y, m - 1, d);
    }

    function formatDate(date) {
        if (!date) return '';
        let m = String(date.getMonth() + 1).padStart(2, '0');
        let d = String(date.getDate()).padStart(2, '0');
        let y = date.getFullYear();
        if (state.dateFormat === 'US') return m + '-' + d + '-' + y;
        return d + '-' + m + '-' + y;
    }

    // ===== Depreciation =====
    function computeDepreciation() {
        let dp = state.depr;
        let cost = dp.CST;
        let salvage = dp.SAL;
        let life = dp.LIF;
        let year = dp.YR;
        let dbPct = dp.DB;
        let depreciable = cost - salvage;

        if (life <= 0 || year <= 0) return;

        let dep = 0;
        let rbv = cost;
        let totalDep = 0;

        switch (dp.method) {
            case 'SL':
                dep = depreciable / life;
                totalDep = dep * Math.min(year, life);
                rbv = cost - totalDep;
                break;

            case 'SYD': {
                let sumDigits = life * (life + 1) / 2;
                for (let y = 1; y <= Math.min(year, life); y++) {
                    dep = depreciable * (life - y + 1) / sumDigits;
                    totalDep += dep;
                }
                rbv = cost - totalDep;
                break;
            }

            case 'DB': {
                let rate = dbPct / 100 / life;
                let bookVal = cost;
                for (let y = 1; y <= Math.min(year, life); y++) {
                    dep = bookVal * rate;
                    if (bookVal - dep < salvage) dep = bookVal - salvage;
                    if (dep < 0) dep = 0;
                    bookVal -= dep;
                    totalDep += dep;
                }
                rbv = bookVal;
                break;
            }

            case 'DBSL': {
                // Declining balance with crossover to straight-line
                let rate = dbPct / 100 / life;
                let bookVal = cost;
                for (let y = 1; y <= Math.min(year, life); y++) {
                    let dbDep = bookVal * rate;
                    let remainingLife = life - y + 1;
                    let slDep = (bookVal - salvage) / remainingLife;
                    dep = Math.max(dbDep, slDep);
                    if (bookVal - dep < salvage) dep = bookVal - salvage;
                    if (dep < 0) dep = 0;
                    bookVal -= dep;
                    totalDep += dep;
                }
                rbv = bookVal;
                break;
            }

            case 'SLF': {
                // French straight-line
                dep = depreciable / life;
                if (year === 1) dep = dep / 2;
                if (year > life) dep = depreciable / life / 2;
                totalDep = 0;
                let bv = cost;
                for (let y = 1; y <= Math.min(year, life + 1); y++) {
                    let d = depreciable / life;
                    if (y === 1) d = d / 2;
                    if (y === life + 1) d = d / 2;
                    totalDep += d;
                    dep = d;
                }
                rbv = cost - totalDep;
                break;
            }

            case 'DBF': {
                // French declining balance
                let rate = dbPct / 100 / life;
                let bookVal = cost;
                for (let y = 1; y <= Math.min(year, life + 1); y++) {
                    if (y === 1) {
                        dep = bookVal * rate / 2;
                    } else {
                        dep = bookVal * rate;
                    }
                    let remainingLife = life - y + 1;
                    let slDep = (bookVal - salvage) / remainingLife;
                    dep = Math.max(dep, slDep);
                    if (bookVal - dep < salvage) dep = bookVal - salvage;
                    if (dep < 0) dep = 0;
                    bookVal -= dep;
                    totalDep += dep;
                }
                rbv = bookVal;
                break;
            }
        }

        dp.DEP = dep;
        dp.RBV = rbv;
        dp.RDV = rbv - salvage;
        if (dp.RDV < 0) dp.RDV = 0;
    }

    // ===== Statistics =====
    function computeStatistics() {
        let data = state.statData;
        let n = data.length;
        if (n === 0) return null;

        let sumX = 0, sumY = 0, sumXX = 0, sumYY = 0, sumXY = 0;

        // Transform data based on model
        let tData = data.map(d => {
            let x = d.x, y = d.y;
            switch (state.statModel) {
                case 'LOG': x = Math.log(d.x); break;
                case 'EXP': y = Math.log(d.y); break;
                case 'PWR': x = Math.log(d.x); y = Math.log(d.y); break;
            }
            return { x, y };
        });

        for (let d of tData) {
            sumX += d.x;
            sumY += d.y;
            sumXX += d.x * d.x;
            sumYY += d.y * d.y;
            sumXY += d.x * d.y;
        }

        let meanX = sumX / n;
        let meanY = sumY / n;
        let sxx = sumXX - n * meanX * meanX;
        let syy = sumYY - n * meanY * meanY;
        let sxy = sumXY - n * meanX * meanY;

        let b = sxx !== 0 ? sxy / sxx : 0;
        let a = meanY - b * meanX;
        let r = (sxx > 0 && syy > 0) ? sxy / Math.sqrt(sxx * syy) : 0;

        // Sample and population std dev for original data
        let origSumX = 0, origSumY = 0, origSumXX = 0, origSumYY = 0;
        for (let d of data) {
            origSumX += d.x;
            origSumY += d.y;
            origSumXX += d.x * d.x;
            origSumYY += d.y * d.y;
        }
        let origMeanX = origSumX / n;
        let origMeanY = origSumY / n;
        let varXPop = origSumXX / n - origMeanX * origMeanX;
        let varYPop = origSumYY / n - origMeanY * origMeanY;
        let varXSamp = n > 1 ? (origSumXX - n * origMeanX * origMeanX) / (n - 1) : 0;
        let varYSamp = n > 1 ? (origSumYY - n * origMeanY * origMeanY) / (n - 1) : 0;

        return {
            n: n,
            meanX: origMeanX,
            meanY: origMeanY,
            Sx: Math.sqrt(Math.max(0, varXSamp)),
            Sy: Math.sqrt(Math.max(0, varYSamp)),
            sigmaX: Math.sqrt(Math.max(0, varXPop)),
            sigmaY: Math.sqrt(Math.max(0, varYPop)),
            a: a,
            b: b,
            r: r
        };
    }

    function statPredict(xOrY, value) {
        let stats = computeStatistics();
        if (!stats) return NaN;
        if (xOrY === 'y') {
            let x = value;
            switch (state.statModel) {
                case 'LIN': return stats.a + stats.b * x;
                case 'LOG': return stats.a + stats.b * Math.log(x);
                case 'EXP': return Math.exp(stats.a + stats.b * x);
                case 'PWR': return Math.exp(stats.a) * Math.pow(x, stats.b);
            }
        } else {
            let y = value;
            switch (state.statModel) {
                case 'LIN': return stats.b !== 0 ? (y - stats.a) / stats.b : NaN;
                case 'LOG': return stats.b !== 0 ? Math.exp((y - stats.a) / stats.b) : NaN;
                case 'EXP': return stats.b !== 0 ? (Math.log(y) - stats.a) / stats.b : NaN;
                case 'PWR': return stats.b !== 0 ? Math.exp((Math.log(y) - stats.a) / stats.b) : NaN;
            }
        }
        return NaN;
    }

    // ===== Percent Change =====
    function computePercentChange(solve) {
        let pc = state.pctChange;
        switch (solve) {
            case 'PCH':
                if (pc.OLD === 0) return NaN;
                if (pc.PD === 1) {
                    pc.PCH = ((pc.NEW - pc.OLD) / Math.abs(pc.OLD)) * 100;
                } else {
                    pc.PCH = (Math.pow(pc.NEW / pc.OLD, 1 / pc.PD) - 1) * 100;
                }
                return pc.PCH;
            case 'OLD':
                if (pc.PD === 1) {
                    pc.OLD = pc.NEW / (1 + pc.PCH / 100);
                } else {
                    pc.OLD = pc.NEW / Math.pow(1 + pc.PCH / 100, pc.PD);
                }
                return pc.OLD;
            case 'NEW':
                if (pc.PD === 1) {
                    pc.NEW = pc.OLD * (1 + pc.PCH / 100);
                } else {
                    pc.NEW = pc.OLD * Math.pow(1 + pc.PCH / 100, pc.PD);
                }
                return pc.NEW;
        }
        return NaN;
    }

    // ===== Interest Conversion =====
    function computeIconv(solve) {
        let ic = state.iconv;
        switch (solve) {
            case 'EFF':
                ic.EFF = (Math.pow(1 + (ic.NOM / 100) / ic.CY, ic.CY) - 1) * 100;
                return ic.EFF;
            case 'NOM':
                ic.NOM = (Math.pow(1 + ic.EFF / 100, 1 / ic.CY) - 1) * ic.CY * 100;
                return ic.NOM;
        }
        return NaN;
    }

    // ===== Date Calculations =====
    function computeDate(solve) {
        let dc = state.dateCalc;
        let dt1 = parseDate(dc.DT1);
        let dt2 = parseDate(dc.DT2);

        if (solve === 'DBD') {
            if (!dt1 || !dt2) return NaN;
            if (dc.method === 'ACT') {
                dc.DBD = Math.round((dt2 - dt1) / (24 * 60 * 60 * 1000));
            } else {
                // 30/360
                let d1 = dt1.getDate(), m1 = dt1.getMonth() + 1, y1 = dt1.getFullYear();
                let d2 = dt2.getDate(), m2 = dt2.getMonth() + 1, y2 = dt2.getFullYear();
                if (d1 === 31) d1 = 30;
                if (d2 === 31 && d1 >= 30) d2 = 30;
                dc.DBD = 360 * (y2 - y1) + 30 * (m2 - m1) + (d2 - d1);
            }
            return dc.DBD;
        } else if (solve === 'DT2') {
            if (!dt1) return NaN;
            let result = new Date(dt1.getTime() + dc.DBD * 24 * 60 * 60 * 1000);
            dc.DT2 = formatDate(result);
            return dc.DT2;
        } else if (solve === 'DT1') {
            if (!dt2) return NaN;
            let result = new Date(dt2.getTime() - dc.DBD * 24 * 60 * 60 * 1000);
            dc.DT1 = formatDate(result);
            return dc.DT1;
        }
        return NaN;
    }

    function getDayOfWeek(dateStr) {
        let d = parseDate(dateStr);
        if (!d) return '';
        const days = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
        return days[d.getDay()];
    }

    // ===== Profit Margin =====
    function computeProfit(solve) {
        let p = state.profit;
        switch (solve) {
            case 'MAR':
                if (p.SEL === 0) return NaN;
                p.MAR = ((p.SEL - p.CST) / p.SEL) * 100;
                return p.MAR;
            case 'CST':
                p.CST = p.SEL * (1 - p.MAR / 100);
                return p.CST;
            case 'SEL':
                if (p.MAR === 100) return NaN;
                p.SEL = p.CST / (1 - p.MAR / 100);
                return p.SEL;
        }
        return NaN;
    }

    // ===== Breakeven =====
    function computeBreakeven(solve) {
        let b = state.breakeven;
        switch (solve) {
            case 'Q':
                if (b.P - b.VC === 0) return NaN;
                b.Q = (b.FC + b.PFT) / (b.P - b.VC);
                return b.Q;
            case 'PFT':
                b.PFT = b.Q * (b.P - b.VC) - b.FC;
                return b.PFT;
            case 'P':
                if (b.Q === 0) return NaN;
                b.P = (b.FC + b.PFT) / b.Q + b.VC;
                return b.P;
            case 'VC':
                if (b.Q === 0) return NaN;
                b.VC = b.P - (b.FC + b.PFT) / b.Q;
                return b.VC;
            case 'FC':
                b.FC = b.Q * (b.P - b.VC) - b.PFT;
                return b.FC;
        }
        return NaN;
    }

    // ===== Reset =====
    function fullReset() {
        state.display = '0';
        state.label = '';
        state.assignIndicator = '';
        state.inputMode = false;
        state.decimalEntered = false;
        state.lastResult = 0;
        state.currentValue = 0;
        state.operatorStack = [];
        state.pendingOp = null;
        state.pendingValue = 0;
        state.parenDepth = 0;
        state.parenStack = [];
        state.secondActive = false;
        state.cptActive = false;
        state.stoActive = false;
        state.rclActive = false;
        state.invActive = false;
        state.hypActive = false;
        state.calcMode = 'AOS';
        state.decimals = 9;
        state.angleUnit = 'DEG';
        state.dateFormat = 'US';
        state.separator = 'US';
        state.memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        state.tvm = { N: 0, IY: 0, PV: 0, PMT: 0, FV: 0 };
        state.tvmComputed = { N: false, IY: false, PV: false, PMT: false, FV: false };
        state.PY = 1;
        state.CY = 1;
        state.beginMode = false;
        state.cashFlows = [0];
        state.cashFlowFreq = [1];
        state.amortP1 = 1;
        state.amortP2 = 1;
        state.bond = { SDT: '01-01-2026', CPN: 0, RDT: '01-01-2036', RV: 100, dayCount: 'ACT', couponFreq: 2, YLD: 0, PRI: 0, AI: 0 };
        state.depr = { method: 'SL', CST: 0, SAL: 0, LIF: 0, YR: 1, DB: 200, DEP: 0, RBV: 0, RDV: 0 };
        state.statData = [];
        state.statModel = 'LIN';
        state.pctChange = { OLD: 0, NEW: 0, PCH: 0, PD: 1 };
        state.iconv = { NOM: 0, EFF: 0, CY: 1 };
        state.dateCalc = { DT1: '01-01-2026', DT2: '01-01-2026', DBD: 0, method: 'ACT' };
        state.profit = { CST: 0, SEL: 0, MAR: 0 };
        state.breakeven = { FC: 0, VC: 0, P: 0, PFT: 0, Q: 0 };
        state.constant = null;
        state.activeWorksheet = null;
        state.worksheetIndex = 0;
        updateDisplay();
    }

    // ===== Financial Formulas =====

    // --- Simple Interest ---
    const simpleInterest = {
        interest: (Vp, i, t) => Vp * i * t,
        futureValue: (Vp, i, t) => Vp * (1 + i * t),
        presentValue: (Vf, i, t) => Vf / (1 + i * t),
        rate: (Vf, Vp, t) => t !== 0 ? ((Vf / Vp) - 1) / t : NaN,
        time: (Vf, Vp, i) => i !== 0 ? ((Vf / Vp) - 1) / i : NaN,
        discount: (Vf, d, t) => Vf * (1 - d * t)
    };

    // --- CETES (Mexican Treasury Bills) ---
    const cetes = {
        pvDiscount: (Vf, d, t) => Vf * (1 - (d * t) / 360),
        pvYield: (Vf, tr, t) => Vf * Math.pow(1 + (tr * t) / 360, -1),
        return_: (Vf, Vp) => Vf - Vp,
        numCetes: (inversion, Vp) => Vp !== 0 ? Math.floor(inversion / Vp) : NaN,
        yieldRate: (R, Vp) => Vp !== 0 ? R / Vp : NaN
    };

    // --- Compound Interest ---
    const compoundInterest = {
        futureValue: (Vp, i, n) => Vp * Math.pow(1 + i, n),
        presentValue: (Vf, i, n) => Vf * Math.pow(1 + i, -n),
        time: (Vf, Vp, i) => i > -1 && i !== 0 ? Math.log(Vf / Vp) / Math.log(1 + i) : NaN,
        rate: (Vf, Vp, n) => n !== 0 ? Math.pow(Vf / Vp, 1 / n) - 1 : NaN,
        realValue: (Vf, inflation) => Vf / (1 + inflation),
        realRate: (iN, inflation) => (iN - inflation) / (1 + inflation)
    };

    // --- Interest Rates ---
    const interestRates = {
        effectivePerPeriod: (jnom, m) => m !== 0 ? jnom / m : NaN,
        effectiveAnnual: (jnom, m) => Math.pow(1 + jnom / m, m) - 1,
        nominalFromEffective: (iE, k) => (Math.pow(1 + iE, 1 / k) - 1) * k,
        equivalentNominal: (jnom, m, n) => (Math.pow(1 + jnom / m, m / n) - 1) * n,
        convertNominal: (jnom1, m1, m2) => (Math.pow(1 + jnom1 / m1, m1 / m2) - 1) * m2
    };

    // --- Ordinary Annuities (Vencidas) ---
    const annuityOrd = {
        futureValue: (A, i, n) => i !== 0 ? A * ((Math.pow(1 + i, n) - 1) / i) : A * n,
        rentFromFV: (Vf, i, n) => {
            if (i === 0) return n !== 0 ? Vf / n : NaN;
            return Vf * i / (Math.pow(1 + i, n) - 1);
        },
        termFromFV: (Vf, A, i) => {
            if (i === 0) return A !== 0 ? Vf / A : NaN;
            return Math.log((Vf * i / A) + 1) / Math.log(1 + i);
        },
        presentValue: (A, i, n) => i !== 0 ? A * ((1 - Math.pow(1 + i, -n)) / i) : A * n,
        rentFromPV: (Vp, i, n) => {
            if (i === 0) return n !== 0 ? Vp / n : NaN;
            return Vp * i / (1 - Math.pow(1 + i, -n));
        },
        termFromPV: (Vp, A, i) => {
            if (i === 0) return A !== 0 ? Vp / A : NaN;
            return -Math.log(1 - (Vp * i / A)) / Math.log(1 + i);
        }
    };

    // --- Annuities Due (Anticipadas) ---
    const annuityDue = {
        futureValue: (A, i, n) => i !== 0 ? A * ((Math.pow(1 + i, n) - 1) / i) * (1 + i) : A * n,
        rentFromFV: (Vf, i, n) => {
            if (i === 0) return n !== 0 ? Vf / n : NaN;
            return Vf * i / ((Math.pow(1 + i, n) - 1) * (1 + i));
        },
        termFromFV: (Vf, A, i) => {
            if (i === 0) return A !== 0 ? Vf / A : NaN;
            return Math.log((Vf * i / (A * (1 + i))) + 1) / Math.log(1 + i);
        },
        presentValue: (A, i, n) => i !== 0 ? A * ((1 - Math.pow(1 + i, -n)) / i) * (1 + i) : A * n,
        rentFromPV: (Vp, i, n) => {
            if (i === 0) return n !== 0 ? Vp / n : NaN;
            return Vp * i / ((1 - Math.pow(1 + i, -n)) * (1 + i));
        },
        termFromPV: (Vp, A, i) => {
            if (i === 0) return A !== 0 ? Vp / A : NaN;
            return -Math.log(1 - (Vp * i / (A * (1 + i)))) / Math.log(1 + i);
        }
    };

    // --- Deferred Annuities ---
    const annuityDeferred = {
        presentValue: (A, i, n, d) => {
            if (i === 0) return A * n;
            return A * ((1 - Math.pow(1 + i, -n)) / (i * Math.pow(1 + i, d)));
        },
        termFromDeferred: (Vp, A, i, d) => {
            if (i === 0) return A !== 0 ? Vp / A : NaN;
            return -Math.log(1 - (Vp * i * Math.pow(1 + i, d) / A)) / Math.log(1 + i);
        },
        rentFromDeferred: (Vp, i, n, d) => {
            if (i === 0) return n !== 0 ? Vp / n : NaN;
            return Vp * i * Math.pow(1 + i, d) / (1 - Math.pow(1 + i, -n));
        }
    };

    // --- Perpetuities ---
    const perpetuity = {
        presentValue: (Ap, i) => i !== 0 ? Ap / i : NaN,
        annuity: (P, i) => P * i,
        rateFromDonation: (Ap, P, Ro) => (P - Ro) !== 0 ? Ap / (P - Ro) : NaN,
        totalDonation: (Ro, Ap, i) => i !== 0 ? Ro + Ap / i : NaN,
        pvAnnuityPerpetuity: (Ap, i, n) => {
            if (i === 0) return NaN;
            return Ap / (Math.pow(1 + i, n) - 1);
        }
    };

    // --- Replacement Cost ---
    const replacementCost = {
        totalCost: (K, i, n) => {
            let factor = Math.pow(1 + i, n);
            return (factor - 1) !== 0 ? K * factor / (factor - 1) : NaN;
        }
    };

    // ===== Public API =====
    return {
        state,
        formatNumber,
        updateDisplay,
        getDisplayValue,
        setDisplayValue,
        showError,
        inputDigit,
        inputDecimal,
        backspace,
        changeSign,
        clearEntry,
        clearAll,
        executeOp,
        executeEquals,
        openParen,
        closeParen,
        percent,
        mathSqrt,
        mathSquare,
        mathReciprocal,
        mathLn,
        mathExp,
        mathFactorial,
        mathSin,
        mathCos,
        mathTan,
        mathRandom,
        mathRound,
        storeMemory,
        recallMemory,
        storeMemoryOp,
        tvmSolve,
        computeAmortization,
        computeNPV,
        computeIRR,
        expandCashFlows,
        computeBond,
        computeDepreciation,
        computeStatistics,
        statPredict,
        computePercentChange,
        computeIconv,
        computeDate,
        getDayOfWeek,
        computeProfit,
        computeBreakeven,
        fullReset,
        parseDate,
        formatDate,
        applyOp,
        simpleInterest,
        cetes,
        compoundInterest,
        interestRates,
        annuityOrd,
        annuityDue,
        annuityDeferred,
        perpetuity,
        replacementCost
    };
})();
