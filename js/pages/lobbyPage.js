import { AlertModal } from "../components/modals/alertModal.js";
import { LoadingModal } from "../components/modals/loadingModal.js";
import { Modal } from "../components/modals/modal.js";
import { GameStatus, PlayerSymbol } from "../game/gameConstants.js";
import { Router } from "../router.js";
import { Page } from "./page.js";

export class LobbyPage extends Page {
  constructor(appContainer, router, tictactoeApi, gameState) {
    super(appContainer);

    this.router = router;
    this.tictactoeApi = tictactoeApi;
    this.gameState = gameState;
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
    this.joinGameInputWrapper = document.createElement("div");
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
    this.createGameDescription.textContent = "Generate a private room and wait for an opponent.";
    this.createGameButton.classList.add("btn", "btn-chocolate");
    this.createGameButton.textContent = "Create Room";

    this.joinGameCard.classList.add("tile-card", "lobby-card");
    this.joinGameHeading.classList.add("card-heading");
    this.joinGameHeading.textContent = "Join Game";
    this.joinGameDescription.classList.add("card-desc");
    this.joinGameDescription.textContent = "Enter a 4-character code to join a friend.";
    
    this.joinGameInputWrapper.classList.add("input-group");
    this.joinGameTextbox.type = "text";
    this.joinGameTextbox.placeholder = "CODE";
    this.joinGameTextbox.maxLength = 4;
    this.joinGameTextbox.classList.add("code-input");

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
      this.createGameButton
    );

    // Assemble Join Card (Input and button wrapped nicely)
    this.joinGameInputWrapper.append(this.joinGameTextbox, this.joinGameButton);
    this.joinGameCard.append(
      this.joinGameHeading,
      this.joinGameDescription,
      this.joinGameInputWrapper
    );

    // Assemble Cards Wrapper
    this.cardsWrapper.append(this.createGameCard, this.joinGameCard);

    // Assemble Main Page
    this.pageWrapper.append(
      this.title,
      this.subtitle,
      this.cardsWrapper,
      this.backButton
    );
  }

  attachEvents() {
    this.backButton.addEventListener("click", () => {
      this.router.navigate(Router.Screens.HOME, Router.SlideTransitions.BACKWARD);
    });

    this.createGameButton.addEventListener("click", async () => {
      // const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
      LoadingModal.showLoading("Connecting to server...", "Please wait...")
      const roomCode = "TEST";

      try {
        const symbol = await this.tictactoeApi.createGame(roomCode);
        LoadingModal.hideLoading();
        LoadingModal.showLoading(
          "Room Created",
          `Waiting for opponent...`,
          roomCode,
          "Copy this code and share it with your friend!"
        );
        this.gameState.joinRoom(roomCode, symbol);

        const checkInterval = setInterval(async () => {
          const isReady = await this.tictactoeApi.checkRoomStatus(roomCode);
          if (isReady == "true") {
            LoadingModal.hideLoading();
            clearInterval(checkInterval);
            this.gameState.status = GameStatus.PLAYING;
            this.router.navigate(Router.Screens.GAME);
          }
        }, 500);
      } catch (error) {
        LoadingModal.hideLoading();
        const alertModal = new AlertModal("Network Error", "Could not create the game on the server.");
        alertModal.open();
      }
    });

    this.joinGameTextbox.addEventListener("input", (event) => {
      this.joinGameTextbox.value = event.target.value.toUpperCase();
    });

    this.joinGameTextbox.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
      }
    });

    this.joinGameButton.addEventListener("click", async () => {
      const enteredCode = this.joinGameTextbox.value.replace(/\s/g, "");

      if (enteredCode.length !== 4) {
        const alertModal = new AlertModal("Invalid Input", "Please enter a valid 4-character code.");
        alertModal.open();
        return;
      }

      LoadingModal.showLoading("Joining...", "Connecting to room...");

      try {
        const symbol = await this.tictactoeApi.createGame(enteredCode);

        LoadingModal.hideLoading();

        if (symbol === PlayerSymbol.X) {
          // If we got "X", the room didn't exist and the server just made a new one
          this.tictactoeApi.resetGame(enteredCode);
          const alertModal = new AlertModal("Room Not Found", "Please check the code and try again.");
          alertModal.open();
          
        } else if (symbol === PlayerSymbol.O) {
          this.gameState.joinRoom(enteredCode, PlayerSymbol.O);
          this.gameState.status = GameStatus.PLAYING;          
          this.router.navigate(Router.Screens.GAME);
        } else {

          const alertModal = new AlertModal("Unable to Join", symbol);
          alertModal.open();
        }
      } catch (error) {
        LoadingModal.hideLoading();
        const alertModal = new AlertModal("Network Error", "Could not connect to the server.");
        alertModal.open();
      }
    });
  }
}
