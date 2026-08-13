# Delta Spec: Live Economic Indicators (UF, UTM, Dólar, IPC)

## ADDED Requirements

### Requirement: Server-Side Economic Indicators Proxy
The backend MUST provide a proxy endpoint to retrieve real-time economic indicators (UF, UTM, Dólar Observado, IPC) from mindicador.cl.

#### Scenario: Successfully fetching live economic indicators
- **WHEN** client requests `GET /api/v1/catalogs/indicators-live`
- **THEN** backend returns values for `uf`, `utm`, `dolar`, and `ipc` with dates.

### Requirement: Dual Action Cards & Live Ticker Widget
The frontend Monthly Parameters page MUST display UF and UTM live cards with 1-click auto-fill buttons, along with a secondary ticker widget for Dólar Observado and IPC.

#### Scenario: Auto-filling UF and UTM values
- **WHEN** user clicks "Usar Valor Oficial UF" or "Usar Valor Oficial UTM"
- **THEN** the corresponding input in the monthly parameter form is populated with the official live rate.
