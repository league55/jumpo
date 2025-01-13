import React, { useEffect, useRef, useState } from 'react';

interface GameState {
  playerY: number;
  velocity: number;
  isJumping: boolean;
  obstacles: Array<{ x: number; y: number }>;
  gameOver: boolean;
  score: number;
}

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    playerY: 300,
    velocity: 0,
    isJumping: false,
    obstacles: [],
    gameOver: false,
    score: 0,
  });

  // Handle screen tap
  const handleTap = () => {
    if (gameState.gameOver) {
      // Reset game
      setGameState({
        playerY: 300,
        velocity: 0,
        isJumping: false,
        obstacles: [],
        gameOver: false,
        score: 0,
      });
      return;
    }

    if (!gameState.isJumping) {
      setGameState(prev => ({
        ...prev,
        velocity: -8,
        isJumping: true,
      }));
    }
  };

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let frameCount = 0;
    const OBSTACLE_SPEED = 5;
    const SPAWN_RATE = 60; // New obstacle every 60 frames

    const gameLoop = setInterval(() => {
      if (gameState.gameOver) {
        // Draw game over screen
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(50, gameState.playerY, 40, 40);
        ctx.fillStyle = '#795548';
        ctx.fillRect(0, 340, canvas.width, 60);
        gameState.obstacles.forEach(obstacle => {
          ctx.fillStyle = '#000000';
          ctx.fillRect(obstacle.x, obstacle.y, 20, 20);
        });
        
        ctx.fillStyle = 'white';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2);
        ctx.fillText(`Score: ${gameState.score}`, canvas.width / 2, canvas.height / 2 + 30);
        ctx.font = '16px Arial';
        ctx.fillText('Tap to restart', canvas.width / 2, canvas.height / 2 + 60);
        return;
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update player position
      setGameState(prev => {
        const newVelocity = prev.isJumping ? prev.velocity + 0.5 : prev.velocity;
        const newY = prev.playerY + newVelocity;
        
        // Update obstacles
        let newObstacles = prev.obstacles
          .map(obstacle => ({ ...obstacle, x: obstacle.x - OBSTACLE_SPEED }))
          .filter(obstacle => obstacle.x > -20);

        // Spawn new obstacle
        if (frameCount % SPAWN_RATE === 0) {
          newObstacles.push({
            x: canvas.width,
            y: Math.random() < 0.5 ? 300 : 260, // Randomly place obstacle at ground level or slightly higher
          });
        }

        // Check collisions
        const playerBox = {
          x: 50,
          y: prev.playerY,
          width: 40,
          height: 40,
        };

        const collision = newObstacles.some(obstacle => {
          return (
            playerBox.x < obstacle.x + 20 &&
            playerBox.x + playerBox.width > obstacle.x &&
            playerBox.y < obstacle.y + 20 &&
            playerBox.y + playerBox.height > obstacle.y
          );
        });

        if (collision) {
          return {
            ...prev,
            gameOver: true,
          };
        }

        // Check if player landed
        if (newY >= 300) {
          return {
            ...prev,
            playerY: 300,
            velocity: 0,
            isJumping: false,
            obstacles: newObstacles,
            score: prev.score + 1,
          };
        }

        return {
          ...prev,
          playerY: newY,
          velocity: newVelocity,
          obstacles: newObstacles,
          score: prev.score + 1,
        };
      });

      // Draw player
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(50, gameState.playerY, 40, 40);

      // Draw obstacles
      gameState.obstacles.forEach(obstacle => {
        ctx.fillStyle = '#000000';
        ctx.fillRect(obstacle.x, obstacle.y, 20, 20);
      });

      // Draw ground
      ctx.fillStyle = '#795548';
      ctx.fillRect(0, 340, canvas.width, 60);

      // Draw score
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Score: ${gameState.score}`, 10, 30);

      frameCount++;
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={400}
      onClick={handleTap}
      onTouchStart={handleTap}
      className="border border-gray-200 rounded-lg shadow-lg"
    />
  );
}