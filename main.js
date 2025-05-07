// Constants
const totalLives = 3;
const displayTimer = 2000;
const flashDuration = 500;

// Game State
let level = parseInt(localStorage.getItem("level")) || 5;
let currentLives = totalLives;
let wrongClicks = 0;
let clickable = false;

// Sounds
const sounds = {
  correct: document.getElementById("correctSound"),
  wrong: document.getElementById("wrongSound"),
  levelUp: document.getElementById("levelUpSound"),
  gameOver: document.getElementById("gameOverSound")
};

// Event Listeners
$(".levelBtn").on("click", handleLevelSelection);
$("#panel").on("click", ".tile", handleTileClick);

// Game Functions
function handleLevelSelection() {
  $("#panel").html();
  level = parseInt(this.getAttribute("data-level"));
  localStorage.setItem("level", level);
  resetGame();
  loadLevel();
}

function handleTileClick() {
  if (!clickable || $(this).hasClass("tile--disabled")) return;

  const tile = $(this).addClass("tile--fill").addClass("tile--disabled");
  
  const isCorrect = tile.attr("data-filled") === "1";
  isCorrect ? handleCorrectClick() : handleWrongClick(tile);
}

// Game Functions
function loadLevel() {
  $("#panel").html(generateBoard());
  wrongClicks = 0;
  setTimeout(() => {
    $(".tile").removeClass("tile--disabled tile--fill tile--wrong");
    clickable = true;
  }, displayTimer);
  $("#level").text(level);
}

function updateLives(value) {
  currentLives = value;
  const hearts = "❤️".repeat(currentLives) + "🖤".repeat(totalLives - currentLives);
  $("#lives").html(hearts);
}

function resetGame() {
  $("#panel").html("<div id='startOverlay'>Choose a Starting Level</div>");
  currentLives = totalLives;
  updateLives(currentLives);
  $("#level").text("");
}

function handleWrongClick(tile) {
  sounds.wrong.play();
  wrongClicks++;
  tile.addClass("tile--wrong");
  
  if (wrongClicks < 3) return;

  clickable = false;
  wrongClicks = 0;
  updateLives(currentLives - 1);

  if (currentLives <= 0) {
    sounds.gameOver.play();
    setTimeout(resetGame, 300);
    return;
  }

  setTimeout(() => {
    tile.removeClass("tile--wrong");
    loadLevel();
  }, 500);
}

function handleCorrectClick() {
  sounds.correct.play();
  setTimeout(() => {
    if ($(".tile--fill").length === $("[data-filled='1']").length) {
      clickable = false;
      sounds.levelUp.play();
      setTimeout(() => {
        level++;
        $("#level").text(level);
        loadLevel();
      }, flashDuration);
    }
  }, 100);
}

function generateBoard() {
  const boardXY = 3 + Math.floor(level / 2);
  const baseHighlight = Math.ceil(5 + level * 0.7);
  const variation = Math.floor(Math.random() * 3) - 1; // -1 to +1
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

  const selectedTiles = getRandom(allTiles, numToHighlight);
  selectedTiles.forEach(tile => tile.attr("data-filled", 1).addClass("tile--fill"));

  return board;
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
