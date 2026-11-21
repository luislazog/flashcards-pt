import { Card, Progress, ProgressMap } from './types';

const DAY = 24 * 60 * 60 * 1000;
// Días hasta la próxima revisión según la caja.
const INTERVALS = [0, 1, 2, 4, 8, 16];
export const MAX_BOX = INTERVALS.length - 1;

export function review(prev: Progress | undefined, knew: boolean, now = Date.now()): Progress {
  const box = knew ? Math.min((prev?.box ?? 0) + 1, MAX_BOX) : 1;
  return { box, due: now + INTERVALS[box] * DAY };
}

export function isDue(p: Progress | undefined, now = Date.now()): boolean {
  return !p || p.due <= now;
}

export function dueCards(cards: Card[], progress: ProgressMap, now = Date.now()): Card[] {
  return cards.filter((c) => isDue(progress[c.id], now));
}

export function stats(cards: Card[], progress: ProgressMap, now = Date.now()) {
  let fresh = 0;
  let learning = 0;
  let mastered = 0;
  for (const c of cards) {
    const box = progress[c.id]?.box ?? 0;
    if (box === 0) fresh++;
    else if (box >= MAX_BOX) mastered++;
    else learning++;
  }
  return { total: cards.length, fresh, learning, mastered, due: dueCards(cards, progress, now).length };
}

const shuffle = <T,>(items: T[]): T[] => [...items].sort(() => Math.random() - 0.5);

/**
 * Sesión de estudio: primero repasos pendientes (al azar) y después tarjetas nuevas
 * en el orden de la ruta, para seguir la línea de aprendizaje del libro.
 */
export function buildSession(cards: Card[], progress: ProgressMap, maxNew = 10, maxReview = 15, now = Date.now()): Card[] {
  const due = dueCards(cards, progress, now);
  const reviews = shuffle(due.filter((c) => (progress[c.id]?.box ?? 0) > 0)).slice(0, maxReview);
  const fresh = due.filter((c) => (progress[c.id]?.box ?? 0) === 0).slice(0, maxNew);
  return [...reviews, ...fresh];
}
