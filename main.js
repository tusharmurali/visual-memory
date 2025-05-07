// Constants
const totalLives = 3;
const displayTimer = 2000;
const flashDuration = 500;

let level = localStorage.getItem("level")
  ? parseInt(localStorage.getItem("level"))
  : 5;
let difficulty = 1;
let currentLives = totalLives;
let wrongClicks = 0;
let clickable = false;

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const levelUpSound = document.getElementById("levelUpSound");
const gameOverSound = document.getElementById("gameOverSound");

// Add event listeners to the level buttons
$(".levelBtn").on("click", function () {
  level = this.getAttribute("data-level");
  localStorage.setItem("level", level);
  resetGame();
  loadLevel();
});

// Tile Click Handler
$("#panel").on("click", ".tile", function () {
  if (!clickable) return;

  $(this).addClass("tile--fill");

  const tileFilled = $(this).attr("data-filled") === "1";

  if (!tileFilled) {
    wrongSound.play();
    $(this).addClass("tile--wrong");
    wrongClicks++;

    if (wrongClicks >= 3) {
      clickable = false;
      wrongClicks = 0;
      updateLives(currentLives - 1);

      if (currentLives <= 0) {
        gameOverSound.play();
        setTimeout(() => alert("Game over! Restarting..."), 300);
        resetGame();
      }

      setTimeout(() => {
        $(".tile--wrong").removeClass("tile--wrong");
        loadLevel();
      }, 500);
    }
  } else {
    handleCorrectClick();
  }
});

// Game Functions
function loadLevel() {
  $("#panel").html(generateBoard(true));
  wrongClicks = 0;
  setTimeout(() => {
    $(".tile--fill").removeClass("tile--fill");
    $(".tile--wrong").removeClass("tile--wrong");
    clickable = true;
  }, displayTimer);
  $("#level").text(level);
}

function updateLives(value) {
  currentLives = value;
  const hearts =
    "❤️".repeat(currentLives) + "🖤".repeat(totalLives - currentLives);
  $("#lives").html(hearts);
}

function resetGame() {
  currentLives = totalLives;
  updateLives(currentLives);
  $("#level").text("");
}

function handleWrongClick() {
  clickable = false;
  wrongSound.play();
  setTimeout(() => $(".tile").removeClass("tile--fill"), 200);
  updateLives(currentLives - 1);

  if (currentLives <= 0) {
    gameOverSound.play();
    setTimeout(() => alert("Game over! Restarting..."), 300);
    resetGame();
  }
}

function handleCorrectClick() {
  correctSound.play();
  if ($(".tile--fill").length === $("[data-filled='1']").length) {
    clickable = false;
    levelUpSound.play();
    setTimeout(() => {
      level++;
      $("#level").text(level);
      loadLevel();
    }, flashDuration);
  }
}

function generateBoard(showTiles = true) {
  const boardXY = 3 + Math.floor(level / 2);
  const baseHighlight = Math.ceil(5 + level * 0.7);
  const variation = Math.floor(Math.random() * 5) - 2; // -2 to +2
  const numToHighlight = Math.max(1, baseHighlight + variation);
  const board = $("<div class='inner-panel'>");

  let allTiles = [];
  for (let row = 0; row < boardXY; row++) {
    const rowTiles = $("<div class='row'>");
    for (let col = 0; col < boardXY; col++) {
      const tile = $("<div class='tile'></div>")
        .attr("data-filled", 0)
        .attr("id", `tile_${row}_${col}`);
      allTiles.push(tile);
      rowTiles.append(tile);
    }
    board.append(rowTiles);
  }

  if (showTiles) {
    highlightRandomTiles(allTiles, numToHighlight);
  }

  return board;
}

function highlightRandomTiles(allTiles, numToHighlight) {
  const selected = getRandom(allTiles, numToHighlight);
  selected.forEach((tile) => {
    tile.attr("data-filled", 1).addClass("tile--fill");
  });
}

function getRandom(arr, n) {
  const result = [];
  const taken = new Set();

  while (result.length < n && result.length < arr.length) {
    const idx = Math.floor(Math.random() * arr.length);
    if (!taken.has(idx)) {
      taken.add(idx);
      result.push(arr[idx]);
    }
  }

  return result;
}
