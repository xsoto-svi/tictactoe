import { ViewTemplate } from "../core/viewTemplate.js";

export class Page extends ViewTemplate {
  constructor(appContainer) {
    super();
    this.appContainer = appContainer;
    this.pageWrapper = document.createElement("div");

    this.pageWrapper.classList.add("page-base");
  }

  render() {
    this.appContainer.append(this.pageWrapper);

    requestAnimationFrame(() => {
      this.pageWrapper.classList.add("slide-in");
    });
  }
}