function Player(mark) {
  this.mark = mark;
}

function Space(xCoordinate, yCoordinate) {
  this.xCoordinate = xCoordinate;
  this.yCoordinate = yCoordinate;
  this.isMarked = false;
  this.mark;
}

function Board() {
  this.spaces = [];
  for (var x = 1; x <= 3; x++) {
    for (var y = 1; y <= 3; y++) {
      this.spaces.push(new Space(x, y));
    }
  }
}

Space.prototype.markedBy = function (player) {
  if (player) {
    this.isMarked = true;
    this.mark = player;
  } else {
    return this.mark;
  }
}
