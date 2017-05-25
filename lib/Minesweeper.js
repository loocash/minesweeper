import _ from 'lodash';
import Grid from './Grid';
import BFS from './BFS';

const SIDE = 8;
const SIZE = SIDE*SIDE;
const BOMBS = 10;

/**
 * Represents the field in the minesweeper game.
 * The field can be in two main states: revealed or unrevealed.
 * At the beginning all fields are unrevealed and in order to reveal
 * a field one must invoke a method "reveal" on it which will make
 * effect only if the field is not flagged or arleady revealed.
 * Furthermore the unrevealed field can be marked as blank, flagged, or questioned.
 * The Field carries information about if it has bomb and how many bombs are around the field.
 */
class Field {

  /**
   * Creates a new field
   * @param {boolean} [hasBomb=false] - flag indicating if the field has a bomb 
   * @param {number} [bombsAround=0] - how many bombs are around the field
   */
  constructor(hasBomb = false, bombsAround = 0) {
    this.hasBomb = hasBomb;
    this.isRevealed = false;
    this.mark = 0;
    this.bombsAround = bombsAround;
  }

  /**
   * Reveals the field
   */
  reveal() {
    if (!this.isFlagged() && !this.isRevealed) {
      this.isRevealed = true;
      this.mark = 0;
    }
  }

  /**
   * Checks if the field is flagged
   * @returns {boolean} - true if the field is flagged
   */
  isFlagged() {
    return this.getMark() === 'F';
  }

  /**
   * Gets the current mark
   * @returns {string} - the mark
   */
  getMark() {
    return ['', 'F', '?'][this.mark];
  }

  /**
   * Changes the mark
   */
  changeMark() {
    if (!this.isRevealed) {
      this.mark++;
      this.mark %= 3;
    }
  }

  /**
   * Converts the field into a string
   * @returns {string} - string in human friendly form
   */
  toString() {
    if (this.isRevealed) {
      if (this.hasBomb) return "*";
      else if (this.bombsAround > 0) return this.bombsAround;
      else return ".";
    } else {
      const mark = this.getMark();
      return mark === '' ? "#" : mark;
    }
  }

}

/**
 * Represents the minesweeper game logic
 */
class Minesweeper {

  /**
   * Creates a new game instance
   */
  constructor({onHighScore, timer}) {
    this.onHighScore = onHighScore;
    this.timer = timer;
    this.init();
  }

  init() {
    this.grid = new Grid(SIDE, SIDE, Minesweeper.makeFields());
    Minesweeper.countBombs(this.grid);
    this.bfs_init();
    this.flags = 0;
    this.timer.reset();
  }

  static makeFields() {
    const clearFields = _.range(SIZE-BOMBS).map(i => new Field());
    const bombedFields = _.range(BOMBS).map(i => new Field(true));
    const fields = _.shuffle(clearFields.concat(bombedFields));
    return fields;
  }

  static countBombs(grid) {
    grid.getCells().forEach(
      cell => {
        const field = grid.getCell(...cell);
        const neighbors = grid.getNeighbors(...cell);
        const bombedNeighbors = neighbors.filter(
          n => grid.getCell(...n).hasBomb);
        field.bombsAround = bombedNeighbors.length;
      }
    );
  }

  bfs_init() {
    const grid = this.grid;

    const Node = function(value, row, col) {
      this.value = value;
      this.row = row;
      this.col = col;
      this.visited = false;
    };

    Node.prototype.isNeighbor = function(node) {
      return grid.areNeighbors(node.row, node.col, this.row, this.col);
    };

    this.nodes = [];

    _.times(SIDE, row => {
      _.times(SIDE, col => {
        const node = new Node(this.grid.getCell(row, col), row, col);
        this.nodes.push(node);
      });
    });

    this.neighbors = (node) => {
      const field = node.value;
      if (field.bombsAround === 0 && !field.hasBomb && !field.isFlagged()) {
        return this.nodes.filter(n => n.isNeighbor(node)); 
      } else if (field.hasBomb) {
        return this.nodes.filter(n => n.value.hasBomb); 
      }
      return [];
    };
  }

  mark(row, col) {
    if (this.grid.inBounds(row, col) && !this.isSolved()) {
      const field = this.grid.getCell(row, col);
      if (field.isFlagged()) {
        this.flags--;
      }
      field.changeMark();
      if (field.isFlagged()) {
        this.flags++;
        if (this.flags === BOMBS+1) {
          this.flags--;
          field.changeMark();
        }
      }
    }
  }

  markTile(tile) {
    const cell = this.grid.indexToCell(tile);
    this.mark(...cell);
  }

  reveal(row, col) {
    if (this.grid.inBounds(row, col) && !this.isSolved()) {
      if (this.isNew()) {
        this.timer.start();
      }
      const field = this.grid.getCell(row, col);
      if (!field.isRevealed && !field.isFlagged()) {
        const sourceCell = this.nodes.find(c => c.row === row && c.col === col);
        const cellsToReveal = BFS.from(sourceCell, this.neighbors);
        cellsToReveal.forEach(c => c.value.reveal());
      } else if (field.isRevealed && field.bombsAround > 0) {
        const unrevealed = this.grid.getNeighbors(row, col).filter(
          cell => !this.grid.getCell(...cell).isRevealed
        );
        const flagsAround = unrevealed.filter(cell => this.grid.getCell(...cell).isFlagged()).length;
        if (flagsAround >= field.bombsAround) {
          unrevealed.forEach(cell => this.reveal(...cell));
        }
      }
      if (this.isSolved()) {
        this.timer.stop();
        if (this.isWon()) {
          this.onHighScore(this.timer.elapsed);
        }
      }
    }
  }

  revealTile(tile) {
    const cell = this.grid.indexToCell(tile);
    this.reveal(...cell);
  }

  isLost() {
    return this.grid.array.some(field => field.isRevealed && field.hasBomb);
  }

  isWon() {
    return this.grid.array.every(field => 
      (field.isRevealed && !field.hasBomb) ||
      (!field.isRevealed && field.hasBomb)
    );
  }

  isSolved() {
    return this.isLost() || this.isWon();
  }

  isNew() {
    return this.grid.array.every(field => !field.isRevealed);
  }

  getTile(tile) {
    const cell = this.grid.indexToCell(tile);
    return this.grid.getCell(...cell);
  }

  toString() {
    return this.grid.toString();
  }

}

export {
  Minesweeper,
  Field,
  SIDE,
  SIZE,
  BOMBS
};

export default Minesweeper;