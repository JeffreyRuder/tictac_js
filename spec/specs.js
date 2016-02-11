describe('Player', function() {
  it("returns the player's mark", function() {
    var testPlayer = new Player("X");
    expect(testPlayer.mark).to.equal("X");
  });
});

describe('Space', function() {
  it("return its x-coordinate", function() {
    var testSpace = new Space(1,2);
    expect(testSpace.xCoordinate).to.equal(1);
  });

  it("returns its y-coordinate", function() {
    var testSpace = new Space(1,2);
    expect(testSpace.yCoordinate).to.equal(2);
  });

  it("lets a player mark a space", function() {
    var testPlayer = new Player("X")
    var testSpace = new Space(1,2);
    testSpace.markedBy(testPlayer);
    expect(testSpace.markedBy()).to.equal(testPlayer);
  });

  it("knows if another space is adjacent", function() {
    var testBoard = new Board;
    expect(testBoard.getSpace(1, 1).isAdjacent(testBoard.getSpace(1, 2))).to.be.true;
    expect(testBoard.getSpace(1, 1).isAdjacent(testBoard.getSpace(1, 3))).to.be.false;
  });
});

describe('Board', function() {
  it("creates 9 spaces when it is initialized", function() {
    var testBoard = new Board();
    expect(testBoard.spaces.length).to.equal(9);
  });

  it("returns a space by its coordinates", function() {
    var testBoard = new Board();
    expect(testBoard.getSpace(1, 2).xCoordinate).to.equal(1);
    expect(testBoard.getSpace(1, 2).yCoordinate).to.equal(2);
  });

  it("returns all unmarked spaces", function() {
    var game = new Game;
    game.board.getSpace(1, 1).markedBy(game.playerOne);
    expect(game.board.getUnmarkedSpaces()).to.be.an("array");
    expect(game.board.getUnmarkedSpaces().length).to.equal(8);
  })


  it("should be able to tell if a player has three horizontal marks in a row", function() {
    var emptyBoard = new Board();
    var fullBoard = new Board();
    var playerOne = new Player("X");
    fullBoard.getSpace(1,1).markedBy(playerOne);
    fullBoard.getSpace(2,1).markedBy(playerOne);
    fullBoard.getSpace(3,1).markedBy(playerOne);
    expect(emptyBoard.horizontalWinner()).to.be.false;
    expect(fullBoard.horizontalWinner()).to.equal(playerOne);
  });

  it("should be able to tell if a player has three vertical marks in a row", function() {
    var emptyBoard = new Board();
    var fullBoard = new Board();
    var playerOne = new Player("X");
    fullBoard.getSpace(1,1).markedBy(playerOne);
    fullBoard.getSpace(1,2).markedBy(playerOne);
    fullBoard.getSpace(1,3).markedBy(playerOne);
    expect(emptyBoard.verticalWinner()).to.be.false;
    expect(fullBoard.verticalWinner()).to.equal(playerOne);
  });

  it("should be able to tell if a player has three diagonal marks in a row", function() {
    var emptyBoard = new Board();
    var firstFullBoard = new Board();
    var secondFullBoard = new Board();
    var playerOne = new Player("X");
    firstFullBoard.getSpace(1,1).markedBy(playerOne);
    firstFullBoard.getSpace(2,2).markedBy(playerOne);
    firstFullBoard.getSpace(3,3).markedBy(playerOne);
    secondFullBoard.getSpace(1,3).markedBy(playerOne);
    secondFullBoard.getSpace(2,2).markedBy(playerOne);
    secondFullBoard.getSpace(3,1).markedBy(playerOne);
    expect(emptyBoard.diagonalWinner()).to.be.false;
    expect(firstFullBoard.diagonalWinner()).to.equal(playerOne);
    expect(secondFullBoard.diagonalWinner()).to.equal(playerOne);
  });
});

describe('Game', function() {
  it("creates 2 players and a board", function() {
    var testGame = new Game();
    expect(testGame.playerOne.mark).to.equal("X");
    expect(testGame.playerTwo.mark).to.equal("O");
    expect(testGame.turn).to.equal(1);
    expect(testGame.playerTurn).to.equal(testGame.playerOne);
    expect(testGame.board.spaces).to.be.an("array");
    expect(testGame.board.spaces.length).to.equal(9);
  });

  it("tracks which turn game is on and whose turn it is", function() {
    var testGame = new Game();
    testGame.nextTurn();
    expect(testGame.turn).to.equal(2);
    expect(testGame.playerTurn).to.equal(testGame.playerTwo);
  });

  it("tracks winners", function() {
    var testGame = new Game();
    testGame.board.getSpace(1, 1).markedBy(testGame.playerOne);
    testGame.nextTurn();
    testGame.board.getSpace(2, 1).markedBy(testGame.playerTwo);
    testGame.nextTurn();
    testGame.board.getSpace(1, 2).markedBy(testGame.playerOne);
    testGame.nextTurn();
    testGame.board.getSpace(2, 2).markedBy(testGame.playerTwo);
    testGame.nextTurn();
    testGame.board.getSpace(1, 3).markedBy(testGame.playerOne);
    testGame.nextTurn();
    expect(testGame.winner).to.equal(testGame.playerOne);
  });

  it("tracks draws", function() {
    var testGame = new Game();
    testGame.board.getSpace(1, 1).markedBy(testGame.playerOne);
    testGame.nextTurn();
    testGame.board.getSpace(2, 1).markedBy(testGame.playerTwo);
    testGame.nextTurn();
    testGame.board.getSpace(1, 2).markedBy(testGame.playerOne);
    testGame.nextTurn();
    testGame.board.getSpace(2, 2).markedBy(testGame.playerTwo);
    testGame.nextTurn();
    testGame.board.getSpace(3, 1).markedBy(testGame.playerOne);
    testGame.nextTurn();
    testGame.board.getSpace(3, 2).markedBy(testGame.playerTwo);
    testGame.nextTurn();
    testGame.board.getSpace(2, 3).markedBy(testGame.playerOne);
    testGame.nextTurn();
    testGame.board.getSpace(1, 3).markedBy(testGame.playerTwo);
    testGame.nextTurn();
    testGame.board.getSpace(3, 3).markedBy(testGame.playerOne);
    testGame.nextTurn();
    expect(testGame.winner).to.equal("Draw");
  });

  it("has an ai that chooses an empty space on player 2's turn", function() {
    var testGame = new Game();
    testGame.ai = 1;
    testGame.board.getSpace(1, 1).markedBy(testGame.playerOne);
    testGame.nextTurn();
    var aiSpace = testGame.easyAIMove();
    testGame.board.getSpace(aiSpace.xCoordinate, aiSpace.yCoordinate).markedBy(testGame.playerTwo);
    expect(testGame.board.getUnmarkedSpaces().length).to.equal(7);
  });

  it("has an ai that blocks two horizontally", function() {
    var testGame = new Game();
    testGame.ai = 2;
    testGame.board.getSpace(1, 1).markedBy(testGame.playerOne);
    testGame.board.getSpace(2, 1).markedBy(testGame.playerOne);
    testGame.nextTurn();
    var aiSpace = testGame.easyAIMove();
    testGame.board.getSpace(aiSpace.xCoordinate, aiSpace.yCoordinate).markedBy(testGame.playerTwo);
    expect(testGame.winner).to.equal("O");
  });

});
