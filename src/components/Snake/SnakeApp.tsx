import React, { useState, useEffect, useRef, useCallback } from "react";
import "./SnakeApp.css";

const snakeLogo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='10' y='30' width='20' height='20' fill='%2322c55e'/%3E%3Crect x='30' y='30' width='20' height='20' fill='%2322c55e'/%3E%3Crect x='50' y='30' width='20' height='20' fill='%2322c55e'/%3E%3Crect x='50' y='50' width='20' height='20' fill='%2322c55e'/%3E%3Crect x='50' y='70' width='20' height='20' fill='%2322c55e'/%3E%3C/svg%3E";

const SnakeApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState([{ x: 200, y: 200 }]);
  const [food, setFood] = useState({ x: 100, y: 100 });
  const [direction, setDirection] = useState("RIGHT");
  const [score, setScore] = useState(0);
  const [visible, setVisible] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(3);
  const boxSize = 20;
  const canvasSize = 400;

  // Draw the game
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, boxSize, boxSize);

    // Draw the snake
    ctx.fillStyle = "green";
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
    });
  }, [snake, food]);

  // Generate new food position
  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
    const y = Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize;
    setFood({ x, y });
  }, []);

  // Move the snake
  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= boxSize;
        break;
      case "DOWN":
        head.y += boxSize;
        break;
      case "LEFT":
        head.x -= boxSize;
        break;
      case "RIGHT":
        head.x += boxSize;
        break;
    }

    newSnake.unshift(head);

    // Check if the snake eats the food
    if (head.x === food.x && head.y === food.y) {
      setScore((prev) => prev + 1);
      generateFood();
    } else {
      newSnake.pop(); // Remove the tail if no food is eaten
    }

    setSnake(newSnake);
  }, [snake, direction, food, generateFood]);

  // Check for collisions
  const checkCollision = useCallback(() => {
    const head = snake[0];

    // Check wall collisions
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
      return true;
    }

    // Check self-collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }

    return false;
  }, [snake]);

  // Handle keyboard input
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
        if (direction !== "DOWN") setDirection("UP");
        break;
      case "ArrowDown":
        if (direction !== "UP") setDirection("DOWN");
        break;
      case "ArrowLeft":
        if (direction !== "RIGHT") setDirection("LEFT");
        break;
      case "ArrowRight":
        if (direction !== "LEFT") setDirection("RIGHT");
        break;
    }
  };

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    if (countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => setCountdown(null), 0);
        return () => clearTimeout(timer);
      }
      return;
    }
    const interval = setInterval(() => {
      if (checkCollision()) {
        setGameOver(true);
      } else {
        moveSnake();
        drawGame();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver, countdown, checkCollision, moveSnake, drawGame]);

  // Add keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

    return (
      <>
        <button
          onClick={() => !visible && setVisible(true)}
          className="snake-button"
          aria-label="Open Snake Game"
        >
          <img src={snakeLogo} alt="Snake Logo" className="snake-logo" />
        </button>
        {visible && (
          <div className="snake-modal">
            <button
              className="snake-close-btn"
              onClick={() => setVisible(false)}
              aria-label="Close Snake Game"
            >
              ×
            </button>
            <p className="snake-score">Score: {score}</p>
            <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
            {countdown !== null && (
              <div className="countdown-overlay">
                <h2 className="countdown-text">{countdown === 0 ? "Go!" : countdown}</h2>
              </div>
            )}
            {gameOver && (
              <div className="game-over-overlay">
                <h2>Game Over!</h2>
                <p className="final-score">Your score: {score}</p>
                <button
                  className="play-again-btn"
                  onClick={() => {
                    setSnake([{ x: 200, y: 200 }]);
                    setFood({ x: 100, y: 100 });
                    setDirection("RIGHT");
                    setScore(0);
                    setGameOver(false);
                    setCountdown(3);
                  }}
                >
                  Play Again
                </button>
              </div>
            )}
          </div>
        )}
      </>
    );
};

export default SnakeApp;