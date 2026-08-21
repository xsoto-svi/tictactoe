export class GameState {
  constructor() {
    this.roomCode = null;
    this.symbol = null;

    this.board = Array(9).fill("");
    this.status = "waiting"; // "waiting", "playing", "won", "lost", "draw"
    this.winner = null;
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
    this.board = serverBoardData.split(":").slice(0,9);
    this.evaluateGameStatus();
  }

  get isMyTurn() {
    if (this.status !== "playing") return false;

    const xCount = this.board.filter((cell) => cell === "X").length;
    const oCount = this.board.filter((cell) => cell === "O").length;

    // Assuming X always makes the first move
    const activeTurnSymbol = xCount <= oCount ? "X" : "O";

    return this.symbol === activeTurnSymbol;
  }

  applyLocalMove(index) {
    if (this.board[index] === "" && this.status === "playing") {
      this.board[index] = this.symbol;
      this.evaluateGameStatus();
    }
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
        this.status = this.winner === this.symbol ? "won" : "lost";
        return;
      }
    }

    if (!this.board.includes("")) {
      this.status = "draw";
    }
  }

  resetLocalBoard() {
    this.board = Array(9).fill("");
    this.status = "playing";
    this.winner = null;
  }
}
