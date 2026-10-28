import type { Rol } from "../types/user";

// La API manda el rol como texto ("admin" / "cliente"); lo normalizamos
export function normalizarRol(role: string | null | undefined): Rol {
  return role?.toLowerCase() === "admin" ? "admin" : "cliente";
}

export function esAdmin(role: string | null | undefined): boolean {
  return normalizarRol(role) === "admin";
}

export function primerNombre(nombre: string): string {
  return nombre.trim().split(" ")[0] || nombre;
}

// "Hola administrador Natanael" / "Hola cliente Natanael"
export function getSaludo(role: string | null | undefined, nombre: string): string {
  const rol = esAdmin(role) ? "administrador" : "cliente";
  return `Hola ${rol} ${primerNombre(nombre)}`;
}
