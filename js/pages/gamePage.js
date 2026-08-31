import { BoardComponent } from "../components/boardComponent.js";
import { AlertModal } from "../components/modals/alertModal.js";
import { ConfirmationModal } from "../components/modals/confirmationModal.js";
import { LoadingModal } from "../components/modals/loadingModal.js";
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
    this.scoreBoard = document.createElement("div");

    this.playerIcon = document.createElement("img");
    this.playerScoreCard = document.createElement("div");
    this.playersScore = document.createElement("span");

    this.vsDivider = document.createElement("span");

    this.opponentScoreCard = document.createElement("div");
    this.opponentsScore = document.createElement("span");
    this.opponentIcon = document.createElement("img");

    this.gameStatusBar = document.createElement("div");
    this.errorStatusBar = document.createElement("div");
    this.leaveButton = document.createElement("button");
  }

  setAttributes() {
    this.scoreBoard.classList.add("score-board");
    this.playerScoreCard.classList.add("score-card-item");
    this.opponentScoreCard.classList.add("score-card-item");

    this.playerIcon.classList.add("score-symbol-icon");
    this.opponentIcon.classList.add("score-symbol-icon");

    this.vsDivider.classList.add("score-vs");
    this.vsDivider.textContent = "VS";

    this.gameStatusBar.classList.add("status-bar");
    this.errorStatusBar.classList.add("error-bar");
    this.errorStatusBar.textContent = "";

    this.leaveButton.classList.add("btn", "btn-butter");
    this.leaveButton.textContent = "Leave Game";
    this.leaveButton.style.marginTop = "20px";
    this.leaveButton.style.maxWidth = "200px";

    this.updateScoreDisplay();
  }

  appendElements() {
    this.playerScoreCard.append(this.playersScore);
    this.opponentScoreCard.append(this.opponentsScore);

    this.scoreBoard.append(
      this.playerIcon,
      this.playerScoreCard,
      this.vsDivider,
      this.opponentScoreCard,
      this.opponentIcon,
    );

    this.pageWrapper.append(
      this.scoreBoard,
      this.gameStatusBar,
      this.errorStatusBar,
      this.gameBoard.getHTML(),
      this.leaveButton,
    );
  }

  attachEvents() {
    window.addEventListener("beforeunload", () => {
      this.handleLeaveGame(this.gameState.roomCode);
    });

    this.leaveButton.addEventListener("click", () => {
      const confirmModal = new ConfirmationModal(
        document.body,
        "Leave Game?",
        "Are you sure you want to quit? This will forfeit the match.",
        () => {
          this.handleLeaveGame(this.gameState.roomCode);
        },
        () => {},
      );
      confirmModal.open();
    });

    this.startGamePoll();
  }

  handleLeaveGame(roomCode) {
    this.stopAllPolls();

    if (roomCode) {
      this.tictactoeApi.resetGame(roomCode).catch(() => {});
    }

    this.gameState.resetScore();

    this.router.navigate(Router.Screens.HOME, "back");
  }

  updateScoreDisplay() {
    this.playersScore.textContent = `Player: ${this.gameState.playerScore}`;
    this.opponentsScore.textContent = `Opponent: ${this.gameState.opponentScore}`;

    const opponentSymbol =
      this.gameState.symbol === PlayerSymbol.X
        ? PlayerSymbol.O
        : PlayerSymbol.X;

    if (this.gameState.symbol) {
      this.playerIcon.src =
        this.gameState.symbol === PlayerSymbol.X
          ? "../assets/x-icon.svg"
          : "../assets/o-icon.svg";
      this.opponentIcon.src =
        opponentSymbol === PlayerSymbol.X
          ? "../assets/x-icon.svg"
          : "../assets/o-icon.svg";
    }
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
      this.gameStatusBar.textContent =
        this.gameState.winner === this.gameState.symbol
          ? "You Won! 🎉"
          : "You Lost!";
    } else if (this.gameState.status === GameStatus.DRAW) {
      this.gameStatusBar.textContent = "It's a draw!";
    }

    this.updateScoreDisplay();

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
    }, 2500);
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
          const newAssignedSymbol =
            await this.tictactoeApi.createGame(nextRoomCode);
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
        this.handleLeaveGame(this.gameState.roomCode);
      },
    );

    resetGameModal.open();
  }

  startRematchPoll(oldRoomCode, nextRoomCode, newAssignedSymbol) {
    this.stopAllPolls();

    let isPollingInProgress = false;

    const poll = async () => {
      if (isPollingInProgress) return;
      isPollingInProgress = true;

      try {
        const isNextRoomReady =
          await this.tictactoeApi.checkRoomStatus(nextRoomCode);

        if (isNextRoomReady === "true") {
          this.stopAllPolls();
          LoadingModal.hideLoading();

          if (this.gameState.symbol === PlayerSymbol.O) {
            this.tictactoeApi.resetGame(oldRoomCode).catch(() => {});
          }

          this.gameState.joinRoom(nextRoomCode, newAssignedSymbol);

          this.updateScoreDisplay();
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
          this.handleLeaveGame(nextRoomCode); // Clean up the new room so it doesn't stay abandoned on the server
          const alert = new AlertModal(
            "Game Over",
            "Your opponent left the game.",
          );
          alert.open();
          return;
        }
      } catch (error) {
        this.stopAllPolls();
        LoadingModal.hideLoading();
        const alertModal = new AlertModal("Game Error", "Connection lost.");
        alertModal.open();
        this.router.navigate(Router.Screens.HOME);
        return;
      } finally {
        isPollingInProgress = false;
      }

      this.rematchInterval = setTimeout(poll, 1000);
    };

    poll();
  }

  startGamePoll() {
    this.stopAllPolls();

    let isPollingInProgress = false;

    const poll = async () => {
      if (isPollingInProgress) return;
      isPollingInProgress = true;

      try {
        const boardData = await this.tictactoeApi.boardStatus(
          this.gameState.roomCode,
        );

        if (boardData === "[GAME NOT YET STARTED]") {
          this.stopAllPolls();
          const alertModal = new AlertModal(
            "Game Over",
            "Your opponent left the game.",
          );
          alertModal.open();
          this.handleLeaveGame();
          return;
        }

        this.gameState.syncWithServer(boardData);

        if (this.gameState.isGameOver) {
          this.stopAllPolls();
          this.showGameOverModal();
          return;
        }

        this.updateUI();
      } catch (error) {
        this.stopAllPolls();
        const alertModal = new AlertModal(
          "Game Disconnected",
          "The room was closed.",
        );
        alertModal.open();
        this.handleLeaveGame(this.gameState.roomCode);
        return;
      } finally {
        isPollingInProgress = false;
      }

      this.gameInterval = setTimeout(poll, 500);
    };

    poll();
  }

  stopAllPolls() {
    if (this.gameInterval) {
      clearTimeout(this.gameInterval);
      this.gameInterval = null;
    }
    if (this.rematchInterval) {
      clearTimeout(this.rematchInterval);
      this.rematchInterval = null;
    }
  }
}
