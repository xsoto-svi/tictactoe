import { HomePage } from "./pages/homePage.js";
import { HowToPlayPage } from "./pages/howToPlayPage.js";
import { LobbyPage } from "./pages/lobbyPage.js";
import { GamePage } from "./pages/gamePage.js";
import { HistoryPage } from "./pages/historyPage.js";

export class Router {
  static Screens = {
    HOME: "HOME",
    HOW_TO_PLAY: "HOW_TO_PLAY",
    LOBBY: "LOBBY",
    GAME: "GAME",
    HISTORY: "HISTORY",
  };

  static SlideTransitions = {
    FORWARD: "forward",
    BACKWARD: "back",
  };

  constructor(appContainer, tictactoeApi, historyApi, gameState) {
    this.appContainer = appContainer;
    this.tictactoeApi = tictactoeApi;
    this.historyApi = historyApi;
    this.gameState = gameState;

    this.navigate(
      Router.Screens.HOME,
      Router.SlideTransitions.FORWARD,
      false,
      {},
    );
  }

  navigate(screenName, direction = "forward", animate = true, params = {}) {
    const oldPageElement = this.appContainer.firstElementChild;

    let activePage;

    switch (screenName) {
      case Router.Screens.HOME:
        activePage = new HomePage(this.appContainer, this);
        break;
      case Router.Screens.HOW_TO_PLAY:
        activePage = new HowToPlayPage(this.appContainer, this);
        break;
      case Router.Screens.LOBBY:
        activePage = new LobbyPage(
          this.appContainer,
          this,
          this.tictactoeApi,
          this.gameState,
        );
        break;
      case Router.Screens.GAME:
        activePage = new GamePage(
          this.appContainer,
          this,
          this.tictactoeApi,
          this.gameState,
        );
        break;
      case Router.Screens.HISTORY:
        activePage = new HistoryPage(this.appContainer, this, this.historyApi);
        break;
      default:
        activePage = new HomePage(this.appContainer, this);
    }

    activePage.render();
    const newPageElement = activePage.pageWrapper;

    if (!animate || !oldPageElement) {
      // If no animation is needed (like on initial boot), just clean up old elements
      if (oldPageElement) oldPageElement.remove();
      return;
    }

    if (direction === "back") {
      oldPageElement.classList.add("slide-out-right");
      newPageElement.classList.add("slide-in-left");
    } else {
      oldPageElement.classList.add("slide-out-left");
      newPageElement.classList.add("slide-in-right");
    }

    oldPageElement.addEventListener(
      "animationend",
      () => {
        oldPageElement.remove();
      },
      { once: true },
    );
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
