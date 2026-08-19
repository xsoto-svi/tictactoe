import { CellComponent } from "./cellComponent.js";
import { Component } from "./core/component.js";

export class BoardComponent extends Component {
  constructor(onCellClick) {
    super();
    this.onCellClick = onCellClick;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.cells = [];
    this.board = document.createElement("div");

    for (let i = 0; i < 9; i++) {
      this.cells.push(
        new CellComponent(i, () => this.onCellClick(i))
      );
    }
  }

  setAttributes() {
    this.board.classList.add("board");
    this.cells.forEach(cell => {
      this.board.append(cell.getHTML());
    });
  }

  appendElements() {
    this.componentContainer.append(this.board);
  }

  updateCell(index, symbol) {
    this.cells[index].setValue(symbol);
  }
}