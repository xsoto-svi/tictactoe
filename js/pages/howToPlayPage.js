import { Router } from "../router.js";
import { Page } from "./page.js"

export class HowToPlayPage extends Page {
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

    this.instructionsList = document.createElement("div");

    this.rule1 = document.createElement("p");
    this.rule2 = document.createElement("p");
    this.rule3 = document.createElement("p");
    this.rule4 = document.createElement("p");

    this.okButton = document.createElement("button");
  }

  setAttributes() {
    this.cardContainer.classList.add("tile-card");

    this.title.classList.add("game-title");
    this.title.textContent = "How To Play";

    this.instructionsList.classList.add("instructions-list");

    this.rule1 = this.createRuleItem("1. Creating a Lobby:", " Go to the lobby and enter a unique room code, or create a new room to host a match.");
    this.rule2 = this.createRuleItem("2. Joining a Game:", " Share your room code with a friend so they can type it in and join your active session.");
    this.rule3 = this.createRuleItem("3. Classic Rules:", " Take turns placing your marks on the 3x3 grid. Align three in a row horizontally, vertically, or diagonally to win.");
    this.rule4 = this.createRuleItem("4. Seamless Rematches:", " When a game ends, click 'Play Again' to automatically transition into a fresh rematch room without heading back to the menu.");

    this.okButton.classList.add("btn", "btn-chocolate");
    this.okButton.textContent = "Ok";
  }

  appendElements() {
    this.instructionsList.append(
      this.rule1,
      this.rule2,
      this.rule3,
      this.rule4
    );

    this.cardContainer.append(
      this.title,
      this.instructionsList,
      this.okButton
    )

    this.pageWrapper.append(this.cardContainer);
  }

  attachEvents() {
    this.okButton.addEventListener("click", () => {
      this.router.navigate(
        Router.Screens.HOME,
        Router.SlideTransitions.BACKWARD
      );
    });
  }

  createRuleItem(boldText, normalText) {
    const p = document.createElement("p");
    
    const strong = document.createElement("strong");
    strong.textContent = boldText;
    
    const text = document.createTextNode(normalText);
    
    p.append(strong, text);
    return p;
  }
}