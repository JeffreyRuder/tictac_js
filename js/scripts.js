function Player(mark) {
  this.mark = mark;
}

function Space(xCoordinate, yCoordinate) {
  this.xCoordinate = xCoordinate;
  this.yCoordinate = yCoordinate;
  this.isMarked = false;
  this.mark;
}

Space.prototype.markedBy = function (player) {
  if (player) {
    this.isMarked = true;
    this.mark = player;
  } else {
    return this.mark;
  }
}

Space.prototype.isAdjacent = function (space) {
  if (this.xCoordinate === space.xCoordinate && this.yCoordinate === space.yCoordinate) {
    return false;
  } else {
    return Math.abs(this.xCoordinate - space.xCoordinate) <= 1 &&
      Math.abs(this.yCoordinate - space.yCoordinate) <= 1;
  }
};

function Board() {
  this.spaces = [];
  for (var x = 1; x <= 3; x++) {
    for (var y = 1; y <= 3; y++) {
      this.spaces.push(new Space(x, y));
    }
  }
}

Board.prototype.getSpace = function(xCoordinate, yCoordinate) {
  //we may want to name this anon function "doesItMatch"
  return this.spaces.find(function(space) {
    return space.xCoordinate === xCoordinate && space.yCoordinate === yCoordinate;
  });
}

Board.prototype.horizontalWinner = function() {
  for (var y = 1; y <= 3; y ++) {
    var thisRow = []
    for (var x = 1; x <= 3; x++) {
      thisRow.push(this.getSpace(x, y));
    }
    if (threeInARow(thisRow)) {
      return thisRow[0].mark;
    }
  }
  return false;
}

Board.prototype.verticalWinner = function() {
  for (var x = 1; x <= 3; x ++) {
    var thisColumn = []
    for (var y = 1; y <= 3; y++) {
      thisColumn.push(this.getSpace(x, y));
    }
    if (threeInARow(thisColumn)) {
      return thisColumn[0].mark;
    }
  }
  return false;
}

Board.prototype.diagonalWinner = function() {
  var firstDiagonal = []
  for (var x = 1; x <= 3; x++) {
    firstDiagonal.push(this.getSpace(x, x));
  }
  if (threeInARow(firstDiagonal)) {
    return firstDiagonal[0].mark;
  }
  var secondDiagonal = [];
  for (var x = 1; x<= 3; x++) {
    secondDiagonal.push(this.getSpace(x, 4-x));
  }
  if (threeInARow(secondDiagonal)) {
    return secondDiagonal[0].mark;
  }
  return false;
}

Board.prototype.getUnmarkedSpaces = function() {
  var unmarkedSpaces = []
  for (var space of this.spaces) {
    if (!space.isMarked) {
      unmarkedSpaces.push(space);
    }
  }
  return unmarkedSpaces;
}

function Game() {
  this.playerOne = new Player("X");
  this.playerTwo = new Player("O");
  this.board = new Board();
  this.turn = 1;
  this.playerTurn = this.playerOne;
  this.winner;
  this.ai = 0;
}

Game.prototype.nextTurn = function () {
  this.turn += 1;
  if (this.board.horizontalWinner() || this.board.verticalWinner() || this.board.diagonalWinner()) {
    this.winner = (this.board.horizontalWinner() || this.board.verticalWinner() || this.board.diagonalWinner());
  } else if (this.turn > 9) {
    this.winner = "Draw";
  } else if (this.turn % 2 === 0) {
    this.playerTurn = this.playerTwo;
    if (this.ai === 1) {
      this.easyAIMove();
    }
  } else {
    this.playerTurn = this.playerOne;
  }
};

Game.prototype.easyAIMove = function () {
  var unmarkedSpaces = this.board.getUnmarkedSpaces();
  return unmarkedSpaces[Math.floor(Math.random() * (unmarkedSpaces.length - 1))];
};

var threeInARow = function(arrayOfThreeSpaces) {
  if (arrayOfThreeSpaces[0].mark &&
    arrayOfThreeSpaces[0].mark === arrayOfThreeSpaces[1].mark &&
    arrayOfThreeSpaces[0].mark === arrayOfThreeSpaces[2].mark) {
    return arrayOfThreeSpaces[0].mark;
  } else {
    return false;
  }
}
