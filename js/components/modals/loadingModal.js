import { Modal } from "./modal.js";

export class LoadingModal extends Modal {
  static currentInstance = null;

  static showLoading(title, message, code = null, subMessage = null) {
    if (!LoadingModal.currentInstance) {
      LoadingModal.currentInstance = new LoadingModal(
        title,
        message,
        code,
        subMessage,
      );
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

    this.title = title;
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

      this.copyButton = document.createElement("button");
      this.copyButton.classList.add("modal-copy-btn");
      this.copyButton.title = "Copy Code";

      const copyIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
      const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;

      this.copyButton.innerHTML = copyIcon;

      this.copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(this.code.toUpperCase());
        this.copyButton.innerHTML = checkIcon;
        setTimeout(() => {
          this.copyButton.innerHTML = copyIcon;
        }, 2000);
      });
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
      this.codeBadge.append(this.codeLabel, this.codeValue, this.copyButton);
      this.modalContent.append(this.codeBadge);
    }
  }
}
