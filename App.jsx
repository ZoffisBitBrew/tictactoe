import React, { use, useState } from "react";
import ItemSlot from "./assets/ItemSlot.svg";

function App() {
  //Create State of Board 3x3 as an Array filled with "null"
  const [board, setBoard] = useState(Array(9).fill(null));
  //Create State of klick in a field
  const [isXTurn, setIsXTurn] = useState(true);
  //Create State of the winning Squares for changing the BG-Color
  const [winnerSquares, setWinnerSquares] = useState([]);
  const [startGame, setStartGame] = useState(true);
  //Play against a easy Bot
  const [isBotActive, setIsBotActive] = useState(true);
  //Set winning Comninations
  const winningCombinations = [
    //Horizontal winning lines
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    //Vertical winning lines
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    //Diagonal winning lines
    [0, 4, 8],
    [2, 4, 6],
  ];
  //Create Function easy BotAI
  function makeBotMove(currentBoard) {
    const emptyIndices = currentBoard
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (emptyIndices.length === 0) return;

    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

    const newBoard = [...currentBoard];
    newBoard[randomIndex] = "O"; // Bot ist O
    setBoard(newBoard);
    setIsXTurn(true);

    const winnerCombo = getWinner(newBoard)[0];
    if (winnerCombo) {
      setWinnerSquares(winnerCombo);
    }
  }
  //Create winner Functions. Check if there is a winner
  function getWinner(squares) {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      //Check if the Value at the is the same at the others
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return [combination, squares[a]];
    }
    return [null, null];
  }

  //Function of handleScuareclick
  const handleSquareClick = function (index) {
    if (board[index] || getWinner(board)[0]) return; //Check if there is a value at the index of the Array or is the Game allready winning
    setStartGame(false);
    console.log(startGame);
    const updateBoard = [...board];
    updateBoard[index] = isXTurn ? "X" : "O";
    setBoard(updateBoard);
    setIsXTurn(!isXTurn);
    const winnerCombo = getWinner(updateBoard)[0];
    if (winnerCombo) {
      setWinnerSquares(winnerCombo);
      return;
    }

    if (isXTurn && isBotActive) {
      setTimeout(() => makeBotMove(updateBoard), 500);
    }
  };

  // Create Function to check the current Game Status
  function getGameStatus() {
    const winner = getWinner(board)[1]; //returns the Winner X or O or null
    if (winner) return `Winner: ${winner}`;
    //Check if its a draw (every checks the Array that consist a specific value -> in this case here checks an Arrow funktion that there is no null in the array)
    if (board.every((square) => square !== null)) {
      return "It's a draw";
    }
    return `Next Player: ${isXTurn ? "X" : "O"}`;
  }

  //Create Function to reset Game
  function resetGame() {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinnerSquares([]);
    setStartGame(true);
  }
  const isGameOver = winnerSquares.length > 0;
  return (
    <div className="min-h-screen bg-[#06213b] flex items-center justify-center">
      <div className="w-full max-w-[400px] mx-5">
        <h1 className="text-5xl font-semibold text-white mb-8 text-center">
          Tic Tac Toe
        </h1>
        <div className="my-3 flex items-center justify-between text-2xl font-medium text-gray-400">
          <div className="ml-10 flex-1 text-center">{getGameStatus()}</div>

          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isBotActive}
              onChange={() =>
                setIsBotActive((prev) => (startGame ? !prev : prev))
              }
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Against AI
            </span>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden mb-6">
          {board.map((square, index) => (
            <button
              key={index}
              onClick={() => handleSquareClick(index)}
              className={`relative h-32 w-full p-0 transition-colors duration-200
    ${winnerSquares.includes(index) ? "bg-green-900" : "bg-gray-800"}
    ${!winnerSquares.includes(index) && !isGameOver ? "hover:bg-gray-700" : ""}
    border-none
  `}
            >
              {/* SVG im Hintergrund */}
              <img
                src={ItemSlot}
                alt="Item Slot"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              />

              {/* Text im Vordergrund */}
              {square && (
                <span
                  className={`relative z-10 flex h-full w-full items-center justify-center text-6xl font-light ${
                    square === "X" ? "text-white" : "text-slate-400"
                  }`}
                >
                  {square}
                </span>
              )}
            </button>
          ))}
        </div>
        <div>
          <button
            onClick={resetGame}
            className="w-full py-3 text-lg text-white border rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-colors duration-200"
          >
            Reset Game
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
export default App;
