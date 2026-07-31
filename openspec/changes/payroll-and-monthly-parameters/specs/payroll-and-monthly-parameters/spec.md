## ADDED Requirements

### Requirement: Previred Catalogs API
The system SHALL provide API endpoints to retrieve standard Chilean catalog data: AFPs, Health Institutions, Contract Types, Banks, Cost Centers, and Job Positions.

#### Scenario: Frontend fetches catalog options
- **WHEN** user opens WorkerModal or EditWorkerPage
- **THEN** dropdown select options for AFP, Health Institution, Contract Type, and Bank are loaded from catalog endpoints.

### Requirement: Monthly Parameters Management
The system SHALL allow users to create and manage monthly calculation parameters (UF, UTM, Minimum Wage, Imponibles Capping, Tax Brackets, Family Allowance Brackets) for any period (`YYYY-MM`).

#### Scenario: Creating monthly parameters for period 2026-07
- **WHEN** user submits monthly parameters for 2026-07 with UF and UTM values
- **THEN** system saves the parameters and associated tax & family allowance brackets.

### Requirement: Automated Chilean Payroll Calculation
The system SHALL compute worker pay slips automatically given monthly novelties and monthly parameters for a target period.

#### Scenario: Calculating pay slip for worker
- **WHEN** user triggers payroll calculation for worker for period 2026-07
- **THEN** system calculates taxable income, AFP deduction, Health deduction, AFC deduction, Unique Tax, Net Payable, and records detailed breakdown items.

### Requirement: Expanded Worker and Company Forms
The Worker and Company creation modals and edit pages SHALL include all labor, health, contract, and banking fields.

#### Scenario: User creates worker with complete labor profile
- **WHEN** user submits WorkerModal with name, RUT, paternal/maternal last names, entry date, base salary, AFP, Health, Contract Type, and Bank
- **THEN** worker is created with all associated relations.
