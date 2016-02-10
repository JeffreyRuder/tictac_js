$(function() {
  var game = new Game;

  $(".board-cell").click(function(event) {
    console.log(game);
    var cellId = $(this).attr('id').split(",");
    var cellX = parseInt(cellId[0]);
    var cellY = parseInt(cellId[1]);
    console.log(game.board);
    console.log(cellId);
    game.board.getSpace(cellX, cellY).markedBy(game.playerTurn);
    if(game.playerTurn === game.playerOne) {
      $(this).css("background-color", "blue");
    } else {
      $(this).css("background-color", "red");
    }
    game.nextTurn();
    if (game.winner) {
      alert(game.winner.mark + " wins!");
    }
  });

})
