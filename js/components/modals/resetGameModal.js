import { GameStatus, PlayerSymbol } from "../../game/gameConstants.js";
import { Modal } from "./modal.js";

export class ResetGameModal extends Modal {
  constructor(
    container,
    isDismissible,
    symbol,
    winner,
    status,
    onPlayAgain,
    onLeave
  ) {
    super(container, isDismissible);

    this.symbol = symbol;
    this.winner = winner;
    this.status = status;
    this.onPlayAgain = onPlayAgain;
    this.onLeave = onLeave;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.statusMessage = document.createElement("h2");
    this.buttonsGroup = document.createElement("div");

    this.leaveButton = document.createElement("button");
    // if Spectator
    /*********** */
    if (this.symbol) {
      this.playAgainButton = document.createElement("button");
    }
  }

  setAttributes() {
    this.statusMessage.classList.add("status-message");
    this.buttonsGroup.classList.add("btns-grp");

    if (this.winner === this.symbol) {
      this.statusMessage.textContent = "You Won! 🎉";
    } else if (this.status === GameStatus.DRAW) {
      this.statusMessage.textContent = "It's a Draw!";
    } else if (this.winner !== this.symbol) {
      this.statusMessage.textContent = "You Lost!";
    }

    this.leaveButton.textContent = "Leave";
    this.leaveButton.classList.add("secondary-button");

    if (this.symbol) {
      this.playAgainButton.textContent = "Play Again";
      this.playAgainButton.classList.add("primary-button"); 
    }
  }

  appendElements() {
    if (this.symbol) {
      this.buttonsGroup.append(this.playAgainButton, this.leaveButton);
    } else {
      this.buttonsGroup.append(this.leaveButton);
    }

    this.modalContent.append(this.statusMessage, this.buttonsGroup);
  }

  attachEvents() {
    this.leaveButton.addEventListener("click", () => {
      this.close();
      if (this.onLeave) this.onLeave();
    });

    if (this.symbol) {
      this.playAgainButton.addEventListener("click", () => {
        this.close();
        if (this.onPlayAgain) this.onPlayAgain(); 
      });
    }
  }
}