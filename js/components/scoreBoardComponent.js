import { Component } from "./core/component.js";
import { PlayerSymbol } from "../game/gameConstants.js";

export class ScoreBoardComponent extends Component {
  constructor() {
    super();
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.playerIcon = document.createElement("img");
    this.playerScoreCard = document.createElement("div");
    this.playersScore = document.createElement("span");

    this.vsDivider = document.createElement("span");

    this.opponentScoreCard = document.createElement("div");
    this.opponentsScore = document.createElement("span");
    this.opponentIcon = document.createElement("img");
  }

  setAttributes() {
    this.componentContainer.classList.add("score-board");
    this.playerScoreCard.classList.add("score-card-item");
    this.opponentScoreCard.classList.add("score-card-item");

    this.playerIcon.classList.add("score-symbol-icon");
    this.opponentIcon.classList.add("score-symbol-icon");

    this.vsDivider.classList.add("score-vs");
    this.vsDivider.textContent = "VS";
  }

  appendElements() {
    this.playerScoreCard.append(this.playersScore);
    this.opponentScoreCard.append(this.opponentsScore);

    this.componentContainer.append(
      this.playerIcon,
      this.playerScoreCard,
      this.vsDivider,
      this.opponentScoreCard,
      this.opponentIcon,
    );
  }

  update(gameState) {
    this.playersScore.textContent = `Player: ${gameState.playerScore}`;
    this.opponentsScore.textContent = `Opponent: ${gameState.opponentScore}`;

    const opponentSymbol =
      gameState.symbol === PlayerSymbol.X ? PlayerSymbol.O : PlayerSymbol.X;

    if (gameState.symbol) {
      this.playerIcon.src =
        gameState.symbol === PlayerSymbol.X
          ? "../assets/x-icon.svg"
          : "../assets/o-icon.svg";
      this.opponentIcon.src =
        opponentSymbol === PlayerSymbol.X
          ? "../assets/x-icon.svg"
          : "../assets/o-icon.svg";
    }
  }
}
