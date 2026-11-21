export type PremiumState = {
  premium: boolean;
  /** La tienda está disponible (solo en Android con Google Play). */
  available: boolean;
  /** Precio ya formateado en la moneda del usuario, si la tienda lo devolvió. */
  price?: string;
  busy: boolean;
  message?: string;
  buy: () => Promise<void>;
  restore: () => Promise<void>;
};
