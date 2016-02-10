$(function() {
  var game = new Game;
  var gameOn = true;

  $(".board-cell").click(function(event) {
    if (!gameOn) {
      return;
    }
    var cellId = $(this).attr('id').split(",");
    var cellX = parseInt(cellId[0]);
    var cellY = parseInt(cellId[1]);
    thisSpace = game.board.getSpace(cellX, cellY);
    if (!thisSpace.isMarked) {
      thisSpace.markedBy(game.playerTurn);
      if(game.playerTurn === game.playerOne) {
        $(this).append("<span class='letter x'>X</span>");
      } else {
        $(this).append("<span class='letter o'>O</span>");
      }
      game.nextTurn();
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
    }
  });
})
