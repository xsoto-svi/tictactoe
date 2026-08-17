import { ViewTemplate } from "../core/viewTemplate";

export class Page extends ViewTemplate {
  constructor(container) {
    super();
    this.container = container;
  }

  render() {
    throw new Error("render() must be implemented");
  }
}