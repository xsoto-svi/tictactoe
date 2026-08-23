import { Router } from "../router.js";
import { Page } from "./page.js"

export class HomePage extends Page {
  constructor(appContainer, router) {
    super(appContainer);
    this.router = router;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.cardContainer = document.createElement("div");
    this.title = document.createElement("h1");
    this.subtitle = document.createElement("p");
    this.menuContainer = document.createElement("div");
    this.startButton = document.createElement("button");
    this.howToPlayButton = document.createElement("button");
  }

  setAttributes() {
    this.cardContainer.classList.add("tile-card");
    
    this.title.classList.add("game-title");
    this.title.textContent = "Tic-Tac-Toe";

    this.subtitle.classList.add("game-subtitle");
    this.subtitle.textContent = "The classic X and O game of strategy and fun.";
    
    this.menuContainer.classList.add("btn-group");

    this.startButton.classList.add("btn", "btn-chocolate");
    this.startButton.textContent = "Start Game";

    this.howToPlayButton.classList.add("btn", "btn-butter");
    this.howToPlayButton.textContent = "How To Play";
  }

  appendElements() {
    this.menuContainer.append(this.startButton, this.howToPlayButton);

    this.cardContainer.append(
      this.title,
      this.subtitle,
      this.menuContainer
    )

    this.pageWrapper.append(this.cardContainer);
  }

  attachEvents() {
    this.startButton.addEventListener("click", () => {
      this.router.navigate(Router.Screens.LOBBY);
    });

    this.howToPlayButton.addEventListener("click", () => {
      this.router.navigate(Router.Screens.HOW_TO_PLAY);
    });
  }
}