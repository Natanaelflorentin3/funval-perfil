import api from "../api/axios";
import type { LoginRequest, RegisterRequest, TokenResponse, UserProfile } from "../types/user";

export async function loginService(data: LoginRequest): Promise<TokenResponse> {
  const res = await api.post<TokenResponse>("/auth/login", data);
  return res.data;
}

export async function registerService(data: RegisterRequest): Promise<UserProfile> {
  const res = await api.post<UserProfile>("/auth/register", data);
  return res.data;
}

// Trae el usuario completo (id, email, rol, avatar_url)
export async function getMeService(): Promise<UserProfile> {
  const res = await api.get<UserProfile>("/auth/me");
  return res.data;
}

// PUT /auth/perfil → multipart/form-data con los campos "name" y "foto"
// No seteamos el Content-Type a mano: axios lo arma solo (con el "boundary")
// cuando recibe un FormData.
export async function updatePerfilService(formData: FormData): Promise<UserProfile> {
  const res = await api.put<UserProfile>("/auth/perfil", formData);
  return res.data;
}
