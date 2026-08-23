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

    this.okButton = document.createElement("button");

    this.steps = [
      {
        num: "1",
        subject: "Creating a Lobby",
        desc: "Go to the lobby and enter a unique room code, or create a new room to host a match.",
        svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>`
      },
      {
        num: "2",
        subject: "Joining a Game",
        desc: "Share your room code with a friend so they can type it in and join your active session.",
        svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
      },
      {
        num: "3",
        subject: "Classic Rules",
        desc: "Take turns placing your marks on the 3x3 grid. Align three in a row horizontally, vertically, or diagonally to win.",
        svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line></svg>`
      },
      {
        num: "4",
        subject: "Seamless Rematches",
        desc: "When a game ends, click 'Play Again' to automatically transition into a fresh match room without heading back to the menu.",
        svg: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>`
      }
    ];
  }

  setAttributes() {
    this.cardContainer.classList.add("how-to-play-wrapper");

    this.title.classList.add("game-title");
    this.title.textContent = "How To Play";

    this.instructionsList.classList.add("instructions-list");

    this.okButton.classList.add("btn", "btn-chocolate");
    this.okButton.textContent = "Ok";
  }

  appendElements() {
    this.cardContainer.append(
      this.title,
      this.instructionsList,
      this.okButton
    )

    this.createStepItems();

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

  createStepItems() {
    this.steps.forEach(step => {
      const item = document.createElement("div");
      item.classList.add("instruction-item");

      // Number badge on the side
      const numberBadge = document.createElement("div");
      numberBadge.classList.add("instruction-number");
      numberBadge.textContent = step.num;

      // Content wrapper (Subject + Desc)
      const contentDiv = document.createElement("div");
      contentDiv.classList.add("instruction-content");

      const headerRow = document.createElement("div");
      headerRow.classList.add("instruction-header-row");

      const iconSpan = document.createElement("span");
      iconSpan.classList.add("instruction-icon");
      iconSpan.innerHTML = step.svg;

      const subjectHeading = document.createElement("h3");
      subjectHeading.textContent = step.subject;
      subjectHeading.classList.add("instruction-subject");

      headerRow.append(iconSpan, subjectHeading);

      const description = document.createElement("p");
      description.textContent = step.desc;
      description.classList.add("instruction-desc");

      contentDiv.append(headerRow, description);
      item.append(numberBadge, contentDiv);
      this.instructionsList.append(item);
    });
  }
}