# Design: Live Economic Indicators (UF, UTM, Dólar, IPC) & Widget Dashboard

## Backend Architecture

### Endpoint: `GET /api/v1/catalogs/indicators-live`
Queries `https://mindicador.cl/api` server-side and maps:
```typescript
export interface LiveIndicators {
  uf: { valor: number; fecha: string };
  utm: { valor: number; fecha: string };
  dolar?: { valor: number; fecha: string };
  ipc?: { valor: number; fecha: string };
}
```

If main endpoint fails, queries `/api/uf`, `/api/utm`, `/api/dolar`, `/api/ipc` individually.

## Frontend Layout Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│  ✨ Live UF Card                        │  🏛️ Live UTM Card                                │
│  $40.844,79 CLP                         │  $67.500,00 CLP                                  │
│  [ Usar Valor Oficial UF ]              │  [ Usar Valor Oficial UTM ]                      │
├─────────────────────────────────────────┴───────────────────────────────────────────────────┤
│  📈 Ticker Secundario: 💵 Dólar Observado: $950.50 CLP  │ 📊 IPC Mes: 0.3%                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

## Tooltips Reference Map
- **Período (YYYY-MM)**: Período mensual al que corresponden las variables.
- **Valor UF Cierre ($)**: Valor de la UF al cierre de mes.
- **Valor UTM Mes ($)**: Unidad Tributaria Mensual usada para calcular tramos del Impuesto Único.
- **Sueldo Mínimo ($)**: Ingreso Mínimo Mensual (IMM) vigente en Chile.
- **Tope AFP (UF)**: Límite máximo en UF (84.3 UF) para cotización previsional.
- **Tope AFC (UF)**: Límite máximo en UF (126.6 UF) para Seguro de Cesantía.
- **Tasa SIS (%)**: Porcentaje del Seguro de Invalidez y Sobrevivencia.
