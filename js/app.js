import { GameState } from "./game/gameState.js";
import { Router } from "./router.js";
import { TicTacToeApi } from "./services/tictactoeApi.js";
import { HistoryApi } from "./services/historyApi.js";

const appContainer = document.querySelector("#app");
const tictactoeApi = new TicTacToeApi();
const historyApi = new HistoryApi();
const gameState = new GameState();

const router = new Router(appContainer, tictactoeApi, historyApi, gameState);
