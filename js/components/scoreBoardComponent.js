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
    this.playerSide = document.createElement("div");
    this.playerIconWrapper = document.createElement("div");
    this.playerIcon = document.createElement("img");
    this.playerInfo = document.createElement("div");
    this.playerNameDiv = document.createElement("div");
    this.playerScoreDiv = document.createElement("div");

    this.vsDivider = document.createElement("span");

    this.opponentSide = document.createElement("div");
    this.opponentIconWrapper = document.createElement("div");
    this.opponentIcon = document.createElement("img");
    this.opponentInfo = document.createElement("div");
    this.opponentNameDiv = document.createElement("div");
    this.opponentScoreDiv = document.createElement("div");
  }

  setAttributes() {
    this.componentContainer.classList.add("score-board-wrapper");

    this.playerSide.classList.add("score-card-side", "player-side");
    this.playerIconWrapper.classList.add("score-card-symbol");
    this.playerIcon.classList.add("score-symbol-icon");
    this.playerInfo.classList.add("score-card-info");
    this.playerNameDiv.classList.add("score-card-name");
    this.playerScoreDiv.classList.add("score-card-score");

    this.vsDivider.classList.add("score-vs");
    this.vsDivider.textContent = "VS";

    this.opponentSide.classList.add("score-card-side", "opponent-side");
    this.opponentIconWrapper.classList.add("score-card-symbol");
    this.opponentIcon.classList.add("score-symbol-icon");
    this.opponentInfo.classList.add("score-card-info");
    this.opponentNameDiv.classList.add("score-card-name");
    this.opponentScoreDiv.classList.add("score-card-score");
  }

  appendElements() {
    this.playerIconWrapper.append(this.playerIcon);
    this.playerInfo.append(this.playerNameDiv, this.playerScoreDiv);
    this.playerSide.append(this.playerIconWrapper, this.playerInfo);

    // Opponent mirror
    this.opponentIconWrapper.append(this.opponentIcon);
    this.opponentInfo.append(this.opponentNameDiv, this.opponentScoreDiv);
    this.opponentSide.append(this.opponentInfo, this.opponentIconWrapper); // icon on right for opponent

    this.componentContainer.append(
      this.playerSide,
      this.vsDivider,
      this.opponentSide,
    );
  }

  update(gameState) {
    this.playerNameDiv.textContent = gameState.playerName || "Player";
    this.playerScoreDiv.textContent = `Score: ${gameState.playerScore}`;

    this.opponentNameDiv.textContent = "Opponent";
    this.opponentScoreDiv.textContent = `Score: ${gameState.opponentScore}`;

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
