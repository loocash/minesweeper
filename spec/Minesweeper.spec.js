import Minesweeper, { Field, SIDE } from '../lib/Minesweeper';
import Grid from '../lib/Grid';
import Timer from '../lib/Timer';
import _ from 'lodash';

const stringToMinesweeper = (str) => {
  const rows = str.split("\n").slice(1, SIDE+1);
  const cols = rows.map(row => row.split(" "));
  const cells = _.flatten(cols).map(cell => cell === "*" ? true : false);
  const fields = cells.map(cell => new Field(cell));
  const ms = new Minesweeper({onHighScore: () => {}, timer: new Timer(() => {})});
  ms.grid = new Grid(SIDE, SIDE, fields);
  Minesweeper.countBombs(ms.grid);
  ms.bfs_init();
  return ms;
};

const revealAllFields = (ms) => {
  ms.grid.array.forEach(cell => cell.reveal());
};

const msTemplates = [
`
* . . . . . . *
. . . . . . * .
. . . . . * . .
. . . . * . . .
. . . * . . . .
. . * . . . . .
. * . . . . . .
* . . . . . . *
`, // 0
`
* 1 . . . 1 2 *
1 1 . . 1 2 * 2
. . . 1 2 * 2 1
. . 1 2 * 2 1 .
. 1 2 * 2 1 . .
1 2 * 2 1 . . .
2 * 2 1 . . 1 1
* 2 1 . . . 1 *
`, // 1
`
* # # # # # # *
# # # # # # * #
# # # # # * # #
# # # # * # # #
# # # * # # # #
# # * # # # # #
# * # # # # # #
* # # # # # # *
`, // 2
`
# # # # # # # #
# # # # # # # #
# # # # # # 2 1
# # # # # 2 1 .
# # # # 2 1 . .
# # # 2 1 . . .
# # 2 1 . . 1 1
# # 1 . . . 1 #
`, // 3
`
# 1 . . . 1 2 #
1 1 . . 1 2 # 2
. . . 1 2 # 2 1
. . 1 2 # 2 1 .
. 1 2 # 2 1 . .
1 2 # 2 1 . . .
2 # 2 1 . . 1 1
# 2 1 . . . 1 #
` // 4
];

describe("Field", () => {

  it("tells whether the field is bombed or not", () => {
    const bombedField = new Field(true);
    const clearField = new Field();
    expect(bombedField.hasBomb).toBe(true);
    expect(clearField.hasBomb).toBe(false);
  });

  it("is unreveald when created and can be revealed", () => {
    const field = new Field();
    expect(field.isRevealed).toBe(false);
    field.reveal();
    expect(field.isRevealed).toBe(true);
  });

  it("can be marked", () => {
    const field = new Field();
    expect(field.getMark()).toBe('');
    field.changeMark();
    expect(field.isFlagged()).toBe(true);
    field.changeMark();
    expect(field.getMark()).toBe('?');
    field.changeMark();
    expect(field.getMark()).toBe('');
  });

  it("tells how many bombs are around", () => {
    const field = new Field();
    expect(field.bombsAround).toBe(0);
    field.bombsAround = 4;
    expect(field.bombsAround).toBe(4);
  });

});

describe("Minesweeper", () => {

  let game;

  beforeEach(() => {
    game = stringToMinesweeper(msTemplates[0]);
  });

  it("counts bombs properly", () => {
    revealAllFields(game);
    expect(msTemplates[1]).toBe("\n" + game.toString() + "\n");
  });

  it("is lost when the mined field is revealed", () => {
    expect(game.isSolved()).toBe(false);
    game.reveal(2, 5);
    expect(game.isSolved()).toBe(true);
    expect(game.isLost()).toBe(true);
    expect(game.isWon()).toBe(false);
    expect("\n" + game.toString() + "\n").toBe(msTemplates[2]);
  });

  it("is won when all clear fields are revealed and no bombed field is", () => {
    game.grid.array.filter(f => !f.hasBomb).forEach(f => f.reveal());
    expect(game.isSolved()).toBe(true);
    expect(game.isLost()).toBe(false);
    expect(game.isWon()).toBe(true);
  });

  it("reveals all clear area when an empty field is revealed", () => {
    game.reveal(3, 7);
    expect("\n" + game.toString() + "\n").toBe(msTemplates[3]);
  });

  it("prevents revealed fields from being marked", () => {
    game.reveal(0, 1);
    game.mark(0, 1);
    const field = game.getTile(1);
    expect(field.getMark()).toBe('');
  });

  it("allows only 10 fields to be flagged", () => {
    game.grid.getCells().forEach(
      cell => game.mark(...cell)
    );
    const flagged = game.grid.array.filter(f => f.isFlagged()).length;
    expect(flagged).toBe(10);
  });

});
