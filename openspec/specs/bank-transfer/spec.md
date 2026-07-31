# bank-transfer Specification

## Purpose
TBD - created by archiving change bank-payroll-transfer-generator. Update Purpose after archive.
## Requirements
### Requirement: Bank Payroll Transfer File Generation
The system MUST provide a feature to generate formatted bank transfer files for mass salary disbursement.

#### Scenario: Generating a bank transfer file
- **WHEN** user clicks "Generar Nómina Bancaria" and selects a bank format
- **THEN** the system generates and downloads the formatted transfer file for the selected company and period.

### Requirement: Bank Data Integrity Pre-Validation
The system MUST validate worker banking information (Bank, Account Type, Account Number) before generating the transfer file.

#### Scenario: Detecting workers with incomplete bank details
- **WHEN** user opens the Bank Payroll Modal
- **THEN** the system lists any workers with missing banking details and alerts the user before export.

### Requirement: Support for Chilean Bank Formats
The system MUST support Chilean bank formats including Banco Santander CSV, BancoEstado PAE TXT, Banco de Chile CSV/TXT, and Universal TEF CSV.

#### Scenario: Selecting Santander format
- **WHEN** user selects Banco Santander format
- **THEN** the file is generated using Santander's semicolon-delimited CSV structure with worker RUT, name, account type, account number, and net amount.

