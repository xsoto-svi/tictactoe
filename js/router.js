export class Router {
  constructor(appContainer, routes = {}, tictactoeApi, gameState) {
    this.appContainer = appContainer;
    this.routes = routes;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;

    this.load();

    window.addEventListener("hashchange", () => {
      this.load();
    });
  }

  navigate(path) {
    window.location.hash = path;
  }

  load() {
    this.appContainer.replaceChildren();

    const path = window.location.hash.slice(1) || "/";

    const PageClass = this.routes[path];

    if (!PageClass) {
      this.render404();
      return;
    }

    const page = new PageClass(this.appContainer, this, this.tictactoeApi, this.gameState);

    page.render();
  }

  render404() {
    const errorWrapper = document.createElement("div");
    let header = document.createElement("h1");
    header.append("404");
    let para = document.createElement("p");
    para.append("Page not found");

    this.appContainer.append(header, para);
  }
}