import { GameStatus, PlayerSymbol } from "./gameConstants.js";

export class GameState {
  constructor() {
    this.roomCode = null;
    this.symbol = null;

    this.board = Array(9).fill("");
    this.status = GameStatus.WAITING;
    this.winner = null;
  }

  _updateBoard(newBoardArray) {
    if (this.board.join() === newBoardArray.join()) {
      return false;
    }
    
    this.board = newBoardArray;
    this.evaluateGameStatus();

    return this.isGameOver;
  }

  joinRoom(roomCode, tile) {
    this.roomCode = roomCode;
    this.symbol = tile;
    this.resetLocalBoard();
  }

  getApiCoordinates(index) {
    return {
      x: index % 3,
      y: Math.floor(index / 3),
    };
  }

  syncWithServer(serverBoardData) {
    const nextBoard = serverBoardData.split(":").slice(0, 9);

    return this._updateBoard(nextBoard);
  }

  applyLocalMove(index) {
    if (this.board[index] === "" && this.status === GameStatus.PLAYING) {

      const nextBoard = [...this.board];
      nextBoard[index] = this.symbol;

      return this._updateBoard(nextBoard);
    }

    return false;
  }

  evaluateGameStatus() {
    const winningLines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Horizontal rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Vertical columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];

    for (let line of winningLines) {
      const [a, b, c] = line;

      if (
        this.board[a] !== "" &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];

        this.status = GameStatus.GAME_OVER;

        return;
      }
    }

    if (!this.board.includes("")) {
      this.status = GameStatus.DRAW;
    }
  }

  resetLocalBoard() {
    this.board = Array(9).fill("");
    this.status = GameStatus.PLAYING;
    this.winner = null;
  }

  get isGameOver() {
    return this.status === GameStatus.GAME_OVER || this.status === GameStatus.DRAW;
  }

  get isMyTurn() {
    if (this.status !== GameStatus.PLAYING) return false;

    const xCount = this.board.filter((cell) => cell === PlayerSymbol.X).length;
    const oCount = this.board.filter((cell) => cell === PlayerSymbol.O).length;

    // Assuming X always makes the first move
    const activeTurnSymbol = xCount <= oCount ? PlayerSymbol.X : PlayerSymbol.O;

    return this.symbol === activeTurnSymbol;
  }
}
