import { Component } from "../core/component.js";

export class HistoryTabsComponent extends Component {
  constructor(onTabChange) {
    super();
    this.onTabChange = onTabChange;
    this.activeTab = "ROOMS";

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.roomsTab = document.createElement("button");
    this.playersTab = document.createElement("button");
  }

  setAttributes() {
    this.componentContainer.classList.add("history-tabs-top");

    this.roomsTab.classList.add("history-tab", "active-tab");
    this.roomsTab.textContent = "Rooms";

    this.playersTab.classList.add("history-tab");
    this.playersTab.textContent = "Players";
  }

  appendElements() {
    this.componentContainer.append(this.roomsTab, this.playersTab);
  }

  attachEvents() {
    this.roomsTab.addEventListener("click", () => {
      if (this.activeTab !== "ROOMS") {
        this.setActiveTab("ROOMS");
        this.onTabChange("ROOMS");
      }
    });

    this.playersTab.addEventListener("click", () => {
      if (this.activeTab !== "PLAYERS") {
        this.setActiveTab("PLAYERS");
        this.onTabChange("PLAYERS");
      }
    });
  }

  setActiveTab(tabName) {
    this.activeTab = tabName;
    if (tabName === "ROOMS") {
      this.roomsTab.classList.add("active-tab");
      this.playersTab.classList.remove("active-tab");
    } else {
      this.playersTab.classList.add("active-tab");
      this.roomsTab.classList.remove("active-tab");
    }
  }

  show() {
    this.componentContainer.classList.remove("hide");
    this.componentContainer.classList.add("show-flex");
  }

  hide() {
    this.componentContainer.classList.add("hide");
    this.componentContainer.classList.remove("show-flex");
  }
}
