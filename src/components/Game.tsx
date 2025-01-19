import React, { useEffect, useRef, useState } from 'react';
import { drawGame } from '../utils/gameRenderer';
import { updateGameState } from '../utils/gameLogic';
import { GameState, INITIAL_GAME_STATE, resetGameState } from '../types/gameTypes';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/gameConstants';

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameCountRef = useRef<number>(0);
  const [gameState, setGameState] = useState<GameState>(INITIAL_GAME_STATE);
  const gameLoopRef = useRef<number>();

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && gameState.showWelcome) {
      startGame();
    }
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      showWelcome: false,
      gameStarted: true
    }));
  };

  const restartGame = () => {
    setGameState(prev => resetGameState(prev));
    frameCountRef.current = -1;
  };

  const handleTap = () => {
    if (!gameState.gameStarted || gameState.gameOver || gameState.gameWon) {
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [gameState.showWelcome]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      drawGame(ctx, gameState);
      
      if (gameState.gameStarted && !gameState.showWelcome && !gameState.gameOver) {
        setGameState(prev => updateGameState(prev, frameCountRef.current));
        frameCountRef.current++;
      }
      gameLoopRef.current = requestAnimationFrame(animate);
    };

    gameLoopRef.current = requestAnimationFrame(animate);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        onClick={handleTap}
        onTouchStart={handleTap}
        className="border border-gray-200 rounded-lg shadow-lg"
        tabIndex={0}
      />
      {(gameState.showWelcome || gameState.gameOver || gameState.gameWon) && (
        <div className="absolute left-1/2 bottom-8 -translate-x-1/2">
          <button
            onClick={gameState.showWelcome ? startGame : restartGame}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transform transition hover:scale-105"
          >
            {gameState.showWelcome ? 'Start Game' : 'Play Again'}
          </button>
        </div>
      )}
    </div>
  );
}