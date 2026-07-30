import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { loginSchema, type LoginSchemaType } from '../../validators/authValidator';
import authService from '../../services/authService';
import { useAppDispatch } from '../../store/store';
import { setCredentials } from '../../store/slices/auth.slice';
import FormInput from '../../components/common/FormInput';
import AlertBanner from '../../components/common/AlertBanner';
import { ArrowRightIcon, ChartBarIcon, CheckIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => {
      dispatch(setCredentials(user));
      navigate('/home');
    },
  });

  const onSubmit = (data: LoginSchemaType) => {
    loginMutation.mutate(data);
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  const errorMessage =
    loginMutation.isError
      ? (loginMutation.error as any)?.response?.data?.message || 'Credenciales incorrectas o problema de servidor'
      : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-4 py-8 sm:px-6 lg:px-8 selection:bg-neutral-200">
      {/* Multi-layered Soft Glass Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-24 -left-20 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-amber-100/60 via-stone-200/40 to-neutral-200/20 blur-[130px]" />
        <div className="absolute -bottom-24 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-neutral-200/60 via-stone-100/50 to-amber-50/40 blur-[140px]" />
      </div>

      {/* Main Ultra-Glassmorphism Floating Split Card */}
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl transition-all before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent before:pointer-events-none">
        {/* Left Branding Panel (Notion Glass) */}
        <div className="hidden w-1/2 flex-col justify-between border-r border-white/60 bg-[#FAF9F5]/40 p-10 backdrop-blur-xl md:flex">
          <div>
            {/* Notion Style Icon Badge */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
                <ChartBarIcon className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold tracking-tight text-[#37352F]">
                Sistema Contable
              </span>
            </div>

            <div className="mt-12 space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#37352F] leading-snug">
                Organiza tus finanzas con la simplicidad de Notion.
              </h1>
              <p className="text-sm text-[#787774] leading-relaxed">
                Control contable en tiempo real, reportes instantáneos y la máxima claridad para tu empresa.
              </p>
            </div>
          </div>

          {/* Minimalist Feature List */}
          <div className="space-y-3 pt-6 border-t border-neutral-200/50">
            <div className="flex items-center gap-2.5 text-xs text-[#37352F] font-medium">
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-white/80 border border-white text-[#37352F] shadow-2xs backdrop-blur-md">
                <CheckIcon className="h-3 w-3 stroke-[2.5]" />
              </div>
              <span>Seguridad de nivel bancario con tokens JWT</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#37352F] font-medium">
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-white/80 border border-white text-[#37352F] shadow-2xs backdrop-blur-md">
                <ShieldCheckIcon className="h-3 w-3 stroke-[2.5]" />
              </div>
              <span>Protección CSRF y revocación activa</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-10 md:w-1/2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 md:hidden mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#37352F] text-white">
                <ChartBarIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[#37352F]">Sistema Contable</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#37352F]">
              Iniciar Sesión
            </h2>
            <p className="mt-1 text-xs text-[#787774]">
              Ingresa tus credenciales para acceder al espacio de trabajo
            </p>
          </div>

          {/* Error Alert Banner */}
          <AlertBanner message={errorMessage} onDismiss={() => loginMutation.reset()} />

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              id="email"
              label="Correo Electrónico"
              type="email"
              placeholder="tu@empresa.com"
              autoComplete="email"
              register={register('email')}
              error={errors.email?.message}
            />

            <FormInput
              id="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              register={register('password')}
              error={errors.password?.message}
            />

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 disabled:opacity-50"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Iniciando...
                </span>
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRightIcon className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200/80" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white/80 px-2.5 text-[#787774] font-medium backdrop-blur-md rounded-full border border-white">o bien</span>
            </div>
          </div>

          {/* Google SSO Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/80 bg-white/70 px-4 py-2.5 text-sm font-medium text-[#37352F] shadow-sm backdrop-blur-md transition-all duration-200 hover:bg-white/95 hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-300"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.8 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.6 7.2C.6 9.2 0 10.5 0 12s.6 2.8 1.6 4.8l3.7-2.1z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.2 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Switch link */}
          <p className="mt-6 text-center text-xs text-[#787774]">
            ¿No tienes una cuenta?{' '}
            <Link to="/register" className="font-semibold text-[#37352F] hover:underline">
              Crea una aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
