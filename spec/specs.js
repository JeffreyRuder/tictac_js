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
});

describe('Board', function() {
  it("creates 9 spaces when it is initialized", function() {
    var testBoard = new Board();
    expect(testBoard.spaces.length).to.equal(9);
  });
});
