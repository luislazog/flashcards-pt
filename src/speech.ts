import { Alert, Linking, Platform } from 'react-native';
import * as Speech from 'expo-speech';

// Sin una voz brasileña explícita, Android cae en la voz por defecto del teléfono
// (en inglés) y el portugués suena con acento gringo.
const isBrazilian = (language: string) => language.toLowerCase().replace('_', '-').startsWith('pt-br');

let voiceId: string | undefined;
let loaded = false;
let warned = false;

async function pickVoice() {
  if (loaded) return;
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    if (voices.length === 0) return; // el motor aún no está listo: reintentar luego
    loaded = true;
    const pt = voices
      .filter((v) => isBrazilian(v.language))
      .sort(
        (a, b) =>
          Number(b.quality === Speech.VoiceQuality.Enhanced) - Number(a.quality === Speech.VoiceQuality.Enhanced),
      );
    voiceId = pt[0]?.identifier;
  } catch {
    // se habla con el idioma por defecto
  }
}

function warnMissingVoice() {
  if (warned || Platform.OS !== 'android') return;
  warned = true;
  Alert.alert(
    'Falta la voz de Brasil',
    'Tu teléfono no tiene instalada una voz en portugués de Brasil, por eso el audio suena con acento extranjero. Ve a Ajustes → Salida de texto a voz → Google → Instalar datos de voz y descarga "Português (Brasil)".',
    [
      { text: 'Ahora no', style: 'cancel' },
      {
        text: 'Abrir ajustes',
        onPress: () => Linking.sendIntent('com.android.settings.TTS_SETTINGS').catch(() => Linking.openSettings()),
      },
    ],
  );
}

export async function speak(text: string) {
  Speech.stop();
  await pickVoice();
  if (loaded && !voiceId) warnMissingVoice();
  Speech.speak(text, { language: 'pt-BR', voice: voiceId, rate: 0.9 });
}

// Se llama al abrir la app para tener la voz lista antes del primer toque.
export const prepareVoice = pickVoice;
