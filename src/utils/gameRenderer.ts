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
  SIGN_WIDTH,
  SIGN_HEIGHT,
  POLE_WIDTH,
  POLE_HEIGHT,
  CHARACTER_IMAGE_URL
} from '../constants/gameConstants';


const characterImage = new Image();
characterImage.src = CHARACTER_IMAGE_URL;

// Define background themes
const LEVEL_BACKGROUNDS = [
  {
    name: 'Forest',
    skyColor: '#87CEEB',
    groundColor: '#228B22',
    elements: (ctx: CanvasRenderingContext2D) => {
      // Draw trees
      for (let x = 0; x < CANVAS_WIDTH; x += 100) {
        const fixedHeight = 80 + Math.sin(x * 0.1) * 20;
        // Tree trunk
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 20, GROUND_Y - fixedHeight, 20, fixedHeight);
        // Tree top
        ctx.fillStyle = '#006400';
        ctx.beginPath();
        ctx.moveTo(x, GROUND_Y - fixedHeight);
        ctx.lineTo(x + 30, GROUND_Y - fixedHeight - 40);
        ctx.lineTo(x + 60, GROUND_Y - fixedHeight);
        ctx.fill();
      }
    }
  },
  {
    name: 'Park',
    skyColor: '#B0E0E6',
    groundColor: '#90EE90',
    elements: (ctx: CanvasRenderingContext2D) => {
      // Draw lake
      ctx.fillStyle = '#4682B4';
      ctx.beginPath();
      ctx.ellipse(CANVAS_WIDTH/2, GROUND_Y - 20, 150, 30, 0, Math.PI * 2, 0);
      ctx.fill();
      
      // Draw benches
      for (let x = 100; x < CANVAS_WIDTH; x += 200) {
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x, GROUND_Y - 30, 40, 20);
      }
    }
  },
  {
    name: 'City',
    skyColor: '#F0F8FF',
    groundColor: '#808080',
    elements: (ctx: CanvasRenderingContext2D) => {
      // Draw buildings
      for (let x = 0; x < CANVAS_WIDTH; x += 150) {
        const fixedHeight = 100 + Math.sin(x * 0.05) * 30;
        ctx.fillStyle = '#708090';
        ctx.fillRect(x, GROUND_Y - fixedHeight, 100, fixedHeight);
        
        // Windows
        ctx.fillStyle = '#FFD700';
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < Math.floor(fixedHeight / 25) - 1; j++) {
            ctx.fillRect(x + 20 + (i * 25), GROUND_Y - fixedHeight + 20 + (j * 25), 15, 15);
          }
        }
      }
    }
  },
  {
    name: 'Pool',
    skyColor: '#87CEEB',
    groundColor: '#DEB887',
    elements: (ctx: CanvasRenderingContext2D) => {
      // Draw pool
      ctx.fillStyle = '#00CED1';
      ctx.fillRect(100, GROUND_Y - 40, CANVAS_WIDTH - 200, 30);
      
      // Draw pool edges
      ctx.fillStyle = '#F5F5F5';
      ctx.fillRect(80, GROUND_Y - 45, CANVAS_WIDTH - 160, 10);
    }
  },
  {
    name: 'Village',
    skyColor: '#FFB6C1',
    groundColor: '#8FBC8F',
    elements: (ctx: CanvasRenderingContext2D) => {
      // Draw river
      ctx.fillStyle = '#4169E1';
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y - 20);
      ctx.quadraticCurveTo(CANVAS_WIDTH/2, GROUND_Y - 40, CANVAS_WIDTH, GROUND_Y - 10);
      ctx.lineTo(CANVAS_WIDTH, GROUND_Y);
      ctx.quadraticCurveTo(CANVAS_WIDTH/2, GROUND_Y - 20, 0, GROUND_Y);
      ctx.fill();
      
      // Draw houses
      for (let x = 50; x < CANVAS_WIDTH; x += 200) {
        drawHouse(ctx, x, GROUND_Y - 80);
      }
    }
  }
];

function drawHouse(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // House body
  ctx.fillStyle = '#F5F5DC';
  ctx.fillRect(x, y, 60, 60);
  
  // Roof
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 30, y - 30);
  ctx.lineTo(x + 70, y);
  ctx.fill();
  
  // Door
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + 25, y + 30, 15, 30);
  
  // Window
  ctx.fillStyle = '#87CEEB';
  ctx.fillRect(x + 10, y + 10, 15, 15);
}

function drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + width * 0.5, y + height * 0.5, height * 0.5, 0, Math.PI * 2);
  ctx.arc(x + width * 0.3, y + height * 0.5, height * 0.4, 0, Math.PI * 2);
  ctx.arc(x + width * 0.7, y + height * 0.5, height * 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawSign(ctx: CanvasRenderingContext2D, x: number, name: string) {
  // Draw pole
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x + SIGN_WIDTH/2 - POLE_WIDTH/2, GROUND_Y - POLE_HEIGHT, POLE_WIDTH, POLE_HEIGHT);
  
  const signBottom = GROUND_Y - POLE_HEIGHT;
  const signTop = GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT;

  //ctx.fillRect(x, GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT, SIGN_WIDTH, SIGN_HEIGHT);

  // Draw sign background
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(x + SIGN_WIDTH / 2, signBottom);
  ctx.lineTo(x + SIGN_WIDTH / 2 + SIGN_WIDTH / 2, signTop + SIGN_HEIGHT / 2);
  ctx.lineTo(x + SIGN_WIDTH / 2, signTop);
  ctx.lineTo(x + SIGN_WIDTH / 2 - SIGN_WIDTH / 2,  signTop + SIGN_HEIGHT / 2);
  ctx.lineTo(x + SIGN_WIDTH / 2, signBottom);
  ctx.fill();
  
  // Draw sign border
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 2;
  ctx.stroke();
 

  // Draw text
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

    // Measure text width
    const textMetrics = ctx.measureText(name);
    const padding = 4; // Padding around text
    
    // Draw text background
    ctx.fillStyle = 'rgba(10, 100, 255, 0.8)'; // Semi-transparent white
    ctx.fillRect(
      x + SIGN_WIDTH/2 - textMetrics.width/2 - padding,
      GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT/2 - 8,
      textMetrics.width + padding * 2,
      16
    );

  
    ctx.fillStyle = '#311';
  ctx.fillText(name, x + SIGN_WIDTH/2, GROUND_Y - POLE_HEIGHT - SIGN_HEIGHT/2); 
}

function drawPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, frame: number, isWinning: boolean = false) {
  // Draw body
  ctx.fillStyle = '#FF69B4'; // Pink color for character
  // ctx.fillRect(x, y, PLAYER_WIDTH, PLAYER_HEIGHT - 15);
  // ctx.fillStyle = '#FF69B4';
  ctx.beginPath();
  ctx.ellipse(x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT / 4 + 6, PLAYER_HEIGHT / 2 - 5, PLAYER_WIDTH / 2,  Math.PI / 2, 0, 2 * Math.PI);
  ctx.fill();


  // Draw head
  if (characterImage.complete) {
    // Draw character body
    ctx.drawImage(
      characterImage,
      PLAYER_X - PLAYER_WIDTH / 4,
      y - PLAYER_HEIGHT / 2,
      50,
      50
    );
  }
  // ctx.fillStyle = '#FFE4E1';
  // ctx.beginPath();
  // ctx.arc(x + PLAYER_WIDTH/2, y - 5, 15, 0, Math.PI * 2);
  // ctx.fill();
   
  const legWidth = 4;
  const legHeight = 15;
  const legSpacing = 10;
  
  ctx.fillStyle = '#000000';
   
    // Normal running animation
    const leftLegAngle = Math.sin(frame * 0.5) * 0.5;
    ctx.save();
    ctx.translate(x + legSpacing, y + PLAYER_HEIGHT - legHeight);
    ctx.rotate(leftLegAngle);
    ctx.fillRect(-legWidth/2, 0, legWidth, legHeight);
    ctx.restore();
    
    const rightLegAngle = -Math.sin(frame * 0.5) * 0.5;
    ctx.save();
    ctx.translate(x + PLAYER_WIDTH - legSpacing, y + PLAYER_HEIGHT - legHeight);
    ctx.rotate(rightLegAngle);
    ctx.fillRect(-legWidth/2, 0, legWidth, legHeight);
    ctx.restore();
    
    
    const rightArmAngle = -Math.sin(frame * 0.25) * 0.5;
    ctx.save();
    ctx.translate(x + PLAYER_WIDTH, y + PLAYER_HEIGHT/2 - 15);
    ctx.rotate(rightArmAngle);
    ctx.fillRect(-legWidth - 3, 0, legWidth -3, 10);
    ctx.restore();

    
     
    ctx.save();
    ctx.translate(x + 10, y + PLAYER_HEIGHT/2 - 15);
    ctx.rotate(rightArmAngle);
    ctx.fillRect(-legWidth - 3, 0, legWidth -3, 10);
    ctx.restore();
}

function drawCelebrationEffects(ctx: CanvasRenderingContext2D) {
  const time = Date.now() * 0.001;
  for (let i = 0; i < 20; i++) {
    const x = Math.sin(time + i) * 100 + CANVAS_WIDTH / 2;
    const y = Math.cos(time + i) * 100 + CANVAS_HEIGHT / 2;
    const size = Math.sin(time * 2 + i) * 2 + 4;
    
    ctx.fillStyle = `hsl(${(time * 100 + i * 20) % 360}, 70%, 50%)`;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawGame(ctx: CanvasRenderingContext2D, gameState: GameState) {
  // Clear canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (gameState.showWelcome) {
    // Draw welcome screen
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Title
    ctx.fillStyle = '#333';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Running for a date night', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);
    
    // Description
    ctx.font = '16px Arial';
    ctx.fillText('Oh no! Martina has lost her metro card!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    ctx.fillText('Will she make it to the date with Maks on time?', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 10);
    
    // Controls
    ctx.font = '14px Arial';
    ctx.fillText('Click to jump', CANVAS_WIDTH / 2, CANVAS_HEIGHT * 2/3);
    return;
  }

  // Draw current level background
  const currentBackground = LEVEL_BACKGROUNDS[gameState.currentLevel % LEVEL_BACKGROUNDS.length];
  
  // Draw sky
  ctx.fillStyle = currentBackground.skyColor;
  ctx.fillRect(0, 0, CANVAS_WIDTH, GROUND_Y);
  
  // Draw background elements
  currentBackground.elements(ctx);

  // Draw clouds
  gameState.clouds.forEach(cloud => {
    drawCloud(ctx, cloud.x, cloud.y, cloud.width, cloud.height);
  });

  // Draw signs
  gameState.signs.forEach(sign => {
    drawSign(ctx, sign.x, sign.name);
  });

  // Draw player with victory animation if won
  drawPlayer(ctx, PLAYER_X, gameState.playerY, gameState.animationFrame, gameState.gameWon);

  // Draw obstacles
  ctx.fillStyle = '#000000';
  gameState.obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
  });

  // Draw ground
  ctx.fillStyle = currentBackground.groundColor;
  ctx.fillRect(0, GROUND_Y, CANVAS_WIDTH, GROUND_HEIGHT);

  // Draw score
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3;
  ctx.font = '20px Arial';
  ctx.textAlign = 'left';
  ctx.strokeText(`Score: ${gameState.score}`, 10, 30);
  ctx.fillText(`Score: ${gameState.score}`, 10, 30);

  // Draw game over screen
  if (gameState.gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.fillText(`Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 30);
  }

  // Draw win screen
  if (gameState.gameWon) {
    // Win text
    ctx.fillStyle = 'white';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    
    // Draw text with outline for better visibility
    ctx.strokeText('You Won!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
    ctx.fillText('You Won!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
    
    ctx.font = '20px Arial';
    ctx.strokeText('Martina made it to the date!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    ctx.fillText('Martina made it to the date!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    
    ctx.strokeText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    ctx.fillText(`Final Score: ${gameState.score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    
    drawCelebrationEffects(ctx);
  }
}