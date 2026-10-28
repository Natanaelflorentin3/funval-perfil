import { useOutletContext } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { Avatar } from "../components/Avatar";
import { getSaludo, normalizarRol } from "../utils/roles";
import type { LayoutContext } from "../components/Layout";

export function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const { abrirPerfil } = useOutletContext<LayoutContext>();

  if (!user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">{getSaludo(user.role, user.name)} 👋</h1>

      <section className="flex flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 text-center sm:flex-row sm:text-left">
        <Avatar src={user.avatar_url} nombre={user.name} size="xl" />
        <div className="flex-1">
          <p className="text-xl font-bold">{user.name}</p>
          <p className="text-slate-500">{user.email}</p>
          <span className="mt-2 inline-block rounded-full bg-brand-50 px-3 py-0.5 text-xs font-semibold capitalize text-brand-700">
            {normalizarRol(user.role)}
          </span>
        </div>
        <button onClick={abrirPerfil} className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">
          Editar perfil
        </button>
      </section>
    </div>
  );
}
