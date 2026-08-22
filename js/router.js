import { HomePage } from "./pages/homePage.js";
import { HowToPlayPage } from "./pages/howToPlayPage.js";
import { LobbyPage } from "./pages/lobbyPage.js";
import { GamePage } from "./pages/gamePage.js";

export class Router {
  static Screens = {
    HOME: "HOME",
    HOW_TO_PLAY: "HOW_TO_PLAY",
    LOBBY: "LOBBY",
    GAME: "GAME"
  }

  constructor(appContainer, routes = {}, tictactoeApi, gameState) {
    this.appContainer = appContainer;
    this.routes = routes;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;

    this.navigate("HOME");
  }

  navigate(screenName, params = {}) {
    this.appContainer.replaceChildren();

    let activePage;

    switch (screenName) {
      case Router.Screens.HOME:
        activePage = new HomePage(this.appContainer, this);
        break;
      case Router.Screens.HOW_TO_PLAY:
        activePage = new HowToPlayPage(this.appContainer, this);
        break;
      case Router.Screens.LOBBY:
        activePage = new LobbyPage(this.appContainer, this, this.tictactoeApi, this.gameState);
        break;
      case Router.Screens.GAME:
        activePage = new GamePage(this.appContainer, this, this.tictactoeApi, this.gameState);
        break;
      default:
        activePage = new HomePage(this.appContainer, this);
    }
    
    activePage.render();
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