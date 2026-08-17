import { Page } from "./page.js"

export class HomePage extends Page {
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
    this.startButton = document.createElement("button");
    this.howToPlayButton = document.createElement("button");
  }

  setAttributes() {
    this.pageWrapper.classList.add("home-page-container");
    
    this.title.classList.add("h1");
    this.title.textContent = "Tic-Tac-Toe";
    
    this.startButton.classList.add("start-button");
    this.startButton.textContent = "Start";

    this.howToPlayButton.classList.add("how-to-play-button");
    this.howToPlayButton.textContent = "How To Play";
  }

  appendElements() {
    this.pageWrapper.append(this.title);
    this.pageWrapper.append(this.startButton);
    this.pageWrapper.append(this.howToPlayButton);
  }

  render() {
    this.container.append(this.pageWrapper);
  }
}