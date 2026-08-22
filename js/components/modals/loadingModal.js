import { Modal } from "./modal.js";

export class LoadingModal extends Modal {
  static currentInstance = null;
  
  static showLoading(title, message, code = null, subMessage = null) {
    if (!LoadingModal.currentInstance) {
      LoadingModal.currentInstance = new LoadingModal(title, message, code, subMessage);
    } 
    
    LoadingModal.currentInstance.open();
  }

  static hideLoading() {
    if (LoadingModal.currentInstance) {
      LoadingModal.currentInstance.close();
      LoadingModal.currentInstance = null;
    }
  }

  constructor(title, message, code = null, subMessage = null) {
    super(document.body, false);

    this.title = title
    this.message = message;
    this.code = code;
    this.subMessage = subMessage;
    
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.header = document.createElement("h2");
    this.description = document.createElement("p");

    if (this.code) {
      this.codeBadge = document.createElement("div");
      this.codeLabel = document.createElement("span");
      this.codeValue = document.createElement("span");
    }

    if (this.subMessage) {
      this.subDescription = document.createElement("p");
    }
  }

  setAttributes() {
    this.header.textContent = this.title;
    this.description.textContent = this.message;
    this.description.classList.add("modal-main-desc");

    if (this.code) {
      this.codeBadge.classList.add("modal-code-badge");
      this.codeLabel.textContent = "ROOM CODE: ";
      this.codeValue.textContent = this.code.toUpperCase();
      this.codeValue.classList.add("modal-code-text");
    }

    if (this.subMessage) {
      this.subDescription.textContent = this.subMessage;
      this.subDescription.classList.add("modal-sub-desc");
    }
  }

  appendElements() {
    this.modalContent.append(this.header, this.description);

    if (this.subMessage) {
      this.modalContent.append(this.subDescription);
    }

    if (this.code) {
      this.codeBadge.append(this.codeLabel, this.codeValue);
      this.modalContent.append(this.codeBadge);
    }

  }
}