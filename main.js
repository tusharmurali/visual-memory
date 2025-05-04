var totalLives = 3;
    var level = 1;
    var difficulty = 1;
    var currentLives = totalLives;
    var clickable = false;

    var displayTimer = 2000;
    var flashDuration = 500;

    const correctSound = document.getElementById('correctSound');
    const wrongSound = document.getElementById('wrongSound');
    const levelUpSound = document.getElementById('levelUpSound');
    const gameOverSound = document.getElementById('gameOverSound');

    $('#startBtn').click(function () {
      level = parseInt($('#levelSelector').val());
      $("#level").text(level);
      currentLives = totalLives;
      updateLives(currentLives);
      loadLevel();
    });

    $('#panel').on('click', '.tile', function () {
      if (!clickable) return;

      $(this).addClass('tile--fill');

      if ($(this).attr('data-filled') != 1) {
        clickable = false;
        wrongSound.play();
        setTimeout(() => $(".tile").removeClass('tile--fill'), 200);
        updateLives(currentLives - 1);

        if (currentLives <= 0) {
          gameOverSound.play();
          setTimeout(() => alert("Game over! Restarting..."), 300);
          level = 1;
          currentLives = totalLives;
          $("#level").text(level);
          updateLives(currentLives);
        }

        let i = setInterval(() => {
          $("[data-filled='1']").toggleClass('tile--fill');
        }, flashDuration);

        setTimeout(() => {
          clearInterval(i);
          loadLevel();
        }, (flashDuration * 4) + 100);

      } else {
        correctSound.play();
        if ($('.tile--fill').length == $("[data-filled='1']").length) {
          clickable = false;
          levelUpSound.play();
          setTimeout(() => {
            level++;
            $("#level").text(level);
            loadLevel();
          }, flashDuration);
        }
      }
    });

    function loadLevel() {
      $("#panel").html(generateBoard(true));
      setTimeout(() => {
        $(".tile--fill").removeClass("tile--fill");
        clickable = true;
      }, displayTimer);
    }

    function updateLives(value) {
        currentLives = value;
        const hearts = '❤️'.repeat(currentLives) + '🖤'.repeat(totalLives - currentLives);
        $("#lives").html(hearts);
      }

    function generateBoard(showTiles = true) {
      let boardXY = 3 + Math.floor(level / 2);
      let numToHighlight = Math.ceil(5 + level * 0.7);
      let board = $("<div class='inner-panel'>");

      let allTiles = [];

      for (let row = 0; row < boardXY; row++) {
        let rowTiles = $("<div class='row'>");
        for (let col = 0; col < boardXY; col++) {
          let tile = $("<div class='tile'></div>");
          tile.attr('data-filled', 0);
          tile.attr('id', `tile_${row}_${col}`);
          allTiles.push(tile);
          rowTiles.append(tile);
        }
        board.append(rowTiles);
      }

      if (showTiles) {
        let selected = getRandom(allTiles, numToHighlight);
        selected.forEach(tile => {
          tile.attr('data-filled', 1).addClass('tile--fill');
        });
      }

      return board;
    }

    function getRandom(arr, n) {
      let result = [];
      let taken = new Set();
      while (result.length < n && result.length < arr.length) {
        let idx = Math.floor(Math.random() * arr.length);
        if (!taken.has(idx)) {
          taken.add(idx);
          result.push(arr[idx]);
        }
      }
      return result;
    }