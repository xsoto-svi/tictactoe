import { Component } from "../core/component.js";

export class Modal extends Component {
  constructor(container, isDismissible = true) {
    super();
    this.container = container;
    this.isDismissible = isDismissible;

    this.modalWrapper = document.createElement("div");
    this.modalContent = document.createElement("div");

    this.modalWrapper.classList.add("modal-overlay");
    this.modalContent.classList.add("modal-content");

    this.modalWrapper.append(this.modalContent);

    this.modalWrapper.addEventListener("click", (event) => {
      if (this.isDismissible && event.target == this.modalWrapper) {
        this.close();
      }
    });
  }

  open() {
    this.container.append(this.modalWrapper);
  }

  close() {
    if (this.modalWrapper) {
      this.modalWrapper.remove();
    }
  }
}
