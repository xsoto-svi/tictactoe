import { Page } from "./page.js"

export class HowToPlayPage extends Page {
  constructor(appContainer) {
    super(appContainer);

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.pageWrapper = document.createElement("div");
    this.title = document.createElement("h1");
    this.instructions = document.createElement("p");
    this.okButton = document.createElement("button");
  }

  setAttributes() {
    this.pageWrapper.classList.add("page-container");
    
    this.title.classList.add("title");
    this.title.textContent = "How To Play";

    this.instructions.classList.add("description");
    this.instructions.textContent = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vulputate risus dolor. Duis id feugiat dui, in sollicitudin ante. Vestibulum efficitur justo et eros ornare, a vulputate ligula efficitur. Pellentesque mattis consequat sapien. Vivamus non odio lobortis est congue iaculis. Phasellus finibus condimentum odio, eget volutpat arcu feugiat a. Quisque a ex egestas, blandit orci ut, lobortis enim. Suspendisse quam elit, consectetur id lectus non, rhoncus iaculis lorem. Aenean varius gravida tellus, a rhoncus neque fringilla ac. Nunc rhoncus justo non elit venenatis, id viverra massa vehicula.\n Aenean molestie fringilla ligula id blandit. Cras sit amet risus ac quam tincidunt pellentesque et non risus. Morbi cursus massa eget ante lacinia, nec tristique justo vulputate. Suspendisse laoreet, magna lacinia aliquam mattis, dui sem convallis dolor, fermentum dictum urna quam in est. Donec tempus quis lorem non mattis. Duis tempor pharetra felis id varius. Quisque pretium augue eu nulla consectetur, vitae pulvinar nulla porttitor. Aenean nec dolor auctor, congue ligula at, efficitur eros. Phasellus a enim pharetra, faucibus felis in, dictum justo. Praesent aliquam felis vitae laoreet rutrum. Nullam libero sem, vehicula et venenatis et, sodales ac elit.";
    
    this.okButton.classList.add("btn-ok");
    this.okButton.textContent = "Ok";
  }

  appendElements() {
    this.pageWrapper.append(this.title, this.instructions, this.okButton);
  }
}