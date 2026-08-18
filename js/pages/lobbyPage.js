import { Page } from "./page.js"

export class LobbyPage extends Page {
  constructor(appContainer) {
    super(appContainer);

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.pageWrapper = document.createElement("div");
    this.title = document.createElement("h1");

    this.createGameContainer = document.createElement("div");
    this.createGameHeading = document.createElement("h2");
    this.createGameDescription = document.createElement("p");
    this.createGameButton = document.createElement("button");

    this.joinGameContainer = document.createElement("div");
    this.joinGameHeading = document.createElement("h2");
    this.joinGameDescription = document.createElement("p");
    this.joinGameButton = document.createElement("button");
  }

  setAttributes() {
    this.pageWrapper.classList.add("page-container");
    this.title = document.createElement("title");
    
    this.createGameContainer.classList.add("option-container");
    this.createGameHeading.classList.add("option-heading");
    this.createGameHeading.textContent = "Create Game";
    this.createGameDescription.classList.add("description");
    this.createGameDescription.textContent = "Create Game Description";
    this.createGameButton.classList.add("btn-create");
    this.createGameButton.textContent = "Create";

    this.joinGameContainer.classList.add("option-container");
    this.joinGameHeading.classList.add("option-heading");
    this.joinGameHeading.textContent = "Join Game";
    this.joinGameDescription.classList.add("description");
    this.joinGameDescription.textContent = "Join Game Description";
    this.joinGameButton.classList.add("btn-join");
    this.joinGameButton.textContent = "Join";
  }

  appendElements() {
    this.createGameContainer.append(this.createGameHeading, this.createGameDescription, this.createGameButton);

    this.joinGameContainer.append(this.joinGameHeading, this.joinGameDescription, this.joinGameButton);

    this.pageWrapper.append(this.title, this.createGameContainer, this.joinGameContainer);
  }
}