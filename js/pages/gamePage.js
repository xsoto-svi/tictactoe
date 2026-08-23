import { BoardComponent } from "../components/boardComponent.js";
import { AlertModal } from "../components/modals/alertModal.js";
import { ConfirmationModal } from "../components/modals/confirmationModal.js";
import { LoadingModal } from "../components/modals/loadingModal.js";
import { Modal } from "../components/modals/modal.js";
import { ResetGameModal } from "../components/modals/resetGameModal.js";
import { GameStatus, PlayerSymbol } from "../game/gameConstants.js";
import { Router } from "../router.js";
import { Page } from "./page.js";

export class GamePage extends Page {
  constructor(appContainer, router, tictactoeApi, gameState) {
    super(appContainer);
    this.router = router;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;
    this.isProcessingMove = false;

    this.gameInterval = null;
    this.rematchInterval = null;
    this.toastTimeout = null;

    this.isGameOverModalPresent = false;

    this.gameBoard = new BoardComponent((index) => this.onCellClick(index));

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.gameStatusBar = document.createElement("div");
    this.errorStatusBar = document.createElement("div");
    this.leaveButton = document.createElement("button");
  }

  setAttributes() {
    this.gameStatusBar.classList.add("status-bar");
    this.errorStatusBar.classList.add("error-bar");
    this.errorStatusBar.textContent = "";

    this.leaveButton.classList.add("btn", "btn-butter");
    this.leaveButton.textContent = "Leave Game";
    this.leaveButton.style.marginTop = "20px";
    this.leaveButton.style.maxWidth = "200px";
  }

  appendElements() {
    this.pageWrapper.append(
      this.gameStatusBar,
      this.errorStatusBar,
      this.gameBoard.getHTML(),
      this.leaveButton
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

    this.leaveButton.addEventListener("click", () => {
      const confirmModal = new ConfirmationModal(
        document.body,
        "Leave Game?",
        "Are you sure you want to quit? This will forfeit the match.",
        () => {
          this.handleLeaveGame();
        },
        () => {
        }
      );
      confirmModal.open();
    });

    this.startGamePoll();
  }

  handleLeaveGame() {
    this.stopAllPolls();

    
    if (this.gameState.roomCode) {
      this.tictactoeApi.resetGame(this.gameState.roomCode).catch(() => {});
    }

    this.router.navigate(Router.Screens.HOME, "back");    
  }

  async onCellClick(index) {
    if (this.isProcessingMove) return;
    if (this.gameState.status !== GameStatus.PLAYING) return;

    if (!this.gameState.isMyTurn) {
      this.showErrorToast("It's not your turn yet.");
      return;
    }

    if (this.gameState.board[index] !== "") {
      this.showErrorToast("That space is already taken!");
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

        if (this.gameState.isGameOver) {
          this.showGameOverModal();
        }

      } else {
        this.showErrorToast("That space is already taken!");
      }
      
    } catch (error) {
      console.log("error = ", error);
      this.showErrorToast("Network Error: Failed to send move.");
    } finally {
      this.isProcessingMove = false;
    }
  }

  updateUI() {
    if (this.gameState.status === GameStatus.WAITING) {
      this.gameStatusBar.textContent = "Waiting for opponent...";
      this.gameStatusBar.classList.remove("my-turn");   
    } else if (this.gameState.status === GameStatus.PLAYING) {
      if (this.gameState.isMyTurn) {
        this.gameStatusBar.textContent = "It's your turn! 🎮";
        this.gameStatusBar.classList.add("my-turn");
      } else {
        this.gameStatusBar.textContent = "Opponent's turn...";
        this.gameStatusBar.classList.remove("my-turn");
      }
    } else if (this.gameState.status === GameStatus.GAME_OVER) {
      this.gameStatusBar.textContent = this.gameState.winner === this.gameState.symbol 
        ? "You Won! 🎉" 
        : "You Lost!";
    } else if (this.gameState.status === GameStatus.DRAW) {
      this.gameStatusBar.textContent = "It's a draw!";
    }

    this.gameState.board.forEach((symbol, index) => {
      this.gameBoard.updateCell(index, symbol);
    });
  }

  showErrorToast(message) {
    this.errorStatusBar.textContent = message;
    this.errorStatusBar.classList.add("show");

    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.errorStatusBar.textContent = "";
      this.errorStatusBar.classList.remove("show");
    }, 2500); // Disappears after 2.5 seconds
  }

  showGameOverModal() {
    if (this.isGameOverModalPresent) {
      return;
    }

    this.isGameOverModalPresent = true;
    const resetGameModal = new ResetGameModal(
      document.body,
      false,
      this.gameState.symbol,
      this.gameState.winner,
      this.gameState.status,
      async () => {
        // Both players generate the exact same next room code deterministically
        const oldRoomCode = this.gameState.roomCode;
        const nextRoomCode = this.gameState.roomCode + "R"; 

        LoadingModal.showLoading("Joining...", "Setting up the rematch.");

        try {
          const newAssignedSymbol = await this.tictactoeApi.createGame(nextRoomCode);
          this.startRematchPoll(oldRoomCode, nextRoomCode, newAssignedSymbol);
        } catch (error) {
          LoadingModal.hideLoading();
          const alert = new AlertModal("Error", "Could not start rematch.");
          alert.open();
        }

        this.isGameOverModalPresent = false;
      },
      () => {
        // Only destroy the room if someone explicitly clicks "Leave"
        this.isGameOverModalPresent = false;
        this.tictactoeApi.resetGame(this.gameState.roomCode);
        this.router.navigate(Router.Screens.HOME);
      }
    );

    resetGameModal.open();
  }

  startRematchPoll(oldRoomCode, nextRoomCode, newAssignedSymbol) {
    this.stopAllPolls();

    this.rematchInterval = setInterval(async () => {
      try {

        // Check if new room is ready
        const isNextRoomReady = await this.tictactoeApi.checkRoomStatus(nextRoomCode);
        
        if (isNextRoomReady === "true") {
          this.stopAllPolls();
          LoadingModal.hideLoading();
          
          // clean-up previous rooms
          if (this.gameState.symbol === PlayerSymbol.O) {
            this.tictactoeApi.resetGame(oldRoomCode).catch(() => {});
          }

          this.gameState.joinRoom(nextRoomCode, newAssignedSymbol);

          this.updateUI();
          this.startGamePoll();
          return;
        }

        // Check if the opponent left the old room
        const oldRoomData = await this.tictactoeApi.boardStatus(oldRoomCode);
        
        if (oldRoomData === "[GAME NOT YET STARTED]") {
          // THE OPPONENT LEFT!
          this.stopAllPolls();
          LoadingModal.hideLoading();
          
          // Clean up the new room so it doesn't stay abandoned on the server
          this.tictactoeApi.resetGame(nextRoomCode).catch(() => {}); 
          
          const alert = new AlertModal("Game Over", "Your opponent left the game.");
          alert.open();
          this.router.navigate(Router.Screens.HOME);
          return;
        }

      } catch (error) {
        this.stopAllPolls();
        LoadingModal.hideLoading();
        const alertModal = new AlertModal("Game Error" , "Connection lost.");
        alertModal.open();
        this.router.navigate(Router.Screens.HOME);
      }
    }, 1000);
  }

  startGamePoll() {
    this.stopAllPolls();

    this.gameInterval = setInterval(async () => {
      try {
        const boardData = await this.tictactoeApi.boardStatus(this.gameState.roomCode);

        if (boardData === "[GAME NOT YET STARTED]") {
          this.stopAllPolls();
          
          const alertModal = new AlertModal("Game Over", "Your opponent left the game.");
          alertModal.open();

          this.router.navigate(Router.Screens.HOME);
          return;
        }

        this.gameState.syncWithServer(boardData);
      
        if (this.gameState.isGameOver) {
          this.stopAllPolls();
          this.showGameOverModal();
        }

        this.updateUI();

      } catch (error) {
        console.log("error:", error);
        this.stopAllPolls();
        
        const alertModal = new AlertModal("Game Disconnected", "The room was closed.");
        alertModal.open();
        this.tictactoeApi.resetGame(this.gameState.roomCode).catch(() => {});
        this.router.navigate(Router.Screens.HOME);
      }
    }, 500);
  }

  stopAllPolls() {
    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.rematchInterval) clearInterval(this.rematchInterval);
  }
}