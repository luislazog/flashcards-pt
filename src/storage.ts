import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, ProgressMap } from './types';

const PROGRESS_KEY = 'progress.v1';
const CUSTOM_KEY = 'custom-cards.v1';

async function read<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const loadProgress = () => read<ProgressMap>(PROGRESS_KEY, {});
export const saveProgress = (p: ProgressMap) => AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
export const loadCustomCards = () => read<Card[]>(CUSTOM_KEY, []);
export const saveCustomCards = (c: Card[]) => AsyncStorage.setItem(CUSTOM_KEY, JSON.stringify(c));
