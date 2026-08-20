import { Component } from "../core/component.js";

export class Modal extends Component {
  constructor(container, titleText, contentElement, isDismissible = true) {
    super();
    this.container = container;
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
    this.container.append(this.modalWrapper);

    this.attachEvents();
  }

  close() {
    if (this.modalWrapper) {
      this.modalWrapper.remove();
    }
  }

  static showLoadingModal(title, message) {
    this.closeModal();
    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    this.currentModal = new Modal(document.body, title, messageElement, false);
    this.currentModal.open();
  }

  static showAlertModal(title, message) {
    this.closeModal();
    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    this.currentModal = new Modal(document.body, title, messageElement, true);
    this.currentModal.open();
  }

  static closeModal() {
    if (this.currentModal) {
      this.currentModal.close();
      this.currentModal = null;
    }
  }
}
