export type Card = {
  id: string;
  pt: string;
  es: string;
  example?: string;
  custom?: boolean;
};

export type Progress = {
  box: number; // 0 = nueva, 1..5 = caja de Leitner
  due: number; // timestamp (ms) de la próxima revisión
};

export type ProgressMap = Record<string, Progress>;
