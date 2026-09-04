import { ApiClient } from "./apiClient.js";

export class HistoryApi extends ApiClient {
  constructor() {
    super("http://localhost:8080/tictactoe-webservice/api");
  }

  // Placeholder APIs for History
  getAllRooms() {
    return this.get(`/room/all`);
  }

  getAllPlayers() {
    return this.get(`/player/all`);
  }

  getGamesByRoom(roomId) {
    return this.get(`/room/${roomId}`);
  }

  getGamesByPlayer(playerName) {
    return this.get(`/player/${playerName}/games`);
  }

  getGameDetails(gameId) {
    return this.get(`/game/${gameId}`);
  }

  saveMove(body) {
    return this.post(`/game/save`, body);
  }
}
