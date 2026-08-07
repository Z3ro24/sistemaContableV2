import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import HomePage from "../pages/app/HomePage";
import ProfilePage from "../pages/app/ProfilePage";
import WorkersPage from "../pages/app/WorkersPage";
import EditWorkerPage from "../pages/app/EditWorkerPage";
import CompaniesPage from "../pages/app/CompaniesPage";
import EditCompanyPage from "../pages/app/EditCompanyPage";
import MonthlyParametersPage from "../pages/app/MonthlyParametersPage";
import PayrollsPage from "../pages/app/PayrollsPage";
import LrePage from "../pages/app/LrePage";
import PreviredPage from "../pages/app/PreviredPage";
import BankTransfersPage from "../pages/app/BankTransfersPage";
import NoveltiesPage from "../pages/app/NoveltiesPage";
import PlaceholderPage from "../pages/app/PlaceholderPage";
import NotFound from "../pages/404";
import AppLayout from "../layouts/AppLayout";
import { useAuthInit } from "../hooks/useAuthInit";
import { useAppSelector } from "../store/store";

const App = () => {
  const { isLoading } = useAuthInit();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F7F7F5] text-sm font-medium text-[#787774]">
        Cargando sesión...
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          {/* Rutas públicas (Login & Registro) */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      ) : (
        <>
          {/* Rutas privadas envueltas en AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />

            {/* 👥 Recursos Humanos & Sueldos */}
            <Route path="/payrolls" element={<PayrollsPage />} />
            <Route path="/lre" element={<LrePage />} />
            <Route
              path="/payrolls/lre"
              element={<Navigate to="/lre" replace />}
            />
            <Route path="/reports/previred" element={<PreviredPage />} />
            <Route
              path="/reports/bank-transfers"
              element={<BankTransfersPage />}
            />
            <Route path="/novelties" element={<NoveltiesPage />} />
            <Route
              path="/payrolls/history"
              element={
                <PlaceholderPage
                  title="Histórico de Liquidaciones"
                  category="RRHH & Sueldos"
                  description="Archivo consolidado de liquidaciones y reliquidaciones de períodos anteriores."
                />
              }
            />

            {/* 📚 Contabilidad & Finanzas */}
            <Route
              path="/accounting/chart-of-accounts"
              element={
                <PlaceholderPage
                  title="Plan de Cuentas"
                  category="Contabilidad & Finanzas"
                  description="Estructura de cuentas contables (Activo, Pasivo, Patrimonio, Ingresos, Gastos)."
                />
              }
            />
            <Route
              path="/accounting/vouchers"
              element={
                <PlaceholderPage
                  title="Comprobantes Contables"
                  category="Contabilidad & Finanzas"
                  description="Registro de asientos contables de Ingreso, Egreso y Traspaso."
                />
              }
            />
            <Route
              path="/accounting/journal"
              element={
                <PlaceholderPage
                  title="Libro Diario"
                  category="Libros Contables"
                  description="Registro cronológico de todas las transacciones y asientos contables del período."
                />
              }
            />
            <Route
              path="/accounting/ledger"
              element={
                <PlaceholderPage
                  title="Libro Mayor"
                  category="Libros Contables"
                  description="Resumen mensual de movimientos y saldos por cuenta contable."
                />
              }
            />
            <Route
              path="/accounting/purchases-book"
              element={
                <PlaceholderPage
                  title="Libro de Compras"
                  category="Libros Contables"
                  description="Registro auxiliar de facturas y documentos de compras recibidos."
                />
              }
            />
            <Route
              path="/accounting/sales-book"
              element={
                <PlaceholderPage
                  title="Libro de Ventas"
                  category="Libros Contables"
                  description="Registro auxiliar de facturas, boletas y notas de venta emitidas."
                />
              }
            />
            <Route
              path="/accounting/balance-8-cols"
              element={
                <PlaceholderPage
                  title="Balance de 8 Columnas"
                  category="Estados Financieros"
                  description="Balance de Comprobación y Saldos clasificado en 8 columnas."
                />
              }
            />
            <Route
              path="/accounting/classified-balance"
              element={
                <PlaceholderPage
                  title="Balance Clasificado"
                  category="Estados Financieros"
                  description="Estado de situación financiera (Activo Corriente, No Corriente, Pasivo y Patrimonio)."
                />
              }
            />
            <Route
              path="/accounting/p-and-l"
              element={
                <PlaceholderPage
                  title="Estado de Resultados (P&L)"
                  category="Estados Financieros"
                  description="Informe de ingresos, costos, gastos y utilidad neta de la empresa."
                />
              }
            />
            <Route
              path="/accounting/reconciliation"
              element={
                <PlaceholderPage
                  title="Conciliación Bancaria"
                  category="Contabilidad & Finanzas"
                  description="Cotejo de extractos bancarios con libros contables de tesorería."
                />
              }
            />

            {/* 💼 Compras y Ventas */}
            <Route
              path="/sales-purchases/purchases"
              element={
                <PlaceholderPage
                  title="Registro de Compras (RCV)"
                  category="Compras y Ventas"
                  description="Carga y centralización del Registro de Compras del SII."
                />
              }
            />
            <Route
              path="/sales-purchases/sales"
              element={
                <PlaceholderPage
                  title="Registro de Ventas"
                  category="Compras y Ventas"
                  description="Centralización de documentos de venta y facturación electrónica."
                />
              }
            />
            <Route
              path="/sales-purchases/bhe"
              element={
                <PlaceholderPage
                  title="Boletas de Honorarios (BHE)"
                  category="Compras y Ventas"
                  description="Registro y retención de boletas de honorarios de prestadores de servicios."
                />
              }
            />
            <Route
              path="/sales-purchases/receivables-payables"
              element={
                <PlaceholderPage
                  title="Cuentas por Cobrar / Pagar"
                  category="Compras y Ventas"
                  description="Control de vencimientos de clientes y proveedores."
                />
              }
            />

            {/* ⚙️ Configuración & Sistema */}
            <Route
              path="/settings"
              element={<Navigate to="/settings/workers" replace />}
            />
            <Route path="/settings/workers" element={<WorkersPage />} />
            <Route
              path="/settings/workers/edit/:id"
              element={<EditWorkerPage />}
            />
            <Route path="/settings/companies" element={<CompaniesPage />} />
            <Route
              path="/settings/companies/edit/:id"
              element={<EditCompanyPage />}
            />
            <Route
              path="/settings/parameters"
              element={<MonthlyParametersPage />}
            />
            <Route
              path="/settings/sii-certificate"
              element={
                <PlaceholderPage
                  title="Certificado Digital SII"
                  category="Configuración & Sistema"
                  description="Carga y administración de firma digital PFX para autenticación SII."
                />
              }
            />
            <Route
              path="/settings/users"
              element={
                <PlaceholderPage
                  title="Usuarios & Permisos"
                  category="Configuración & Sistema"
                  description="Administración de usuarios, roles y permisos de acceso."
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/login" element={<Navigate to="/home" replace />} />
          <Route path="/register" element={<Navigate to="/home" replace />} />
        </>
      )}
    </Routes>
  );
};

export default App;
