## ADDED Requirements

### Requirement: Styled Login Page Layout
The system SHALL present a responsive, styled Login Page built with Tailwind CSS and Headless UI primitives.

#### Scenario: User views login page
- **WHEN** user navigates to the login route
- **THEN** system renders a split-screen container with branding graphics and a clean, accessible email/password login form.

### Requirement: Field Validation Error Display
The system SHALL highlight form inputs with visual error indicators and display field-specific error messages when input validation fails.

#### Scenario: User submits invalid email or password
- **WHEN** user enters an invalid email or short password and submits the form
- **THEN** system highlights the invalid field with a red focus ring and displays the Zod error message below the input.

### Requirement: Backend Error Alert Banner
The system SHALL display an alert banner with an icon when the backend API returns an error response.

#### Scenario: Backend login attempt fails
- **WHEN** authentication request fails with a 401 or 400 error from the server
- **THEN** system displays an accessible red alert banner containing the error message returned by the server.

### Requirement: Password Strength Indicator on Register Page
The system SHALL provide a visual password strength indicator when the user types a new password on the Register Page.

#### Scenario: User enters password on registration
- **WHEN** user types in the registration password field
- **THEN** system updates a strength bar showing progress (Weak, Medium, Strong) based on length, numbers, and uppercase characters.
