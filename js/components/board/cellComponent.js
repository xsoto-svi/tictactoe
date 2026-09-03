import { Component } from "../core/component.js";

export class CellComponent extends Component {
  constructor(index, onClick) {
    super();
    this.index = index;
    this.onClick = onClick;
    this.attachEvents();

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.cell = document.createElement("div");
  }

  setAttributes() {
    this.cell.classList.add("cell");
  }

  appendElements() {
    this.componentContainer.append(this.cell);
  }

  attachEvents() {
    this.componentContainer.addEventListener("click", () => {
      this.onClick(this.index);
    });
  }

  setValue(symbol) {
    this.cell.textContent = symbol;
    if (symbol) {
      this.cell.classList.add("cell-filled");
    } else {
      this.cell.classList.remove("cell-filled");
    }
  }
}
