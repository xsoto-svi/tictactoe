import { Page } from "./page.js"

export class RoomPage extends Page {
  constructor(appContainer) {
    super(appContainer);

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.waitingPageContainer = document.createElement("div");
    this.title = document.createElement("h2");
    this.waitingPageDescription = document.createElement("p");
  }

  setAttributes() {
    this.waitingPageContainer.classList.add("page-container");

    this.title.classList.add("title");
    this.title.textContent = "Room created"

    this.waitingPageDescription.classList.add("description");
    this.waitingPageDescription.textContent = "Waiting for player...";
  }

  appendElements() {
    this.pageWrapper.append(this.waitingPageContainer, this.title, this.waitingPageDescription);
  }
}