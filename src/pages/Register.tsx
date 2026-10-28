import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { getMeService, loginService, registerService } from "../services/auth.service";
import { getErrorMessage } from "../api/axios";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmar: string;
}

export function Register() {
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();
  const [errorApi, setErrorApi] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  async function onSubmit(data: RegisterForm) {
    setErrorApi(null);
    try {
      // El registro crea un "cliente" pero NO devuelve token → hacemos login automático
      await registerService({ name: data.name.trim(), email: data.email.trim(), password: data.password });
      const res = await loginService({ email: data.email.trim(), password: data.password });
      setToken(res.access_token);
      setUser(await getMeService());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setErrorApi(getErrorMessage(err));
    }
  }

  const input =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Crear cuenta</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input className={input} {...register("name", { required: "El nombre es obligatorio.", minLength: { value: 2, message: "Mínimo 2 caracteres." } })} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Correo</span>
            <input type="email" className={input} {...register("email", { required: "El correo es obligatorio.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Correo inválido." } })} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Contraseña</span>
            <input type="password" className={input} {...register("password", { required: "La contraseña es obligatoria.", minLength: { value: 6, message: "Mínimo 6 caracteres." } })} />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Repetir contraseña</span>
            <input type="password" className={input} {...register("confirmar", { validate: (v) => v === getValues("password") || "Las contraseñas no coinciden." })} />
            {errors.confirmar && <p className="mt-1 text-xs text-red-600">{errors.confirmar.message}</p>}
          </label>

          {errorApi && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorApi}</p>}

          <button type="submit" disabled={isSubmitting} className="w-full rounded-lg bg-brand-600 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
            {isSubmitting ? "Creando cuenta..." : "Registrarme"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:underline">Iniciá sesión</Link>
        </p>
      </div>
    </div>
  );
}
