// Versión para web/iOS: sin tienda. En Android Metro usa premium.android.ts.
import { Platform } from 'react-native';
import { PremiumState } from './premiumTypes';

const none = async () => {};

// Solo para probar la interfaz en el navegador: ?premium=1 (desbloqueado) o ?store=1 (botón de compra de muestra).
const flag = (name: string) =>
  Platform.OS === 'web' && typeof location !== 'undefined' && location.search.includes(`${name}=1`);

export function usePremium(): PremiumState {
  const store = flag('store');
  return { premium: flag('premium'), available: store, busy: false, buy: none, restore: none };
}
