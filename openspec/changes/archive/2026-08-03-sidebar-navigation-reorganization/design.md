# Design: Reorganización Completa del Sidebar y Navegación del Sistema

## Navigation Tree Architecture

```
 📊 Dashboard
  └── Vista General / KPIs (/home)

 👥 Recursos Humanos & Sueldos
  ├── Ficha de Empleados (/settings/workers)
  ├── Novedades del Mes (/hr/novelties)
  ├── Procesar Liquidaciones (/payrolls)
  ├── Histórico de Liquidaciones (/payrolls/history)
  └── 📁 Archivos y Reportes ▾
       ├── PreviRed (.txt) (/reports/previred)
       ├── Libro de Remuneraciones LRE (.csv) (/lre)
       └── Pago Masivo a Bancos (.txt) (/reports/bank-transfers)

 📚 Contabilidad & Finanzas
  ├── Plan de Cuentas (/accounting/chart-of-accounts)
  ├── Comprobantes Contables (Asientos) (/accounting/vouchers)
  ├── 📁 Libros Contables ▾
  │    ├── Libro Diario (/accounting/journal)
  │    ├── Libro Mayor (/accounting/ledger)
  │    ├── Libro de Compras (/accounting/purchases-book)
  │    └── Libro de Ventas (/accounting/sales-book)
  ├── 📁 Estados Financieros ▾
  │    ├── Balance de 8 Columnas (/accounting/balance-8-cols)
  │    ├── Balance Clasificado (/accounting/classified-balance)
  │    └── Estado de Resultados (P&L) (/accounting/p-and-l)
  └── Conciliación Bancaria (/accounting/reconciliation)

 💼 Compras y Ventas
  ├── Registro de Compras (RCV) (/sales-purchases/purchases)
  ├── Registro de Ventas (/sales-purchases/sales)
  ├── Boletas de Honorarios (BHE) (/sales-purchases/bhe)
  └── Cuentas por Cobrar / Pagar (/sales-purchases/receivables-payables)

 ⚙️ Configuración & Sistema
  ├── Parámetros Mensuales (/settings/parameters)
  ├── Datos de la Empresa & Sucursales (/settings/companies)
  ├── Certificado Digital SII (/settings/sii-certificate)
  └── Usuarios & Permisos (/settings/users)
```

## Component Architecture

1. **`Sidebar.tsx`**:
   - Uses Headless UI `<Disclosure>` for multi-level collapsible accordion categories.
   - Handles both Expanded (64w) and Collapsed (20w) states with popover menus.
   - Active state highlight logic (`location.pathname.startsWith(...)`).
2. **`Breadcrumbs.tsx`**:
   - Expanded route dictionary (`routeNameMap`) covering all new module paths.
3. **`PlaceholderPage.tsx`**:
   - Reusable component for upcoming features, displaying domain icon, section title, description, and "En desarrollo" badge in Notion Glass style.
