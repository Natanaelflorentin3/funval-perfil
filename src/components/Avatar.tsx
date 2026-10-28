interface Props {
  src: string | null | undefined;
  nombre: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const SIZES = {
  sm: "h-9 w-9 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
};

// Muestra la foto; si no hay, un círculo con la inicial del nombre
export function Avatar({ src, nombre, size = "md" }: Props) {
  const inicial = nombre.trim().charAt(0).toUpperCase() || "?";
  return src ? (
    <img src={src} alt={nombre} className={`${SIZES[size]} shrink-0 rounded-full object-cover ring-2 ring-white`} />
  ) : (
    <div
      className={`${SIZES[size]} flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 ring-2 ring-white`}
    >
      {inicial}
    </div>
  );
}
