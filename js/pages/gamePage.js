import { BoardComponent } from "../components/boardComponent.js";
import { Modal } from "../components/common/modal.js";
import { Page } from "./page.js";

export class GamePage extends Page {
  constructor(appContainer, router, tictactoeApi, gameState) {
    super(appContainer);
    this.router = router;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;

    this.gameBoard = new BoardComponent((index) => this.onCellClick(index));

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.title = document.createElement("h1");
    this.turnContainer = document.createElement("div");
  }

  setAttributes() {
    this.title.classList.add("title");
    
    if (isMyTurn) {

    }
    this.turnContainer.textContent = ;
  }

  appendElements() {
    this.pageWrapper.append(this.title, this.gameBoard.getHTML());
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
          Modal.showAlertModal("Game Over", "Your opponent left the game.");
          this.router.navigate("/");
        } else {
          this.gameState.syncWithServer(boardData);
        }
      } catch (error) {
        clearInterval(boardInterval);
        Modal.showAlertModal("Game Disconnected", "The room was closed.");
        this.router.navigate("/");
      }
    }, 2000);
  }

  async onCellClick(index) {
    if (this.gameState.status !== "playing") return;

    if (!this.gameState.isMyTurn) {
      Modal.showAlert("Hold on!", "It is not your turn yet.");
      return;
    }

    // 3. Is the cell already taken on our local copy? (Saves a useless API call)
    if (this.gameState.board[index] !== ":") {
      Modal.showAlert("Invalid Move", "That space is already taken!");
      return;
    }

    const coords = this.gameState.getApiCoordinates(index);

    try {
      const response = await this.tictactoeApi.updateToAddMove(
        this.gameState.roomCode,
        this.gameState.symbol,
        coords.x,
        coords.y,
      );
    } catch (error) {
      Modal.showAlert("Network Error", "Failed to send move.");
    }
  }
}
