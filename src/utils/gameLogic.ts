import { GameState } from '../types/gameTypes';
import { checkCollision } from './collisionDetection';
import {
  CANVAS_WIDTH,
  GROUND_Y,
  OBSTACLE_SPEED,
  CLOUD_SPEED,
  SPAWN_RATE,
  SIGN_SPAWN_RATE,
  CLOUD_SPAWN_RATE,
  CLOUD_MIN_WIDTH,
  CLOUD_MAX_WIDTH,
  CLOUD_MIN_HEIGHT,
  CLOUD_MAX_HEIGHT,
  GRAVITY,
  VILLAGE_NAMES,
  OBSTACLE_HEIGHT,
  PLAYER_HEIGHT
} from '../constants/gameConstants';

export function updateGameState(prevState: GameState, frameCount: number): GameState {
  // Reset frameCount when game starts
  if (frameCount === 0) {
    return {
      ...prevState,
      obstacles: [],
      signs: [],
      currentLevel: 0,
      signCount: 0,
      score: 0
    };
  }

  const newVelocity = prevState.isJumping ? prevState.velocity + GRAVITY : prevState.velocity;
  const newY = prevState.playerY + newVelocity;
 

  // Update animation frame
  const newAnimationFrame = prevState.animationFrame + 1;
  const isOnGround = newY >= GROUND_Y - PLAYER_HEIGHT;

  if(prevState.signCount === VILLAGE_NAMES.length && prevState.signs.length === 0) {
    if(!prevState.isJumping) {
      return {
        ...prevState,
        isJumping: true,
        velocity: -8,
        gameWon: true,
        animationFrame: newAnimationFrame,
      };
    } else {
      return {
        ...prevState,
        playerY: isOnGround ? GROUND_Y - PLAYER_HEIGHT : newY,
        velocity: isOnGround ? 0 : newVelocity,
        isJumping: isOnGround ? false : true,
        animationFrame: newAnimationFrame,
      };
    }
  }


  // Update obstacles
  const newObstacles = prevState.obstacles
    .map(obstacle => ({ ...obstacle, x: obstacle.x - OBSTACLE_SPEED }))
    .filter(obstacle => obstacle.x > -20);

  // Update signs
  const newSigns = prevState.signs
    .map(sign => ({ ...sign, x: sign.x - OBSTACLE_SPEED }))
    .filter(sign => sign.x > -100);

  // Update clouds
  const newClouds = prevState.clouds
    .map(cloud => ({ ...cloud, x: cloud.x - CLOUD_SPEED }))
    .filter(cloud => cloud.x > -cloud.width);

  let newSignCount = prevState.signCount;
  let newScore = prevState.score;
  let newCurrentLevel = prevState.currentLevel;
  let gameWon = prevState.gameWon;

  // Spawn new obstacles
  if (frameCount % SPAWN_RATE === 0 && !prevState.gameOver && !prevState.gameWon) {
    newObstacles.push({
      x: CANVAS_WIDTH,
      y: GROUND_Y - OBSTACLE_HEIGHT
    });
  }

  // Spawn new sign - only if we haven't spawned all signs yet
  if (frameCount % SIGN_SPAWN_RATE === 0 && prevState.signCount < VILLAGE_NAMES.length) {
    const nextVillage = VILLAGE_NAMES[prevState.signCount];
    if (nextVillage && prevState.signs.length === 0) {
      newSignCount++;
      newSigns.push({
        x: CANVAS_WIDTH,
        name: nextVillage,
      });
    }
  }

  // Spawn new clouds
  if (frameCount % CLOUD_SPAWN_RATE === 0) {
    const width = Math.random() * (CLOUD_MAX_WIDTH - CLOUD_MIN_WIDTH) + CLOUD_MIN_WIDTH;
    const height = Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT) + CLOUD_MIN_HEIGHT;
    newClouds.push({
      x: CANVAS_WIDTH,
      y: Math.random() * (GROUND_Y / 2),
      width,
      height
    });
  }

  // Check if player has passed a sign
  prevState.signs.forEach(sign => {
    if (sign.x < 50 && !prevState.gameOver) {
      newScore = prevState.signCount;
      newCurrentLevel = prevState.signCount;
      
      // Check if all signs have been passed
      if (newScore === VILLAGE_NAMES.length) {
        gameWon = true;
      }
    }
  });

  // Check for collisions
  const gameOver = checkCollision({
    ...prevState,
    obstacles: newObstacles
  });

  // Ground collision 
  const finalY = isOnGround ? GROUND_Y - PLAYER_HEIGHT : newY;

  return {
    ...prevState,
    playerY: finalY,
    velocity: isOnGround ? 0 : newVelocity,
    isJumping: !isOnGround,
    obstacles: newObstacles,
    signs: newSigns,
    clouds: newClouds,
    signCount: newSignCount,
    score: newScore,
    currentLevel: newCurrentLevel,
    gameOver: gameOver,
    gameWon: gameWon,
    animationFrame: prevState.animationFrame + 1
  };
}