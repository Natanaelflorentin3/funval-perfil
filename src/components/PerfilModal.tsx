import { useEffect, useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useAuthStore } from "../store/authStore";
import { updatePerfilService } from "../services/auth.service";
import { getErrorMessage } from "../api/axios";
import { Avatar } from "./Avatar";
import type { PerfilForm } from "../types/user";

const MAX_MB = 5; // límite de la API
const TIPOS_OK = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface Props {
  onClose: () => void;
}

// Modal flotante para editar nombre + foto, sin salir del Dashboard
export function PerfilModal({ onClose }: Props) {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const [errorApi, setErrorApi] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PerfilForm>({ defaultValues: { name: user?.name ?? "" } });

  // Observamos el input de archivo para generar la vista previa
  const archivos = useWatch({ control, name: "foto" });

  const archivo = archivos?.[0];

  // URL temporal en la memoria del navegador → la foto se ve al instante, sin tocar el servidor
  const preview = useMemo(
    () => (archivo && TIPOS_OK.includes(archivo.type) ? URL.createObjectURL(archivo) : null),
    [archivo]
  );

  // Al cambiar de archivo o cerrar el modal, liberamos esa memoria
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function onSubmit(data: PerfilForm) {
    setErrorApi(null);
    setOk(false);

    // FormData = el "paquete" multipart/form-data: texto + archivo en UNA petición.
    // (JSON no puede llevar archivos binarios)
    const formData = new FormData();
    formData.append("name", data.name.trim());
    const archivo = data.foto?.[0];
    if (archivo) formData.append("foto", archivo); // la API espera la llave "foto"

    try {
      const actualizado = await updatePerfilService(formData);
      setUser(actualizado); // actualiza el estado global → navbar y dashboard se refrescan solos
      setOk(true);
      setTimeout(onClose, 900);
    } catch (err) {
      setErrorApi(getErrorMessage(err));
    }
  }

  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-t-2xl bg-white p-6 shadow-xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-slate-900">Editar perfil</h2>
          <button onClick={onClose} className="text-2xl leading-none text-slate-400 hover:text-slate-700" aria-label="Cerrar">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-5">
          {/* Foto: muestra la vista previa local si eligió una, si no la actual */}
          <div className="flex items-center gap-4">
            <Avatar src={preview ?? user.avatar_url} nombre={user.name} size="lg" />
            <div className="text-sm">
              <label className="inline-block cursor-pointer rounded-lg border border-slate-300 px-3 py-2 font-medium hover:bg-slate-50">
                Elegir foto
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  {...register("foto", {
                    validate: (files) => {
                      const f = files?.[0];
                      if (!f) return true; // la foto es opcional
                      if (!TIPOS_OK.includes(f.type)) return "Solo imágenes JPG, PNG, WEBP o GIF.";
                      if (f.size > MAX_MB * 1024 * 1024) return `La imagen no puede superar ${MAX_MB} MB.`;
                      return true;
                    },
                  })}
                />
              </label>
              <p className="mt-1 text-xs text-slate-500">
                {preview ? "Vista previa (todavía no se guardó)" : `JPG, PNG o WEBP · máx ${MAX_MB} MB`}
              </p>
              {errors.foto && <p className="mt-1 text-xs text-red-600">{errors.foto.message}</p>}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Nombre</span>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              {...register("name", {
                required: "El nombre es obligatorio.",
                minLength: { value: 2, message: "Mínimo 2 caracteres." },
              })}
            />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Correo</span>
            <input value={user.email} disabled className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-slate-500" />
          </label>

          {errorApi && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{errorApi}</p>}
          {ok && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">¡Perfil actualizado!</p>}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60"
            >
              {isSubmitting ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
