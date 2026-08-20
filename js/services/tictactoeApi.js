import { ApiClient } from "./apiClient.js";

export class TicTacToeApi extends ApiClient {
  constructor() {
    super("http://localhost:8080/tictactoe/tictactoeserver");
  }

  createGame(roomCode, options = {}) {
    return this.get(`/createGame?key=${roomCode}`);
  }

  checkRoomStatus(roomCode, option = {}) {
    return this.get(`/check?key=${roomCode}`);
  }

  updateToAddMove(roomCode, symbol, x, y, options = {}) {
    return this.get(`/move?key=${roomCode}&tile=${symbol}&y=${y}&x=${x}`);
  }

  boardStatus(roomCode, options = {}) {
    return this.get(`/board?key=${roomCode}`);
  }

  resetGame(roomCode, options = {}) {
    return this.get(`/reset?key=${roomCode}`, options);
  }
}
