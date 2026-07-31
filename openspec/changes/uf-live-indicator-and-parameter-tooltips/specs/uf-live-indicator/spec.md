## ADDED Requirements

### Requirement: Live UF Indicator Card
The system SHALL fetch real-time UF rate data from `https://mindicador.cl/api/uf` and display a live indicator card on the Monthly Parameters page.

#### Scenario: Display live UF rate and update date
- **WHEN** user opens the Monthly Parameters page (`/settings/parameters`)
- **THEN** system fetches live UF data from mindicador.cl and renders a card showing the current UF rate ($), unit, update date, and a "Usar valor oficial" button.

#### Scenario: Auto-fill UF input field
- **WHEN** live UF data is successfully retrieved from mindicador.cl
- **THEN** system auto-populates the UF closing value input field with the fetched UF rate, allowing full manual editing by the user.

### Requirement: Parameter Field Tooltips
The system SHALL display informative tooltips on parameter label headers explaining each field's role in Chilean payroll math.

#### Scenario: User hovers over parameter label tooltip
- **WHEN** user hovers over the info icon `ⓘ` next to any parameter field label (Period, UF, UTM, Minimum Wage, AFP Cap, AFC Cap, SIS Rate)
- **THEN** system displays a floating tooltip explaining the purpose and usage of that parameter in Chilean payroll.
