export interface GameState {
  playerY: number;
  velocity: number;
  isJumping: boolean;
  obstacles: Array<{ x: number; y: number }>;
  signs: Array<{ x: number; name: string }>;
  clouds: Array<{ x: number; y: number; width: number; height: number }>;
  gameOver: boolean;
  score: number;
  animationFrame: number;
}

export const INITIAL_GAME_STATE: GameState = {
  playerY: 300,
  velocity: 0,
  isJumping: false,
  obstacles: [],
  signs: [],
  clouds: [],
  gameOver: false,
  score: 0,
  animationFrame: 0,
};