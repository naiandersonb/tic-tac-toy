const board = document.getElementById("board");
const resetButton = document.querySelector(".reset-btn");

const WIN_CONDITIONS = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
  [1, 5, 9],
  [3, 5, 7],
  [1, 4, 7],
  [2, 5, 8],
  [3, 6, 9],
];

resetButton.addEventListener("click", () => {
  currentPlayer.reset();
  gameBoard.reset();
  resetBoard();
});

const resetBoard = () => {
  const boardCells = document.querySelectorAll(".board-cell");

  boardCells.forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("board-cell-disabled");
  });
};
(() => {
  for (let i = 1; i <= 9; i++) {
    const button = document.createElement("button");
    button.id = i;
    button.type = "button";
    button.readOnly = true;
    button.className = "board-cell box play-regular";
    button.addEventListener("click", () => gameBoard.selectField(i));
    board.appendChild(button);
  }
})();

const currentPlayer = (() => {
  let currentPlayer = "0";

  const change = () => {
    const zeroPlayer = document.getElementById("p-0");
    const xPlayer = document.getElementById("p-x");

    switch (currentPlayer) {
      case "0":
        currentPlayer = "X";
        zeroPlayer.classList.add("player-0");
        xPlayer.classList.remove("player-x");
        break;

      case "X":
        currentPlayer = "0";
        xPlayer.classList.add("player-x");
        zeroPlayer.classList.remove("player-0");
        break;
    }
  };

  const reset = () => (currentPlayer = "0");

  const get = () => currentPlayer;

  return { change, reset, get };
})();

const gameBoard = (() => {
  const score0 = document.querySelector("[data-score='0']");
  const scoreX = document.querySelector("[data-score='x']");
  const buttons = document.querySelectorAll(".board-cell");

  let finished = false;
  let winner = null;

  const players = {
    0: [],
    X: [],
  };

  const score = { 0: 0, X: 0 };

  const get = () => players;

  function selectField(id) {
    const button = document.getElementById(id);
    const value = button.innerText;

    if (value !== "0" && value !== "X" && !finished) {
      const player = currentPlayer.get();
      button.innerText = player;
      currentPlayer.change();
      set(player, id);
    }
  }

  const set = (player, value) => {
    players[player].push(value);
    checkWinner(players[player], player);
  };

  const checkWinner = (list, player) => {
    for (let i = 0; i < WIN_CONDITIONS.length; i++) {
      const [a, b, c] = WIN_CONDITIONS[i];

      if (list.includes(a) && list.includes(b) && list.includes(c)) {
        showResult([a, b, c], player);
        winner = player;
        incrementScore(player);
        finished = true;
        return;
      }
    }
  };

  const incrementScore = (player) => {
    score[player]++;
    if (player === "0") {
      score0.innerText = score["0"];
    } else {
      scoreX.innerText = score["X"];
    }
  };

  const showResult = (winList, player) => {
    for (let i = 0; i < buttons.length; i++) {
      const id = Number(buttons[i].id);
      if (!winList.includes(id)) {
        buttons[i].classList.add("board-cell-disabled");
      }
    }

    winner.innerText = player;

    winnerContainer.classList.remove("hidden");
    resetContainer.classList.remove("hidden");

    if (player === "0") {
      winner.style.color = "#92c4ed";
    } else {
      winner.style.color = "#fde67e";
    }
  };

  const reset = () => {
    const winnerContainer = document.querySelector(".winner");
    const resetContainer = document.querySelector(".reset-container");

    winnerContainer.classList.add("hidden");
    resetContainer.classList.add("hidden");

    finished = false;
    winner = null;
    players[0] = [];
    players["X"] = [];
  };

  const getFinished = () => finished;
  const getWinner = () => winner;

  return { get, set, getFinished, getWinner, selectField, reset };
})();
