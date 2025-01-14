import { GameState } from '../types/gameTypes';
import { PLAYER_X, PLAYER_WIDTH, PLAYER_HEIGHT, OBSTACLE_WIDTH, OBSTACLE_HEIGHT } from '../constants/gameConstants';

export function checkCollision(gameState: GameState): boolean {
  const playerBox = {
    x: PLAYER_X,
    y: gameState.playerY,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
  };

  return gameState.obstacles.some(obstacle => {
    return (
      playerBox.x < obstacle.x + OBSTACLE_WIDTH &&
      playerBox.x + playerBox.width > obstacle.x &&
      playerBox.y < obstacle.y + OBSTACLE_HEIGHT &&
      playerBox.y + playerBox.height > obstacle.y
    );
  });
}