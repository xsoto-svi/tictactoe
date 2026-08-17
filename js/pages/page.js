export class Page {
  constructor(container) {
    this.container = container;
  }

  render() {
    throw new Error("render() must be implemented");
  }
}