import { ViewTemplate } from "../core/viewTemplate.js";

export class Page extends ViewTemplate {
  constructor(appContainer) {
    super();
    this.appContainer = appContainer;
    this.pageWrapper = document.createElement("div");
  }

  setAttributes() {
    this.pageWrapper.classList.add("page-container");
  }

  render() {
    this.appContainer.append(this.pageWrapper);
  }
}