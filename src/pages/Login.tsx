import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getMeService, loginService } from "../services/auth.service";
import { getErrorMessage } from "../api/axios";
import type { LoginRequest } from "../types/user";

export function Login() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>();

  // Si ya hay sesión, directo al dashboard
  if (token && user) return <Navigate to="/dashboard" replace />;

  async function onSubmit(data: LoginRequest) {
    setErrorApi(null);
    try {
      // 1) Login → token
      const res = await loginService(data);
      setToken(res.access_token);
      // 2) Con el token pedimos el perfil completo (id, avatar_url, etc.)
      const perfil = await getMeService();
      setUser(perfil);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      logout();
      setErrorApi(getErrorMessage(err));
    }
  }

  const input =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center text-2xl font-extrabold tracking-tight text-brand-600">FunVal Shop</p>
        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">Iniciar sesión</h1>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Correo</span>
              <input
                type="email"
                autoComplete="email"
                className={input}
                {...register("email", {
                  required: "El correo es obligatorio.",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido." },
                })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Contraseña</span>
              <input
                type="password"
                autoComplete="current-password"
                className={input}
                {...register("password", { required: "La contraseña es obligatoria." })}
              />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </label>

            {errorApi && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorApi}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? "Ingresando..." : "Ingresar"}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-500">
            ¿No tenés cuenta?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Registrate
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          La API está en Render: si estuvo inactiva, el primer ingreso puede tardar ~30 segundos.
        </p>
      </div>
    </div>
  );
}
