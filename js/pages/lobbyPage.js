import { Modal } from "../components/common/modal.js";
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
    this.pageWrapper = document.createElement("div");
    this.title = document.createElement("h1");

    this.createGameContainer = document.createElement("div");
    this.createGameHeading = document.createElement("h2");
    this.createGameDescription = document.createElement("p");
    this.createGameButton = document.createElement("button");

    this.joinGameContainer = document.createElement("div");
    this.joinGameHeading = document.createElement("h2");
    this.joinGameDescription = document.createElement("p");

    this.joinGameLabel = document.createElement("label");
    this.joinGameTextbox = document.createElement("input");
    this.joinGameButton = document.createElement("button");

    this.backButton = document.createElement("button");
  }

  setAttributes() {
    this.pageWrapper.classList.add("page-container");
    
    this.createGameContainer.classList.add("option-container");
    this.createGameHeading.classList.add("option-heading");
    this.createGameHeading.textContent = "Create Game";
    this.createGameDescription.classList.add("description");
    this.createGameDescription.textContent = "Create Game Description";
    this.createGameButton.classList.add("btn-create");
    this.createGameButton.textContent = "Create";

    this.joinGameContainer.classList.add("option-container");
    this.joinGameHeading.classList.add("option-heading");
    this.joinGameHeading.textContent = "Join Game";
    this.joinGameDescription.classList.add("description");
    this.joinGameDescription.textContent = "Join Game Description";

    this.joinGameLabel.textContent = "Enter Code";
    this.joinGameTextbox.maxLength = 4;
    this.joinGameButton.classList.add("btn-join");
    this.joinGameButton.textContent = "Join";

    this.backButton.classList.add("back-button");
    this.backButton.textContent = "Back";
  }

  appendElements() {
    this.createGameContainer.append(
      this.createGameHeading,
      this.createGameDescription,
      this.createGameButton
    );

    this.joinGameContainer.append(
      this.joinGameHeading,
      this.joinGameDescription,
      this.joinGameLabel,
      this.joinGameTextbox,
      this.joinGameButton
    );

    this.pageWrapper.append(
      this.title,
      this.createGameContainer,
      this.joinGameContainer,
      this.backButton
    );
  }

  attachEvents() {
    this.backButton.addEventListener("click", () => {
      this.router.navigate("/");
    });

    this.createGameButton.addEventListener("click", async () => {
      const roomCode = Math.random().toString(36).substring(2, 6);
      this.showLoadingModal("Room Created", `Waiting for opponent... Code: ${roomCode}`);

      try {
        const symbol = await this.tictactoeApi.createGame(roomCode);
        this.gameState.joinRoom(roomCode, symbol);

        const checkInterval = setInterval(async () => {
          const isReady = await this.tictactoeApi.checkRoomStatus(roomCode);
          if (isReady == "true") {
            clearInterval(checkInterval);
            this.gameState.status = "playing";
            this.closeModal();
            this.router.navigate("/game");
          }
        }, 1500);

      } catch (error) {
        this.showAlertModal("Network Error", "Could not create the game on the server.");
      }
    });

    this.joinGameTextbox.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        event.preventDefault();
      }
    });

    this.joinGameButton.addEventListener("click", async () => {
      const enteredCode = this.joinGameTextbox.value.replace(/\s/g, "");

      if (enteredCode.length !== 4) {
        this.showAlertModal("Invalid Input", "Please enter a valid 4-character code.");
        return;
      }

      this.showLoadingModal("Joining...", "Connecting to room...");

      try {
        const symbol = await this.tictactoeApi.createGame(enteredCode);

        if (symbol === "X") {
          // If we got "X", the room didn't exist and the server just made a new one
          this.tictactoeApi.resetGame(enteredCode);
          this.showAlertModal("Room Not Found", "Please check the code and try again.");
          
        } else if (symbol === "O") {
          this.gameState.joinRoom(enteredCode, "O");
          this.gameState.status = "playing";
          this.closeModal();
          this.router.navigate("/game");
        } else {
          this.showAlertModal("Unable to Join", symbol);
        }
      } catch (error) {
        this.showAlertModal("Network Error", "Could not connect to the server.");
      }
    });
  }

  showLoadingModal(title, message) {
    this.closeModal();
    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    this.currentModal = new Modal(document.body, title, messageElement, false);
    this.currentModal.open();
  }

  showAlertModal(title, message) {
    this.closeModal(); 
    const messageElement = document.createElement("p");
    messageElement.textContent = message;

    this.currentModal = new Modal(document.body, title, messageElement, true);
    this.currentModal.open();
  }

  closeModal() {
    if (this.currentModal) {
      this.currentModal.close();
      this.currentModal = null;
    }
  }
}