import { Page } from "./page.js"

export class LobbyOptionsPage extends Page {
  constructor(container) {
    super();
    this.container = container;
    
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
    this.createGameDescription.classList.add("description");
    this.createGameButton.classList.add("btn-create");

    this.joinGameContainer.classList.add("option-container");
    this.joinGameHeading.classList.add("option-heading");
    this.joinGameDescription.classList.add("description");
    this.joinGameButton.classList.add("btn-join");
  }

  appendElements() {
    this.createGameContainer.append(this.createGameHeading, this.createGameDescription, this.createGameButton);

    this.joinGameContainer.append(this.joinGameHeading, this.joinGameDescription, this.joinGameButton);

    this.pageWrapper.append(this.title, this.createGameContainer, this.joinGameContainer);
  }

  render() {
    this.container.append(this.pageWrapper);
  }
}