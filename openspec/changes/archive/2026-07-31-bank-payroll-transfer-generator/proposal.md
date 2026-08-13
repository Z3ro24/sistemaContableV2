# Proposal: Bank Payroll Mass Transfer File Generator

## Why
Finance and accounting teams need to pay monthly worker salaries through Chilean commercial bank portals (Banco Santander, BancoEstado PAE, Banco de Chile, BCI, Itaú, Scotiabank). Generating bank-formatted transfer files directly from payroll liquidations eliminates manual data entry, prevents bank rejection errors due to missing account details, and speeds up mass salary disbursement.

## What Changes
- Add a **"🏦 Generar Nómina Bancaria"** action in `PayrollsPage.tsx`.
- Add an interactive **Bank Payroll Generator Modal** (`BankPayrollModal.tsx`):
  - **Summary**: Displays total liquidations in payroll selection, target company name, and **Total Net Amount to Transfer ($ CLP)**.
  - **Data Integrity Pre-Validation**: Checks each worker for missing bank, account type, or account number, flagging incomplete worker records before export.
  - **Bank Format Selector**: Supports Santander CSV, BancoEstado PAE TXT, Banco de Chile CSV/TXT, BCI/Itaú CSV, and Universal TEF CSV formats.
  - **File Exporter**: Generates and downloads the exact formatted file ready for upload to the bank portal.
- Create `bankTransferUtils.ts` in `frontend/src/utils/bankTransferUtils.ts` containing Chilean bank formatting rules.
