# Design: Bank Payroll Mass Transfer File Generator

## Architecture & UI Flow

### UI Component: `BankPayrollModal.tsx`
Location: `frontend/src/components/modals/BankPayrollModal.tsx`

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏦 Generar Nómina Bancaria de Transferencia                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ Empresa: Servicios Contables SpA  │ Período: 2026-07                         │
│ Trabajadores a pagar: 5           │ Total a Transferir: $2.433.900 CLP      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Pre-validación de Datos Bancarios:                                       │
│   🟢 4 trabajadores con datos bancarios completos.                           │
│   ⚠️ 1 trabajador sin número de cuenta (Pedro Soto - RUT 15.678.901-2)       │
├─────────────────────────────────────────────────────────────────────────────┤
│ Selector de Banco Emisor:                                                   │
│   [ 🟢 Banco Santander (CSV) ▾ ]                                             │
│                                                                             │
│ [ Cancelar ]                             [ 📥 Descargar Archivo Bancario ]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Chilean Bank Transfer Format Engines (`bankTransferUtils.ts`)

1. **Banco Santander (CSV)**:
   - Header: `RUT;Nombre;TipoCuenta;NumeroCuenta;Monto;Email`
   - Delimiter: `;`
   - Encoding: UTF-8 with BOM

2. **BancoEstado (PAE - Pago Automático Empresas / Cuenta RUT)**:
   - Format: Fixed-width `.TXT` or CSV
   - Fields: Header (Empresa RUT) + Detail lines (Worker RUT 9 chars, SBIF Bank Code 3 chars, Account Number 12 chars, Net Amount 10 chars integer).

3. **Banco de Chile / Banco Edwards**:
   - Format: Standard CSV / TXT with SBIF bank codes.

4. **Universal TEF (Cualquier Banco)**:
   - Generic multibanco CSV format with full banking details.

## Pre-validation Engine
Functions `validateBankData(payrolls)`:
- Scans `worker.bank`, `worker.bankAccountType`, `worker.bankAccountNumber`.
- Returns `{ validPayrolls, invalidPayrolls }` to display clear warnings in the UI before file creation.
