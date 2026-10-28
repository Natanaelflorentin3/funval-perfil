// Tipos copiados del Swagger de la API (api-funval-g6)

export type Rol = "admin" | "cliente";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

// Respuesta de POST /auth/login
export interface TokenResponse {
  access_token: string;
  token_type: string;
  user_role: string;
  user_name: string;
}

// Respuesta de GET /auth/me y PUT /auth/perfil
export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar_url: string | null;
}

// Cada item de GET /users/
export interface UserResponse {
  id: number;
  email: string;
  name: string;
  role: string | null;
  avatar_url: string | null;
  created_at: string;
}

// Lo que maneja el formulario del modal de perfil
export interface PerfilForm {
  name: string;
  foto: FileList;
}
