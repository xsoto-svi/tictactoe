import { GameState } from "./game/gameState.js";
import { Router } from "./router.js";
import { TicTacToeApi } from "./services/tictactoeApi.js";

const appContainer = document.querySelector("#app");
const tictactoeApi = new TicTacToeApi();
const gameState = new GameState();

const router = new Router(appContainer, tictactoeApi, gameState);