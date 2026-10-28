import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { normalizarRol } from "../utils/roles";
import type { Rol } from "../types/user";

interface Props {
  roles?: Rol[]; // si se pasa, solo esos roles pueden entrar
}

// 1) ¿Hay sesión? → si no, al login
// 2) ¿El rol tiene permiso? → si no, a /no-autorizado
export function ProtectedRoute({ roles }: Props) {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);

  if (!token || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(normalizarRol(user.role))) return <Navigate to="/no-autorizado" replace />;

  return <Outlet />;
}
