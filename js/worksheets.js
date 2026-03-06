/**
 * BA II Plus Worksheets
 * UI generators for all 12 worksheets
 */

'use strict';

const Worksheets = (function () {
    const E = CalcEngine;

    function getOverlay() { return document.getElementById('ws-overlay'); }
    function getTitle() { return document.getElementById('ws-title'); }
    function getBody() { return document.getElementById('ws-body'); }

    function show(title, html) {
        getTitle().textContent = title;
        getBody().innerHTML = html;
        getOverlay().classList.remove('hidden');
    }

    function hide() {
        getOverlay().classList.add('hidden');
        E.state.activeWorksheet = null;
    }

    function fmt(v) {
        return E.formatNumber(v);
    }

    function fmtDec(v, d) {
        if (d === undefined) d = 2;
        return v.toFixed(d);
    }

    // ===== Format Settings =====
    function openFormat() {
        let s = E.state;
        let html = `
        <div class="ws-section-title">Formato de Decimales</div>
        <div class="ws-field">
            <span class="ws-field-label">DEC</span>
            <select class="ws-select" id="ws-fmt-dec">
                ${[0,1,2,3,4,5,6,7,8,9].map(i =>
                    `<option value="${i}" ${s.decimals === i ? 'selected' : ''}>${i === 9 ? '9 (Flotante)' : i}</option>`
                ).join('')}
            </select>
        </div>
        <div class="ws-section-title">Unidad de Ángulos</div>
        <div class="ws-field">
            <span class="ws-field-label">ANG</span>
            <select class="ws-select" id="ws-fmt-angle">
                <option value="DEG" ${s.angleUnit === 'DEG' ? 'selected' : ''}>Grados (DEG)</option>
                <option value="RAD" ${s.angleUnit === 'RAD' ? 'selected' : ''}>Radianes (RAD)</option>
            </select>
        </div>
        <div class="ws-section-title">Formato de Fechas</div>
        <div class="ws-field">
            <span class="ws-field-label">DATE</span>
            <select class="ws-select" id="ws-fmt-date">
                <option value="US" ${s.dateFormat === 'US' ? 'selected' : ''}>US (MM-DD-AAAA)</option>
                <option value="EU" ${s.dateFormat === 'EU' ? 'selected' : ''}>EU (DD-MM-AAAA)</option>
            </select>
        </div>
        <div class="ws-section-title">Separador Numérico</div>
        <div class="ws-field">
            <span class="ws-field-label">SEP</span>
            <select class="ws-select" id="ws-fmt-sep">
                <option value="US" ${s.separator === 'US' ? 'selected' : ''}>US (1,000.00)</option>
                <option value="EU" ${s.separator === 'EU' ? 'selected' : ''}>EU (1.000,00)</option>
            </select>
        </div>
        <div class="ws-section-title">Método de Cálculo</div>
        <div class="ws-field">
            <span class="ws-field-label">CALC</span>
            <select class="ws-select" id="ws-fmt-calc">
                <option value="AOS" ${s.calcMode === 'AOS' ? 'selected' : ''}>AOS (Algebraico)</option>
                <option value="CHN" ${s.calcMode === 'CHN' ? 'selected' : ''}>CHN (Cadena)</option>
            </select>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.applyFormat()">Aplicar</button>
        </div>`;
        show('Formato', html);
        E.state.activeWorksheet = 'FORMAT';
    }

    function applyFormat() {
        let s = E.state;
        s.decimals = parseInt(document.getElementById('ws-fmt-dec').value);
        s.angleUnit = document.getElementById('ws-fmt-angle').value;
        s.dateFormat = document.getElementById('ws-fmt-date').value;
        s.separator = document.getElementById('ws-fmt-sep').value;
        s.calcMode = document.getElementById('ws-fmt-calc').value;
        E.updateDisplay();
        hide();
    }

    // ===== P/Y & C/Y =====
    function openPY() {
        let s = E.state;
        let html = `
        <div class="ws-field">
            <span class="ws-field-label">P/Y</span>
            <input type="number" class="ws-field-value" id="ws-py" value="${s.PY}" step="1" min="1">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">C/Y</span>
            <input type="number" class="ws-field-value" id="ws-cy" value="${s.CY}" step="1" min="1">
        </div>
        <p class="ws-info">P/Y = Pagos por año. C/Y = Períodos de capitalización por año. Para exámenes CFA se recomienda P/Y = 1.</p>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.applyPY()">Aplicar</button>
        </div>`;
        show('P/Y y C/Y', html);
        E.state.activeWorksheet = 'PY';
    }

    function applyPY() {
        let py = parseFloat(document.getElementById('ws-py').value) || 1;
        let cy = parseFloat(document.getElementById('ws-cy').value) || 1;
        E.state.PY = Math.max(1, py);
        E.state.CY = Math.max(1, cy);
        hide();
    }

    // ===== Amortization =====
    function openAmort() {
        let s = E.state;
        let html = `
        <div class="ws-section-title">Rango de Períodos</div>
        <div class="ws-field">
            <span class="ws-field-label">P1</span>
            <input type="number" class="ws-field-value" id="ws-amort-p1" value="${s.amortP1}" min="1" step="1">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">P2</span>
            <input type="number" class="ws-field-value" id="ws-amort-p2" value="${s.amortP2}" min="1" step="1">
        </div>
        <div class="ws-section-title">Valores TVM Actuales</div>
        <p class="ws-info">N=${fmt(s.tvm.N)}, I/Y=${fmt(s.tvm.IY)}%, PV=${fmt(s.tvm.PV)}, PMT=${fmt(s.tvm.PMT)}, FV=${fmt(s.tvm.FV)}</p>
        <p class="ws-info">P/Y=${s.PY}, Modo: ${s.beginMode ? 'BGN' : 'END'}</p>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeAmort()">Calcular</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.computeAmortTable()">Tabla Completa</button>
        </div>
        <div id="ws-amort-result"></div>`;
        show('Amortización', html);
        E.state.activeWorksheet = 'AMORT';
    }

    function computeAmort() {
        let p1 = parseInt(document.getElementById('ws-amort-p1').value) || 1;
        let p2 = parseInt(document.getElementById('ws-amort-p2').value) || 1;
        E.state.amortP1 = p1;
        E.state.amortP2 = p2;
        let result = E.computeAmortization(p1, p2);
        let el = document.getElementById('ws-amort-result');
        el.innerHTML = `
        <div class="ws-section-title">Resultados (Períodos ${p1} a ${p2})</div>
        <div class="ws-field">
            <span class="ws-field-label">BAL</span>
            <input type="text" class="ws-field-value" readonly value="${fmt(result.BAL)}">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">PRN</span>
            <input type="text" class="ws-field-value" readonly value="${fmt(result.PRN)}">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">INT</span>
            <input type="text" class="ws-field-value" readonly value="${fmt(result.INT)}">
        </div>`;
    }

    function computeAmortTable() {
        let s = E.state;
        let N = Math.min(Math.round(s.tvm.N), 600);
        if (N <= 0) return;

        let r = (s.tvm.IY / 100) / s.PY;
        let balance = s.tvm.PV;
        let bgn = s.beginMode ? 1 : 0;
        let rows = '';
        let totalInt = 0, totalPrn = 0;

        for (let p = 1; p <= N; p++) {
            let interest, principal;
            if (r === 0) {
                interest = 0;
                principal = s.tvm.PMT;
            } else if (bgn) {
                interest = (balance + s.tvm.PMT) * r;
                principal = s.tvm.PMT - interest;
            } else {
                interest = balance * r;
                principal = s.tvm.PMT - interest;
            }
            totalInt += interest;
            totalPrn += principal;
            balance += principal;
            rows += `<tr><td>${p}</td><td>${fmtDec(s.tvm.PMT)}</td><td>${fmtDec(interest)}</td><td>${fmtDec(principal)}</td><td>${fmtDec(balance)}</td></tr>`;
        }

        let el = document.getElementById('ws-amort-result');
        el.innerHTML = `
        <div class="ws-section-title">Tabla de Amortización</div>
        <div style="overflow-x:auto; max-height:300px; overflow-y:auto;">
        <table class="ws-table">
            <tr><th>#</th><th>Pago</th><th>Interés</th><th>Capital</th><th>Saldo</th></tr>
            ${rows}
            <tr style="border-top:2px solid rgba(255,255,255,0.15)">
                <td><b>Total</b></td><td></td><td><b>${fmtDec(totalInt)}</b></td><td><b>${fmtDec(totalPrn)}</b></td><td></td>
            </tr>
        </table>
        </div>`;
    }

    // ===== Cash Flow =====
    function openCashFlow() {
        let s = E.state;
        let cfItems = '';
        cfItems += `
        <div class="ws-cf-item">
            <label>CF0</label>
            <input type="number" class="ws-field-value" id="ws-cf-0" value="${s.cashFlows[0]}" step="any">
            <span style="color:#666;font-size:0.7rem;min-width:70px">Inversión inicial</span>
        </div>`;
        for (let i = 1; i < s.cashFlows.length; i++) {
            cfItems += `
            <div class="ws-cf-item">
                <label>C${String(i).padStart(2, '0')}</label>
                <input type="number" class="ws-field-value" id="ws-cf-${i}" value="${s.cashFlows[i]}" step="any">
                <label>F${String(i).padStart(2, '0')}</label>
                <input type="number" class="ws-field-value freq" id="ws-cf-f${i}" value="${s.cashFlowFreq[i] || 1}" step="1" min="1">
            </div>`;
        }

        let html = `
        <div class="ws-section-title">Flujos de Efectivo</div>
        <div class="ws-cf-list" id="ws-cf-list">${cfItems}</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.addCashFlow()">+ Agregar Flujo</button>
            <button class="ws-btn ws-btn-danger" onclick="Worksheets.removeCashFlow()">- Eliminar</button>
        </div>
        <div class="ws-section-title">Tasa de Descuento (para NPV)</div>
        <div class="ws-field">
            <span class="ws-field-label">I (%)</span>
            <input type="number" class="ws-field-value" id="ws-cf-rate" value="${s.tvm.IY}" step="any">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeCF('NPV')">Calcular NPV</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeCF('IRR')">Calcular IRR</button>
        </div>
        <div id="ws-cf-result"></div>`;
        show('Flujos de Efectivo', html);
        E.state.activeWorksheet = 'CF';
    }

    function saveCashFlows() {
        let s = E.state;
        s.cashFlows[0] = parseFloat(document.getElementById('ws-cf-0').value) || 0;
        for (let i = 1; i < s.cashFlows.length; i++) {
            let el = document.getElementById('ws-cf-' + i);
            let fel = document.getElementById('ws-cf-f' + i);
            if (el) s.cashFlows[i] = parseFloat(el.value) || 0;
            if (fel) s.cashFlowFreq[i] = Math.max(1, parseInt(fel.value) || 1);
        }
    }

    function addCashFlow() {
        saveCashFlows();
        if (E.state.cashFlows.length >= 25) return;
        E.state.cashFlows.push(0);
        E.state.cashFlowFreq.push(1);
        openCashFlow();
    }

    function removeCashFlow() {
        saveCashFlows();
        if (E.state.cashFlows.length <= 1) return;
        E.state.cashFlows.pop();
        E.state.cashFlowFreq.pop();
        openCashFlow();
    }

    function computeCF(type) {
        saveCashFlows();
        let el = document.getElementById('ws-cf-result');
        if (type === 'NPV') {
            let rate = parseFloat(document.getElementById('ws-cf-rate').value) || 0;
            let npv = E.computeNPV(rate);
            el.innerHTML = `
            <div class="ws-section-title">Resultado</div>
            <div class="ws-field">
                <span class="ws-field-label">NPV</span>
                <input type="text" class="ws-field-value" readonly value="${fmt(npv)}">
            </div>`;
            E.setDisplayValue(npv, 'NPV=', '');
        } else {
            let irr = E.computeIRR();
            el.innerHTML = `
            <div class="ws-section-title">Resultado</div>
            <div class="ws-field">
                <span class="ws-field-label">IRR (%)</span>
                <input type="text" class="ws-field-value" readonly value="${isNaN(irr) ? 'No Solution' : fmt(irr)}">
            </div>`;
            if (!isNaN(irr)) E.setDisplayValue(irr, 'IRR=', '');
        }
    }

    // ===== Bond =====
    function openBond() {
        let b = E.state.bond;
        let html = `
        <div class="ws-section-title">Datos del Bono</div>
        <div class="ws-field">
            <span class="ws-field-label">SDT</span>
            <input type="text" class="ws-field-value" id="ws-bond-sdt" value="${b.SDT}" placeholder="MM-DD-AAAA">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">CPN (%)</span>
            <input type="number" class="ws-field-value" id="ws-bond-cpn" value="${b.CPN}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">RDT</span>
            <input type="text" class="ws-field-value" id="ws-bond-rdt" value="${b.RDT}" placeholder="MM-DD-AAAA">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">RV (%par)</span>
            <input type="number" class="ws-field-value" id="ws-bond-rv" value="${b.RV}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Días</span>
            <select class="ws-select" id="ws-bond-dc">
                <option value="ACT" ${b.dayCount === 'ACT' ? 'selected' : ''}>ACT (actual/actual)</option>
                <option value="360" ${b.dayCount === '360' ? 'selected' : ''}>360 (30/360)</option>
            </select>
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Cupón</span>
            <select class="ws-select" id="ws-bond-freq">
                <option value="2" ${b.couponFreq === 2 ? 'selected' : ''}>Semestral (2/Y)</option>
                <option value="1" ${b.couponFreq === 1 ? 'selected' : ''}>Anual (1/Y)</option>
            </select>
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-field">
            <span class="ws-field-label">YLD (%)</span>
            <input type="number" class="ws-field-value" id="ws-bond-yld" value="${b.YLD}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">PRI</span>
            <input type="number" class="ws-field-value" id="ws-bond-pri" value="${b.PRI}" step="any">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeBondWS('PRI')">Calcular Precio</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeBondWS('YLD')">Calcular Rendimiento</button>
        </div>
        <div id="ws-bond-result"></div>`;
        show('Bonos', html);
        E.state.activeWorksheet = 'BOND';
    }

    function saveBondData() {
        let b = E.state.bond;
        b.SDT = document.getElementById('ws-bond-sdt').value;
        b.CPN = parseFloat(document.getElementById('ws-bond-cpn').value) || 0;
        b.RDT = document.getElementById('ws-bond-rdt').value;
        b.RV = parseFloat(document.getElementById('ws-bond-rv').value) || 100;
        b.dayCount = document.getElementById('ws-bond-dc').value;
        b.couponFreq = parseInt(document.getElementById('ws-bond-freq').value);
        b.YLD = parseFloat(document.getElementById('ws-bond-yld').value) || 0;
        b.PRI = parseFloat(document.getElementById('ws-bond-pri').value) || 0;
    }

    function computeBondWS(solve) {
        saveBondData();
        let result = E.computeBond(solve);
        let b = E.state.bond;
        let el = document.getElementById('ws-bond-result');

        if (isNaN(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }

        if (solve === 'PRI') {
            document.getElementById('ws-bond-pri').value = b.PRI.toFixed(4);
            el.innerHTML = `
            <div class="ws-section-title">Resultado</div>
            <div class="ws-field">
                <span class="ws-field-label">PRI</span>
                <input type="text" class="ws-field-value" readonly value="${fmt(b.PRI)}">
            </div>
            <div class="ws-field">
                <span class="ws-field-label">AI</span>
                <input type="text" class="ws-field-value" readonly value="${fmt(b.AI)}">
            </div>`;
            E.setDisplayValue(b.PRI, 'PRI=', '');
        } else {
            document.getElementById('ws-bond-yld').value = b.YLD.toFixed(4);
            el.innerHTML = `
            <div class="ws-section-title">Resultado</div>
            <div class="ws-field">
                <span class="ws-field-label">YLD (%)</span>
                <input type="text" class="ws-field-value" readonly value="${fmt(b.YLD)}">
            </div>
            <div class="ws-field">
                <span class="ws-field-label">AI</span>
                <input type="text" class="ws-field-value" readonly value="${fmt(b.AI)}">
            </div>`;
            E.setDisplayValue(b.YLD, 'YLD=', '');
        }
    }

    // ===== Depreciation =====
    function openDepr() {
        let d = E.state.depr;
        let html = `
        <div class="ws-section-title">Método de Depreciación</div>
        <div class="ws-field">
            <span class="ws-field-label">Método</span>
            <select class="ws-select" id="ws-depr-method">
                <option value="SL" ${d.method === 'SL' ? 'selected' : ''}>SL — Línea Recta</option>
                <option value="SYD" ${d.method === 'SYD' ? 'selected' : ''}>SYD — Suma de Dígitos</option>
                <option value="DB" ${d.method === 'DB' ? 'selected' : ''}>DB — Saldo Decreciente</option>
                <option value="DBSL" ${d.method === 'DBSL' ? 'selected' : ''}>DB→SL — Decreciente a Recta</option>
                <option value="SLF" ${d.method === 'SLF' ? 'selected' : ''}>SLF — Línea Recta (Francés)</option>
                <option value="DBF" ${d.method === 'DBF' ? 'selected' : ''}>DBF — Decreciente (Francés)</option>
            </select>
        </div>
        <div class="ws-section-title">Datos</div>
        <div class="ws-field">
            <span class="ws-field-label">CST</span>
            <input type="number" class="ws-field-value" id="ws-depr-cst" value="${d.CST}" step="any" placeholder="Costo">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">SAL</span>
            <input type="number" class="ws-field-value" id="ws-depr-sal" value="${d.SAL}" step="any" placeholder="Valor de salvamento">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">LIF</span>
            <input type="number" class="ws-field-value" id="ws-depr-lif" value="${d.LIF}" step="1" min="1" placeholder="Vida útil (años)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">YR</span>
            <input type="number" class="ws-field-value" id="ws-depr-yr" value="${d.YR}" step="1" min="1" placeholder="Año">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">DB%</span>
            <input type="number" class="ws-field-value" id="ws-depr-db" value="${d.DB}" step="any" placeholder="% Saldo decreciente">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeDepr()">Calcular</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.computeDeprTable()">Tabla Completa</button>
        </div>
        <div id="ws-depr-result"></div>`;
        show('Depreciación', html);
        E.state.activeWorksheet = 'DEPR';
    }

    function saveDeprData() {
        let d = E.state.depr;
        d.method = document.getElementById('ws-depr-method').value;
        d.CST = parseFloat(document.getElementById('ws-depr-cst').value) || 0;
        d.SAL = parseFloat(document.getElementById('ws-depr-sal').value) || 0;
        d.LIF = parseFloat(document.getElementById('ws-depr-lif').value) || 0;
        d.YR = parseInt(document.getElementById('ws-depr-yr').value) || 1;
        d.DB = parseFloat(document.getElementById('ws-depr-db').value) || 200;
    }

    function computeDepr() {
        saveDeprData();
        E.computeDepreciation();
        let d = E.state.depr;
        let el = document.getElementById('ws-depr-result');
        el.innerHTML = `
        <div class="ws-section-title">Resultado (Año ${d.YR})</div>
        <div class="ws-field">
            <span class="ws-field-label">DEP</span>
            <input type="text" class="ws-field-value" readonly value="${fmt(d.DEP)}">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">RBV</span>
            <input type="text" class="ws-field-value" readonly value="${fmt(d.RBV)}">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">RDV</span>
            <input type="text" class="ws-field-value" readonly value="${fmt(d.RDV)}">
        </div>`;
        E.setDisplayValue(d.DEP, 'DEP=', '');
    }

    function computeDeprTable() {
        saveDeprData();
        let d = E.state.depr;
        let life = Math.min(d.LIF, 100);
        if (life <= 0) return;

        let rows = '';
        let origYr = d.YR;
        for (let y = 1; y <= life; y++) {
            d.YR = y;
            E.computeDepreciation();
            rows += `<tr><td>${y}</td><td>${fmtDec(d.DEP)}</td><td>${fmtDec(d.RBV)}</td><td>${fmtDec(d.RDV)}</td></tr>`;
        }
        d.YR = origYr;

        let el = document.getElementById('ws-depr-result');
        el.innerHTML = `
        <div class="ws-section-title">Tabla de Depreciación (${d.method})</div>
        <div style="overflow-x:auto; max-height:300px; overflow-y:auto;">
        <table class="ws-table">
            <tr><th>Año</th><th>Depreciación</th><th>Val. Libros</th><th>Dep. Restante</th></tr>
            ${rows}
        </table>
        </div>`;
    }

    // ===== Statistics =====
    function openData() {
        let s = E.state;
        let rows = '';
        for (let i = 0; i < s.statData.length; i++) {
            rows += `
            <div class="ws-cf-item">
                <label>${i + 1}</label>
                <input type="number" class="ws-field-value" id="ws-stat-x${i}" value="${s.statData[i].x}" step="any" placeholder="X">
                <input type="number" class="ws-field-value" id="ws-stat-y${i}" value="${s.statData[i].y}" step="any" placeholder="Y">
            </div>`;
        }
        let html = `
        <div class="ws-section-title">Datos Estadísticos (X, Y)</div>
        <div class="ws-cf-list" id="ws-stat-list">${rows || '<p class="ws-info">Sin datos. Agrega pares de datos.</p>'}</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.addStatData()">+ Agregar Dato</button>
            <button class="ws-btn ws-btn-danger" onclick="Worksheets.removeStatData()">- Eliminar</button>
            <button class="ws-btn ws-btn-danger" onclick="Worksheets.clearStatData()">Limpiar Todo</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.goToStat()">Ver Resultados →</button>
        </div>`;
        show('Datos Estadísticos', html);
        E.state.activeWorksheet = 'DATA';
    }

    function saveStatData() {
        let s = E.state;
        for (let i = 0; i < s.statData.length; i++) {
            let xEl = document.getElementById('ws-stat-x' + i);
            let yEl = document.getElementById('ws-stat-y' + i);
            if (xEl) s.statData[i].x = parseFloat(xEl.value) || 0;
            if (yEl) s.statData[i].y = parseFloat(yEl.value) || 0;
        }
    }

    function addStatData() {
        saveStatData();
        if (E.state.statData.length >= 50) return;
        E.state.statData.push({ x: 0, y: 0 });
        openData();
    }

    function removeStatData() {
        saveStatData();
        if (E.state.statData.length === 0) return;
        E.state.statData.pop();
        openData();
    }

    function clearStatData() {
        E.state.statData = [];
        openData();
    }

    function goToStat() {
        saveStatData();
        openStat();
    }

    function openStat() {
        let s = E.state;
        let stats = E.computeStatistics();
        let html = `
        <div class="ws-section-title">Modelo de Regresión</div>
        <div class="ws-field">
            <span class="ws-field-label">Modelo</span>
            <select class="ws-select" id="ws-stat-model" onchange="Worksheets.changeStatModel()">
                <option value="LIN" ${s.statModel === 'LIN' ? 'selected' : ''}>LIN — Lineal</option>
                <option value="LOG" ${s.statModel === 'LOG' ? 'selected' : ''}>LOG — Logarítmico</option>
                <option value="EXP" ${s.statModel === 'EXP' ? 'selected' : ''}>EXP — Exponencial</option>
                <option value="PWR" ${s.statModel === 'PWR' ? 'selected' : ''}>PWR — Potencia</option>
            </select>
        </div>`;

        if (stats) {
            html += `
        <div class="ws-section-title">Resultados (n = ${stats.n})</div>
        <div class="ws-field"><span class="ws-field-label">x̄</span><input class="ws-field-value" readonly value="${fmt(stats.meanX)}"></div>
        <div class="ws-field"><span class="ws-field-label">Sx</span><input class="ws-field-value" readonly value="${fmt(stats.Sx)}"></div>
        <div class="ws-field"><span class="ws-field-label">σx</span><input class="ws-field-value" readonly value="${fmt(stats.sigmaX)}"></div>
        <div class="ws-field"><span class="ws-field-label">ȳ</span><input class="ws-field-value" readonly value="${fmt(stats.meanY)}"></div>
        <div class="ws-field"><span class="ws-field-label">Sy</span><input class="ws-field-value" readonly value="${fmt(stats.Sy)}"></div>
        <div class="ws-field"><span class="ws-field-label">σy</span><input class="ws-field-value" readonly value="${fmt(stats.sigmaY)}"></div>
        <div class="ws-section-title">Regresión</div>
        <div class="ws-field"><span class="ws-field-label">a</span><input class="ws-field-value" readonly value="${fmt(stats.a)}"></div>
        <div class="ws-field"><span class="ws-field-label">b</span><input class="ws-field-value" readonly value="${fmt(stats.b)}"></div>
        <div class="ws-field"><span class="ws-field-label">r</span><input class="ws-field-value" readonly value="${fmt(stats.r)}"></div>
        <div class="ws-section-title">Pronóstico</div>
        <div class="ws-field">
            <span class="ws-field-label">X →</span>
            <input type="number" class="ws-field-value" id="ws-stat-px" step="any" placeholder="Ingrese X">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.predictY()">Predecir ŷ</button>
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Y →</span>
            <input type="number" class="ws-field-value" id="ws-stat-py" step="any" placeholder="Ingrese Y">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.predictX()">Predecir x̂</button>
        </div>
        <div id="ws-stat-predict"></div>`;
        } else {
            html += '<p class="ws-info">Sin datos. Ingresa datos primero.</p>';
        }

        html += `
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openData()">← Editar Datos</button>
        </div>`;
        show('Estadística', html);
        E.state.activeWorksheet = 'STAT';
    }

    function changeStatModel() {
        E.state.statModel = document.getElementById('ws-stat-model').value;
        openStat();
    }

    function predictY() {
        let x = parseFloat(document.getElementById('ws-stat-px').value);
        if (isNaN(x)) return;
        let y = E.statPredict('y', x);
        let el = document.getElementById('ws-stat-predict');
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">ŷ =</span><input class="ws-field-value" readonly value="${fmt(y)}"></div>`;
        E.setDisplayValue(y, 'ŷ=', '');
    }

    function predictX() {
        let y = parseFloat(document.getElementById('ws-stat-py').value);
        if (isNaN(y)) return;
        let x = E.statPredict('x', y);
        let el = document.getElementById('ws-stat-predict');
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">x̂ =</span><input class="ws-field-value" readonly value="${fmt(x)}"></div>`;
        E.setDisplayValue(x, 'x̂=', '');
    }

    // ===== Percent Change =====
    function openPctChange() {
        let p = E.state.pctChange;
        let html = `
        <div class="ws-section-title">Cambio Porcentual / Interés Compuesto</div>
        <div class="ws-field">
            <span class="ws-field-label">OLD</span>
            <input type="number" class="ws-field-value" id="ws-pct-old" value="${p.OLD}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">NEW</span>
            <input type="number" class="ws-field-value" id="ws-pct-new" value="${p.NEW}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">%CH</span>
            <input type="number" class="ws-field-value" id="ws-pct-pch" value="${p.PCH}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">#PD</span>
            <input type="number" class="ws-field-value" id="ws-pct-pd" value="${p.PD}" step="1" min="1">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computePctChange('PCH')">Calcular %CH</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computePctChange('OLD')">Calcular OLD</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computePctChange('NEW')">Calcular NEW</button>
        </div>
        <div id="ws-pct-result"></div>`;
        show('Cambio Porcentual', html);
        E.state.activeWorksheet = 'PCT';
    }

    function savePctData() {
        let p = E.state.pctChange;
        p.OLD = parseFloat(document.getElementById('ws-pct-old').value) || 0;
        p.NEW = parseFloat(document.getElementById('ws-pct-new').value) || 0;
        p.PCH = parseFloat(document.getElementById('ws-pct-pch').value) || 0;
        p.PD = Math.max(1, parseInt(document.getElementById('ws-pct-pd').value) || 1);
    }

    function computePctChange(solve) {
        savePctData();
        let result = E.computePercentChange(solve);
        if (isNaN(result)) {
            document.getElementById('ws-pct-result').innerHTML = '<p class="ws-info" style="color:#e88">Error: división por cero.</p>';
            return;
        }
        // Update displayed values
        let p = E.state.pctChange;
        document.getElementById('ws-pct-old').value = p.OLD;
        document.getElementById('ws-pct-new').value = p.NEW;
        document.getElementById('ws-pct-pch').value = p.PCH;
        let el = document.getElementById('ws-pct-result');
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${solve}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, solve + '=', '');
    }

    // ===== Interest Conversion =====
    function openIconv() {
        let ic = E.state.iconv;
        let html = `
        <div class="ws-section-title">Conversión de Tasas de Interés</div>
        <div class="ws-field">
            <span class="ws-field-label">NOM (%)</span>
            <input type="number" class="ws-field-value" id="ws-ic-nom" value="${ic.NOM}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">EFF (%)</span>
            <input type="number" class="ws-field-value" id="ws-ic-eff" value="${ic.EFF}" step="any">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">C/Y</span>
            <input type="number" class="ws-field-value" id="ws-ic-cy" value="${ic.CY}" step="1" min="1">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeIconv('EFF')">NOM → EFF</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeIconv('NOM')">EFF → NOM</button>
        </div>
        <div id="ws-ic-result"></div>
        <p class="ws-info">Convierte entre tasa nominal anual (APR) y tasa efectiva anual (EAR).</p>`;
        show('Conversión de Tasas', html);
        E.state.activeWorksheet = 'ICONV';
    }

    function computeIconv(solve) {
        let ic = E.state.iconv;
        ic.NOM = parseFloat(document.getElementById('ws-ic-nom').value) || 0;
        ic.EFF = parseFloat(document.getElementById('ws-ic-eff').value) || 0;
        ic.CY = Math.max(1, parseInt(document.getElementById('ws-ic-cy').value) || 1);
        let result = E.computeIconv(solve);
        document.getElementById('ws-ic-nom').value = ic.NOM;
        document.getElementById('ws-ic-eff').value = ic.EFF;
        let el = document.getElementById('ws-ic-result');
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${solve}</span><input class="ws-field-value" readonly value="${fmt(result)}%"></div>`;
        E.setDisplayValue(result, solve + '=', '');
    }

    // ===== Date =====
    function openDate() {
        let dc = E.state.dateCalc;
        let fmtLabel = E.state.dateFormat === 'US' ? 'MM-DD-AAAA' : 'DD-MM-AAAA';
        let html = `
        <div class="ws-section-title">Cálculo de Fechas</div>
        <div class="ws-field">
            <span class="ws-field-label">DT1</span>
            <input type="text" class="ws-field-value" id="ws-date-dt1" value="${dc.DT1}" placeholder="${fmtLabel}">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">DT2</span>
            <input type="text" class="ws-field-value" id="ws-date-dt2" value="${dc.DT2}" placeholder="${fmtLabel}">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">DBD</span>
            <input type="number" class="ws-field-value" id="ws-date-dbd" value="${dc.DBD}" step="1">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Método</span>
            <select class="ws-select" id="ws-date-method">
                <option value="ACT" ${dc.method === 'ACT' ? 'selected' : ''}>ACT (días reales)</option>
                <option value="360" ${dc.method === '360' ? 'selected' : ''}>360</option>
            </select>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeDateWS('DBD')">Calcular Días</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeDateWS('DT2')">Calcular DT2</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeDateWS('DT1')">Calcular DT1</button>
        </div>
        <div id="ws-date-result"></div>`;
        show('Fechas', html);
        E.state.activeWorksheet = 'DATE';
    }

    function computeDateWS(solve) {
        let dc = E.state.dateCalc;
        dc.DT1 = document.getElementById('ws-date-dt1').value;
        dc.DT2 = document.getElementById('ws-date-dt2').value;
        dc.DBD = parseInt(document.getElementById('ws-date-dbd').value) || 0;
        dc.method = document.getElementById('ws-date-method').value;

        let result = E.computeDate(solve);
        let el = document.getElementById('ws-date-result');

        if (solve === 'DBD') {
            let dow1 = E.getDayOfWeek(dc.DT1);
            let dow2 = E.getDayOfWeek(dc.DT2);
            el.innerHTML = `
            <div class="ws-field"><span class="ws-field-label">DBD</span><input class="ws-field-value" readonly value="${result}"></div>
            <p class="ws-info">DT1: ${dow1} | DT2: ${dow2}</p>`;
            document.getElementById('ws-date-dbd').value = dc.DBD;
            E.setDisplayValue(dc.DBD, 'DBD=', '');
        } else if (solve === 'DT2') {
            document.getElementById('ws-date-dt2').value = dc.DT2;
            let dow = E.getDayOfWeek(dc.DT2);
            el.innerHTML = `<div class="ws-field"><span class="ws-field-label">DT2</span><input class="ws-field-value" readonly value="${dc.DT2}"></div>
            <p class="ws-info">Día: ${dow}</p>`;
        } else {
            document.getElementById('ws-date-dt1').value = dc.DT1;
            let dow = E.getDayOfWeek(dc.DT1);
            el.innerHTML = `<div class="ws-field"><span class="ws-field-label">DT1</span><input class="ws-field-value" readonly value="${dc.DT1}"></div>
            <p class="ws-info">Día: ${dow}</p>`;
        }
    }

    // ===== Profit Margin =====
    function openProfit() {
        let p = E.state.profit;
        let html = `
        <div class="ws-section-title">Margen de Ganancia</div>
        <div class="ws-field">
            <span class="ws-field-label">CST</span>
            <input type="number" class="ws-field-value" id="ws-prof-cst" value="${p.CST}" step="any" placeholder="Costo">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">SEL</span>
            <input type="number" class="ws-field-value" id="ws-prof-sel" value="${p.SEL}" step="any" placeholder="Precio de venta">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">MAR (%)</span>
            <input type="number" class="ws-field-value" id="ws-prof-mar" value="${p.MAR}" step="any" placeholder="Margen">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeProfitWS('MAR')">Calcular Margen</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeProfitWS('CST')">Calcular Costo</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeProfitWS('SEL')">Calcular Precio</button>
        </div>
        <div id="ws-prof-result"></div>`;
        show('Margen de Ganancia', html);
        E.state.activeWorksheet = 'PROFIT';
    }

    function computeProfitWS(solve) {
        let p = E.state.profit;
        p.CST = parseFloat(document.getElementById('ws-prof-cst').value) || 0;
        p.SEL = parseFloat(document.getElementById('ws-prof-sel').value) || 0;
        p.MAR = parseFloat(document.getElementById('ws-prof-mar').value) || 0;
        let result = E.computeProfit(solve);
        if (isNaN(result)) {
            document.getElementById('ws-prof-result').innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo.</p>';
            return;
        }
        document.getElementById('ws-prof-cst').value = p.CST;
        document.getElementById('ws-prof-sel').value = p.SEL;
        document.getElementById('ws-prof-mar').value = p.MAR;
        let el = document.getElementById('ws-prof-result');
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${solve}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, solve + '=', '');
    }

    // ===== Breakeven =====
    function openBreakeven() {
        let b = E.state.breakeven;
        let html = `
        <div class="ws-section-title">Punto de Equilibrio</div>
        <div class="ws-field">
            <span class="ws-field-label">FC</span>
            <input type="number" class="ws-field-value" id="ws-be-fc" value="${b.FC}" step="any" placeholder="Costos fijos">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">VC</span>
            <input type="number" class="ws-field-value" id="ws-be-vc" value="${b.VC}" step="any" placeholder="Costo variable/unidad">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">P</span>
            <input type="number" class="ws-field-value" id="ws-be-p" value="${b.P}" step="any" placeholder="Precio/unidad">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">PFT</span>
            <input type="number" class="ws-field-value" id="ws-be-pft" value="${b.PFT}" step="any" placeholder="Utilidad">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Q</span>
            <input type="number" class="ws-field-value" id="ws-be-q" value="${b.Q}" step="any" placeholder="Cantidad">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeBreakevenWS('Q')">Calcular Q</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.computeBreakevenWS('PFT')">Calcular Utilidad</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.computeBreakevenWS('P')">Calcular P</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.computeBreakevenWS('VC')">Calcular VC</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.computeBreakevenWS('FC')">Calcular FC</button>
        </div>
        <div id="ws-be-result"></div>`;
        show('Punto de Equilibrio', html);
        E.state.activeWorksheet = 'BRKEVN';
    }

    function saveBreakevenData() {
        let b = E.state.breakeven;
        b.FC = parseFloat(document.getElementById('ws-be-fc').value) || 0;
        b.VC = parseFloat(document.getElementById('ws-be-vc').value) || 0;
        b.P = parseFloat(document.getElementById('ws-be-p').value) || 0;
        b.PFT = parseFloat(document.getElementById('ws-be-pft').value) || 0;
        b.Q = parseFloat(document.getElementById('ws-be-q').value) || 0;
    }

    function computeBreakevenWS(solve) {
        saveBreakevenData();
        let result = E.computeBreakeven(solve);
        if (isNaN(result)) {
            document.getElementById('ws-be-result').innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo.</p>';
            return;
        }
        let b = E.state.breakeven;
        document.getElementById('ws-be-fc').value = b.FC;
        document.getElementById('ws-be-vc').value = b.VC;
        document.getElementById('ws-be-p').value = b.P;
        document.getElementById('ws-be-pft').value = b.PFT;
        document.getElementById('ws-be-q').value = b.Q;
        let el = document.getElementById('ws-be-result');
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${solve}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, solve + '=', '');
    }

    // ===== Memory Worksheet =====
    function openMemory() {
        let mem = E.state.memory;
        let rows = '';
        for (let i = 0; i < 10; i++) {
            rows += `
            <div class="ws-field">
                <span class="ws-field-label">M${i}</span>
                <input type="number" class="ws-field-value" id="ws-mem-${i}" value="${mem[i]}" step="any">
            </div>`;
        }
        let html = `
        <div class="ws-section-title">Memorias (M0 – M9)</div>
        ${rows}
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.applyMemory()">Guardar</button>
            <button class="ws-btn ws-btn-danger" onclick="Worksheets.clearMemory()">Limpiar Todas</button>
        </div>`;
        show('Memoria', html);
        E.state.activeWorksheet = 'MEM';
    }

    function applyMemory() {
        for (let i = 0; i < 10; i++) {
            let el = document.getElementById('ws-mem-' + i);
            if (el) E.state.memory[i] = parseFloat(el.value) || 0;
        }
        hide();
    }

    function clearMemory() {
        E.state.memory = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        openMemory();
    }

    // ===== NPV from = key =====
    function openNPV() {
        openCashFlow();
    }

    // ===== IRR from 0 key =====
    function openIRR() {
        openCashFlow();
    }

    // ===== FORMULAS MENU =====
    function openFormulas() {
        let html = `
        <div class="ws-section-title">Fórmulas Financieras</div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openSimpleInterest()">Interés Simple</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openCetesWS()">CETES (Instrumentos Bursátiles)</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openCompoundInterest()">Interés Compuesto</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openInterestRates()">Tasas de Interés</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openAnnuityOrd()">Anualidades Vencidas</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openAnnuityDue()">Anualidades Anticipadas</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openAnnuityDeferred()">Anualidades Diferidas</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openPerpetuityWS()">Perpetuidades</button></div>
        <div class="ws-btn-row"><button class="ws-btn ws-btn-primary" style="flex:1" onclick="Worksheets.openReplacementCost()">Costo de Reemplazos</button></div>
        `;
        show('Fórmulas Financieras', html);
        E.state.activeWorksheet = 'FORMULAS';
    }

    // ===== Simple Interest =====
    function openSimpleInterest() {
        let html = `
        <div class="ws-section-title">Interés Simple</div>
        <p class="ws-info">I = Vp &times; i &times; t &nbsp;|&nbsp; Vf = Vp(1 + it) &nbsp;|&nbsp; Vl = Vf(1 - dt)</p>
        <div class="ws-field">
            <span class="ws-field-label">Vp</span>
            <input type="number" class="ws-field-value" id="ws-si-vp" value="0" step="any" placeholder="Valor Presente">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vf</span>
            <input type="number" class="ws-field-value" id="ws-si-vf" value="0" step="any" placeholder="Valor Futuro">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-si-i" value="0" step="any" placeholder="Tasa de interés (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">t</span>
            <input type="number" class="ws-field-value" id="ws-si-t" value="0" step="any" placeholder="Tiempo (períodos)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">d (dec)</span>
            <input type="number" class="ws-field-value" id="ws-si-d" value="0" step="any" placeholder="Tasa de descuento (decimal)">
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcSI('I')">Interés</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcSI('VF')">Vf</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcSI('VP')">Vp</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcSI('RATE')">Tasa (i)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcSI('TIME')">Tiempo (t)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcSI('DISC')">Descuento (Vl)</button>
        </div>
        <div id="ws-si-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Interés Simple', html);
        E.state.activeWorksheet = 'SI';
    }

    function calcSI(solve) {
        let Vp = parseFloat(document.getElementById('ws-si-vp').value) || 0;
        let Vf = parseFloat(document.getElementById('ws-si-vf').value) || 0;
        let i = parseFloat(document.getElementById('ws-si-i').value) || 0;
        let t = parseFloat(document.getElementById('ws-si-t').value) || 0;
        let d = parseFloat(document.getElementById('ws-si-d').value) || 0;
        let result, label;
        switch (solve) {
            case 'I':
                result = E.simpleInterest.interest(Vp, i, t);
                label = 'I';
                break;
            case 'VF':
                result = E.simpleInterest.futureValue(Vp, i, t);
                label = 'Vf';
                document.getElementById('ws-si-vf').value = result;
                break;
            case 'VP':
                result = E.simpleInterest.presentValue(Vf, i, t);
                label = 'Vp';
                document.getElementById('ws-si-vp').value = result;
                break;
            case 'RATE':
                result = E.simpleInterest.rate(Vf, Vp, t);
                label = 'i';
                document.getElementById('ws-si-i').value = result;
                break;
            case 'TIME':
                result = E.simpleInterest.time(Vf, Vp, i);
                label = 't';
                document.getElementById('ws-si-t').value = result;
                break;
            case 'DISC':
                result = E.simpleInterest.discount(Vf, d, t);
                label = 'Vl';
                break;
        }
        let el = document.getElementById('ws-si-result');
        if (isNaN(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== CETES =====
    function openCetesWS() {
        let html = `
        <div class="ws-section-title">Valuación de CETES</div>
        <p class="ws-info">Vp = Vf(1 - dt/360) &nbsp;|&nbsp; Vp = Vf(1 + tr&middot;t/360)⁻¹ &nbsp;|&nbsp; R = Vf - Vp &nbsp;|&nbsp; tr = R/Vp</p>
        <div class="ws-field">
            <span class="ws-field-label">Vf</span>
            <input type="number" class="ws-field-value" id="ws-cetes-vf" value="10" step="any" placeholder="Valor nominal">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vp</span>
            <input type="number" class="ws-field-value" id="ws-cetes-vp" value="0" step="any" placeholder="Precio de compra">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">d (dec)</span>
            <input type="number" class="ws-field-value" id="ws-cetes-d" value="0" step="any" placeholder="Tasa de descuento">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">tr (dec)</span>
            <input type="number" class="ws-field-value" id="ws-cetes-tr" value="0" step="any" placeholder="Tasa de rendimiento">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">t (días)</span>
            <input type="number" class="ws-field-value" id="ws-cetes-t" value="28" step="1" placeholder="Plazo en días">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Inversión</span>
            <input type="number" class="ws-field-value" id="ws-cetes-inv" value="0" step="any" placeholder="Monto a invertir">
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcCetes('VP_D')">Vp (con desc.)</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcCetes('VP_R')">Vp (con rend.)</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcCetes('R')">Rendimiento ($)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcCetes('TR')">Tasa rend.</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcCetes('NC')">Núm. CETES</button>
        </div>
        <div id="ws-cetes-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('CETES', html);
        E.state.activeWorksheet = 'CETES';
    }

    function calcCetes(solve) {
        let Vf = parseFloat(document.getElementById('ws-cetes-vf').value) || 0;
        let Vp = parseFloat(document.getElementById('ws-cetes-vp').value) || 0;
        let d = parseFloat(document.getElementById('ws-cetes-d').value) || 0;
        let tr = parseFloat(document.getElementById('ws-cetes-tr').value) || 0;
        let t = parseFloat(document.getElementById('ws-cetes-t').value) || 0;
        let inv = parseFloat(document.getElementById('ws-cetes-inv').value) || 0;
        let result, label;
        switch (solve) {
            case 'VP_D':
                result = E.cetes.pvDiscount(Vf, d, t);
                label = 'Vp(desc)';
                document.getElementById('ws-cetes-vp').value = result;
                break;
            case 'VP_R':
                result = E.cetes.pvYield(Vf, tr, t);
                label = 'Vp(rend)';
                document.getElementById('ws-cetes-vp').value = result;
                break;
            case 'R':
                result = E.cetes.return_(Vf, Vp);
                label = 'R';
                break;
            case 'TR':
                let R = Vf - Vp;
                result = E.cetes.yieldRate(R, Vp);
                label = 'tr';
                document.getElementById('ws-cetes-tr').value = result;
                break;
            case 'NC':
                result = E.cetes.numCetes(inv, Vp);
                label = 'N° CETES';
                break;
        }
        let el = document.getElementById('ws-cetes-result');
        if (isNaN(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Compound Interest =====
    function openCompoundInterest() {
        let html = `
        <div class="ws-section-title">Interés Compuesto</div>
        <p class="ws-info">Vf = Vp(1+i)ⁿ &nbsp;|&nbsp; VR = Vf/(1+λ) &nbsp;|&nbsp; iR = (iN-λ)/(1+λ)</p>
        <div class="ws-field">
            <span class="ws-field-label">Vp</span>
            <input type="number" class="ws-field-value" id="ws-ci-vp" value="0" step="any" placeholder="Valor Presente">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vf</span>
            <input type="number" class="ws-field-value" id="ws-ci-vf" value="0" step="any" placeholder="Valor Futuro">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ci-i" value="0" step="any" placeholder="Tasa por período (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">n</span>
            <input type="number" class="ws-field-value" id="ws-ci-n" value="0" step="any" placeholder="Número de períodos">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">λ (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ci-inf" value="0" step="any" placeholder="Inflación (decimal)">
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcCI('VF')">Vf</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcCI('VP')">Vp</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcCI('N')">Tiempo (n)</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcCI('RATE')">Tasa (i)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcCI('VR')">Valor Real</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcCI('IR')">Tasa Real</button>
        </div>
        <div id="ws-ci-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Interés Compuesto', html);
        E.state.activeWorksheet = 'CI';
    }

    function calcCI(solve) {
        let Vp = parseFloat(document.getElementById('ws-ci-vp').value) || 0;
        let Vf = parseFloat(document.getElementById('ws-ci-vf').value) || 0;
        let i = parseFloat(document.getElementById('ws-ci-i').value) || 0;
        let n = parseFloat(document.getElementById('ws-ci-n').value) || 0;
        let inf = parseFloat(document.getElementById('ws-ci-inf').value) || 0;
        let result, label;
        switch (solve) {
            case 'VF':
                result = E.compoundInterest.futureValue(Vp, i, n);
                label = 'Vf';
                document.getElementById('ws-ci-vf').value = result;
                break;
            case 'VP':
                result = E.compoundInterest.presentValue(Vf, i, n);
                label = 'Vp';
                document.getElementById('ws-ci-vp').value = result;
                break;
            case 'N':
                result = E.compoundInterest.time(Vf, Vp, i);
                label = 'n';
                document.getElementById('ws-ci-n').value = result;
                break;
            case 'RATE':
                result = E.compoundInterest.rate(Vf, Vp, n);
                label = 'i';
                document.getElementById('ws-ci-i').value = result;
                break;
            case 'VR':
                result = E.compoundInterest.realValue(Vf, inf);
                label = 'VR';
                break;
            case 'IR':
                result = E.compoundInterest.realRate(i, inf);
                label = 'iR';
                break;
        }
        let el = document.getElementById('ws-ci-result');
        if (isNaN(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Interest Rates =====
    function openInterestRates() {
        let html = `
        <div class="ws-section-title">Conversión de Tasas de Interés</div>
        <p class="ws-info">i = jnom/m &nbsp;|&nbsp; iE = (1+j/m)^m - 1 &nbsp;|&nbsp; j = [(1+iE)^(1/k) - 1]k</p>
        <div class="ws-field">
            <span class="ws-field-label">j nom (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ir-jnom" value="0" step="any" placeholder="Tasa nominal (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">m</span>
            <input type="number" class="ws-field-value" id="ws-ir-m" value="12" step="1" min="1" placeholder="Capitalizaciones/año">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">iE (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ir-ie" value="0" step="any" placeholder="Tasa efectiva anual (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">k</span>
            <input type="number" class="ws-field-value" id="ws-ir-k" value="1" step="1" min="1" placeholder="Cap/año para nominal">
        </div>
        <div class="ws-section-title">Conversión entre Nominales</div>
        <div class="ws-field">
            <span class="ws-field-label">j₁ (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ir-j1" value="0" step="any" placeholder="Tasa nominal 1 (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">m₁</span>
            <input type="number" class="ws-field-value" id="ws-ir-m1" value="12" step="1" min="1" placeholder="Capitalizaciones nominal 1">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">m₂</span>
            <input type="number" class="ws-field-value" id="ws-ir-m2" value="4" step="1" min="1" placeholder="Capitalizaciones nominal 2">
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcIR('EPP')">i efectiva/período</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcIR('EA')">Efect. Anual</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcIR('NOM')">Nominal (de Efect.)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcIR('EQN')">Equiv. Nominal</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcIR('CNV')">Convertir j₁→j₂</button>
        </div>
        <div id="ws-ir-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Tasas de Interés', html);
        E.state.activeWorksheet = 'IRATES';
    }

    function calcIR(solve) {
        let jnom = parseFloat(document.getElementById('ws-ir-jnom').value) || 0;
        let m = parseFloat(document.getElementById('ws-ir-m').value) || 1;
        let iE = parseFloat(document.getElementById('ws-ir-ie').value) || 0;
        let k = parseFloat(document.getElementById('ws-ir-k').value) || 1;
        let j1 = parseFloat(document.getElementById('ws-ir-j1').value) || 0;
        let m1 = parseFloat(document.getElementById('ws-ir-m1').value) || 1;
        let m2 = parseFloat(document.getElementById('ws-ir-m2').value) || 1;
        let result, label;
        switch (solve) {
            case 'EPP':
                result = E.interestRates.effectivePerPeriod(jnom, m);
                label = 'i por período';
                break;
            case 'EA':
                result = E.interestRates.effectiveAnnual(jnom, m);
                label = 'iE anual';
                document.getElementById('ws-ir-ie').value = result;
                break;
            case 'NOM':
                result = E.interestRates.nominalFromEffective(iE, k);
                label = 'j nominal';
                document.getElementById('ws-ir-jnom').value = result;
                break;
            case 'EQN':
                result = E.interestRates.equivalentNominal(jnom, m, k);
                label = 'j equiv. (n=' + k + ')';
                break;
            case 'CNV':
                result = E.interestRates.convertNominal(j1, m1, m2);
                label = 'j₂ (m₂=' + m2 + ')';
                break;
        }
        let el = document.getElementById('ws-ir-result');
        if (isNaN(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Ordinary Annuities (Vencidas) =====
    function openAnnuityOrd() {
        let html = `
        <div class="ws-section-title">Anualidades Vencidas</div>
        <p class="ws-info">Vf = A[(1+i)ⁿ-1]/i &nbsp;|&nbsp; Vp = A[1-(1+i)⁻ⁿ]/i</p>
        <div class="ws-field">
            <span class="ws-field-label">A</span>
            <input type="number" class="ws-field-value" id="ws-ao-a" value="0" step="any" placeholder="Renta (pago periódico)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ao-i" value="0" step="any" placeholder="Tasa por período (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">n</span>
            <input type="number" class="ws-field-value" id="ws-ao-n" value="0" step="any" placeholder="Número de períodos">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vf</span>
            <input type="number" class="ws-field-value" id="ws-ao-vf" value="0" step="any" placeholder="Valor Futuro">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vp</span>
            <input type="number" class="ws-field-value" id="ws-ao-vp" value="0" step="any" placeholder="Valor Presente">
        </div>
        <div class="ws-section-title">Con Valor Futuro</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcAO('VF')">Calcular Vf</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcAO('A_VF')">Renta (de Vf)</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcAO('N_VF')">Plazo (de Vf)</button>
        </div>
        <div class="ws-section-title">Con Valor Presente</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcAO('VP')">Calcular Vp</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcAO('A_VP')">Renta (de Vp)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcAO('N_VP')">Plazo (de Vp)</button>
        </div>
        <div id="ws-ao-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Anualidades Vencidas', html);
        E.state.activeWorksheet = 'AO';
    }

    function calcAO(solve) {
        let A = parseFloat(document.getElementById('ws-ao-a').value) || 0;
        let i = parseFloat(document.getElementById('ws-ao-i').value) || 0;
        let n = parseFloat(document.getElementById('ws-ao-n').value) || 0;
        let Vf = parseFloat(document.getElementById('ws-ao-vf').value) || 0;
        let Vp = parseFloat(document.getElementById('ws-ao-vp').value) || 0;
        let result, label;
        switch (solve) {
            case 'VF':
                result = E.annuityOrd.futureValue(A, i, n);
                label = 'Vf';
                document.getElementById('ws-ao-vf').value = result;
                break;
            case 'A_VF':
                result = E.annuityOrd.rentFromFV(Vf, i, n);
                label = 'A';
                document.getElementById('ws-ao-a').value = result;
                break;
            case 'N_VF':
                result = E.annuityOrd.termFromFV(Vf, A, i);
                label = 'n';
                document.getElementById('ws-ao-n').value = result;
                break;
            case 'VP':
                result = E.annuityOrd.presentValue(A, i, n);
                label = 'Vp';
                document.getElementById('ws-ao-vp').value = result;
                break;
            case 'A_VP':
                result = E.annuityOrd.rentFromPV(Vp, i, n);
                label = 'A';
                document.getElementById('ws-ao-a').value = result;
                break;
            case 'N_VP':
                result = E.annuityOrd.termFromPV(Vp, A, i);
                label = 'n';
                document.getElementById('ws-ao-n').value = result;
                break;
        }
        let el = document.getElementById('ws-ao-result');
        if (isNaN(result) || !isFinite(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Annuities Due (Anticipadas) =====
    function openAnnuityDue() {
        let html = `
        <div class="ws-section-title">Anualidades Anticipadas</div>
        <p class="ws-info">Vf = A[(1+i)ⁿ-1]/i × (1+i) &nbsp;|&nbsp; Vp = A[1-(1+i)⁻ⁿ]/i × (1+i)</p>
        <div class="ws-field">
            <span class="ws-field-label">A</span>
            <input type="number" class="ws-field-value" id="ws-ad-a" value="0" step="any" placeholder="Renta">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-ad-i" value="0" step="any" placeholder="Tasa por período (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">n</span>
            <input type="number" class="ws-field-value" id="ws-ad-n" value="0" step="any" placeholder="Número de períodos">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vf</span>
            <input type="number" class="ws-field-value" id="ws-ad-vf" value="0" step="any" placeholder="Valor Futuro">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vp</span>
            <input type="number" class="ws-field-value" id="ws-ad-vp" value="0" step="any" placeholder="Valor Presente">
        </div>
        <div class="ws-section-title">Con Valor Futuro</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcAD('VF')">Calcular Vf</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcAD('A_VF')">Renta (de Vf)</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcAD('N_VF')">Plazo (de Vf)</button>
        </div>
        <div class="ws-section-title">Con Valor Presente</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcAD('VP')">Calcular Vp</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcAD('A_VP')">Renta (de Vp)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcAD('N_VP')">Plazo (de Vp)</button>
        </div>
        <div id="ws-ad-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Anualidades Anticipadas', html);
        E.state.activeWorksheet = 'AD';
    }

    function calcAD(solve) {
        let A = parseFloat(document.getElementById('ws-ad-a').value) || 0;
        let i = parseFloat(document.getElementById('ws-ad-i').value) || 0;
        let n = parseFloat(document.getElementById('ws-ad-n').value) || 0;
        let Vf = parseFloat(document.getElementById('ws-ad-vf').value) || 0;
        let Vp = parseFloat(document.getElementById('ws-ad-vp').value) || 0;
        let result, label;
        switch (solve) {
            case 'VF':
                result = E.annuityDue.futureValue(A, i, n);
                label = 'Vf';
                document.getElementById('ws-ad-vf').value = result;
                break;
            case 'A_VF':
                result = E.annuityDue.rentFromFV(Vf, i, n);
                label = 'A';
                document.getElementById('ws-ad-a').value = result;
                break;
            case 'N_VF':
                result = E.annuityDue.termFromFV(Vf, A, i);
                label = 'n';
                document.getElementById('ws-ad-n').value = result;
                break;
            case 'VP':
                result = E.annuityDue.presentValue(A, i, n);
                label = 'Vp';
                document.getElementById('ws-ad-vp').value = result;
                break;
            case 'A_VP':
                result = E.annuityDue.rentFromPV(Vp, i, n);
                label = 'A';
                document.getElementById('ws-ad-a').value = result;
                break;
            case 'N_VP':
                result = E.annuityDue.termFromPV(Vp, A, i);
                label = 'n';
                document.getElementById('ws-ad-n').value = result;
                break;
        }
        let el = document.getElementById('ws-ad-result');
        if (isNaN(result) || !isFinite(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Deferred Annuities =====
    function openAnnuityDeferred() {
        let html = `
        <div class="ws-section-title">Anualidades Diferidas</div>
        <p class="ws-info">Vp = A[1-(1+i)⁻ⁿ] / [i(1+i)ᵈ]</p>
        <div class="ws-field">
            <span class="ws-field-label">A</span>
            <input type="number" class="ws-field-value" id="ws-adf-a" value="0" step="any" placeholder="Renta">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-adf-i" value="0" step="any" placeholder="Tasa por período (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">n</span>
            <input type="number" class="ws-field-value" id="ws-adf-n" value="0" step="any" placeholder="Número de períodos de pago">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">d</span>
            <input type="number" class="ws-field-value" id="ws-adf-d" value="0" step="any" placeholder="Períodos de diferimiento">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Vp</span>
            <input type="number" class="ws-field-value" id="ws-adf-vp" value="0" step="any" placeholder="Valor Presente (diferido)">
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcADF('VP')">Valor Presente</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcADF('N')">Plazo (n)</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcADF('A')">Renta (A)</button>
        </div>
        <div id="ws-adf-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Anualidades Diferidas', html);
        E.state.activeWorksheet = 'ADF';
    }

    function calcADF(solve) {
        let A = parseFloat(document.getElementById('ws-adf-a').value) || 0;
        let i = parseFloat(document.getElementById('ws-adf-i').value) || 0;
        let n = parseFloat(document.getElementById('ws-adf-n').value) || 0;
        let d = parseFloat(document.getElementById('ws-adf-d').value) || 0;
        let Vp = parseFloat(document.getElementById('ws-adf-vp').value) || 0;
        let result, label;
        switch (solve) {
            case 'VP':
                result = E.annuityDeferred.presentValue(A, i, n, d);
                label = 'Vp';
                document.getElementById('ws-adf-vp').value = result;
                break;
            case 'N':
                result = E.annuityDeferred.termFromDeferred(Vp, A, i, d);
                label = 'n';
                document.getElementById('ws-adf-n').value = result;
                break;
            case 'A':
                result = E.annuityDeferred.rentFromDeferred(Vp, i, n, d);
                label = 'A';
                document.getElementById('ws-adf-a').value = result;
                break;
        }
        let el = document.getElementById('ws-adf-result');
        if (isNaN(result) || !isFinite(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Perpetuities =====
    function openPerpetuityWS() {
        let html = `
        <div class="ws-section-title">Perpetuidades</div>
        <p class="ws-info">Ap = P × i &nbsp;|&nbsp; Vp = Ap/i &nbsp;|&nbsp; Vt = Ro + Ap/i</p>
        <div class="ws-field">
            <span class="ws-field-label">P</span>
            <input type="number" class="ws-field-value" id="ws-perp-p" value="0" step="any" placeholder="Inversión inicial">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-perp-i" value="0" step="any" placeholder="Tasa (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Ap</span>
            <input type="number" class="ws-field-value" id="ws-perp-ap" value="0" step="any" placeholder="Anualidad perpetua">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">Ro</span>
            <input type="number" class="ws-field-value" id="ws-perp-ro" value="0" step="any" placeholder="Donación inicial">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">n</span>
            <input type="number" class="ws-field-value" id="ws-perp-n" value="0" step="any" placeholder="Períodos (para Vp perpetuidad)">
        </div>
        <div class="ws-section-title">Calcular</div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcPerp('VP')">Valor Presente</button>
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcPerp('AP')">Anualidad (Ap)</button>
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcPerp('RATE')">Tasa (i)</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcPerp('VT')">Valor Total Donación</button>
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.calcPerp('VP_N')">Vp Perpetuidad c/n</button>
        </div>
        <div id="ws-perp-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Perpetuidades', html);
        E.state.activeWorksheet = 'PERP';
    }

    function calcPerp(solve) {
        let P = parseFloat(document.getElementById('ws-perp-p').value) || 0;
        let i = parseFloat(document.getElementById('ws-perp-i').value) || 0;
        let Ap = parseFloat(document.getElementById('ws-perp-ap').value) || 0;
        let Ro = parseFloat(document.getElementById('ws-perp-ro').value) || 0;
        let n = parseFloat(document.getElementById('ws-perp-n').value) || 0;
        let result, label;
        switch (solve) {
            case 'VP':
                result = E.perpetuity.presentValue(Ap, i);
                label = 'Vp';
                document.getElementById('ws-perp-p').value = result;
                break;
            case 'AP':
                result = E.perpetuity.annuity(P, i);
                label = 'Ap';
                document.getElementById('ws-perp-ap').value = result;
                break;
            case 'RATE':
                result = E.perpetuity.rateFromDonation(Ap, P, Ro);
                label = 'i';
                document.getElementById('ws-perp-i').value = result;
                break;
            case 'VT':
                result = E.perpetuity.totalDonation(Ro, Ap, i);
                label = 'Vt';
                break;
            case 'VP_N':
                result = E.perpetuity.pvAnnuityPerpetuity(Ap, i, n);
                label = 'Vp';
                break;
        }
        let el = document.getElementById('ws-perp-result');
        if (isNaN(result) || !isFinite(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">${label}</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, label + '=', '');
    }

    // ===== Replacement Cost =====
    function openReplacementCost() {
        let html = `
        <div class="ws-section-title">Costo Total de Reemplazos Futuros</div>
        <p class="ws-info">Ct = K(1+i)ⁿ / [(1+i)ⁿ - 1]</p>
        <div class="ws-field">
            <span class="ws-field-label">K</span>
            <input type="number" class="ws-field-value" id="ws-rc-k" value="0" step="any" placeholder="Costo de reemplazo">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">i (dec)</span>
            <input type="number" class="ws-field-value" id="ws-rc-i" value="0" step="any" placeholder="Tasa (decimal)">
        </div>
        <div class="ws-field">
            <span class="ws-field-label">n</span>
            <input type="number" class="ws-field-value" id="ws-rc-n" value="0" step="any" placeholder="Períodos">
        </div>
        <div class="ws-btn-row">
            <button class="ws-btn ws-btn-primary" onclick="Worksheets.calcRC()">Calcular Costo Total</button>
        </div>
        <div id="ws-rc-result"></div>
        <div class="ws-btn-row" style="margin-top:12px">
            <button class="ws-btn ws-btn-secondary" onclick="Worksheets.openFormulas()">← Menú Fórmulas</button>
        </div>`;
        show('Costo de Reemplazos', html);
        E.state.activeWorksheet = 'RC';
    }

    function calcRC() {
        let K = parseFloat(document.getElementById('ws-rc-k').value) || 0;
        let i = parseFloat(document.getElementById('ws-rc-i').value) || 0;
        let n = parseFloat(document.getElementById('ws-rc-n').value) || 0;
        let result = E.replacementCost.totalCost(K, i, n);
        let el = document.getElementById('ws-rc-result');
        if (isNaN(result) || !isFinite(result)) {
            el.innerHTML = '<p class="ws-info" style="color:#e88">Error en el cálculo. Verifica los datos.</p>';
            return;
        }
        el.innerHTML = `<div class="ws-field"><span class="ws-field-label">Ct</span><input class="ws-field-value" readonly value="${fmt(result)}"></div>`;
        E.setDisplayValue(result, 'Ct=', '');
    }

    // ===== Public API =====
    return {
        hide,
        openFormat,
        applyFormat,
        openPY,
        applyPY,
        openAmort,
        computeAmort,
        computeAmortTable,
        openCashFlow,
        addCashFlow,
        removeCashFlow,
        computeCF,
        saveCashFlows,
        openBond,
        saveBondData,
        computeBondWS,
        openDepr,
        computeDepr,
        computeDeprTable,
        openData,
        addStatData,
        removeStatData,
        clearStatData,
        goToStat,
        openStat,
        changeStatModel,
        predictY,
        predictX,
        openPctChange,
        computePctChange,
        openIconv,
        computeIconv,
        openDate,
        computeDateWS,
        openProfit,
        computeProfitWS,
        openBreakeven,
        computeBreakevenWS,
        openMemory,
        applyMemory,
        clearMemory,
        openNPV,
        openIRR,
        openFormulas,
        openSimpleInterest,
        calcSI,
        openCetesWS,
        calcCetes,
        openCompoundInterest,
        calcCI,
        openInterestRates,
        calcIR,
        openAnnuityOrd,
        calcAO,
        openAnnuityDue,
        calcAD,
        openAnnuityDeferred,
        calcADF,
        openPerpetuityWS,
        calcPerp,
        openReplacementCost,
        calcRC
    };
})();
