import { HomePage } from "./pages/homePage.js";
import { HowToPlayPage } from "./pages/howToPlayPage.js";
import { LobbyPage } from "./pages/lobbyPage.js";
import { RoomPage } from "./pages/roomPage.js";
import { Router } from "./router.js";

const container = document.querySelector("#app");

const routes = {
  "/": HomePage,
  "/how-to-play": HowToPlayPage,
  "/lobby": LobbyPage,
  "/room": RoomPage
};

const router = new Router(container, routes);