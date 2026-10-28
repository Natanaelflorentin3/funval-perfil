import { useEffect, useMemo, useState } from "react";
import { getUsersService } from "../services/users.service";
import { getErrorMessage } from "../api/axios";
import { Avatar } from "../components/Avatar";
import { normalizarRol } from "../utils/roles";
import type { UserResponse } from "../types/user";

// Vista exclusiva del ADMIN: lista de usuarios de la plataforma
export function Usuarios() {
  const [usuarios, setUsuarios] = useState<UserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    getUsersService()
      .then(setUsuarios)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(() => {
    const t = busqueda.trim().toLowerCase();
    return usuarios.filter((u) => !t || u.name.toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
  }, [usuarios, busqueda]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500">{usuarios.length} registrados en la plataforma</p>
        </div>
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm sm:w-64"
        />
      </div>

      {loading && <p className="py-10 text-center text-slate-500">Cargando usuarios...</p>}
      {error && <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtrados.map((u) => {
                const rol = normalizarRol(u.role);
                return (
                  <tr key={u.id}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={u.avatar_url} nombre={u.name} size="sm" />
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                          rol === "admin" ? "bg-purple-100 text-purple-700" : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {rol}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtrados.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-slate-500">No hay usuarios que coincidan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
