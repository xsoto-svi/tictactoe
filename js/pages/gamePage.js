import { BoardComponent } from "../components/boardComponent.js";
import { Page } from "./page.js"

export class GamePage extends Page {
  constructor(appContainer) {
    super(appContainer);

    this.gameBoard = new BoardComponent((index) => this.onCellClick(index));

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.title = document.createElement("h1");
  }

  setAttributes() {    
    this.title.classList.add("title");
    this.title.textContent = "Tic-Tac-Toe";
  }

  appendElements() {
    this.pageWrapper.append(this.title, this.gameBoard.getHTML());
  }

  onCellClick(index) {
    // // 1. Ask GameState if the move is valid
    // const success = this.gameState.makeMove(index);

    // if (success) {
    // // 2. If valid, tell the board component to visually update
    // const symbol = this.gameState.previousTurn; // or similar logic
    // this.board.updateCell(index, symbol);

    this.gameBoard.updateCell(index, "X");
  }
}