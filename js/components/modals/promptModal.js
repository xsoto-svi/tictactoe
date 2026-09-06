import { Modal } from "./modal.js";

export class PromptModal extends Modal {
  constructor(title, message, placeholder, onSubmit) {
    super(document.body, true);

    this.title = title;
    this.message = message;
    this.placeholder = placeholder;
    this.onSubmit = onSubmit;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.header = document.createElement("h2");
    this.description = document.createElement("p");
    
    this.inputGroup = document.createElement("div");
    this.input = document.createElement("input");
    
    this.okButton = document.createElement("button");
  }

  setAttributes() {
    this.header.textContent = this.title;
    this.description.textContent = this.message;
    
    this.inputGroup.classList.add("input-group");
    this.inputGroup.style.marginTop = "8px";
    this.inputGroup.style.marginBottom = "8px";

    this.input.type = "text";
    this.input.placeholder = this.placeholder;
    this.input.classList.add("code-input");
    this.input.style.width = "100%";
    
    this.okButton.textContent = "Continue";
    this.okButton.classList.add("btn", "btn-chocolate");
    this.okButton.style.marginTop = "12px";
  }

  appendElements() {
    this.inputGroup.append(this.input);
    this.modalContent.append(this.header, this.description, this.inputGroup, this.okButton);
  }

  attachEvents() {
    this.okButton.addEventListener("click", () => {
      const val = this.input.value.trim();
      if (val) {
        this.close();
        this.onSubmit(val);
      }
    });

    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.okButton.click();
      }
    });
  }
}

