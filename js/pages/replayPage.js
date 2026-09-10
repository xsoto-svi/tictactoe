import { Router } from "../router.js";
import { Page } from "./page.js";
import { BoardComponent } from "../components/boardComponent.js";
import { ScoreBoardComponent } from "../components/scoreBoardComponent.js";
import { StatusBarComponent } from "../components/statusBarComponent.js";
import { GameState } from "../game/gameState.js";
import { PlayerSymbol, GameStatus } from "../game/gameConstants.js";

export class ReplayPage extends Page {
  constructor(appContainer, router) {
    super(appContainer);
    this.router = router;

    this.moves = [];
    this.currentMoveIndex = 0;
    this.replayTimeout = null;

    // Use a dummy game state just for the UI components
    this.gameState = new GameState();

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  setReplayData(details, gameId) {
    this.gameId = gameId;
    this.moves = details;
    if (typeof this.moves === "string") {
      try {
        this.moves = JSON.parse(this.moves);
      } catch (e) {}
    }
    if (
      this.moves &&
      typeof this.moves === "object" &&
      !Array.isArray(this.moves)
    ) {
      this.moves = this.moves.list || this.moves.data || this.moves.moves || [];
    }
    try {
      this.moves.sort(
        (a, b) =>
          new Date(a.datesave || a.datesaved) -
          new Date(b.datesave || b.datesaved),
      );
    } catch (e) {}

    // Guess player names and symbols from moves if possible
    let player1 = null;
    let player2 = null;
    this.moves.forEach((m) => {
      if (!player1) {
        player1 = { name: m.playername, symbol: m.symbol };
      } else if (player1.name !== m.playername && !player2) {
        player2 = { name: m.playername, symbol: m.symbol };
      }
    });

    this.gameState.playerName = player1 ? player1.name : "Player 1";
    this.gameState.symbol = player1 ? player1.symbol : PlayerSymbol.X;

    // We update the scoreboard once
    this.scoreBoard.update(this.gameState);
    this.scoreBoard.playerScoreDiv.style.display = "none";
    this.scoreBoard.opponentScoreDiv.style.display = "none";

    if (player2) {
      this.scoreBoard.opponentNameDiv.textContent = player2.name;
    }
  }

  initializeElements() {
    this.scoreBoard = new ScoreBoardComponent();
    this.statusBar = new StatusBarComponent();

    this.gameBoard = new BoardComponent(() => {});

    this.actionButtonsContainer = document.createElement("div");
    this.quitButton = document.createElement("button");
    this.replayAgainButton = document.createElement("button");
  }

  setAttributes() {
    this.gameBoard.componentContainer.style.pointerEvents = "none";

    this.actionButtonsContainer.style.display = "flex";
    this.actionButtonsContainer.style.gap = "12px";
    this.actionButtonsContainer.style.marginTop = "20px";
    this.actionButtonsContainer.style.width = "100%";
    this.actionButtonsContainer.style.maxWidth = "400px";
    this.actionButtonsContainer.style.justifyContent = "center";

    this.quitButton.classList.add("btn", "btn-butter");
    this.quitButton.textContent = "Quit Replay";
    this.quitButton.style.flex = "1";
    this.quitButton.style.maxWidth = "200px";

    this.replayAgainButton.classList.add("btn", "btn-chocolate", "hide");
    this.replayAgainButton.textContent = "Replay Again";
    this.replayAgainButton.style.flex = "1";
    this.replayAgainButton.style.maxWidth = "200px";
  }

  appendElements() {
    this.actionButtonsContainer.append(this.quitButton, this.replayAgainButton);

    this.pageWrapper.append(
      this.scoreBoard.getHTML(),
      this.statusBar.getHTML(),
      this.gameBoard.getHTML(),
      this.actionButtonsContainer,
    );
  }

  attachEvents() {
    this.quitButton.addEventListener("click", () => {
      this.stopReplay();
      this.router.navigate(Router.Screens.HISTORY, "back");
    });

    this.replayAgainButton.addEventListener("click", () => {
      this.startReplay();
    });
  }

  render() {
    super.render();
    this.startReplay();
  }

  destroy() {
    this.stopReplay();
  }

  startReplay() {
    this.stopReplay();
    this.currentMoveIndex = 0;
    this.gameState.resetLocalBoard();
    this.updateUI();
    this.replayAgainButton.classList.add("hide");

    this.showTurn();

    this.replayTimeout = setTimeout(() => this.playNextMove(), 1500);
  }

  showTurn() {
    if (this.currentMoveIndex < this.moves.length) {
      const move = this.moves[this.currentMoveIndex];
      this.statusBar.gameStatusBar.textContent = `${move.playername}'s turn...`;
      this.statusBar.gameStatusBar.classList.remove("my-turn");
    } else {
      this.statusBar.gameStatusBar.textContent = "Game Over";
    }
  }

  playNextMove() {
    if (this.currentMoveIndex < this.moves.length) {
      const move = this.moves[this.currentMoveIndex];
      this.gameState.board[move.location] = move.symbol;
      this.gameState.evaluateGameStatus();
      this.updateUI();

      this.currentMoveIndex++;
      this.showTurn();

      this.replayTimeout = setTimeout(() => this.playNextMove(), 2000);
    } else {
      this.gameState.evaluateGameStatus();
      if (this.gameState.status === GameStatus.GAME_OVER) {
        const winnerName =
          this.gameState.winner === this.gameState.symbol
            ? this.gameState.playerName
            : this.scoreBoard.opponentNameDiv.textContent;
        this.statusBar.gameStatusBar.textContent = `${winnerName} Won!`;
      } else if (this.gameState.status === GameStatus.DRAW) {
        this.statusBar.gameStatusBar.textContent = "It's a draw!";
      } else {
        this.statusBar.gameStatusBar.textContent = "Game ended prematurely.";
      }
      this.replayAgainButton.classList.remove("hide");
    }
  }

  updateUI() {
    this.gameState.board.forEach((symbol, index) => {
      this.gameBoard.updateCell(index, symbol);
    });
  }

  stopReplay() {
    if (this.replayTimeout) {
      clearTimeout(this.replayTimeout);
      this.replayTimeout = null;
    }
  }
}
