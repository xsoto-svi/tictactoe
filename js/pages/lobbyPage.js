import { AlertModal } from "../components/modals/alertModal.js";
import { LoadingModal } from "../components/modals/loadingModal.js";
import { PromptModal } from "../components/modals/promptModal.js";
import { GameStatus, PlayerSymbol } from "../game/gameConstants.js";
import { Router } from "../router.js";
import { Page } from "./page.js";

export class LobbyPage extends Page {
  constructor(appContainer, router, tictactoeApi, gameState, historyApi) {
    super(appContainer);

    this.router = router;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;
    this.historyApi = historyApi;
    this.currentModal = null;

    this.initializeElements();
    this.setAttributes();
    this.appendElements();
    this.attachEvents();
  }

  initializeElements() {
    this.title = document.createElement("h1");
    this.subtitle = document.createElement("p");

    this.cardsWrapper = document.createElement("div");

    this.createGameCard = document.createElement("div");
    this.createGameHeading = document.createElement("h2");
    this.createGameDescription = document.createElement("p");
    this.createGameButton = document.createElement("button");

    this.joinGameCard = document.createElement("div");
    this.joinGameHeading = document.createElement("h2");
    this.joinGameDescription = document.createElement("p");
    this.joinGameForm = document.createElement("form");
    this.joinGameTextbox = document.createElement("input");
    this.joinGameButton = document.createElement("button");

    this.backButton = document.createElement("button");
  }

  setAttributes() {
    this.pageWrapper.classList.add("page-container");
    this.pageWrapper.classList.add("page-base");

    this.title.classList.add("game-title");
    this.title.textContent = "Lobby";

    this.subtitle.classList.add("game-subtitle");
    this.subtitle.textContent = "Choose how you want to start a game!";

    this.cardsWrapper.classList.add("lobby-cards-wrapper");

    this.createGameCard.classList.add("tile-card", "lobby-card");
    this.createGameHeading.classList.add("card-heading");
    this.createGameHeading.textContent = "Host Game";
    this.createGameDescription.classList.add("card-desc");
    this.createGameDescription.textContent =
      "Generate a private room and wait for an opponent.";
    this.createGameButton.classList.add("btn", "btn-chocolate");
    this.createGameButton.textContent = "Create Room";

    this.joinGameCard.classList.add("tile-card", "lobby-card");
    this.joinGameHeading.classList.add("card-heading");
    this.joinGameHeading.textContent = "Join Game";
    this.joinGameDescription.classList.add("card-desc");
    this.joinGameDescription.textContent =
      "Enter a 4-character code to join a friend.";

    this.joinGameForm.classList.add("input-group");
    this.joinGameTextbox.type = "text";
    this.joinGameTextbox.placeholder = "CODE";
    this.joinGameTextbox.maxLength = 4;
    this.joinGameTextbox.classList.add("code-input");

    this.joinGameButton.type = "submit";
    this.joinGameButton.classList.add("btn", "btn-butter");
    this.joinGameButton.textContent = "Join";

    this.backButton.classList.add("btn", "btn-butter");
    this.backButton.style.marginTop = "16px";
    this.backButton.style.maxWidth = "200px";
    this.backButton.textContent = "Back to Menu";
  }

  appendElements() {
    // Assemble Create Card
    this.createGameCard.append(
      this.createGameHeading,
      this.createGameDescription,
      this.createGameButton,
    );

    // Assemble Join Card (Input and button wrapped nicely)
    this.joinGameForm.append(this.joinGameTextbox, this.joinGameButton);
    this.joinGameCard.append(
      this.joinGameHeading,
      this.joinGameDescription,
      this.joinGameForm,
    );

    // Assemble Cards Wrapper
    this.cardsWrapper.append(this.createGameCard, this.joinGameCard);

    // Assemble Main Page
    this.pageWrapper.append(
      this.title,
      this.subtitle,
      this.cardsWrapper,
      this.backButton,
    );
  }

  attachEvents() {
    this.handleBeforeUnload = () => {
      if (this.gameState.roomCode && this.gameState.gameId) {
        this.tictactoeApi.resetGame(this.gameState.roomCode, { keepalive: true }).catch(() => {});
        this.historyApi.deletePendingGame(this.gameState.roomCode, this.gameState.gameId, { keepalive: true }).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", this.handleBeforeUnload);

    this.backButton.addEventListener("click", () => {
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
      this.router.navigate(
        Router.Screens.HOME,
        Router.SlideTransitions.BACKWARD,
      );
    });

    this.createGameButton.addEventListener("click", () => {
      const prompt = new PromptModal(
        "Player Name",
        "Enter your name to host the game:",
        "Your Name",
        async (playerName) => {
          const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
          LoadingModal.showLoading("Connecting to server...", "Please wait...");

          try {
            let responseData = await this.historyApi.createPendingGame({
              playername: playerName,
              roomcode: roomCode
            });
            // Extract the actual UUID string if the server returned a JSON object
            const gameId = typeof responseData === 'object' ? (responseData.gameId || responseData.id || responseData.uuid || responseData.gameUuid) : responseData;
            
            const symbol = await this.tictactoeApi.createGame(roomCode);

            LoadingModal.hideLoading();
            LoadingModal.showLoading(
              "Room Created",
              `Waiting for opponent...`,
              roomCode,
              "Copy this code and share it with your friend!",
            );
            this.gameState.joinRoom(roomCode, gameId, symbol, playerName);

            const checkInterval = setInterval(async () => {
              const isReady = await this.tictactoeApi.checkRoomStatus(roomCode);
              if (isReady == "true") {
                LoadingModal.hideLoading();
                clearInterval(checkInterval);
                this.gameState.status = GameStatus.PLAYING;
                window.removeEventListener("beforeunload", this.handleBeforeUnload);
                this.router.navigate(Router.Screens.GAME);
              }
            }, 500);
          } catch (error) {
            LoadingModal.hideLoading();
            const alertModal = new AlertModal(
              "Network Error",
              "Could not create the game on the server.",
            );
            alertModal.open();
          }
        }
      );
      prompt.open();
    });

    this.joinGameTextbox.addEventListener("input", (event) => {
      this.joinGameTextbox.value = event.target.value.toUpperCase();
    });

    this.joinGameTextbox.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
      }
    });

    this.joinGameForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const roomCode = this.joinGameTextbox.value.trim();
      if (roomCode) {
        this.onJoinSubmit(roomCode);
      }
    });
  }

  onJoinSubmit = async () => {
    const enteredCode = this.joinGameTextbox.value.replace(/\s/g, "");

    if (enteredCode.length !== 4) {
      const alertModal = new AlertModal(
        "Invalid Input",
        "Please enter a valid 4-character code.",
      );
      alertModal.open();
      return;
    }

    const prompt = new PromptModal(
      "Player Name",
      "Enter your name to join the game:",
      "Your Name",
      async (playerName) => {
        LoadingModal.showLoading("Joining...", "Connecting to room...");

        let gameId;
        try {
          let responseData = await this.historyApi.joinPendingGame({
            playername: playerName,
            roomcode: enteredCode
          });
          gameId = typeof responseData === 'object' ? (responseData.gameId || responseData.id || responseData.uuid || responseData.gameUuid) : responseData;
        } catch (err) {
          LoadingModal.hideLoading();
          if (err.status === 400 && err.data && err.data.message) {
            const alertModal = new AlertModal("Cannot Join", err.data.message);
            alertModal.open();
          } else {
            const alertModal = new AlertModal("Network Error", "Could not connect to the history service.");
            alertModal.open();
          }
          return;
        }

        try {
          const symbol = await this.tictactoeApi.createGame(enteredCode);

          if (symbol === PlayerSymbol.X) {
            // If we got "X", the room didn't exist and the server just made a new one
            this.tictactoeApi.resetGame(enteredCode);
            LoadingModal.hideLoading();
            const alertModal = new AlertModal(
              "Room Not Found",
              "Please check the code and try again.",
            );
            alertModal.open();
          } else if (symbol === PlayerSymbol.O) {
            LoadingModal.hideLoading();
            this.gameState.joinRoom(enteredCode, gameId, PlayerSymbol.O, playerName);
            this.gameState.status = GameStatus.PLAYING;
            window.removeEventListener("beforeunload", this.handleBeforeUnload);
            this.router.navigate(Router.Screens.GAME);
          } else {
            LoadingModal.hideLoading();
            const alertModal = new AlertModal(
              "Unable to Join",
              "Game is already full.",
            );
            alertModal.open();
          }
        } catch (error) {
          LoadingModal.hideLoading();
          const alertModal = new AlertModal(
            "Network Error",
            "Could not connect to the server.",
          );
          alertModal.open();
        }
      }
    );
    prompt.open();
  };
}
