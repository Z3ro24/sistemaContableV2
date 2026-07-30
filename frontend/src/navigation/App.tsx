import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import HomePage from '../pages/app/HomePage';
import ProfilePage from '../pages/app/ProfilePage';
import NotFound from '../pages/404';
import AppLayout from '../layouts/AppLayout';
import { useAuthInit } from '../hooks/useAuthInit';
import { useAppSelector } from '../store/store';

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
            <Route path="/transactions" element={<HomePage />} />
            <Route path="/reports" element={<HomePage />} />
            <Route path="/settings" element={<HomePage />} />
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
