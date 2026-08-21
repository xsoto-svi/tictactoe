import { Modal } from "./modal.js";

export class LoadingModal extends Modal {
  static currentInstance = null;
  
  static showLoading(title, message) {
    if (!LoadingModal.currentInstance) {
      LoadingModal.currentInstance = new LoadingModal(title, message);
    } 
    
    LoadingModal.currentInstance.open();
  }

  static hideLoading() {
    if (LoadingModal.currentInstance) {
      LoadingModal.currentInstance.close();
      LoadingModal.currentInstance = null;
    }
  }

  constructor(title, message) {
    super(document.body, false);

    this.title = title
    this.message = message;
    
    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.header = document.createElement("h2");
    this.description = document.createElement("p");
  }

  setAttributes() {
    this.header.textContent = this.title;
    this.description.textContent = this.message;
  }

  appendElements() {
    this.modalContent.append(this.header, this.description);
  }
}