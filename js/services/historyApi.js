import { ApiClient } from "./apiClient.js";

export class HistoryApi extends ApiClient {
  constructor() {
    super("http://localhost:8080/tictactoe-webservice/api");
  }

  getAllRooms() {
    return this.get(`/rooms`);
  }

  getAllPlayers() {
    return this.get(`/players`);
  }

  getGamesByRoom(roomCode) {
    return this.get(`/rooms/${roomCode}`);
  }

  getGamesByPlayer(playerName) {
    return this.get(`/players/${playerName}/games`);
  }

  createPendingGame(body) {
    return this.post(`/games/create-pending`, body, {
      headers: { "Content-Type": "application/json" },
    });
  }

  joinPendingGame(body) {
    return this.post(`/games/pending`, body, {
      headers: { "Content-Type": "application/json" },
    });
  }

  deletePendingGame(roomCode, gameId, options = {}) {
    return this.delete(`/games/${roomCode}/pending/${gameId}`, options);
  }

  getGameDetails(gameId) {
    return this.get(`/games/${gameId}`);
  }

  saveMove(body) {
    return this.post(`/games/save`, body, {
      headers: { "Content-Type": "application/json" },
    });
  }
}
