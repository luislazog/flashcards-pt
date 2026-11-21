import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { PACKS, availableCards } from './src/packs';
import { usePremium } from './src/premium';
import { PremiumState } from './src/premiumTypes';
import { dueCards, review, stats } from './src/srs';
import { loadCustomCards, loadProgress, saveCustomCards, saveProgress } from './src/storage';
import { Card, ProgressMap } from './src/types';

type Screen = 'home' | 'study' | 'add';

const COLORS = {
  bg: '#F6F8F3',
  card: '#FFFFFF',
  green: '#009C3B',
  yellow: '#FFDF00',
  blue: '#002776',
  text: '#1B1B1B',
  muted: '#6B7280',
  red: '#C62828',
};

const speak = (text: string) => {
  Speech.stop();
  Speech.speak(text, { language: 'pt-BR', rate: 0.9 });
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [custom, setCustom] = useState<Card[]>([]);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Card[]>([]);

  const premium = usePremium();
  const cards = useMemo(() => availableCards(custom, premium.premium), [custom, premium.premium]);

  useEffect(() => {
    Promise.all([loadCustomCards(), loadProgress()]).then(([c, p]) => {
      setCustom(c);
      setProgress(p);
      setReady(true);
    });
  }, []);

  const startStudy = () => {
    const due = dueCards(cards, progress).sort(() => Math.random() - 0.5).slice(0, 20);
    setSession(due);
    setScreen('study');
  };

  const answer = useCallback((card: Card, knew: boolean) => {
    setProgress((prev) => {
      const next = { ...prev, [card.id]: review(prev[card.id], knew) };
      saveProgress(next);
      return next;
    });
  }, []);

  const addCard = (pt: string, es: string, example: string) => {
    const next = [...custom, { id: `custom-${Date.now()}`, pt, es, example: example || undefined, custom: true }];
    setCustom(next);
    saveCustomCards(next);
  };

  const removeCard = (id: string) => {
    const next = custom.filter((c) => c.id !== id);
    setCustom(next);
    saveCustomCards(next);
  };

  if (!ready) return <View style={styles.screen} />;

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar style="dark" />
      {screen === 'home' && (
        <Home
          stats={stats(cards, progress)}
          premium={premium}
          onStudy={startStudy}
          onAdd={() => setScreen('add')}
        />
      )}
      {screen === 'study' && <Study cards={session} onAnswer={answer} onExit={() => setScreen('home')} />}
      {screen === 'add' && (
        <AddCard custom={custom} onAdd={addCard} onRemove={removeCard} onBack={() => setScreen('home')} />
      )}
    </SafeAreaView>
  );
}

function Home({
  stats: s,
  premium,
  onStudy,
  onAdd,
}: {
  stats: ReturnType<typeof stats>;
  premium: PremiumState;
  onStudy: () => void;
  onAdd: () => void;
}) {
  return (
    <ScrollView contentContainerStyle={styles.home}>
      <Text style={styles.title}>Bora! 🇧🇷</Text>
      <Text style={styles.subtitle}>Aprende portugués con tarjetas</Text>

      <View style={styles.statsRow}>
        <Stat label="Nuevas" value={s.fresh} color={COLORS.blue} />
        <Stat label="Aprendiendo" value={s.learning} color={COLORS.green} />
        <Stat label="Dominadas" value={s.mastered} color={COLORS.muted} />
      </View>

      <Pressable
        style={[styles.primary, s.due === 0 && styles.disabled]}
        disabled={s.due === 0}
        onPress={onStudy}
      >
        <Text style={styles.primaryText}>
          {s.due === 0 ? '¡Todo al día por hoy!' : `Estudiar (${s.due} pendientes)`}
        </Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={onAdd}>
        <Text style={styles.secondaryText}>Mis tarjetas / Agregar</Text>
      </Pressable>

      <Text style={[styles.subtitle, { marginTop: 18 }]}>Mazos</Text>
      {PACKS.map((pack) => {
        const locked = pack.premium && !premium.premium;
        return (
          <View key={pack.id} style={[styles.pack, locked && styles.packLocked]}>
            <Text style={styles.packEmoji}>{locked ? '🔒' : pack.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.packTitle}>{pack.title}</Text>
              <Text style={styles.muted}>
                {pack.cards.length} tarjetas · {pack.description}
              </Text>
            </View>
          </View>
        );
      })}

      {!premium.premium && premium.available && (
        <>
          <Pressable style={[styles.pro, premium.busy && styles.disabled]} disabled={premium.busy} onPress={premium.buy}>
            <Text style={styles.proText}>
              Desbloquear Bora Pro{premium.price ? ` · ${premium.price}` : ''}
            </Text>
            <Text style={styles.proSub}>Pago único. Todos los mazos, hoy y los que vengan.</Text>
          </Pressable>
          <Pressable onPress={premium.restore} disabled={premium.busy}>
            <Text style={[styles.link, { textAlign: 'center' }]}>Restaurar compra</Text>
          </Pressable>
        </>
      )}
      {premium.premium && <Text style={[styles.muted, { textAlign: 'center' }]}>Bora Pro activo ✓ Gracias por apoyar la app</Text>}
      {premium.message && <Text style={[styles.muted, { textAlign: 'center' }]}>{premium.message}</Text>}
    </ScrollView>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Study({ cards, onAnswer, onExit }: { cards: Card[]; onAnswer: (c: Card, knew: boolean) => void; onExit: () => void }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  if (!card) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>¡Muito bem! 🎉</Text>
        <Text style={styles.subtitle}>Terminaste esta sesión.</Text>
        <Pressable style={styles.primary} onPress={onExit}>
          <Text style={styles.primaryText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  const next = (knew: boolean) => {
    onAnswer(card, knew);
    setFlipped(false);
    setIndex(index + 1);
  };

  return (
    <View style={styles.study}>
      <View style={styles.studyHeader}>
        <Pressable onPress={onExit}>
          <Text style={styles.link}>← Salir</Text>
        </Pressable>
        <Text style={styles.muted}>
          {index + 1} / {cards.length}
        </Text>
      </View>

      <Pressable style={styles.flashcard} onPress={() => setFlipped(!flipped)}>
        {!flipped ? (
          <>
            <Text style={styles.cardMain}>{card.pt}</Text>
            <Pressable onPress={() => speak(card.pt)} hitSlop={12}>
              <Text style={styles.speaker}>🔊 Escuchar</Text>
            </Pressable>
            <Text style={styles.hint}>Toca para ver la traducción</Text>
          </>
        ) : (
          <>
            <Text style={styles.cardMain}>{card.es}</Text>
            {card.example && (
              <Pressable onPress={() => speak(card.example!)} hitSlop={12}>
                <Text style={styles.example}>“{card.example}” 🔊</Text>
              </Pressable>
            )}
          </>
        )}
      </Pressable>

      {flipped ? (
        <View style={styles.answerRow}>
          <Pressable style={[styles.answer, { backgroundColor: COLORS.red }]} onPress={() => next(false)}>
            <Text style={styles.primaryText}>No la sabía</Text>
          </Pressable>
          <Pressable style={[styles.answer, { backgroundColor: COLORS.green }]} onPress={() => next(true)}>
            <Text style={styles.primaryText}>La sabía</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.answerRow} />
      )}
    </View>
  );
}

function AddCard({
  custom,
  onAdd,
  onRemove,
  onBack,
}: {
  custom: Card[];
  onAdd: (pt: string, es: string, example: string) => void;
  onRemove: (id: string) => void;
  onBack: () => void;
}) {
  const [pt, setPt] = useState('');
  const [es, setEs] = useState('');
  const [example, setExample] = useState('');

  const submit = () => {
    if (!pt.trim() || !es.trim()) return Alert.alert('Faltan datos', 'Escribe la palabra en portugués y su traducción.');
    onAdd(pt.trim(), es.trim(), example.trim());
    setPt('');
    setEs('');
    setExample('');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.home} keyboardShouldPersistTaps="handled">
        <Pressable onPress={onBack}>
          <Text style={styles.link}>← Volver</Text>
        </Pressable>
        <Text style={styles.title}>Nueva tarjeta</Text>
        <TextInput style={styles.input} placeholder="Portugués" value={pt} onChangeText={setPt} />
        <TextInput style={styles.input} placeholder="Español" value={es} onChangeText={setEs} />
        <TextInput style={styles.input} placeholder="Ejemplo (opcional)" value={example} onChangeText={setExample} />
        <Pressable style={styles.primary} onPress={submit}>
          <Text style={styles.primaryText}>Agregar</Text>
        </Pressable>

        <Text style={[styles.subtitle, { marginTop: 24 }]}>Mis tarjetas ({custom.length})</Text>
        {custom.map((c) => (
          <View key={c.id} style={styles.listItem}>
            <Text style={{ flex: 1 }}>
              {c.pt} — {c.es}
            </Text>
            <Pressable onPress={() => onRemove(c.id)} hitSlop={12}>
              <Text style={{ color: COLORS.red }}>Borrar</Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: COLORS.bg },
  home: { padding: 24, gap: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.blue },
  subtitle: { fontSize: 16, color: COLORS.muted },
  muted: { color: COLORS.muted },
  link: { color: COLORS.blue, fontSize: 16 },
  pack: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: COLORS.card, borderRadius: 14, padding: 14 },
  packLocked: { opacity: 0.6 },
  packEmoji: { fontSize: 26 },
  packTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  pro: { backgroundColor: COLORS.blue, padding: 16, borderRadius: 14, alignItems: 'center', gap: 2 },
  proText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  proSub: { color: COLORS.yellow, fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 10, marginVertical: 12 },
  stat: { flex: 1, backgroundColor: COLORS.card, borderRadius: 14, padding: 14, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800' },
  statLabel: { color: COLORS.muted, fontSize: 12 },
  primary: { backgroundColor: COLORS.green, padding: 16, borderRadius: 14, alignItems: 'center' },
  disabled: { backgroundColor: '#9CA3AF' },
  primaryText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  secondary: { borderColor: COLORS.blue, borderWidth: 2, padding: 14, borderRadius: 14, alignItems: 'center' },
  secondaryText: { color: COLORS.blue, fontSize: 16, fontWeight: '700' },
  study: { flex: 1, padding: 24, gap: 20 },
  studyHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  flashcard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 24,
    borderTopWidth: 6,
    borderTopColor: COLORS.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 18,
    elevation: 3,
  },
  cardMain: { fontSize: 36, fontWeight: '800', color: COLORS.text, textAlign: 'center' },
  speaker: { fontSize: 18, color: COLORS.blue },
  example: { fontSize: 18, color: COLORS.muted, fontStyle: 'italic', textAlign: 'center' },
  hint: { color: COLORS.muted, position: 'absolute', bottom: 20 },
  answerRow: { flexDirection: 'row', gap: 12, height: 56 },
  answer: { flex: 1, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  input: { backgroundColor: COLORS.card, borderRadius: 12, padding: 14, fontSize: 16 },
  listItem: { flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 12, padding: 14, gap: 10 },
});
