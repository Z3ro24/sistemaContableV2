# Proposal: Reorganización Completa del Sidebar y Navegación del Sistema

## Why
The accounting application has grown to include payroll, LRE, bank transfers, monthly parameters, and company administration. To scale seamlessly into a full ERP/accounting platform for Chile (including Contabilidad, Compras/Ventas, RRHH, and Configuración), the sidebar navigation needs a structured, multi-level accordion layout matching standard Chilean accounting workflows.

## What Changes
- **Frontend Navigation & Layout (`Sidebar.tsx`, `Breadcrumbs.tsx`, `App.tsx`)**:
  - Reorganize the navigation sidebar into 5 main domain modules with multi-level accordions and sub-menus:
    1. 📊 **Dashboard**: Vista General / KPIs (`/home`)
    2. 👥 **Recursos Humanos & Sueldos**:
       - Ficha de Empleados (`/settings/workers`)
       - Novedades del Mes (`/hr/novelties` - placeholder page)
       - Procesar Liquidaciones (`/payrolls`)
       - Histórico de Liquidaciones (`/payrolls/history` - placeholder page)
       - 📁 Archivos y Reportes (Sub-acordeón):
         - PreviRed (.txt) (`/reports/previred` - placeholder page)
         - Libro de Remuneraciones LRE (.csv) (`/lre`)
         - Pago Masivo a Bancos (.txt) (`/reports/bank-transfers` - placeholder page)
    3. 📚 **Contabilidad & Finanzas**:
       - Plan de Cuentas (`/accounting/chart-of-accounts`)
       - Comprobantes Contables (Asientos) (`/accounting/vouchers`)
       - 📁 Libros Contables (Sub-acordeón): Libro Diario, Libro Mayor, Libro de Compras, Libro de Ventas
       - 📁 Estados Financieros (Sub-acordeón): Balance de 8 Columnas, Balance Clasificado, Estado de Resultados (P&L)
       - Conciliación Bancaria (`/accounting/reconciliation`)
    4. 💼 **Compras y Ventas**:
       - Registro de Compras (RCV) (`/sales-purchases/purchases`)
       - Registro de Ventas (`/sales-purchases/sales`)
       - Boletas de Honorarios (BHE) (`/sales-purchases/bhe`)
       - Cuentas por Cobrar / Pagar (`/sales-purchases/receivables-payables`)
    5. ⚙️ **Configuración & Sistema**:
       - Parámetros Mensuales (UF, UTM, Topes Imponibles) (`/settings/parameters`)
       - Datos de la Empresa & Sucursales (`/settings/companies`)
       - Certificado Digital SII (`/settings/sii-certificate`)
       - Usuarios & Permisos (`/settings/users`)
  - Update `Breadcrumbs.tsx` to handle nested routes and sub-level labels cleanly.
  - Create placeholder views for future modules (`PlaceholderPage.tsx`) so that every link is interactive without breaking the app.
