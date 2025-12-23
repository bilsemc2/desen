
export type PatternType = 
  | 'GRID' | 'STRIPES' | 'CIRCLES' | 'DIAMONDS' | 'STARS' 
  | 'MANDALA_FLOWER' | 'MANDALA_WEB' | 'MANDALA_GEOMETRIC'
  | 'TURKISH_TULIP' | 'TURKISH_EYE' | 'TURKISH_KILIM';

export interface PatternDefinition {
  id: number;
  type: PatternType;
  colors: string[];
  correctOptionIndex: number;
  difficulty: number;
}

export interface GameState {
  currentLevel: number;
  score: number;
  totalQuestions: number;
  isGameOver: boolean;
  lives: number;
}
