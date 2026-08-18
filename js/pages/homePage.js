import { Page } from "./page.js"

export class HomePage extends Page {
  constructor(appContainer) {
    super(appContainer);

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.title = document.createElement("h1");
    this.startButton = document.createElement("button");
    this.howToPlayButton = document.createElement("button");
  }

  setAttributes() {
    this.title.classList.add("title");
    this.title.textContent = "Tic-Tac-Toe";
    
    this.startButton.classList.add("btn-start");
    this.startButton.textContent = "Start";

    this.howToPlayButton.classList.add("btn-how-to-play");
    this.howToPlayButton.textContent = "How To Play";
  }

  appendElements() {
    this.pageWrapper.append(this.title);
    this.pageWrapper.append(this.startButton);
    this.pageWrapper.append(this.howToPlayButton);
  }
}