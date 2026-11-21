import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getAvailablePurchases, isUserCancelledError, useIAP } from 'expo-iap';
import { PRODUCT_ID } from './packs';
import { PremiumState } from './premiumTypes';

const CACHE_KEY = 'premium.v1';

const remember = (value: boolean) => AsyncStorage.setItem(CACHE_KEY, value ? '1' : '0').catch(() => {});

export function usePremium(): PremiumState {
  const [premium, setPremium] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string>();
  const verified = useRef(false);

  const { connected, products, fetchProducts, requestPurchase, finishTransaction } = useIAP({
    onPurchaseSuccess: async (purchase) => {
      if (purchase.productId === PRODUCT_ID && purchase.purchaseState === 'purchased') {
        // Confirmar (acknowledge) la compra: si no, Google la reembolsa a los 3 días.
        await finishTransaction({ purchase, isConsumable: false });
        setPremium(true);
        remember(true);
        setMessage('¡Listo! Bora Pro está activo.');
      } else if (purchase.purchaseState === 'pending') {
        setMessage('Tu pago está pendiente. Se activará cuando se confirme.');
      }
      setBusy(false);
    },
    onPurchaseError: (error) => {
      setBusy(false);
      if (!isUserCancelledError(error)) setMessage('No se pudo completar la compra. Inténtalo de nuevo.');
    },
  });

  // Guardado en el teléfono para que funcione sin conexión.
  useEffect(() => {
    AsyncStorage.getItem(CACHE_KEY)
      .then((v) => {
        if (v === '1' && !verified.current) setPremium(true);
      })
      .catch(() => {});
  }, []);

  const verify = useCallback(async (): Promise<boolean> => {
    try {
      const owned = (await getAvailablePurchases()).some(
        (p) => p.productId === PRODUCT_ID && p.purchaseState === 'purchased',
      );
      verified.current = true;
      setPremium(owned);
      remember(owned);
      return owned;
    } catch {
      return false; // sin conexión: se conserva lo guardado
    }
  }, []);

  useEffect(() => {
    if (!connected) return;
    fetchProducts({ skus: [PRODUCT_ID], type: 'in-app' }).catch(() => {});
    verify();
  }, [connected, fetchProducts, verify]);

  const buy = useCallback(async () => {
    setMessage(undefined);
    setBusy(true);
    try {
      await requestPurchase({ request: { google: { skus: [PRODUCT_ID] } }, type: 'in-app' });
    } catch (e) {
      setBusy(false);
      if (!isUserCancelledError(e)) setMessage('No se pudo abrir Google Play. Inténtalo de nuevo.');
    }
  }, [requestPurchase]);

  const restore = useCallback(async () => {
    setMessage(undefined);
    setBusy(true);
    const owned = await verify();
    setBusy(false);
    setMessage(owned ? '¡Compra restaurada!' : 'No encontramos compras de Bora Pro en esta cuenta de Google.');
  }, [verify]);

  const product = products.find((p) => p.id === PRODUCT_ID);
  return { premium, available: connected, price: product?.displayPrice, busy, message, buy, restore };
}
