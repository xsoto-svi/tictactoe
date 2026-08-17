import { Page } from "./page.js"

export class RoomPage extends Page {
  constructor(container) {
    super();
    this.container = container;
  }

  initializeElements() {
    this.pageWrapper = document.createElement("div");

    this.waitingPageContainer = document.createElement("div");
    this.title = document.createElement("h2");
    this.waitingPageDescription = document.createElement("p");
  }

  setAttributes() {
    this.pageWrapper.classList.add("page-container");
    this.waitingPageContainer.classList.add("page-container");

    this.title.classList.add("title");
    this.title.textContent = "Room created"

    this.waitingPageDescription.classList.add("description");
    this.waitingPageDescription.textContent = "Waiting for player...";
  }

  appendElements() {
    this.pageWrapper.append(this.waitingPageContainer, this.title, this.waitingPageDescription);
  }

  render() {
    this.container.append(this.pageWrapper);
  }
}