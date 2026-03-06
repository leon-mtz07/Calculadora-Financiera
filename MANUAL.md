# Calculadora Financiera BA II Plus — Manual de Usuario Completo

## Tabla de Contenidos

1. [Descripción General](#1-descripción-general)
2. [Interfaz de la Calculadora](#2-interfaz-de-la-calculadora)
3. [Pantalla e Indicadores](#3-pantalla-e-indicadores)
4. [Teclas — Referencia Completa](#4-teclas--referencia-completa)
5. [Modos de Cálculo](#5-modos-de-cálculo)
6. [Configuración de Formato](#6-configuración-de-formato)
7. [Aritmética Básica y Paréntesis](#7-aritmética-básica-y-paréntesis)
8. [Sistema de Memoria (M0–M9)](#8-sistema-de-memoria-m0m9)
9. [TVM — Valor del Dinero en el Tiempo](#9-tvm--valor-del-dinero-en-el-tiempo)
10. [Amortización](#10-amortización)
11. [Flujos de Efectivo (NPV / IRR)](#11-flujos-de-efectivo-npv--irr)
12. [Bonos](#12-bonos)
13. [Depreciación](#13-depreciación)
14. [Estadística y Regresión](#14-estadística-y-regresión)
15. [Cambio Porcentual](#15-cambio-porcentual)
16. [Conversión de Tasas de Interés](#16-conversión-de-tasas-de-interés)
17. [Cálculo de Fechas](#17-cálculo-de-fechas)
18. [Margen de Ganancia](#18-margen-de-ganancia)
19. [Punto de Equilibrio](#19-punto-de-equilibrio)
20. [Funciones Científicas](#20-funciones-científicas)
21. [Fórmulas Financieras (FML)](#21-fórmulas-financieras-fml)
22. [Atajos de Teclado (Desktop)](#22-atajos-de-teclado-desktop)
23. [Ejemplos Paso a Paso](#23-ejemplos-paso-a-paso)

---

## 1. Descripción General

Esta calculadora financiera web es una implementación completa de la **Texas Instruments BA II Plus**, la calculadora financiera profesional más utilizada en el mundo. Incluye todas las funcionalidades de la calculadora original más un módulo adicional de **Fórmulas Financieras** con las fórmulas del formulario de Matemáticas Financieras.

### Características principales:
- **12 hojas de trabajo** (worksheets) financieras integradas
- **Módulo de Fórmulas Financieras** con 9 categorías adicionales
- Funciones científicas completas (trigonometría, logaritmos, etc.)
- 10 memorias independientes con operaciones aritméticas
- Modos AOS (algebraico) y Cadena
- **100% responsiva**: se adapta a teléfonos, tablets y escritorio
- Atajos de teclado para uso en escritorio

---

## 2. Interfaz de la Calculadora

La calculadora se divide en:

```
┌─────────────────────────────┐
│  TEXAS INSTRUMENTS  BA II+  │  ← Encabezado
├─────────────────────────────┤
│ 2ND INV HYP COMPUTE BGN... │  ← Indicadores
│                   0.00      │  ← Pantalla principal
├─────────────────────────────┤
│ [2nd][ENTER][ ↑ ][ ↓ ][ON] │  ← Fila 1: Control
│ [ N ][I/Y ][ PV][PMT][ FV] │  ← Fila 2: TVM (azul)
│ [CPT][ (  ][ ) ][STO][RCL] │  ← Fila 3: Funciones
│ [+/-][CE/C][ ← ][ ÷ ][ × ] │  ← Fila 4: Operadores
│ [ yˣ][ 7  ][ 8 ][ 9 ][ − ] │  ← Fila 5: Números
│ [ √x][ 4  ][ 5 ][ 6 ][ + ] │  ← Fila 6: Números
│ [ LN][ 1  ][ 2 ][ 3 ][ = ] │  ← Fila 7: Números
│ [SIN][COS ][TAN][ 0 ][ . ] │  ← Fila 8: Trigonometría
│[INV][HYP][%][RND][EE][FML]  │  ← Fila 9: Extra
└─────────────────────────────┘
```

---

## 3. Pantalla e Indicadores

### Indicadores de Estado

| Indicador | Significado |
|-----------|-------------|
| **2ND** | La próxima tecla ejecutará su función secundaria |
| **INV** | La próxima función trigonométrica será la inversa |
| **HYP** | La próxima función trigonométrica será hiperbólica |
| **COMPUTE** | Se ha presionado CPT; la siguiente tecla TVM calculará ese valor |
| **ENTER** | Se puede presionar ENTER para asignar un valor |
| **SET** | Se puede cambiar una configuración |
| **↑ ↓** | Hay variables anteriores/siguientes disponibles |
| **DEL** | Se puede eliminar un dato |
| **INS** | Se puede insertar un dato |
| **BGN** | Los cálculos TVM usan pagos al **inicio** del período |
| **RAD** | Los ángulos están en radianes (en vez de grados) |

### Pantalla Principal

La pantalla muestra:
- **Etiqueta** (izquierda): Indica la variable activa (ej: `N=`, `PV=`, `IRR=`)
- **Valor** (centro/derecha): El número actual hasta 10 dígitos
- **Indicador de asignación** (derecha): `=` si el valor fue ingresado, `*` si fue calculado

---

## 4. Teclas — Referencia Completa

Cada tecla tiene dos funciones: **primaria** (impresa en la tecla) y **secundaria** (texto superior, activada con `2nd`).

### Fila 1 — Control

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **2nd** | Activa modo secundario | — |
| **ENTER** | Confirma entrada / asigna valor | **QUIT** — Sale de la hoja de trabajo activa |
| **↑** | Navega hacia arriba en hojas de trabajo | **SET** — Cambia configuración |
| **↓** | Navega hacia abajo en hojas de trabajo | **DEL** — Elimina dato |
| **ON/OFF** | Enciende/apaga la calculadora | **INS** — Inserta dato |

### Fila 2 — TVM (Teclas azules)

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **N** | Asigna/recupera número de períodos | **xP/Y** — Multiplica el valor por P/Y y lo asigna a N |
| **I/Y** | Asigna/recupera tasa de interés anual | **P/Y** — Abre configuración de P/Y y C/Y |
| **PV** | Asigna/recupera valor presente | **AMORT** — Abre hoja de Amortización |
| **PMT** | Asigna/recupera pago periódico | **BGN** — Alterna entre modo BGN (inicio) y END (final) |
| **FV** | Asigna/recupera valor futuro | **CLR TVM** — Limpia todas las variables TVM |

### Fila 3 — Funciones

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **CPT** | Compute — calcula la siguiente variable TVM | — |
| **(** | Abre paréntesis (hasta 15 niveles) | **nPr** — Permutaciones |
| **)** | Cierra paréntesis | **nCr** — Combinaciones |
| **STO** | Almacenar valor en memoria (seguido de 0-9) | **K** — Función de constante |
| **RCL** | Recuperar valor de memoria (seguido de 0-9) | **ANS** — Último resultado calculado |

### Fila 4 — Edición y Operadores

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **+/−** | Cambia el signo del número | **CF** — Abre hoja de Flujos de Efectivo |
| **CE/C** | Borra entrada (1 vez) / borra todo (2 veces) | **CLR WORK** — Limpia la hoja de trabajo activa |
| **←** | Borra el último dígito (backspace) | — |
| **÷** | División | **ICONV** — Conversión de tasas de interés |
| **×** | Multiplicación | **MEM** — Hoja de trabajo de memoria |

### Fila 5

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **yˣ** | Potencia (base^exponente) | **1/x** — Recíproco |
| **7** | Dígito 7 | **DATA** — Ingreso de datos estadísticos |
| **8** | Dígito 8 | **STAT** — Resultados estadísticos |
| **9** | Dígito 9 | **Δ%** — Cambio porcentual |
| **−** | Resta | **FORMAT** — Configuración de formato |

### Fila 6

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **√x** | Raíz cuadrada | **x²** — Cuadrado |
| **4** | Dígito 4 | **DATE** — Cálculo de fechas |
| **5** | Dígito 5 | **PROFIT** — Margen de ganancia |
| **6** | Dígito 6 | **BRKEVN** — Punto de equilibrio |
| **+** | Suma | **RESET** — Restablece la calculadora a valores de fábrica |

### Fila 7

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **LN** | Logaritmo natural | **eˣ** — Exponencial (antilogaritmo natural) |
| **1** | Dígito 1 | **BOND** — Hoja de trabajo de bonos |
| **2** | Dígito 2 | **DEPR** — Hoja de trabajo de depreciación |
| **3** | Dígito 3 | **n!** — Factorial |
| **=** | Ejecuta el cálculo | **NPV** — Abre flujos de efectivo (NPV) |

### Fila 8

| Tecla | Función Primaria | 2nd → Función Secundaria |
|-------|-----------------|--------------------------|
| **SIN** | Seno | **SIN⁻¹** — Arcoseno |
| **COS** | Coseno | **COS⁻¹** — Arcocoseno |
| **TAN** | Tangente | **TAN⁻¹** — Arcotangente |
| **0** | Dígito 0 | **IRR** — Abre flujos de efectivo (IRR) |
| **.** | Punto decimal | **RAND** — Número aleatorio (0-1) |

### Fila 9 — Extra

| Tecla | Función |
|-------|---------|
| **INV** | Activa modo inverso para trigonometría |
| **HYP** | Activa modo hiperbólico para trigonometría |
| **%** | Calcula porcentaje |
| **RND** | Redondea al formato decimal activo |
| **EE** | Entrada en notación científica |
| **FML** | Abre el menú de **Fórmulas Financieras** |

---

## 5. Modos de Cálculo

### AOS (Algebraic Operating System) — Recomendado
Respeta la jerarquía algebraica estándar:
- Multiplicaciones y divisiones se realizan antes que sumas y restas
- Ejemplo: `3 + 2 × 4 =` → Resultado: **11** (2×4=8, 3+8=11)

### CHN (Chain / Cadena)
Evalúa de izquierda a derecha en el orden ingresado:
- Ejemplo: `3 + 2 × 4 =` → Resultado: **20** (3+2=5, 5×4=20)

**Cambiar modo:** Presiona `2nd` → `FORMAT` (tecla −), y selecciona AOS o CHN.

---

## 6. Configuración de Formato

Acceso: `2nd` → `FORMAT` (tecla −)

| Configuración | Opciones |
|---------------|----------|
| **Decimales** | 0 a 8 dígitos fijos, o 9 (flotante) |
| **Ángulos** | DEG (grados) o RAD (radianes) |
| **Fechas** | US (MM-DD-AAAA) o EU (DD-MM-AAAA) |
| **Separador** | US (1,000.00) o EU (1.000,00) |
| **Método** | AOS (algebraico) o CHN (cadena) |

---

## 7. Aritmética Básica y Paréntesis

### Operaciones básicas
```
Suma:           5 + 3 =     → 8
Resta:          10 - 4 =    → 6
Multiplicación: 7 × 8 =     → 56
División:       100 ÷ 4 =   → 25
Potencia:       2 yˣ 10 =   → 1024
```

### Paréntesis
La calculadora admite hasta **15 niveles** de paréntesis anidados:
```
( 3 + 5 ) × 2 =   → 16
( ( 2 + 3 ) × ( 4 + 1 ) ) =   → 25
```

### Cambio de signo
Presiona `+/−` para cambiar el signo del número actual:
```
50 +/− → -50
```

### Porcentaje
```
200 + 15 % =   → 230   (200 + 15% de 200)
500 × 20 % =   → 100   (20% de 500)
```

---

## 8. Sistema de Memoria (M0–M9)

La calculadora tiene **10 memorias independientes** (M0 a M9).

### Operaciones de Memoria

| Acción | Secuencia de Teclas |
|--------|-------------------|
| Almacenar valor en M3 | `STO` `3` |
| Recuperar valor de M3 | `RCL` `3` |
| Sumar valor a M3 | `STO` `+` `3` |
| Restar valor de M3 | `STO` `−` `3` |
| Multiplicar M3 por valor | `STO` `×` `3` |
| Dividir M3 por valor | `STO` `÷` `3` |
| Ver/editar todas las memorias | `2nd` `MEM` (tecla ×) |
| Limpiar todas las memorias | Desde la hoja MEM: botón "Limpiar Todas" |

### Ejemplo: Almacenar y recuperar
```
100 STO 0     → Almacena 100 en M0
200 STO 1     → Almacena 200 en M1
RCL 0         → Muestra 100
+ RCL 1 =     → 100 + 200 = 300
```

### Función ANS (Last Answer)
`2nd` → `ANS` (tecla RCL): Recupera el último resultado calculado.

---

## 9. TVM — Valor del Dinero en el Tiempo

La hoja TVM es la más importante. Resuelve problemas de **5 variables interconectadas**:

| Variable | Descripción |
|----------|-------------|
| **N** | Número total de períodos |
| **I/Y** | Tasa de interés por año (%) |
| **PV** | Valor Presente |
| **PMT** | Pago por período |
| **FV** | Valor Futuro |

### Cómo usar TVM

1. **Ingresa 4 de las 5 variables** presionando el valor seguido de la tecla correspondiente
2. **Calcula la 5ª** presionando `CPT` seguido de la tecla de la variable desconocida

### Convención de signos
- **Flujos de salida** (dinero que pagas): ingresar como **negativo** (usar `+/−`)
- **Flujos de entrada** (dinero que recibes): ingresar como **positivo**

### P/Y y C/Y
Acceso: `2nd` → `P/Y` (tecla I/Y)
- **P/Y**: Pagos por año (default: 1)
- **C/Y**: Períodos de capitalización por año (default: 1)

Para exámenes CFA, se recomienda mantener P/Y = 1.

### Modo BGN / END
`2nd` → `BGN` (tecla PMT)
- **END**: Pagos al final del período (anualidades vencidas) — default
- **BGN**: Pagos al inicio del período (anualidades anticipadas)

Cuando BGN está activo, aparece el indicador **BGN** en pantalla.

### Limpiar variables TVM
`2nd` → `CLR TVM` (tecla FV): Pone todas las variables TVM en cero.

### Ejemplo 1: Cuota mensual de una hipoteca

**Problema:** Préstamo de $200,000 a 30 años, tasa anual del 6%, pagos mensuales.

```
Primero configura P/Y = 12:
2nd → P/Y → ingresa 12 → ENTER → 2nd → QUIT

Ingresa las variables:
360 N                   (30 años × 12 meses)
6 I/Y                   (tasa anual 6%)
200000 PV               (monto del préstamo, positivo porque lo recibes)
0 FV                    (al final se ha pagado todo)
CPT PMT                 → -1,199.10 (pago mensual, negativo porque es salida)
```

### Ejemplo 2: ¿Cuánto ahorrar para $1,000,000?

**Problema:** Quiero juntar $1,000,000 en 20 años ahorrando mensualmente con tasa del 8% anual.

```
2nd → P/Y → 12 → ENTER → 2nd → QUIT

240 N                   (20 años × 12 meses)
8 I/Y                   (tasa anual 8%)
0 PV                    (empiezo sin nada)
1000000 FV              (meta)
CPT PMT                 → -1,698.02 (ahorro mensual necesario)
```

### Ejemplo 3: Tasa de interés implícita

**Problema:** Compro un auto de $300,000 pagando $6,500 mensuales durante 5 años.

```
2nd → P/Y → 12 → ENTER → 2nd → QUIT

60 N                    (5 años × 12)
300000 PV               (precio del auto)
6500 +/− PMT            (pago mensual, negativo)
0 FV                    (se paga completo)
CPT I/Y                 → 8.07% (tasa anual implícita)
```

---

## 10. Amortización

Acceso: `2nd` → `AMORT` (tecla PV)

Genera calendarios de amortización a partir de los datos TVM ingresados.

### Variables

| Variable | Descripción |
|----------|-------------|
| **P1** | Primer período del rango |
| **P2** | Último período del rango |
| **BAL** | Saldo restante al final del rango |
| **PRN** | Porción de capital pagada en el rango |
| **INT** | Porción de intereses pagada en el rango |

### Ejemplo: Tabla de amortización de hipoteca

Después de ingresar los datos TVM de la hipoteca anterior:
```
2nd → AMORT
P1 = 1, P2 = 12     → Muestra amortización del primer año
P1 = 1, P2 = 360    → Muestra amortización completa

También puedes generar la tabla completa con el botón "Tabla Completa".
```

---

## 11. Flujos de Efectivo (NPV / IRR)

Acceso: `2nd` → `CF` (tecla +/−)

Diseñada para analizar flujos de efectivo **desiguales** (a diferencia de TVM que requiere flujos iguales).

### Variables

| Variable | Descripción |
|----------|-------------|
| **CF0** | Flujo inicial (inversión, generalmente negativo) |
| **C01, C02...** | Flujos subsecuentes |
| **F01, F02...** | Frecuencia de cada flujo (cuántas veces se repite) |
| **I** | Tasa de descuento para NPV (%) |
| **NPV** | Valor Presente Neto |
| **IRR** | Tasa Interna de Retorno |

### Ejemplo: Análisis de proyecto de inversión

**Problema:** Inversión inicial de $100,000. Flujos: Año 1: $30,000, Años 2-4: $40,000 c/u, Año 5: $50,000. Tasa de descuento: 10%.

```
2nd → CF
CF0  = -100000        (inversión inicial)
C01  = 30000, F01 = 1 (año 1)
C02  = 40000, F02 = 3 (años 2, 3, 4)
C03  = 50000, F03 = 1 (año 5)
I    = 10             (tasa de descuento)

Calcular NPV → 36,309.67
Calcular IRR → 25.31%
```

**Interpretación:**
- NPV > 0: El proyecto genera valor, se recomienda aceptar
- IRR > tasa de descuento: El proyecto es rentable

---

## 12. Bonos

Acceso: `2nd` → `BOND` (tecla 1)

### Variables

| Variable | Descripción |
|----------|-------------|
| **SDT** | Fecha de liquidación (compra) |
| **CPN** | Tasa de cupón anual (%) |
| **RDT** | Fecha de redención (vencimiento) |
| **RV** | Valor de redención (% del valor par, usualmente 100) |
| **ACT/360** | Método de conteo de días |
| **2/Y o 1/Y** | Frecuencia del cupón (semestral o anual) |
| **YLD** | Rendimiento al vencimiento (yield, %) |
| **PRI** | Precio del bono |
| **AI** | Interés acumulado |

### Ejemplo: Precio de un bono corporativo

**Problema:** Bono con cupón del 7% anual, vencimiento en 10 años, rendimiento requerido 8%, cupones semestrales.

```
2nd → BOND
SDT  = 01-01-2026
CPN  = 7
RDT  = 01-01-2036
RV   = 100
Días = ACT
Cupón = Semestral (2/Y)
YLD  = 8

Calcular Precio → ~93.20
```

---

## 13. Depreciación

Acceso: `2nd` → `DEPR` (tecla 2)

### Métodos disponibles

| Método | Descripción |
|--------|-------------|
| **SL** | Línea Recta (Straight-Line) |
| **SYD** | Suma de Dígitos de los Años |
| **DB** | Saldo Decreciente (Declining Balance) |
| **DB→SL** | Saldo Decreciente con transición a Línea Recta |
| **SLF** | Línea Recta método francés |
| **DBF** | Saldo Decreciente método francés |

### Variables

| Variable | Descripción |
|----------|-------------|
| **CST** | Costo del activo |
| **SAL** | Valor de salvamento |
| **LIF** | Vida útil (años) |
| **YR** | Año a calcular |
| **DB%** | Porcentaje de saldo decreciente |
| **DEP** | Depreciación del año |
| **RBV** | Valor en libros restante |
| **RDV** | Monto depreciable restante |

### Ejemplo: Depreciación en línea recta

**Problema:** Maquinaria costó $50,000, valor de salvamento $5,000, vida útil 10 años.

```
2nd → DEPR
Método = SL
CST = 50000
SAL = 5000
LIF = 10
YR  = 1

Calcular → DEP = 4,500 por año
           RBV = 45,500 (valor en libros después del año 1)
```

---

## 14. Estadística y Regresión

### Ingreso de datos
Acceso: `2nd` → `DATA` (tecla 7)

Permite ingresar hasta 50 pares de datos (X, Y).

### Resultados
Acceso: `2nd` → `STAT` (tecla 8)

### Modelos de regresión

| Modelo | Ecuación |
|--------|----------|
| **LIN** | y = a + bx (Lineal) |
| **LOG** | y = a + b·ln(x) (Logarítmico) |
| **EXP** | y = a·eᵇˣ (Exponencial) |
| **PWR** | y = a·xᵇ (Potencia) |

### Resultados calculados

| Variable | Descripción |
|----------|-------------|
| **n** | Número de datos |
| **x̄** | Media de X |
| **Sx** | Desviación estándar muestral de X |
| **σx** | Desviación estándar poblacional de X |
| **ȳ** | Media de Y |
| **Sy, σy** | Desviaciones de Y |
| **a** | Intercepto de la regresión |
| **b** | Pendiente de la regresión |
| **r** | Coeficiente de correlación |

### Pronóstico
Ingresa un valor de X para predecir ŷ, o un valor de Y para predecir x̂.

### Ejemplo: Regresión lineal de ventas

```
2nd → DATA
Datos:
  X=1, Y=100
  X=2, Y=150
  X=3, Y=180
  X=4, Y=220
  X=5, Y=270

→ Ver Resultados
Modelo: LIN
x̄ = 3, ȳ = 184
a = 56, b = 42
r = 0.993 (correlación muy alta)

Pronóstico: X=6 → ŷ = 308
```

---

## 15. Cambio Porcentual

Acceso: `2nd` → `Δ%` (tecla 9)

### Variables

| Variable | Descripción |
|----------|-------------|
| **OLD** | Valor original |
| **NEW** | Valor nuevo |
| **%CH** | Cambio porcentual |
| **#PD** | Número de períodos (para interés compuesto) |

### Ejemplo

```
OLD = 1000, NEW = 1250
Calcular %CH → 25%

Con #PD = 3:
OLD = 1000, NEW = 1250
Calcular %CH → 7.72% (tasa por período)
```

---

## 16. Conversión de Tasas de Interés

Acceso: `2nd` → `ICONV` (tecla ÷)

### Variables

| Variable | Descripción |
|----------|-------------|
| **NOM** | Tasa nominal anual (APR, %) |
| **EFF** | Tasa efectiva anual (EAR, %) |
| **C/Y** | Períodos de capitalización por año |

### Ejemplo: Comparar dos inversiones

```
Inversión A: 12% nominal capitalización mensual
Inversión B: 12.5% nominal capitalización semestral

Inversión A:
NOM = 12, C/Y = 12
NOM → EFF → 12.68%

Inversión B:
NOM = 12.5, C/Y = 2
NOM → EFF → 12.89%

Resultado: Inversión B es ligeramente mejor
```

---

## 17. Cálculo de Fechas

Acceso: `2nd` → `DATE` (tecla 4)

### Funciones
- Calcular **días entre dos fechas**
- Calcular una **fecha futura/pasada** sumando/restando días
- Ver el **día de la semana** de cualquier fecha

### Métodos
- **ACT**: Días reales del calendario
- **360**: Convención 30/360

### Ejemplo

```
DT1 = 03-01-2026
DT2 = 12-25-2026
Método = ACT
Calcular Días → 299 días
DT1: DOM | DT2: VIE
```

---

## 18. Margen de Ganancia

Acceso: `2nd` → `PROFIT` (tecla 5)

### Variables

| Variable | Descripción |
|----------|-------------|
| **CST** | Costo |
| **SEL** | Precio de venta |
| **MAR** | Margen de ganancia (%) |

### Fórmula
`MAR = (SEL - CST) / SEL × 100`

### Ejemplo

```
CST = 80, SEL = 120
Calcular Margen → 33.33%

CST = 80, MAR = 40%
Calcular Precio → 133.33
```

---

## 19. Punto de Equilibrio

Acceso: `2nd` → `BRKEVN` (tecla 6)

### Variables

| Variable | Descripción |
|----------|-------------|
| **FC** | Costos fijos |
| **VC** | Costo variable por unidad |
| **P** | Precio de venta por unidad |
| **PFT** | Utilidad deseada |
| **Q** | Cantidad (unidades) |

### Fórmula
`Q = (FC + PFT) / (P - VC)`

### Ejemplo: Punto de equilibrio de un negocio

```
FC  = 50000   (renta, salarios fijos, etc.)
VC  = 30      (costo por unidad)
P   = 80      (precio de venta por unidad)
PFT = 0       (para punto de equilibrio puro)

Calcular Q → 1,000 unidades

Con utilidad deseada:
PFT = 20000
Calcular Q → 1,400 unidades
```

---

## 20. Funciones Científicas

### Funciones Matemáticas

| Tecla | Función | 2nd → |
|-------|---------|-------|
| **√x** | Raíz cuadrada | **x²** — Cuadrado |
| **yˣ** | Potencia | **1/x** — Recíproco |
| **LN** | Logaritmo natural | **eˣ** — Exponencial |
| **n!** (2nd+3) | — | Factorial (hasta 69!) |
| **nPr** (2nd+() | — | Permutaciones |
| **nCr** (2nd+)) | — | Combinaciones |
| **RAND** (2nd+.) | — | Número aleatorio 0-1 |

### Trigonometría

| Función | Tecla | Inversa (2nd) |
|---------|-------|---------------|
| **sin(x)** | SIN | **sin⁻¹(x)** = arcsin |
| **cos(x)** | COS | **cos⁻¹(x)** = arccos |
| **tan(x)** | TAN | **tan⁻¹(x)** = arctan |

### Funciones Hiperbólicas
Presiona `HYP` antes de SIN/COS/TAN:
- `HYP` `SIN` → sinh(x)
- `HYP` `COS` → cosh(x)
- `HYP` `TAN` → tanh(x)

### Funciones Hiperbólicas Inversas
Presiona `INV` y `HYP` antes de SIN/COS/TAN:
- `INV` `HYP` `SIN` → sinh⁻¹(x) = arcsinh
- `INV` `HYP` `COS` → cosh⁻¹(x) = arccosh
- `INV` `HYP` `TAN` → tanh⁻¹(x) = arctanh

### Ejemplos

```
Raíz cuadrada:    144 √x        → 12
Cuadrado:         7 2nd x²      → 49
Recíproco:        8 2nd 1/x     → 0.125
Logaritmo:        100 LN        → 4.6052
Exponencial:      2 2nd eˣ      → 7.3891
Factorial:        5 2nd n!      → 120
Permutaciones:    10 2nd nPr 3 = → 720
Combinaciones:    10 2nd nCr 3 = → 120
Seno (grados):    30 SIN        → 0.5
Arcocoseno:       0.5 2nd COS⁻¹ → 60 (grados)
```

---

## 21. Fórmulas Financieras (FML)

Acceso: Botón verde **FML** en la fila inferior.

Este módulo adicional contiene las fórmulas del formulario de **Matemáticas Financieras**, organizadas en 9 categorías:

### 21.1 Interés Simple

| Fórmula | Ecuación |
|---------|----------|
| **Interés** | I = Vp × i × t |
| **Valor Futuro** | Vf = Vp(1 + i×t) |
| **Valor Presente** | Vp = Vf / (1 + i×t) |
| **Tasa** | i = (Vf/Vp - 1) / t |
| **Tiempo** | t = (Vf/Vp - 1) / i |
| **Descuento (Valor líquido)** | Vl = Vf(1 - d×t) |

**Variables:**
- **Vp**: Valor presente (capital)
- **Vf**: Valor futuro (monto)
- **i**: Tasa de interés (en decimal, ej: 0.10 para 10%)
- **t**: Tiempo en períodos
- **d**: Tasa de descuento (decimal)

#### Ejemplo: Interés simple de un préstamo
```
FML → Interés Simple
Vp = 10000 (capital prestado)
i  = 0.12  (12% anual en decimal)
t  = 2     (2 años)

Calcular Interés → I = 2,400
Calcular Vf → Vf = 12,400
```

#### Ejemplo: Descuento bancario
```
FML → Interés Simple
Vf = 50000 (valor nominal del pagaré)
d  = 0.15  (tasa de descuento 15%)
t  = 0.5   (6 meses = 0.5 años)

Calcular Descuento (Vl) → 46,250 (valor líquido recibido)
```

### 21.2 CETES (Instrumentos Bursátiles)

| Fórmula | Ecuación |
|---------|----------|
| **VP (tasa de descuento)** | Vp = Vf(1 - d×t/360) |
| **VP (tasa de rendimiento)** | Vp = Vf(1 + tr×t/360)⁻¹ |
| **Rendimiento** | R = Vf - Vp |
| **Tasa de rendimiento** | tr = R / Vp |
| **Número de CETES** | N = Inversión / Vp |

**Variables:**
- **Vf**: Valor nominal del CETE (generalmente $10 MXN)
- **d**: Tasa de descuento (decimal)
- **tr**: Tasa de rendimiento (decimal)
- **t**: Plazo en días (28, 91, 182, 364)

#### Ejemplo: Compra de CETES a 28 días
```
FML → CETES
Vf = 10          (valor nominal $10)
d  = 0.1125      (tasa de descuento 11.25%)
t  = 28          (plazo 28 días)
Inversión = 100000

Calcular Vp (desc.) → $9.9125
Calcular Rendimiento → $0.0875 por CETE
Calcular Núm. CETES → 10,088 CETES
Calcular Tasa rend. → 0.008826 (0.88% en 28 días)
```

### 21.3 Interés Compuesto

| Fórmula | Ecuación |
|---------|----------|
| **Valor Futuro** | Vf = Vp(1 + i)ⁿ |
| **Valor Presente** | Vp = Vf(1 + i)⁻ⁿ |
| **Tiempo** | n = log(Vf/Vp) / log(1 + i) |
| **Tasa** | i = (Vf/Vp)^(1/n) - 1 |
| **Valor Real** | VR = Vf / (1 + λ) |
| **Tasa Real** | iR = (iN - λ) / (1 + λ) |

**Variables:**
- **λ (lambda)**: Tasa de inflación (decimal)
- **iN**: Tasa nominal (decimal)

#### Ejemplo: Inversión a plazo fijo
```
FML → Interés Compuesto
Vp = 50000  (inversión inicial)
i  = 0.01   (1% mensual)
n  = 24     (24 meses)

Calcular Vf → 63,486.78

Con inflación del 5% anual:
λ = 0.05
Calcular Valor Real → 60,463.60
Calcular Tasa Real (usando iN = 0.1268) → 0.0731 (7.31% real)
```

### 21.4 Tasas de Interés

| Fórmula | Ecuación |
|---------|----------|
| **Tasa efectiva por período** | i = jnom / m |
| **Tasa efectiva anual** | iE = (1 + j/m)^m - 1 |
| **Nominal de efectiva** | j = [(1+iE)^(1/k) - 1] × k |
| **Tasas equivalentes** | jnom_n = [(1+j/m)^(m/n) - 1] × n |
| **Conversión entre nominales** | j₂ = [(1+j₁/m₁)^(m₁/m₂) - 1] × m₂ |

**Variables:**
- **jnom**: Tasa nominal anual (en decimal)
- **m**: Número de capitalizaciones por año
- **iE**: Tasa efectiva anual (en decimal)
- **k**: Capitalizaciones para la nominal resultante

**NOTA:** En este módulo todas las tasas se ingresan en **decimal** (ej: 0.12 para 12%).

#### Ejemplo: Comparar tasas nominales
```
FML → Tasas de Interés
j₁ = 0.12   (12% nominal)
m₁ = 12     (capitalización mensual)
m₂ = 4      (queremos la equivalente trimestral)

Convertir j₁→j₂ → 0.12121 (12.12% nominal trimestral equivalente)
```

#### Ejemplo: Tasa efectiva anual
```
j nom = 0.18  (18% nominal)
m = 12        (mensual)

Calcular Efect. Anual → 0.19562 (19.56% efectiva anual)
```

### 21.5 Anualidades Vencidas

Los pagos se realizan al **final** de cada período.

| Fórmula | Ecuación |
|---------|----------|
| **Valor Futuro** | Vf = A × [(1+i)ⁿ - 1] / i |
| **Renta (de Vf)** | A = Vf × i / [(1+i)ⁿ - 1] |
| **Plazo (de Vf)** | n = log(Vf×i/A + 1) / log(1+i) |
| **Valor Presente** | Vp = A × [1 - (1+i)⁻ⁿ] / i |
| **Renta (de Vp)** | A = Vp × i / [1 - (1+i)⁻ⁿ] |
| **Plazo (de Vp)** | n = -log(1 - Vp×i/A) / log(1+i) |

**Variables:**
- **A**: Renta o pago periódico
- **i**: Tasa de interés por período (decimal)
- **n**: Número de períodos

#### Ejemplo: Fondo de ahorro para el retiro
```
FML → Anualidades Vencidas
A = 5000    (ahorro mensual)
i = 0.008   (0.8% mensual)
n = 360     (30 años × 12 meses)

Calcular Vf → 8,987,517.73 (casi 9 millones)
```

#### Ejemplo: Cuota de un crédito
```
FML → Anualidades Vencidas
Vp = 500000 (monto del préstamo)
i  = 0.015  (1.5% mensual)
n  = 48     (4 años)

Calcular Renta (de Vp) → A = 14,704.86 (cuota mensual)
```

### 21.6 Anualidades Anticipadas

Los pagos se realizan al **inicio** de cada período. La diferencia con las vencidas es el factor multiplicador (1+i).

| Fórmula | Ecuación |
|---------|----------|
| **Valor Futuro** | Vf = A × [(1+i)ⁿ - 1] / i × (1+i) |
| **Renta (de Vf)** | A = Vf×i / [(1+i)ⁿ - 1] × (1+i)⁻¹ |
| **Plazo (de Vf)** | n = log[Vf×i / (A(1+i)) + 1] / log(1+i) |
| **Valor Presente** | Vp = A × [1 - (1+i)⁻ⁿ] / i × (1+i) |
| **Renta (de Vp)** | A = Vp×i / {[1 - (1+i)⁻ⁿ] × (1+i)} |
| **Plazo (de Vp)** | n = -log[1 - Vp×i / (A(1+i))] / log(1+i) |

#### Ejemplo: Arrendamiento
```
FML → Anualidades Anticipadas
A = 8000    (renta mensual, pagada al inicio)
i = 0.01    (1% mensual)
n = 36      (3 años)

Calcular Vp → 245,284.47 (valor presente del arrendamiento)
```

### 21.7 Anualidades Diferidas

Anualidades donde los pagos **comienzan después de un período de gracia**.

| Fórmula | Ecuación |
|---------|----------|
| **Valor Presente** | Vp = A × [1-(1+i)⁻ⁿ] / [i(1+i)ᵈ] |
| **Plazo** | n = -log[1 - Vp×i×(1+i)ᵈ / A] / log(1+i) |
| **Renta** | A = Vp×i×(1+i)ᵈ / [1 - (1+i)⁻ⁿ] |

**Variables adicionales:**
- **d**: Períodos de diferimiento (gracia)

#### Ejemplo: Crédito con período de gracia
```
FML → Anualidades Diferidas
A = 3000    (pago mensual)
i = 0.02    (2% mensual)
n = 24      (24 pagos)
d = 6       (6 meses de gracia)

Calcular Valor Presente → 49,802.68
```

### 21.8 Perpetuidades

Anualidades que **nunca terminan** — pagos periódicos infinitos.

| Fórmula | Ecuación |
|---------|----------|
| **Valor Presente** | Vp = Ap / i |
| **Anualidad perpetua** | Ap = P × i |
| **Tasa (donación)** | i = Ap / (P - Ro) |
| **Valor total donación** | Vt = Ro + Ap/i |
| **VP perpetuidad c/n** | Vp = Ap / [(1+i)ⁿ - 1] |

**Variables:**
- **Ap**: Anualidad perpetua (pago periódico indefinido)
- **P**: Inversión inicial
- **Ro**: Donación inicial
- **n**: Períodos (para perpetuidad con n)

#### Ejemplo: Dotación universitaria
```
FML → Perpetuidades
Ap = 100000  (beca anual de $100,000)
i  = 0.05    (5% anual)

Calcular Valor Presente → 2,000,000 (inversión necesaria)
```

#### Ejemplo: Fondo de donación
```
FML → Perpetuidades
P  = 5000000  (fondo total)
i  = 0.06     (6% anual)
Ro = 500000   (donación inicial para infraestructura)

Calcular Anualidad (Ap) → 300,000 (pago anual perpetuo del fondo)
Calcular Valor Total → 5,500,000 (costo total con donación inicial)
```

### 21.9 Costo de Reemplazos Futuros

| Fórmula | Ecuación |
|---------|----------|
| **Costo Total** | Ct = K(1+i)ⁿ / [(1+i)ⁿ - 1] |

**Variables:**
- **K**: Costo del reemplazo
- **i**: Tasa de interés (decimal)
- **n**: Vida útil (períodos entre reemplazos)

#### Ejemplo: Reemplazo de equipo
```
FML → Costo de Reemplazos
K = 200000  (costo de nuevo equipo)
i = 0.08    (8% anual)
n = 5       (vida útil 5 años)

Calcular Costo Total → 338,493.59 (costo total considerando reemplazos)
```

---

## 22. Atajos de Teclado (Desktop)

| Tecla | Función |
|-------|---------|
| `0-9` | Dígitos |
| `.` | Punto decimal |
| `+` `-` `*` `/` | Operaciones básicas |
| `Enter` o `=` | Igual |
| `Backspace` | Borrar dígito |
| `Escape` | CE/C |
| `(` `)` | Paréntesis |
| `N` | Tecla N (TVM) |
| `I` | Tecla I/Y (TVM) |
| `P` | Tecla PV (TVM) |
| `M` | Tecla PMT (TVM) |
| `F` | Tecla FV (TVM) |
| `C` | Tecla CPT |

---

## 23. Ejemplos Paso a Paso

### Ejemplo Completo 1: Planificación de Retiro

**Escenario:** Tienes 30 años, quieres jubilarte a los 65 con $10,000,000. Puedes ahorrar mensualmente con un rendimiento del 10% anual.

**Paso 1:** Configurar P/Y
```
2nd → P/Y → 12 → ENTER → 2nd → QUIT
```

**Paso 2:** Ingresar datos
```
420 N           (35 años × 12 meses)
10 I/Y          (10% anual)
0 PV            (empiezas de cero)
10000000 FV     (meta)
CPT PMT         → -2,590.76
```

**Resultado:** Necesitas ahorrar **$2,590.76 mensuales**.

**Paso 3:** Verificar con amortización parcial
```
2nd → AMORT
P1 = 1, P2 = 120   (primeros 10 años)
→ BAL muestra cuánto has acumulado en 10 años
```

---

### Ejemplo Completo 2: Análisis de Inversión Inmobiliaria

**Escenario:** Departamento cuesta $2,500,000. Rentas esperadas: $15,000/mes los primeros 3 años, $18,000/mes los siguientes 3 años. Vendes al final en $3,200,000.

**Paso 1:** Flujos de efectivo
```
2nd → CF
CF0  = -2500000     (compra)
C01  = 15000, F01 = 36   (36 meses a $15,000)
C02  = 18000, F02 = 35   (35 meses a $18,000)
C03  = 3218000, F03 = 1  (último mes: renta + venta)
I    = 12                 (12% anual tasa de descuento)
```

**Paso 2:** Calcular
```
NPV → resultado (valor presente neto)
IRR → resultado (tasa interna de retorno mensual × 12 = anual)
```

---

### Ejemplo Completo 3: Valuación de Bonos con CETES

**Paso 1:** Calcular precio de CETES
```
FML → CETES
Vf = 10
d  = 0.1050 (tasa de descuento BANXICO)
t  = 182    (CETES a 182 días)

Calcular Vp (desc.) → $9.4692
```

**Paso 2:** Calcular rendimiento equivalente
```
Calcular Tasa rend. → 5.61% en 182 días

FML → Tasas de Interés
j nom = 0.1122  (5.61% × 2 = 11.22% anualizado)
m = 2           (semestral)
Calcular Efect. Anual → 0.1154 (11.54% efectiva anual)
```

---

### Ejemplo Completo 4: Comparación de Créditos

**Crédito A:** $500,000 a 36 meses, tasa del 18% anual
**Crédito B:** $500,000 a 48 meses, tasa del 15% anual

**Crédito A:**
```
FML → Anualidades Vencidas
Vp = 500000
i  = 0.015  (18%/12 = 1.5% mensual)
n  = 36

Renta (de Vp) → 18,076.13
Total pagado: 18,076.13 × 36 = 650,740.68
Interés total: 150,740.68
```

**Crédito B:**
```
Vp = 500000
i  = 0.0125  (15%/12 = 1.25% mensual)
n  = 48

Renta (de Vp) → 13,897.25
Total pagado: 13,897.25 × 48 = 667,068.00
Interés total: 167,068.00
```

**Conclusión:** Crédito A tiene cuota más alta pero menos interés total.

---

### Ejemplo Completo 5: Depreciación de Activo Fijo

**Equipo de cómputo:** Costo $150,000, valor de salvamento $15,000, vida útil 5 años.

```
2nd → DEPR

Método SL (Línea Recta):
CST = 150000, SAL = 15000, LIF = 5
→ DEP = 27,000/año (constante)

Método SYD (Suma de Dígitos):
→ Año 1: 45,000
→ Año 2: 36,000
→ Año 3: 27,000
→ Año 4: 18,000
→ Año 5: 9,000

Usar "Tabla Completa" para ver toda la tabla de depreciación.
```

---

### Ejemplo Completo 6: Fórmulas de Interés Simple

**Problema:** ¿Cuánto tiempo se necesita para que $25,000 se conviertan en $30,000 con una tasa de interés simple del 8% anual?

```
FML → Interés Simple
Vp = 25000
Vf = 30000
i  = 0.08

Calcular Tiempo → t = 2.5 años
```

**Verificación:**
```
Calcular Interés con:
Vp = 25000, i = 0.08, t = 2.5
→ I = 5,000
→ Vf = 25,000 + 5,000 = 30,000 ✓
```

---

### Ejemplo Completo 7: Perpetuidad Universitaria

**Problema:** Una universidad quiere otorgar becas anuales de $200,000 a perpetuidad. La tasa de rendimiento del fondo es 4% anual. Además, necesita $1,000,000 para infraestructura inicial.

```
FML → Perpetuidades
Ap = 200000  (beca anual)
i  = 0.04    (4% anual)
Ro = 1000000 (infraestructura)

Calcular Valor Presente → 5,000,000 (fondo necesario para becas)
Calcular Valor Total Donación → 6,000,000 (total con infraestructura)
```

---

## Notas Importantes

1. **Convención de tasas en FML:** En el módulo de Fórmulas (FML), las tasas se ingresan en **decimal** (0.12 para 12%), a diferencia de las hojas TVM e ICONV donde se usan porcentajes.

2. **Precisión:** La calculadora almacena valores internamente con hasta 13 dígitos significativos. La configuración de decimales solo afecta la visualización.

3. **Compatibilidad con exámenes:** Las funciones TVM, amortización, flujos de efectivo y bonos son compatibles con los procedimientos del examen CFA, FRM y CFP.

4. **Resetear la calculadora:** `2nd` → `RESET` (tecla +) restaura todos los valores de fábrica.

5. **Limpiar hojas de trabajo:** `2nd` → `CLR WORK` (tecla CE/C) limpia la hoja activa.

6. **Limpiar TVM:** `2nd` → `CLR TVM` (tecla FV) limpia solo las 5 variables TVM.
