import { BoardComponent } from "../components/boardComponent.js";
import { ScoreBoardComponent } from "../components/scoreBoardComponent.js";
import { StatusBarComponent } from "../components/statusBarComponent.js";
import { AlertModal } from "../components/modals/alertModal.js";
import { ConfirmationModal } from "../components/modals/confirmationModal.js";
import { LoadingModal } from "../components/modals/loadingModal.js";
import { ResetGameModal } from "../components/modals/resetGameModal.js";
import { GameStatus, PlayerSymbol } from "../game/gameConstants.js";
import { Router } from "../router.js";
import { Page } from "./page.js";
import { GamePollingService } from "../services/gamePollingService.js";

export class GamePage extends Page {
  constructor(appContainer, router, tictactoeApi, gameState) {
    super(appContainer);
    this.router = router;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;
    this.isProcessingMove = false;
    this.isGameOverModalPresent = false;

    this.gameBoard = new BoardComponent((index) => this.onCellClick(index));
    this.scoreBoard = new ScoreBoardComponent();
    this.statusBar = new StatusBarComponent();

    this.pollingService = new GamePollingService(
      this.tictactoeApi,
      this.gameState,
      {
        onOpponentLeft: () => this.handleOpponentLeft(),
        onGameOver: () => this.showGameOverModal(),
        onGameStateUpdate: () => this.updateUI(),
        onError: (title, msg, disconnect) =>
          this.handleError(title, msg, disconnect),
        onRematchReady: (oldCode, nextCode, symbol) =>
          this.handleRematchReady(oldCode, nextCode, symbol),
        onOpponentLeftRematch: (nextCode) =>
          this.handleOpponentLeftRematch(nextCode),
      },
    );

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.leaveButton = document.createElement("button");
  }

  setAttributes() {
    this.leaveButton.classList.add("btn", "btn-butter");
    this.leaveButton.textContent = "Leave Game";
    this.leaveButton.style.marginTop = "20px";
    this.leaveButton.style.maxWidth = "200px";

    this.scoreBoard.update(this.gameState);
    this.statusBar.update(this.gameState);
  }

  appendElements() {
    this.pageWrapper.append(
      this.scoreBoard.getHTML(),
      this.statusBar.getHTML(),
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

    this.pollingService.startGamePoll();
  }

  handleLeaveGame(roomCode) {
    this.pollingService.stopAllPolls();

    if (roomCode) {
      this.tictactoeApi.resetGame(roomCode).catch(() => {});
    }

    this.gameState.resetScore();

    this.router.navigate(Router.Screens.HOME, "back");
  }

  handleOpponentLeft() {
    const alertModal = new AlertModal(
      "Game Over",
      "Your opponent left the game.",
    );
    alertModal.open();
    this.handleLeaveGame();
  }

  handleError(title, message, disconnect) {
    LoadingModal.hideLoading();
    const alertModal = new AlertModal(title, message);
    alertModal.open();

    if (disconnect) {
      this.handleLeaveGame(this.gameState.roomCode);
    } else {
      this.router.navigate(Router.Screens.HOME);
    }
  }

  async onCellClick(index) {
    if (this.isProcessingMove) return;
    if (this.gameState.status !== GameStatus.PLAYING) return;

    if (!this.gameState.isMyTurn) {
      this.statusBar.showError("It's not your turn yet.");
      return;
    }

    if (this.gameState.board[index] !== "") {
      this.statusBar.showError("That space is already taken!");
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
        this.statusBar.showError("That space is already taken!");
      }
    } catch (error) {
      this.statusBar.showError("Network Error: Failed to send move.");
    } finally {
      this.isProcessingMove = false;
    }
  }

  updateUI() {
    this.statusBar.update(this.gameState);
    this.scoreBoard.update(this.gameState);

    this.gameState.board.forEach((symbol, index) => {
      this.gameBoard.updateCell(index, symbol);
    });
  }

  showGameOverModal() {
    if (this.isGameOverModalPresent) return;

    this.isGameOverModalPresent = true;
    const resetGameModal = new ResetGameModal(
      document.body,
      false,
      this.gameState.symbol,
      this.gameState.winner,
      this.gameState.status,
      async () => {
        const oldRoomCode = this.gameState.roomCode;
        const nextRoomCode = this.gameState.roomCode + "R";

        LoadingModal.showLoading("Joining...", "Setting up the rematch.");

        try {
          const newAssignedSymbol =
            await this.tictactoeApi.createGame(nextRoomCode);
          this.pollingService.startRematchPoll(
            oldRoomCode,
            nextRoomCode,
            newAssignedSymbol,
          );
        } catch (error) {
          LoadingModal.hideLoading();
          const alert = new AlertModal("Error", "Could not start rematch.");
          alert.open();
        }

        this.isGameOverModalPresent = false;
      },
      () => {
        this.isGameOverModalPresent = false;
        this.handleLeaveGame(this.gameState.roomCode);
      },
    );

    resetGameModal.open();
  }

  handleRematchReady(oldRoomCode, nextRoomCode, newAssignedSymbol) {
    LoadingModal.hideLoading();

    if (this.gameState.symbol === PlayerSymbol.O) {
      this.tictactoeApi.resetGame(oldRoomCode).catch(() => {});
    }

    this.gameState.joinRoom(nextRoomCode, newAssignedSymbol);

    this.scoreBoard.update(this.gameState);
    this.updateUI();
    this.pollingService.startGamePoll();
  }

  handleOpponentLeftRematch(nextRoomCode) {
    LoadingModal.hideLoading();
    this.handleLeaveGame(nextRoomCode); // Clean up the new room
    const alert = new AlertModal("Game Over", "Your opponent left the game.");
    alert.open();
  }
}
