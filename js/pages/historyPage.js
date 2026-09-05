import { Router } from "../router.js";
import { Page } from "./page.js";
import { HistoryTabsComponent } from "../components/history/historyTabsComponent.js";
import { HistoryListComponent } from "../components/history/historyListComponent.js";

export class HistoryPage extends Page {
  constructor(appContainer, router, historyApi) {
    super(appContainer);
    this.router = router;
    this.historyApi = historyApi;

    this.currentView = "TABS"; // TABS, GAMES, DETAILS
    this.lastGamesData = [];
    this.lastSelectedEntity = null;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();

    this.loadActiveTab("ROOMS");
  }

  initializeElements() {
    this.layoutContainer = document.createElement("div");

    this.tabsComponent = new HistoryTabsComponent((tabName) => {
      this.currentView = "TABS";
      this.listComponent.triggerTransition("forward");
      this.loadActiveTab(tabName);
    });

    this.cardContainer = document.createElement("div");

    this.headerContainer = document.createElement("div");
    this.titleRow = document.createElement("div");
    this.title = document.createElement("h1");
    this.subtitle = document.createElement("p");
    this.smallBackButton = document.createElement("button");

    this.listComponent = new HistoryListComponent((action) => {
      if (action.type === "ENTITY") {
        this.loadGamesForEntity(action.id);
      } else if (action.type === "GAME") {
        this.loadGameDetails(action.id);
      }
    });

    this.backButton = document.createElement("button");
  }

  setAttributes() {
    this.layoutContainer.classList.add("history-layout");
    this.cardContainer.classList.add("history-card");
    this.headerContainer.classList.add("history-header");
    this.titleRow.classList.add("history-title-row");

    this.title.classList.add("game-title", "history-title");
    this.title.textContent = "MATCH HISTORY";

    this.subtitle.classList.add("history-subtitle");
    this.subtitle.textContent = "ROOMS";

    this.smallBackButton.classList.add("history-small-back-btn", "hide");
    this.smallBackButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`;

    this.backButton.classList.add("btn", "btn-butter", "history-back-btn");
    this.backButton.style.maxWidth = "200px";
    this.backButton.textContent = "BACK TO MENU";
  }

  appendElements() {
    this.titleRow.append(this.smallBackButton, this.title);
    this.headerContainer.append(this.titleRow, this.subtitle);

    this.cardContainer.prepend(
      this.headerContainer,
      this.listComponent.getHTML(),
    );

    this.layoutContainer.append(
      this.tabsComponent.getHTML(),
      this.cardContainer,
      this.backButton,
    );
    this.pageWrapper.append(this.layoutContainer);
  }

  attachEvents() {
    this.backButton.addEventListener("click", () => {
      this.router.navigate(Router.Screens.HOME, "back");
    });

    this.smallBackButton.addEventListener("click", () => {
      this.listComponent.triggerTransition("backward");

      if (this.currentView === "DETAILS") {
        this.currentView = "GAMES";
        this.subtitle.textContent = this.tabsComponent.activeTab === "ROOMS" ? `ROOM: ${this.lastSelectedEntity}` : `PLAYER: ${this.lastSelectedEntity}`;
        this.listComponent.renderGames(
          this.lastGamesData,
          this.lastSelectedEntity,
        );
      } else if (this.currentView === "GAMES") {
        this.currentView = "TABS";
        this.smallBackButton.classList.add("hide");
        this.tabsComponent.show();
        this.loadActiveTab(this.tabsComponent.activeTab);
      }
    });
  }

  async loadActiveTab(tabName) {
    this.tabsComponent.show();
    this.smallBackButton.classList.add("hide");
    this.subtitle.classList.add("hide");

    this.listComponent.renderMessage("Loading...");
    try {
      let data = [];
      if (tabName === "ROOMS") {
        data = await this.historyApi.getAllRooms();
      } else {
        data = await this.historyApi.getAllPlayers();
      }
      this.listComponent.renderEntities(data);
    } catch (e) {
      this.listComponent.renderMessage(
        "Failed to load data.",
        true,
      );
    }
  }

  async loadGamesForEntity(entityId) {
    this.currentView = "GAMES";
    this.tabsComponent.hide();
    this.smallBackButton.classList.remove("hide");
    this.subtitle.classList.remove("hide");
    this.subtitle.textContent = this.tabsComponent.activeTab === "ROOMS" ? `ROOM: ${entityId}` : `PLAYER: ${entityId}`;

    this.listComponent.renderMessage("Loading...");
    try {
      let games = [];
      if (this.tabsComponent.activeTab === "ROOMS") {
        games = await this.historyApi.getGamesByRoom(entityId);
      } else {
        games = await this.historyApi.getGamesByPlayer(entityId);
      }
      this.lastGamesData = games;
      this.lastSelectedEntity = entityId;
      this.listComponent.renderGames(games, entityId);
    } catch (e) {
      this.listComponent.renderMessage(
        "Failed to load games. The API endpoints might not be implemented yet.",
        true,
      );
    }
  }

  async loadGameDetails(gameId) {
    this.currentView = "DETAILS";
    this.smallBackButton.classList.remove("hide");
    this.subtitle.classList.remove("hide");
    this.subtitle.textContent = `GAME: ${gameId}`;

    this.listComponent.renderMessage("Loading...");
    try {
      const details = await this.historyApi.getGameDetails(gameId);
      this.listComponent.renderDetails(details);
    } catch (e) {
      this.listComponent.renderMessage(
        "Failed to load game details. The API endpoints might not be implemented yet.",
        true,
      );
    }
  }
}
