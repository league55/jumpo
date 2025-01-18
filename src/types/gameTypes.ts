import { VILLAGE_NAMES } from "../constants/gameConstants";

export interface GameState {
  playerY: number;
  velocity: number;
  isJumping: boolean;
  obstacles: Array<{ x: number; y: number }>;
  signCount: number;
  signs: Array<{ x: number; name: string }>;
  clouds: Array<{ x: number; y: number; width: number; height: number }>;
  gameOver: boolean;
  gameWon: boolean;
  score: number;
  animationFrame: number;
}

export const INITIAL_GAME_STATE: GameState = {
  playerY: 300,
  velocity: 0,
  isJumping: false,
  obstacles: [],
  signCount: 0,
  signs: [],
  clouds: [],
  gameOver: false,
  gameWon: false,
  score: 0,
  animationFrame: 0,
};

export const resetGameState = (prevState: GameState): GameState => {
  return {
    ...INITIAL_GAME_STATE,
    clouds: prevState.clouds
  };
};