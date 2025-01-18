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

  const handleTap = () => {
    if (gameState.gameOver || gameState.gameWon) {
      setGameState(prev => resetGameState(prev));
      frameCountRef.current = -1;
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
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const animate = () => {
      drawGame(ctx, gameState);
      
      if (!gameState.gameOver) {
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
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      onClick={handleTap}
      onTouchStart={handleTap}
      className="border border-gray-200 rounded-lg shadow-lg"
    />
  );
}