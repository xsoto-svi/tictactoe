import { GameState } from "./game/gameState.js";
import { GamePage } from "./pages/gamePage.js";
import { HomePage } from "./pages/homePage.js";
import { HowToPlayPage } from "./pages/howToPlayPage.js";
import { LobbyPage } from "./pages/lobbyPage.js";
import { RoomPage } from "./pages/roomPage.js";
import { Router } from "./router.js";
import { TicTacToeApi } from "./services/tictactoeApi.js";

const appContainer = document.querySelector("#app");
const tictactoeApi = new TicTacToeApi();
const gameState = new GameState();

const routes = {
  "/": HomePage,
  "/how-to-play": HowToPlayPage,
  "/lobby": LobbyPage,
  "/room": RoomPage,
  "/game": GamePage
}

const router = new Router(appContainer, routes, tictactoeApi, gameState);