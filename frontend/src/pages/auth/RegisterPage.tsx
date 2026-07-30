import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { registerSchema, type RegisterSchemaType } from '../../validators/authValidator';
import authService from '../../services/authService';
import FormInput from '../../components/common/FormInput';
import AlertBanner from '../../components/common/AlertBanner';
import PasswordStrengthMeter from '../../components/common/PasswordStrengthMeter';
import { UserPlusIcon, CheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const RegisterPage = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const passwordValue = watch('password');

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/');
    },
  });

  const onSubmit = (data: RegisterSchemaType) => {
    registerMutation.mutate(data);
  };

  const errorMessage =
    registerMutation.isError
      ? (registerMutation.error as any)?.response?.data?.message || 'Error al registrar el usuario'
      : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F7F5] px-4 py-8 sm:px-6 lg:px-8 selection:bg-neutral-200">
      {/* Multi-layered Soft Glass Ambient Orbs */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute -top-24 -left-20 h-[450px] w-[450px] rounded-full bg-gradient-to-br from-stone-200/50 via-amber-100/40 to-neutral-200/20 blur-[130px]" />
        <div className="absolute -bottom-24 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-neutral-200/60 via-stone-100/50 to-amber-50/40 blur-[140px]" />
      </div>

      {/* Main Ultra-Glassmorphism Floating Split Card */}
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] ring-1 ring-white/60 backdrop-blur-3xl transition-all before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:via-white/10 before:to-transparent before:pointer-events-none">
        {/* Left Branding Panel */}
        <div className="hidden w-1/2 flex-col justify-between border-r border-white/60 bg-[#FAF9F5]/40 p-10 backdrop-blur-xl md:flex">
          <div>
            {/* Notion Style Icon Badge */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#37352F] text-white shadow-md shadow-neutral-900/10">
                <UserPlusIcon className="h-5 w-5" />
              </div>
              <span className="text-base font-semibold tracking-tight text-[#37352F]">
                Crear Cuenta
              </span>
            </div>

            <div className="mt-12 space-y-4">
              <h1 className="text-2xl font-bold tracking-tight text-[#37352F] leading-snug">
                Comienza a estructurar tus cuentas en segundos.
              </h1>
              <p className="text-sm text-[#787774] leading-relaxed">
                Regístrate y accede a una experiencia contable fluida, rápida y totalmente intuitiva.
              </p>
            </div>
          </div>

          {/* Minimalist Feature List */}
          <div className="space-y-3 pt-6 border-t border-neutral-200/50">
            <div className="flex items-center gap-2.5 text-xs text-[#37352F] font-medium">
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-white/80 border border-white text-[#37352F] shadow-2xs backdrop-blur-md">
                <CheckIcon className="h-3 w-3 stroke-[2.5]" />
              </div>
              <span>Configuración guiada y directa</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#37352F] font-medium">
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-white/80 border border-white text-[#37352F] shadow-2xs backdrop-blur-md">
                <SparklesIcon className="h-3 w-3 stroke-[2.5]" />
              </div>
              <span>Validación de contraseña en tiempo real</span>
            </div>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="flex w-full flex-col justify-center p-8 sm:p-10 md:w-1/2">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 md:hidden mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#37352F] text-white">
                <UserPlusIcon className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold text-[#37352F]">Sistema Contable</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#37352F]">
              Registra tu cuenta
            </h2>
            <p className="mt-1 text-xs text-[#787774]">
              Completa los datos para crear tu nuevo usuario
            </p>
          </div>

          {/* Error Alert Banner */}
          <AlertBanner message={errorMessage} onDismiss={() => registerMutation.reset()} />

          {/* Register Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              id="name"
              label="Nombre Completo"
              type="text"
              placeholder="Juan Pérez"
              autoComplete="name"
              register={register('name')}
              error={errors.name?.message}
            />

            <FormInput
              id="email"
              label="Correo Electrónico"
              type="email"
              placeholder="tu@empresa.com"
              autoComplete="email"
              register={register('email')}
              error={errors.email?.message}
            />

            <div>
              <FormInput
                id="password"
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                register={register('password')}
                error={errors.password?.message}
              />
              <PasswordStrengthMeter password={passwordValue} />
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-[#37352F] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#201F1C] focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-1 disabled:opacity-50"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Registrando...
                </span>
              ) : (
                <span>Crear Cuenta</span>
              )}
            </button>
          </form>

          {/* Switch link */}
          <p className="mt-6 text-center text-xs text-[#787774]">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/" className="font-semibold text-[#37352F] hover:underline">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
