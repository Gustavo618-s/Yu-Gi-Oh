const state = {
  score: {
    playerScore: 0,
    computerScore: 0,
    scoreBox: document.getElementById("score-points"),
  },
  cardSprites: {
    avatar: document.getElementById("card-image"),
    name: document.getElementById("card-name"),
    type: document.getElementById("card-type"),
  },
  fieldCards: {
    player: document.getElementById("player-field-card"),
    computer: document.getElementById("computer-field-card"),
  },
  playerSide: {
    player1: "player-cards",
    player1Box: document.querySelector("#player-cards"),
    computer: "computer-cards",
    computerBox: document.querySelector("#computer-cards"),
  },
  actions: {
    button: document.getElementById("next-duel"),
  },
};

const cardData = [
  {
    id: 0,
    name: "Blue Eyes White Dragon",
    type: "Paper",
    img: "./src/assets/icons/dragon.png",
    winOf: [1],
    loseOf: [2],
  },
  {
    id: 1,
    name: "Dark Magician",
    type: "Rock",
    img: "./src/assets/icons/magician.png",
    winOf: [2],
    loseOf: [0],
  },
  {
    id: 2,
    name: "Exodia",
    type: "Scissors",
    img: "./src/assets/icons/exodia.png",
    winOf: [0],
    loseOf: [1],
  },
];

async function getrandomCardId() {
  const randomIndex = Math.floor(Math.random() * cardData.length);
  return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
  const cardImage = document.createElement("img");
  cardImage.setAttribute("height", "100px");
  cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
  cardImage.setAttribute("data-id", IdCard);
  cardImage.classList.add("card");

  if (fieldSide === state.playerSide.player1) {
    cardImage.addEventListener("mouseover", () => {
      drawSelectedCard(IdCard);
    });

    cardImage.addEventListener("click", () => {
      setCardsField(cardImage.getAttribute("data-id"));
    });
  }

  return cardImage;
}

async function setCardsField(cardId) {
  await removeAllCardsImages();

  let computerCardId = await getrandomCardId();

  state.fieldCards.player.style.display = "block";
  state.fieldCards.computer.style.display = "block";

  state.cardSprites.avatar.src = "";
  state.cardSprites.name.innerText = "";
  state.cardSprites.type.innerText = "";

  state.fieldCards.player.src = cardData[cardId].img;
  state.fieldCards.computer.src = cardData[computerCardId].img;

  let duelResults = await checkDuelResults(cardId, computerCardId);

  await updateScore();
  await drawButton(duelResults);
}

async function drawButton(text) {
  state.actions.button.innerText = text;
  state.actions.button.style.display = "block";
}

async function updateScore() {
  state.score.scoreBox.innerText = `Win: ${state.score.playerScore} | Lose: ${state.score.computerScore}`;
}
async function checkDuelResults(playerCardId, computerCardId) {
  let duelResults = "draw";
  let playerCard = cardData[playerCardId];

  if (playerCard.winOf.includes(computerCardId)) {
    duelResults = "win";
    await playAudio("duelResults");
    state.score.playerScore++;
  }

  if (playerCard.loseOf.includes(computerCardId)) {
    duelResults = "lose";
    await playAudio("duelResults");
    state.score.computerScore++;
  }
  return duelResults;
}

async function removeAllCardsImages() {
  let cards = state.playerSide.computerBox;
  let imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());

  cards = state.playerSide.player1Box;
  imgElements = cards.querySelectorAll("img");
  imgElements.forEach((img) => img.remove());
}

async function drawSelectedCard(index) {
  state.cardSprites.avatar.src = cardData[index].img;
  state.cardSprites.name.innerText = cardData[index].name;
  state.cardSprites.type.innerText = "Attribute : " + cardData[index].type;
}

async function drawCards(cardNumbers, fieldSide) {
  for (let i = 0; i < cardNumbers; i++) {
    const randomIdCard = await getrandomCardId();
    const cardImage = await createCardImage(randomIdCard, fieldSide);

    const box =
      fieldSide === state.playerSide.player1
        ? state.playerSide.player1Box
        : state.playerSide.computerBox;

    box.appendChild(cardImage);
  }
}

async function resetDuel() {
  state.cardSprites.avatar.src = "";
  state.actions.button.style.display = "none";

  state.fieldCards.player.style.display = "none";
  state.fieldCards.computer.style.display = "none";

  init();
}

async function playAudio(status) {
  const audio = new Audio(`./src/assets/sounds/${status}.wav`);
  audio.play();
}

function init() {
  drawCards(5, state.playerSide.player1);
  drawCards(5, state.playerSide.computer);

  const bgm = document.getElementById("bgm");
  bgm.play();
}

init();
