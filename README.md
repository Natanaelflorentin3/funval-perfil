# FunVal Shop — Perfil y usuarios

SPA en **React + TypeScript + Tailwind CSS** (Vite) conectada a la API
[api-funval-g6](https://api-funval-g6.onrender.com/docs).

```bash
npm install
npm run dev     # http://localhost:5173
npm run build
```

## Qué incluye
- **Login / registro** (`/auth/login`, `/auth/register`) con React Hook Form. Después del login se pide `/auth/me` para tener el usuario completo (id, rol, avatar).
- **Estado global con Zustand** (`store/authStore.ts`), persistido en localStorage. Un interceptor de axios agrega el token; si vence (401) cierra la sesión.
- **Rutas protegidas**: `/dashboard` para cualquier usuario logueado, `/usuarios` solo para `admin` (un cliente que entra a mano va a `/no-autorizado`, y ni siquiera ve la pestaña).
- **Modal de perfil** (`components/PerfilModal.tsx`):
  - `URL.createObjectURL` para la vista previa local de la foto antes de subirla (y `revokeObjectURL` para liberar memoria).
  - `FormData` con las llaves que pide la API: `name` (texto) y `foto` (archivo) → `PUT /auth/perfil` en una sola petición multipart/form-data.
  - Validación: solo imágenes, máximo 5 MB.
  - Al guardar se actualiza el store → el avatar del navbar y del dashboard cambian al instante.
- **Usuarios (admin)**: tabla con avatar, nombre, correo y rol desde `GET /users/`, con buscador.

`vercel.json` permite recargar en cualquier ruta al desplegar en Vercel.
