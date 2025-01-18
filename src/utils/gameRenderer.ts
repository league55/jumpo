import { GameState } from '../types/gameTypes';
import {
  PLAYER_X,
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  GROUND_Y,
  GROUND_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  CHARACTER_IMAGE_URL,
  SIGN_WIDTH,
  SIGN_HEIGHT,
  POLE_WIDTH,
  POLE_HEIGHT
} from '../constants/gameConstants';

const characterImage = new Image();
characterImage.src = CHARACTER_IMAGE_URL;

function drawLegs(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number) {
  const legWidth = 4;
  const legHeight = 15;
  const legSpacing = 10;
  
  ctx.fillStyle = '#000000';
  
  // Left leg
  const leftLegAngle = Math.sin(frame * 0.5) * 0.5;
  ctx.save();
  ctx.translate(x + legSpacing, y + PLAYER_HEIGHT - legHeight);
  ctx.rotate(leftLegAngle);
  ctx.fillRect(-legWidth/2, 0, legWidth, legHeight);
  ctx.restore();
  
  // Right leg
  const rightLegAngle = -Math.sin(frame * 0.5) * 0.5;
  ctx.save();
  ctx.translate(x + PLAYER_WIDTH - legSpacing, y + PLAYER_HEIGHT - legHeight);
  ctx.rotate(rightLegAngle);
  ctx.fillRect(-legWidth/2, 0, legWidth, legHeight);
  ctx.restore();
}

function drawSign(ctx: CanvasRenderingContext2D, x: number, name: string) {
  // Draw pole
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + SIGN_WIDTH/2 - POLE_WIDTH/2, GROUND_Y - POLE_HEIGHT, POLE_WIDTH, POLE_HEIGHT);
  
  // Draw sign background
  ctx.fillStyle = 'white';
  ctx.fillRect(x, GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT, SIGN_WIDTH, SIGN_HEIGHT);
  
  // Draw sign border
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT, SIGN_WIDTH, SIGN_HEIGHT);
  
  // Draw text
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, x + SIGN_WIDTH/2, GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT/2);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  
  // Draw main cloud body
  ctx.arc(x + width * 0.5, y + height * 0.5, height * 0.5, 0, Math.PI * 2);
  ctx.arc(x + width * 0.3, y + height * 0.5, height * 0.4, 0, Math.PI * 2);
  ctx.arc(x + width * 0.7, y + height * 0.5, height * 0.4, 0, Math.PI * 2);
  
  ctx.fill();
}

export function drawGame(ctx: CanvasRenderingContext2D, gameState: GameState) {
  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw clouds (behind everything)
  gameState.clouds.forEach(cloud => {
    drawCloud(ctx, cloud.x, cloud.y, cloud.width, cloud.height);
  });

  // Draw signs
  gameState.signs.forEach(sign => {
    drawSign(ctx, sign.x, sign.name);
  });

  // Draw player
  if (characterImage.complete) {
    // Draw character body
    ctx.drawImage(
      characterImage,
      PLAYER_X,
      gameState.playerY,
      PLAYER_WIDTH,
      PLAYER_HEIGHT - 15
    );
    
    // Draw animated legs
    drawLegs(ctx, PLAYER_X, gameState.playerY, gameState.animationFrame);
  }

  // Draw obstacles
  ctx.fillStyle = '#000000';
  gameState.obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
  });

  // Draw ground
  ctx.fillStyle = '#795548';
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, GROUND_HEIGHT);

  // Draw score
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  ctx.strokeText(`Score: ${gameState.score}`, 10, 30);  // Draw the border first
  ctx.fillText(`Score: ${gameState.score}`, 10, 30);    // Then fill the text

  // Draw game over screen
  if (gameState.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.fillText(`Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
    ctx.font = '16px Arial';
    ctx.fillText('Tap to restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
  }
}