import { ApiClient } from "./apiClient.js";

export class TicTacToeApi extends ApiClient {
  constructor() {
    super("http://localhost:8080/tictactoe/tictactoeserver");
  }
  
  createGame(roomCode) {
    return this.get(`/createGame?key=${roomCode}`);
  }

  checkRoomStatus(roomCode) {
    return this.get(`/check?key=${roomCode}`);
  }

  updateToAddMove(roomCode, symbol, x, y) {
    return this.get(`/move?key=${roomCode}&tile=${symbol}&y=${y}&x=${x}`);
  }

  boardStatus(roomCode) {
    return this.get(`/board?key=${roomCode}`);
  }

  resetGame(roomCode) {
    return this.get(`/reset?key=${roomCode}`);
  }
}