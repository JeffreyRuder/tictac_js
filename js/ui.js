$(function() {
  var game = new Game;
  var gameOn = true;

  $(".player-type").change(function() {
    game.ai = parseInt($(this).val());
  })

  $(".board-cell").click(function(event) {
    if (!gameOn) {
      return;
    }

    //Identify space
    var cellId = $(this).attr('id').split("A");
    console.log(cellId);
    var cellX = parseInt(cellId[0]);
    var cellY = parseInt(cellId[1]);
    thisSpace = game.board.getSpace(cellX, cellY);

    //Mark the space
    if (!thisSpace.isMarked) {
      thisSpace.markedBy(game.playerTurn);
      if(game.playerTurn === game.playerOne) {
        $(this).append("<span class='letter x'>X</span>");
      } else {
        $(this).append("<span class='letter o'>O</span>");
      }

      //Advance turn
      game.nextTurn();

      //Check for winner and update DOM
      if (game.winner && game.winner !== "Draw") {
        $(".turn-info").empty().append("<h2>Player " + game.winner.mark + " wins!</h2>");
        gameOn = false;
        $(".reset-button").show();
      } else if (game.winner) {
        $(".turn-info").empty().append("<h2>It's a draw!</h2>");
        gameOn = false;
        $(".reset-button").show();
      } else {
        $(".turn-info").empty().append("<h2>Player " + game.playerTurn.mark + "'s turn!</h2>");
      }

      //AI player simulates a click
      if (game.ai === 1 && game.playerTurn === game.playerTwo) {
        var aiSpace = game.easyAIMove();
        var spaceString = ".board-cell#" + aiSpace.xCoordinate + "A" + aiSpace.yCoordinate;
        $(spaceString).trigger("click");
      }
    }
  });
})
