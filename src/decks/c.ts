import { Card, Kind } from '../types';

export const c = (id: string, pt: string, es: string, example?: string, kind?: Kind): Card => ({
  id,
  pt,
  es,
  example,
  kind,
});
