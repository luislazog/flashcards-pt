# Português — tarjetas para aprender portugués

App Android (Expo / React Native + TypeScript) de flashcards con repetición espaciada (cajas de Leitner),
pronunciación en pt-BR y tarjetas propias. Traducciones al español.

## Desarrollo
```bash
npm install
npx expo start        # escanea el QR con Expo Go, o pulsa "a" para el emulador
```

## Publicar en Play Store
1. Cuenta de Google Play Console (pago único de 25 USD) y cuenta en expo.dev.
2. `npm i -g eas-cli && eas login`
3. `eas build -p android --profile production` → genera el `.aab`
4. Subir el `.aab` en Play Console (o `eas submit -p android`).
5. Falta antes de publicar: icono definitivo (`assets/`), capturas, descripción y política de privacidad.

## Estructura
- `src/cards.ts` mazo inicial · `src/srs.ts` repetición espaciada · `src/storage.ts` persistencia local
- `App.tsx` pantallas: inicio, estudio y agregar tarjetas
