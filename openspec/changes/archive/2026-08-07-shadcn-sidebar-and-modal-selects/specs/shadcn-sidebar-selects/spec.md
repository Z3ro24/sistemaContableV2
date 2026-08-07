# Delta Spec: Rediseño de Sidebar y Selects en Modales al Estilo shadcn UI

## ADDED Requirements

### Requirement: shadcn UI Select Component for Modals
The application MUST provide a reusable shadcn UI `Select` component (`select.tsx`) based on `@radix-ui/react-select` for all modal input forms.

#### Scenario: Opening a Modal with shadcn Select
- **WHEN** user opens WorkerModal, NoveltyModal, or BankPayrollModal
- **THEN** dropdown inputs render with shadcn `SelectTrigger` and open accessible `SelectContent` popovers upon click.

### Requirement: Responsive Mobile-First shadcn Sidebar
The main navigation `Sidebar.tsx` MUST support desktop collapsible mode and mobile slide-out drawer mode connected to `Navbar.tsx` and `AppLayout.tsx`.

#### Scenario: Toggling Mobile Menu Drawer
- **WHEN** user clicks the hamburger button on mobile viewports (`lg:hidden`)
- **THEN** a backdrop overlay and mobile drawer containing `Sidebar` content opens.
- **WHEN** user clicks the backdrop overlay or a navigation link
- **THEN** the mobile drawer closes smoothly.
