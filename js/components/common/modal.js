import { Component } from "../core/component.js";

export class Modal extends Component {
  constructor(container, titleText, contentElement, isDismissible = true) {
    super(container);
    this.titleText = titleText;
    this.contentElement = contentElement;
    this.isDismissible = isDismissible;
    
    this.modalWrapper = null;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.modalWrapper = document.createElement("div");
    this.modalContent = document.createElement("div");
    this.header = document.createElement("h3");
  }

  setAttributes() {
    this.modalWrapper.classList.add("modal-overlay");
    this.modalContent.classList.add("modal-content");
    this.header.classList.add("h3");
    this.header.textContent = this.titleText;
  }

  appendElements() {
    this.modalContent.append(this.header, this.contentElement);
    this.modalWrapper.append(this.modalContent);
  }

  attachEvents() {
    this.modalWrapper.addEventListener("click", (event) => {
      if (this.isDismissible && event.target == this.modalWrapper) {
        this.close();
      }
    });
  }

  open() {
    const modalDOM = this.getHTML();

    this.container.append(modalDOM);

    this.attachEvents();
  }

  close() {
    if (this.modalWrapper) {
      this.modalWrapper.remove();
    }
  }
}