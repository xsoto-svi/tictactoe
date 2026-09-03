import { Component } from "./core/component.js";
import { GameStatus } from "../game/gameConstants.js";

export class StatusBarComponent extends Component {
  constructor() {
    super();
    this.toastTimeout = null;
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.gameStatusBar = document.createElement("div");
    this.errorStatusBar = document.createElement("div");
  }

  setAttributes() {
    this.componentContainer.classList.add("status-bar-wrapper");

    this.gameStatusBar.classList.add("status-bar");
    this.errorStatusBar.classList.add("error-bar");
    this.errorStatusBar.textContent = "";
  }

  appendElements() {
    this.componentContainer.append(this.gameStatusBar, this.errorStatusBar);
  }

  update(gameState) {
    if (gameState.status === GameStatus.WAITING) {
      this.gameStatusBar.textContent = "Waiting for opponent...";
      this.gameStatusBar.classList.remove("my-turn");
    } else if (gameState.status === GameStatus.PLAYING) {
      if (gameState.isMyTurn) {
        this.gameStatusBar.textContent = "It's your turn! 🎮";
        this.gameStatusBar.classList.add("my-turn");
      } else {
        this.gameStatusBar.textContent = "Opponent's turn...";
        this.gameStatusBar.classList.remove("my-turn");
      }
    } else if (gameState.status === GameStatus.GAME_OVER) {
      this.gameStatusBar.textContent =
        gameState.winner === gameState.symbol ? "You Won! 🎉" : "You Lost!";
    } else if (gameState.status === GameStatus.DRAW) {
      this.gameStatusBar.textContent = "It's a draw!";
    }
  }

  showError(message) {
    this.errorStatusBar.textContent = message;
    this.errorStatusBar.classList.add("show");

    if (this.toastTimeout) clearTimeout(this.toastTimeout);

    this.toastTimeout = setTimeout(() => {
      this.errorStatusBar.textContent = "";
      this.errorStatusBar.classList.remove("show");
    }, 2500);
  }
}
