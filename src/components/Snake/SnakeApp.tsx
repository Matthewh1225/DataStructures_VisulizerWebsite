import React, { useState, useEffect, useRef, useCallback } from "react";
import "./SnakeApp.css";


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

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="snake-button"
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          margin: 0,
          boxShadow: 'none',
          cursor: 'pointer',
        }}
        aria-label="Open Snake Game"
      >
        🐍
      </button>
    );
  }

  return (
    <div className="snake-game" style={{ position: "relative", display: "inline-block" }}>
      <button
        className="close-btn"
        style={{ position: "absolute", top: 8, right: 8, zIndex: 2 }}
        onClick={() => setVisible(false)}
        aria-label="Close Snake Game"
      >
        ×
      </button>
      <h1>Snake Game</h1>
      <p>Score: {score}</p>
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize}></canvas>
      {countdown !== null && (
        <div className="countdown-overlay" style={{ position: "absolute", top: 0, left: 0, width: canvasSize, height: canvasSize, background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 3 }}>
          <h2 style={{ color: "white", fontSize: "48px" }}>{countdown === 0 ? "Go!" : countdown}</h2>
        </div>
      )}
      {gameOver && (
        <div className="game-over-overlay" style={{ position: "absolute", top: 0, left: 0, width: canvasSize, height: canvasSize, background: "rgba(0,0,0,0.7)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 4 }}>
          <h2 style={{ color: "white" }}>Game Over!</h2>
          <p style={{ color: "white" }}>Your score: {score}</p>
          <button
            onClick={() => {
              setSnake([{ x: 200, y: 200 }]);
              setFood({ x: 100, y: 100 });
              setDirection("RIGHT");
              setScore(0);
              setGameOver(false);
              setCountdown(3);
            }}
            style={{ padding: "10px 20px", fontSize: "16px", marginTop: "10px" }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SnakeApp;