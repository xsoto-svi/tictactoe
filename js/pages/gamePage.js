import { BoardComponent } from "../components/boardComponent.js";
import { AlertModal } from "../components/modals/alertModal.js";
import { Modal } from "../components/modals/modal.js";
import { ResetGameModal } from "../components/modals/resetGameModal.js";
import { Page } from "./page.js";

export class GamePage extends Page {
  constructor(appContainer, router, tictactoeApi, gameState) {
    super(appContainer);
    this.router = router;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;
    this.isProcessingMove = false;

    this.gameBoard = new BoardComponent((index) => this.onCellClick(index));

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.title = document.createElement("h1");
    this.gameStatusBar = document.createElement("div");
    this.gameStatusText = document.createElement("p");

    this.errorStatusBar = document.createElement("div");
    this.errorStatusBarText = document.createElement("p");
  }

  setAttributes() {
    this.title.classList.add("title");
    this.title.textContent = "Tic-Tac-Toe";
    
    this.gameStatusBar.classList.add("status-bar");
    this.errorStatusBar.classList.add("error-bar")
    this.errorStatusBarText.textContent = ""
  }

  appendElements() {
    this.pageWrapper.append(
      this.title,
      this.gameStatusBar,
      this.errorStatusBar,
      this.gameBoard.getHTML(),
    );
  }

  attachEvents() {
    // When a player leaves
    window.addEventListener("beforeunload", () => {
      if (this.gameState.roomCode) {
        this.tictactoeApi.resetGame(this.gameState.roomCode, {
          keepalive: true,
        });
      }
    });

    // Polls if room still exists
    const boardInterval = setInterval(async () => {
      try {
        const boardData = await this.tictactoeApi.boardStatus(
          this.gameState.roomCode,
        );

        if (boardData === "[GAME NOT YET STARTED]") {
          clearInterval(boardInterval);
          
          const alertModal = new AlertModal("Game Over", "Your opponent left the game.");
          alertModal.open();

          this.router.navigate("/");
          return;
        }

        this.gameState.syncWithServer(boardData);
        this.updateUI(); // BUGFIX: Modal duplication

      } catch (error) {
        console.log("error:", error);
        clearInterval(boardInterval);
        
        const alertModal = new AlertModal("Game Disconnected", "The room was closed.");
        alertModal.open();
        this.tictactoeApi.resetGame(this.gameState.roomCode).catch(() => {
          console.log("Could not reset game; server is unreachable.");
        });
        this.router.navigate("/");
      }
    }, 500);
  }

  async onCellClick(index) {
    console.log("--- CLICK DETECTED ---");
    console.log("1. isProcessingMove:", this.isProcessingMove);
    console.log("2. Game Status:", this.gameState.status);
    console.log("3. My Symbol:", this.gameState.symbol);
    console.log("4. isMyTurn:", this.gameState.isMyTurn);
    console.log("5. Cell Content:", `"${this.gameState.board[index]}"`);

    if (this.isProcessingMove) return;
    if (this.gameState.status !== "playing") return;

    if (!this.gameState.isMyTurn) {
      const alertModal = new AlertModal("Hold on!", "It is not your turn yet.");
      alertModal.open();
      return;
    }

    if (this.gameState.board[index] !== "") {
      const alertModal = new AlertModal("Invalid Move", "That space is already taken!");
      alertModal.open();
      return;
    }

    this.isProcessingMove = true;

    try {
      const coords = this.gameState.getApiCoordinates(index);

      const response = await this.tictactoeApi.updateToAddMove(
        this.gameState.roomCode,
        this.gameState.symbol,
        coords.x,
        coords.y,
      );

      if (response !== "[TAKEN]") {
        this.gameState.applyLocalMove(index);
        this.updateUI();
      } else {
        const alertModal = new AlertModal("Invalid Move", "That space is already taken!");
        alertModal.open();
      }
      
    } catch (error) {
      console.log("error = ", error);
      const alertModal = new AlertModal("Network Error", "Failed to send move.");
      alertModal.open();
    } finally {
      this.isProcessingMove = false;
    }
  }

  updateUI() {
    if (this.gameState.status === "waiting") {
      this.gameStatusBar.textContent = "Waiting for opponent...";
    } else if (this.gameState.status === "playing") {
      this.gameStatusBar.textContent = this.gameState.isMyTurn 
        ? "It's your turn" 
        : "Opponent's turn...";
    } else if (this.gameState.status === "won") {

      const gameOverModal = new ResetGameModal(
        document.body,
        false,
        this.symbol,
        this.gameState.status,
        () => {                         
          this.tictactoeApi.resetGame(this.gameState.roomCode);
          this.isGameOverModalOpen = false;
        },
        () => {
          this.tictactoeApi.resetGame(this.gameState.roomCode);
          this.router.navigate("/");
        }
      )
      gameOverModal.open();

      this.gameStatusBar.textContent = this.gameState.winner === this.gameState.symbol 
        ? "You Won! 🎉" 
        : "You Lost!";
    } else if (this.gameState.status === "draw") {
      this.gameStatusBar.textContent = "It's a draw!";
    }

    this.gameState.board.forEach((symbol, index) => {
      this.gameBoard.updateCell(index, symbol);
    });
  }
}
