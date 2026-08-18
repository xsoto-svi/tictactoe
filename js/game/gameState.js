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
      y: Math.floor(index / 3)  
    };
  }

  syncWithServer(serverBoardData) {
    this.board = serverBoardData;
    this.evaluateGameStatus();
  }

  // Called immediately when the user clicks a cell (Optimistic UI)
  applyLocalMove(index) {
    if (this.board[index] === "" && this.status === "playing") {
      this.board[index] = this.symbol;
      this.evaluateGameStatus(); // <-- Check if our move won the game
    }
  }

  evaluateGameStatus() {
    // The 8 possible winning combinations (indexes in a 1D array)
    const winningLines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontal rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Vertical columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // 1. Check for a Winner
    for (let line of winningLines) {
      const [a, b, c] = line;
      
      // If cell A is not empty, and A matches B, and A matches C
      if (
        this.board[a] !== "" && 
        this.board[a] === this.board[b] && 
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        this.status = this.winner === this.symbol ? "won" : "lost";
        return; // Stop checking, the game is over!
      }
    }

    // 2. Check for a Draw (No empty strings left)
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