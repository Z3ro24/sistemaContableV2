# Spec: Tables Pagination & Filters

## Purpose
Provides requirements for client-side instant search by name or RUT, company filter dropdowns, and Notion Glass 10-item pagination controls on Workers and Companies tables.

## Requirements

### Requirement: Search by Name and RUT in Workers
The Workers page SHALL provide a search bar to filter workers by name or RUT in real time.

#### Scenario: User types in search bar
- **WHEN** user types "Juan" or "19.876" in the search input on WorkersPage
- **THEN** table updates immediately to display matching workers.

### Requirement: Company Filter Select in Workers
The Workers page SHALL provide a dropdown select to filter workers by assigned company.

#### Scenario: User selects a company
- **WHEN** user selects a company from the dropdown filter on WorkersPage
- **THEN** table updates immediately to display only workers assigned to that company.

### Requirement: Search by Name and RUT in Companies
The Companies page SHALL provide a search bar to filter companies by name or RUT.

#### Scenario: User types in search bar on CompaniesPage
- **WHEN** user types company name or RUT
- **THEN** table updates immediately to display matching companies.

### Requirement: 10 Records Per Page Pagination
The Workers and Companies tables SHALL display a maximum of 10 items per page with page controls.

#### Scenario: Data exceeds 10 records
- **WHEN** list contains more than 10 records
- **THEN** table displays first 10 items and renders pagination controls [Anterior] and [Siguiente].
