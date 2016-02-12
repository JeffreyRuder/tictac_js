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
  } else if (this.board.getUnmarkedSpaces().length === 0) {
    this.winner = "Draw";
  } else if (this.turn % 2 === 0) {
    this.playerTurn = this.playerTwo;
    if (this.ai === 1) {
      this.easyAIMove();
    } else if (this.ai === 2) {
      this.hardAIMove();
    }
  } else {
    this.playerTurn = this.playerOne;
  }
};

Game.prototype.easyAIMove = function () {
  var unmarkedSpaces = this.board.getUnmarkedSpaces();
  return unmarkedSpaces[Math.floor(Math.random() * (unmarkedSpaces.length - 1))];
};

Game.prototype.mediumAIMove = function () {
  var twoHorizontal = this.checkTwoHorizontal();
  var twoVertical = this.checkTwoVertical();
  var twoDiagonal = this.checkTwoDiagonal();
  var checkCorners = this.checkCorners();
  if (twoHorizontal) {
    return twoHorizontal;
  } else if (twoVertical) {
    return twoVertical;
  } else if (twoDiagonal) {
    return twoDiagonal;
  } else if (this.checkCenter()) {
    return this.board.getSpace(2, 2);
  } else if (checkCorners) {
    return checkCorners;
  } else {
    return this.easyAIMove();
  }
};

Game.prototype.hardAIMove = function() {
  var fork = this.checkFork()
  var twoHorizontal = this.checkTwoHorizontal();
  var twoVertical = this.checkTwoVertical();
  var twoDiagonal = this.checkTwoDiagonal();
  var checkCorners = this.checkCorners();
  if (twoHorizontal) {
    return twoHorizontal;
  } else if (twoVertical) {
    return twoVertical;
  } else if (twoDiagonal) {
    return twoDiagonal;
  } else if (fork) {
      return fork;
  } else if (this.checkCenter()) {
    return this.board.getSpace(2, 2);
  } else if (checkCorners) {
    return checkCorners;
  } else {
    return this.easyAIMove();
  }
};


Game.prototype.checkCenter = function() {
  return this.board.getUnmarkedSpaces().some(elem => elem === this.board.getSpace(2, 2)) ? true : false;
};

Game.prototype.checkCorners = function() {
  var corners = [this.board.getSpace(1,1),
                 this.board.getSpace(3,3),
                 this.board.getSpace(1,3),
                 this.board.getSpace(3,1)]
  for(var corner of corners) {
    if (!corner.mark) {
      return corner;
    }
  }
}


Game.prototype.checkFork = function() {
  var sides = [this.board.getSpace(1,2),
               this.board.getSpace(2,3),
               this.board.getSpace(3,2),
               this.board.getSpace(2,1)]

  var corners = [this.board.getSpace(1,1),
                 this.board.getSpace(3,3),
                 this.board.getSpace(1,3),
                 this.board.getSpace(3,1)]

  var unmarkedSpaces = this.board.getUnmarkedSpaces();

  //check diagonals for a fork
  if((!unmarkedSpaces.includes(corners[0]) && !unmarkedSpaces.includes(corners[1]) && corners[0].mark === corners[1].mark) ||
     (!unmarkedSpaces.includes(corners[2]) && !unmarkedSpaces.includes(corners[3]) && corners[2].mark === corners[3].mark))
  {
    for (var side of sides) {
      if (unmarkedSpaces.includes(side)) {
        return side;
      }
    }

  //check the sides for a fork
  } else if((!unmarkedSpaces.includes(sides[0]) && !unmarkedSpaces.includes(sides[1]) && sides[0].mark === sides[1].mark) ||
            (!unmarkedSpaces.includes(sides[1]) && !unmarkedSpaces.includes(sides[2]) && sides[1].mark === sides[2].mark) ||
            (!unmarkedSpaces.includes(sides[2]) && !unmarkedSpaces.includes(sides[3]) && sides[2].mark === sides[3].mark) ||
            (!unmarkedSpaces.includes(sides[3]) && !unmarkedSpaces.includes(sides[0]) && sides[3].mark === sides[0].mark))
  {
    for (var corner of corners) {
      if (unmarkedSpaces.includes(corner) && sides.some(elem => !unmarkedSpaces.includes(elem) && corner.isAdjacent(elem))) {
        return corner;
      }
    }
  }
  return false;
}

Game.prototype.checkTwoHorizontal = function() {
  var unmarkedSpaces = this.board.getUnmarkedSpaces();
  for (var y = 1; y <= 3; y ++) {
    var thisRow = []
    for (var x = 1; x <= 3; x++) {
      thisRow.push(this.board.getSpace(x, y));
    }
    if (thisRow[0].mark === thisRow[1].mark && !unmarkedSpaces.includes(thisRow[0]) && unmarkedSpaces.includes(thisRow[2])) {
      return thisRow[2];
    } else if (thisRow[0].mark === thisRow[2].mark && !unmarkedSpaces.includes(thisRow[0])  && unmarkedSpaces.includes(thisRow[1])) {
      return thisRow[1];
    } else if (thisRow[1].mark === thisRow[2].mark && !unmarkedSpaces.includes(thisRow[1])  && unmarkedSpaces.includes(thisRow[0])) {
      return thisRow[0];
    }
  }
  return false;
}

Game.prototype.checkTwoVertical= function() {
  var unmarkedSpaces = this.board.getUnmarkedSpaces();
  for (var x = 1; x <= 3; x++) {
    var thisColumn = []
    for (var y = 1; y <= 3; y ++) {
      thisColumn.push(this.board.getSpace(x, y));
    }
    if (thisColumn[0].mark === thisColumn[1].mark && !unmarkedSpaces.includes(thisColumn[0]) && unmarkedSpaces.includes(thisColumn[2])) {
      return thisColumn[2];
    } else if (thisColumn[0].mark === thisColumn[2].mark && !unmarkedSpaces.includes(thisColumn[0])  && unmarkedSpaces.includes(thisColumn[1])) {
      return thisColumn[1];
    } else if (thisColumn[1].mark === thisColumn[2].mark && !unmarkedSpaces.includes(thisColumn[1])  && unmarkedSpaces.includes(thisColumn[0])) {
      return thisColumn[0];
    }
  }
  return false;
}

Game.prototype.checkTwoDiagonal= function() {
  var unmarkedSpaces = this.board.getUnmarkedSpaces();
  var diagonalOne = [this.board.getSpace(1,1),
                     this.board.getSpace(2,2),
                     this.board.getSpace(3,3)]

  var diagonalTwo = [this.board.getSpace(1,3),
                     this.board.getSpace(2,2),
                     this.board.getSpace(3,1)]

  // Check Diagonal One
  if (!unmarkedSpaces.includes(diagonalOne[0]) && !unmarkedSpaces.includes(diagonalOne[1]) && diagonalOne[0].mark === diagonalOne[1].mark && unmarkedSpaces.includes(diagonalOne[2])) {
    return diagonalOne[2];
  } else if (!unmarkedSpaces.includes(diagonalOne[1]) && !unmarkedSpaces.includes(diagonalOne[2]) && diagonalOne[1].mark == diagonalOne[2].mark && unmarkedSpaces.includes(diagonalOne[0])) {
    return diagonalOne[0];
  } else if (!unmarkedSpaces.includes(diagonalOne[0]) && !unmarkedSpaces.includes(diagonalOne[2]) && diagonalOne[0].mark == diagonalOne[2].mark && unmarkedSpaces.includes(diagonalOne[1])) {
    return diagonalOne[1];
  }
  // Check Diagonal Two
  if (!unmarkedSpaces.includes(diagonalTwo[0]) && !unmarkedSpaces.includes(diagonalTwo[1]) && diagonalTwo[0].mark === diagonalTwo[1].mark && unmarkedSpaces.includes(diagonalTwo[2])) {
    return diagonalTwo[2];
  } else if (!unmarkedSpaces.includes(diagonalTwo[1]) && !unmarkedSpaces.includes(diagonalTwo[2]) && diagonalTwo[1].mark == diagonalTwo[2].mark && unmarkedSpaces.includes(diagonalTwo[0])) {
    return diagonalTwo[0];
  } else if (!unmarkedSpaces.includes(diagonalTwo[0]) && !unmarkedSpaces.includes(diagonalTwo[2]) && diagonalTwo[0].mark == diagonalTwo[2].mark && unmarkedSpaces.includes(diagonalTwo[1])) {
    return diagonalTwo[1];
  }
  return false;
}



var threeInARow = function(arrayOfThreeSpaces) {
  if (arrayOfThreeSpaces[0].mark &&
    arrayOfThreeSpaces[0].mark === arrayOfThreeSpaces[1].mark &&
    arrayOfThreeSpaces[0].mark === arrayOfThreeSpaces[2].mark) {
    return arrayOfThreeSpaces[0].mark;
  } else {
    return false;
  }
}
