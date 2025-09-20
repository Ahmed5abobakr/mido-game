import React, { useState, useEffect, useRef } from "react";

export default function SnakeGame() {
  const boardSize = 15;
  const initialSnake = [{ x: 5, y: 5 }];
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState({ x: 8, y: 8 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameBoardRef = useRef(null);

  const getRandomFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      };
    } while (snake.some((seg) => seg.x === newFood.x && seg.y === newFood.y));
    return newFood;
  };

  const moveSnake = () => {
    setSnake((prev) => {
      const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };

      if (
        head.x < 0 ||
        head.x >= boardSize ||
        head.y < 0 ||
        head.y >= boardSize ||
        prev.some((seg) => seg.x === head.x && seg.y === head.y)
      ) {
        setGameOver(true);
        return prev;
      }

      let newSnake = [head, ...prev];
      if (head.x === food.x && head.y === food.y) {
        setScore((s) => s + 1);
        setFood(getRandomFood());
      } else {
        newSnake.pop();
      }
      return newSnake;
    });
  };

  const startGame = () => {
    setSnake(initialSnake);
    setFood(getRandomFood());
    setDir({ x: 1, y: 0 });
    setScore(0);
    setGameOver(false);
    gameBoardRef.current.focus();
  };

  const handleKey = (e) => {
    if (e.key === "ArrowUp" && dir.y === 0) setDir({ x: 0, y: -1 });
    else if (e.key === "ArrowDown" && dir.y === 0) setDir({ x: 0, y: 1 });
    else if (e.key === "ArrowLeft" && dir.x === 0) setDir({ x: -1, y: 0 });
    else if (e.key === "ArrowRight" && dir.x === 0) setDir({ x: 1, y: 0 });
  };

  // نفس الفكرة لكن للأزرار على الموبايل
  const handleButton = (direction) => {
    if (direction === "up" && dir.y === 0) setDir({ x: 0, y: -1 });
    else if (direction === "down" && dir.y === 0) setDir({ x: 0, y: 1 });
    else if (direction === "left" && dir.x === 0) setDir({ x: -1, y: 0 });
    else if (direction === "right" && dir.x === 0) setDir({ x: 1, y: 0 });
  };

  useEffect(() => {
    if (!gameOver) {
      const interval = setInterval(moveSnake, 200);
      return () => clearInterval(interval);
    }
  }, [dir, gameOver]);

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h1>🐍 لعبة الثعبان </h1>
      <p>النتيجة: {score}</p>
      <div
        tabIndex={0}
        ref={gameBoardRef}
        onKeyDown={handleKey}
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${boardSize}, 20px)`,
          gap: "1px",
          backgroundColor: "#333",
          margin: "10px auto",
          width: boardSize * 21,
          outline: "none",
        }}
      >
        {Array.from({ length: boardSize * boardSize }).map((_, i) => {
          const x = i % boardSize;
          const y = Math.floor(i / boardSize);
          const isSnake = snake.some((seg) => seg.x === x && seg.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              style={{
                width: 20,
                height: 20,
                backgroundColor: isSnake ? "green" : isFood ? "red" : "black",
              }}
            />
          );
        })}
      </div>

      {gameOver ? (
        <div>
          <h2 style={{ color: "red" }}>انتهت اللعبة!</h2>
          <button onClick={startGame}>إعادة اللعب</button>
        </div>
      ) : (
        <button onClick={startGame}>ابدأ اللعبة</button>
      )}

      {/* 👇 أزرار التحكم للموبايل */}
      <div style={{ marginTop: 20 }}>
        <div>
          <button onClick={() => handleButton("up")} style={{width:40 , height:40 , padding:40 , margin:20}}>⬆️</button>
        </div>
        <div>
          <button onClick={() => handleButton("left")} style={{width:40 , height:40 , padding:40 , margin:20}}>⬅️</button>
          <button onClick={() => handleButton("down")} style={{width:40 , height:40 , padding:40 , margin:20}}>⬇️</button>
          <button onClick={() => handleButton("right")} style={{width:40 , height:40 , padding:40 , margin:20}}>➡️</button>
        </div>
      </div>
    </div>
  );
}
