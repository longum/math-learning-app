export type DifficultyLevel = 'level1' | 'level2';

export type BlockType = 'hundred' | 'ten' | 'one';

export interface Block {
  type: BlockType;
  value: number;
  count: number;
}

export interface AnimationStep {
  id: number;
  description: string;
  blocks?: Block[][];
  action?: string;
  highlight?: string[];
  showResult?: boolean;
}

export interface Equation {
  num1: number;
  num2: number;
  operator: '+' | '-';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  expireAt: number | null;
}

export interface User {
  username: string;
  password: string;
}
