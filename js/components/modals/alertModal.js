import { Modal } from "./modal.js";

export class AlertModal extends Modal {
  constructor(title, message) {
    super(document.body, true);

    this.title = title;
    this.message = message;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.header = document.createElement("h2");
    this.description = document.createElement("p");
    this.okButton = document.createElement("button");
  }

  setAttributes() {
    this.header.textContent = this.title;
    this.description.textContent = this.message;
    this.okButton.textContent = "Ok";
  }

  appendElements() {
    this.modalContent.append(this.header, this.description, this.okButton);
  }

  attachEvents() {
    this.okButton.addEventListener("click", () => this.close());
  }
}