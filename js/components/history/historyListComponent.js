import { Component } from "../core/component.js";

export class HistoryListComponent extends Component {
  constructor(onItemClick) {
    super();
    this.onItemClick = onItemClick;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
  }

  initializeElements() {
    this.listContainer = document.createElement("div");
  }

  setAttributes() {
    this.componentContainer.classList.add("history-list-viewport");
    this.listContainer.classList.add("history-list");
  }

  appendElements() {
    this.componentContainer.append(this.listContainer);
  }

  clear() {
    while (this.listContainer.firstChild) {
      this.listContainer.removeChild(this.listContainer.firstChild);
    }
  }

  show() {
    this.componentContainer.classList.remove("hide");
    this.componentContainer.classList.add("show-block");
  }

  hide() {
    this.componentContainer.classList.add("hide");
    this.componentContainer.classList.remove("show-block");
  }

  triggerTransition(direction) {
    this.listContainer.classList.remove("slide-in-right", "slide-in-left");
    void this.listContainer.offsetWidth; // trigger reflow
    this.listContainer.classList.add(
      direction === "forward" ? "slide-in-right" : "slide-in-left",
    );
  }

  renderMessage(message, isError = false) {
    this.clear();
    const p = document.createElement("p");
    p.classList.add(isError ? "history-error" : "history-empty");
    p.textContent = message;
    this.listContainer.append(p);
  }

  renderEntities(items) {
    this.clear();

    if (items && typeof items === "object" && !Array.isArray(items)) {
      items = items.list || items.data || items.rooms || items.players || [];
    }

    if (!Array.isArray(items) || items.length === 0) {
      this.renderMessage("No data found.");
      return;
    }

    items.forEach((item) => {
      const btn = document.createElement("button");
      btn.classList.add("btn", "btn-butter");
      const label =
        typeof item === "object"
          ? item.roomcode ||
            item.playername ||
            item.id ||
            item.name ||
            JSON.stringify(item)
          : item;
      btn.textContent = label;

      btn.addEventListener("click", () => {
        this.triggerTransition("forward");
        this.onItemClick({ type: "ENTITY", id: label });
      });

      this.listContainer.append(btn);
    });
  }

  renderGames(games, entityId) {
    this.clear();

    if (typeof games === "string") {
      try {
        games = JSON.parse(games);
      } catch (e) {
        console.error("Failed to parse games:", e);
      }
    }

    if (games && typeof games === "object" && !Array.isArray(games)) {
      games = games.list || games.data || games.games || [];
    }

    if (!Array.isArray(games) || games.length === 0) {
      this.renderMessage(`No games found for ${entityId}.`);
      return;
    }

    games.forEach((game, index) => {
      const btn = document.createElement("button");
      btn.classList.add("btn", "btn-butter");
      const gameId =
        typeof game === "object" ? game.id || game.gameid || game.gameId : game;
      const displayStr = `GAME ${index + 1}`;
      btn.textContent = displayStr;

      btn.addEventListener("click", () => {
        this.triggerTransition("forward");
        this.onItemClick({ type: "GAME", id: gameId, displayStr });
      });

      this.listContainer.append(btn);
    });
  }

  renderDetails(details) {
    this.clear();

    if (typeof details === "string") {
      try {
        details = JSON.parse(details);
      } catch (e) {
        console.error("Failed to parse details:", e);
      }
    }

    if (details && typeof details === "object" && !Array.isArray(details)) {
      details = details.list || details.data || details.moves || [];
    }

    if (!Array.isArray(details) || details.length === 0) {
      this.renderMessage("No details available.");
      return;
    }

    details.forEach((move) => {
      const moveCard = document.createElement("div");
      moveCard.classList.add("history-move-card");

      const symbolDiv = document.createElement("div");
      symbolDiv.classList.add("history-move-symbol");
      const symbolImg = document.createElement("img");
      symbolImg.src =
        move.symbol.toUpperCase() === "X"
          ? "assets/x-icon.svg"
          : "assets/o-icon.svg";
      symbolImg.style.width = "40px";
      symbolImg.style.height = "40px";
      symbolDiv.append(symbolImg);

      const detailsDiv = document.createElement("div");
      detailsDiv.classList.add("history-move-details");

      const playerDiv = document.createElement("div");
      const playerStrong = document.createElement("strong");
      playerStrong.textContent = "Player: ";
      const playerSpan = document.createElement("span");
      playerSpan.textContent = `${move.playername}`;
      playerDiv.append(playerStrong, playerSpan);

      const row = Math.floor(move.location / 3) + 1;
      const col = (move.location % 3) + 1;
      const locationDiv = document.createElement("div");
      const locationStrong = document.createElement("strong");
      locationStrong.textContent = "Location: ";
      const locationSpan = document.createElement("span");
      locationSpan.textContent = `Row ${row}, Column ${col}`;
      locationDiv.append(locationStrong, locationSpan);

      const dateDiv = document.createElement("div");
      const dateStrong = document.createElement("strong");
      dateStrong.textContent = "Date: ";
      const dateSpan = document.createElement("span");
      dateSpan.textContent = `${new Date(move.datesaved).toLocaleString()}`;
      dateDiv.append(dateStrong, dateSpan);

      detailsDiv.append(playerDiv, locationDiv, dateDiv);
      moveCard.append(symbolDiv, detailsDiv);
      this.listContainer.append(moveCard);
    });
  }
}
