"use client";

import { useEffect, useState, useRef } from "react";

const BOARD_SIZE = 20;

type Coord = {
  x: number;
  y: number;
};

function generateFoodPosition(snake: Coord[]): Coord {
  let position: Coord;
  do {
    position = {
      x: Math.floor(Math.random() * BOARD_SIZE) + 1,
      y: Math.floor(Math.random() * BOARD_SIZE) + 1,
    };
  } while (snake.some((segment) => segment.x === position.x && segment.y === position.y));
  return position;
}

export default function GameBoard() {
  const [snake, setSnake] = useState<Coord[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Coord>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("right");
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;

  // Función para reiniciar el juego
  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection("right");
    setGameOver(false);
    setGameStarted(false);
  };

  // Movimiento y lógica del juego
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const interval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead: Coord;

        switch (directionRef.current) {
          case "up":
            newHead = { x: head.x, y: head.y === 1 ? BOARD_SIZE : head.y - 1 };
            break;
          case "down":
            newHead = { x: head.x, y: head.y === BOARD_SIZE ? 1 : head.y + 1 };
            break;
          case "left":
            newHead = { x: head.x === 1 ? BOARD_SIZE : head.x - 1, y: head.y };
            break;
          case "right":
            newHead = { x: head.x === BOARD_SIZE ? 1 : head.x + 1, y: head.y };
            break;
        }

        // Detectar choque con el cuerpo
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          setGameStarted(false);
          return prevSnake; // No avanzar más
        }

        const newSnake = [newHead, ...prevSnake];


        if (newHead.x === food.x && newHead.y === food.y) {
          // Crece, no eliminar cola
          setFood(generateFoodPosition(newSnake));
        } else {
          // Mover: eliminar cola
          newSnake.pop();
        }

        return newSnake;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [gameStarted, gameOver, food]);

  // Control de teclas para cambiar dirección
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted || gameOver) return;

      switch (e.key) {
        case "ArrowUp":
          if (directionRef.current !== "down") setDirection("up");
          break;
        case "ArrowDown":
          if (directionRef.current !== "up") setDirection("down");
          break;
        case "ArrowLeft":
          if (directionRef.current !== "right") setDirection("left");
          break;
        case "ArrowRight":
          if (directionRef.current !== "left") setDirection("right");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-20 grid-rows-20 gap-0 border border-white w-[400px] h-[400px]">
        {[...Array(BOARD_SIZE * BOARD_SIZE)].map((_, i) => {
          const x = (i % BOARD_SIZE) + 1;
          const y = Math.floor(i / BOARD_SIZE) + 1;

          const isSnake = snake.some((segment) => segment.x === x && segment.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border border-gray-700 ${
                isSnake ? "bg-green-500" : isFood ? "bg-red-500" : "bg-black"
              }`}
            />
          );
        })}
      </div>

      {/* Mensaje Game Over */}
      {gameOver && (
        <div className="text-red-500 text-2xl font-bold">Game Over!</div>
      )}

      {/* Botón Start / Reset */}
      <button
        onClick={() => {
          if (gameOver) {
            resetGame();
          } else {
            setGameStarted((started) => !started);
          }
        }}
        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
      >
        {gameOver ? "Restart" : gameStarted ? "Pause" : "Start"}
      </button>
    </div>
  );
}
