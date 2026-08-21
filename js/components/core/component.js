import { ViewTemplate } from "../../core/viewTemplate.js";

export class Component extends ViewTemplate {
  constructor() {
    super();
    this.componentContainer = document.createElement("div");
  }

  getHTML() {
    return this.componentContainer;
  }
}