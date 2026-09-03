export class GamePollingService {
  constructor(tictactoeApi, gameState, callbacks) {
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;
    this.callbacks = callbacks;

    this.gameInterval = null;
    this.rematchInterval = null;
  }

  startGamePoll() {
    this.stopAllPolls();

    let isPollingInProgress = false;

    const poll = async () => {
      if (isPollingInProgress) return;
      isPollingInProgress = true;

      try {
        const boardData = await this.tictactoeApi.boardStatus(
          this.gameState.roomCode,
        );

        if (boardData === "[GAME NOT YET STARTED]") {
          this.stopAllPolls();
          this.callbacks.onOpponentLeft();
          return;
        }

        this.gameState.syncWithServer(boardData);

        if (this.gameState.isGameOver) {
          this.stopAllPolls();
          this.callbacks.onGameOver();
          return;
        }

        this.callbacks.onGameStateUpdate();
      } catch (error) {
        this.stopAllPolls();
        this.callbacks.onError(
          "Game Disconnected",
          "The room was closed.",
          true,
        );
        return;
      } finally {
        isPollingInProgress = false;
      }

      this.gameInterval = setTimeout(poll, 500);
    };

    poll();
  }

  startRematchPoll(oldRoomCode, nextRoomCode, newAssignedSymbol) {
    this.stopAllPolls();

    let isPollingInProgress = false;

    const poll = async () => {
      if (isPollingInProgress) return;
      isPollingInProgress = true;

      try {
        const isNextRoomReady =
          await this.tictactoeApi.checkRoomStatus(nextRoomCode);

        if (isNextRoomReady === "true") {
          this.stopAllPolls();
          this.callbacks.onRematchReady(
            oldRoomCode,
            nextRoomCode,
            newAssignedSymbol,
          );
          return;
        }

        // Check if the opponent left the old room
        const oldRoomData = await this.tictactoeApi.boardStatus(oldRoomCode);

        if (oldRoomData === "[GAME NOT YET STARTED]") {
          // THE OPPONENT LEFT!
          this.stopAllPolls();
          this.callbacks.onOpponentLeftRematch(nextRoomCode);
          return;
        }
      } catch (error) {
        this.stopAllPolls();
        this.callbacks.onError("Game Error", "Connection lost.", false);
        return;
      } finally {
        isPollingInProgress = false;
      }

      this.rematchInterval = setTimeout(poll, 1000);
    };

    poll();
  }

  stopAllPolls() {
    if (this.gameInterval) {
      clearTimeout(this.gameInterval);
      this.gameInterval = null;
    }
    if (this.rematchInterval) {
      clearTimeout(this.rematchInterval);
      this.rematchInterval = null;
    }
  }
}
