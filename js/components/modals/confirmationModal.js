import { Modal } from "./modal.js";

export class ConfirmationModal extends Modal {
  constructor(
    container,
    title,
    message,
    onConfirm,
    onCancel,
    isDismissible
  ) {
    super(container, isDismissible);

    this.title = title;
    this.message = message;
    this.onConfirm = onConfirm;
    this.onCancel = onCancel;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.header = document.createElement("h2");
    this.description = document.createElement("p");
    this.buttonsGroup = document.createElement("div");

    this.confirmButton = document.createElement("button");
    this.cancelButton = document.createElement("button");
  }

  setAttributes() {
    this.header.textContent = this.title;
    this.description.textContent = this.message;
    this.description.classList.add("modal-main-desc");

    this.buttonsGroup.classList.add("btns-grp");

    this.confirmButton.textContent = "Yes";
    this.confirmButton.classList.add("primary-button");

    this.cancelButton.textContent = "Cancel";
    this.cancelButton.classList.add("secondary-button");
  }

  appendElements() {
    this.buttonsGroup.append(this.confirmButton, this.cancelButton);
    this.modalContent.append(this.header, this.description, this.buttonsGroup);
  }

  attachEvents() {
    this.confirmButton.addEventListener("click", () => {
      this.close();
      if (this.onConfirm) this.onConfirm();
    });

    this.cancelButton.addEventListener("click", () => {
      this.close();
      if (this.onCancel) this.onCancel();
    });
  }
}