import { GameState } from '../types/gameTypes';
import { checkCollision } from './collisionDetection';
import {
  CANVAS_WIDTH,
  OBSTACLE_SPEED,
  CLOUD_SPEED,
  SPAWN_RATE,
  SIGN_SPAWN_RATE,
  CLOUD_SPAWN_RATE,
  INITIAL_PLAYER_Y,
  GRAVITY,
  ANIMATION_SPEED, 
  SIGN_WIDTH,
  CLOUD_MIN_WIDTH,
  CLOUD_MAX_WIDTH,
  CLOUD_MIN_HEIGHT,
  CLOUD_MAX_HEIGHT,
  VILLAGE_NAMES
} from '../constants/gameConstants';

export function updateGameState(prevState: GameState, frameCount: number): GameState {
  const newVelocity = prevState.isJumping ? prevState.velocity + GRAVITY : prevState.velocity;
  const newY = prevState.playerY + newVelocity;

  // Update animation frame
  const newAnimationFrame = Math.floor(frameCount / ANIMATION_SPEED) % 4;

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
      const hasLanded = newY >= INITIAL_PLAYER_Y;
      return {
        ...prevState,
        playerY: hasLanded ? INITIAL_PLAYER_Y : newY,
        velocity: hasLanded ? 0 : newVelocity,
        isJumping: hasLanded ? false : true,
        animationFrame: newAnimationFrame,
      };
    }
  }

  // Update obstacles
  let newObstacles = prevState.obstacles
    .map(obstacle => ({ ...obstacle, x: obstacle.x - OBSTACLE_SPEED }))
    .filter(obstacle => obstacle.x > -20);

  // Update signs
  let newSigns = prevState.signs
    .map(sign => ({ ...sign, x: sign.x - OBSTACLE_SPEED }))
    .filter(sign => sign.x > -SIGN_WIDTH);

  // Update clouds
  let newClouds = prevState.clouds
    .map(cloud => ({ ...cloud, x: cloud.x - CLOUD_SPEED }))
    .filter(cloud => cloud.x > -cloud.width);

  // Spawn new obstacle
  if (frameCount % SPAWN_RATE === 0) {
    newObstacles.push({
      x: CANVAS_WIDTH,
      y: Math.random() < 0.5 ? 300 : 260,
    });
  }

  let newSignCount = prevState.signCount;
  // Spawn new sign
  if (frameCount % SIGN_SPAWN_RATE === 0) {
    const randomName = VILLAGE_NAMES[prevState.signCount];
    if (randomName) {
      newSignCount++;
      newSigns.push({
        x: CANVAS_WIDTH,
        name: randomName,
      });
    } 
  }

  // Spawn new cloud
  if (frameCount % CLOUD_SPAWN_RATE === 0) {
    const width = Math.random() * (CLOUD_MAX_WIDTH - CLOUD_MIN_WIDTH) + CLOUD_MIN_WIDTH;
    const height = Math.random() * (CLOUD_MAX_HEIGHT - CLOUD_MIN_HEIGHT) + CLOUD_MIN_HEIGHT;
    newClouds.push({
      x: CANVAS_WIDTH,
      y: Math.random() * 100, // Random height in the top portion of the screen
      width,
      height,
    });
  }


  // Check collisions
  if (checkCollision({ ...prevState, obstacles: newObstacles })) {
    return {
      ...prevState,
      gameOver: true,
      animationFrame: newAnimationFrame,
    };
  }

  // Check if player landed
  if (newY >= INITIAL_PLAYER_Y) {
    return {
      ...prevState,
      playerY: INITIAL_PLAYER_Y,
      velocity: 0,
      isJumping: false,
      obstacles: newObstacles,
      signs: newSigns,
      clouds: newClouds,
      score: prevState.score + 1,
      animationFrame: newAnimationFrame,
      signCount: newSignCount,
    };
  }

  return {
    ...prevState,
    playerY: newY,
    velocity: newVelocity,
    obstacles: newObstacles,
    signs: newSigns,
    clouds: newClouds,
    score: prevState.score + 1,
    animationFrame: newAnimationFrame,
    signCount: newSignCount,
  };
}