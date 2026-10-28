import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "https://api-funval-g6.onrender.com",
  timeout: 60000, // Render "duerme" la API: la primera request puede tardar
});

// Agrega el token a cada petición (lo lee directo del store de Zustand)
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token vencido (dura 30 min) → cerramos sesión y vamos al login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error.config?.url ?? "";
    if (error.response?.status === 401 && !url.includes("/auth/login")) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// FastAPI devuelve { detail: "texto" } o { detail: [{ msg }] }
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "No se pudo conectar con el servidor. Intentá de nuevo en unos segundos.";
    const detail = (error.response.data as { detail?: unknown })?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((d: { msg?: string }) => d.msg).join(" · ");
    if (error.response.status === 403) return "No tenés permisos para esta acción.";
    return `Error ${error.response.status}`;
  }
  return "Ocurrió un error inesperado.";
}

export default api;
