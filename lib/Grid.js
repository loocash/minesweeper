import _ from 'lodash';

/**
 * Wraps an array into a 2-dimensional grid.
 * Given only rows and columns numbers we can then access desired 
 * element under the pair of i and j if the element is stored 
 * inside of the array under the position of (i * columns + j) and both parameters are 
 * in bounds given by the rows and columns numbers.
 */
class Grid {

  /**
   * Creates a new grid
   * @param {number} rows - number of rows 
   * @param {number} cols - number of columns
   * @param {Array} array - array 
   */
  constructor(rows, cols, array) {
    this.rows = rows;
    this.cols = cols;
    this.array = array;
  }

  /**
   * Checks if row and col are in bounds of the grid.
   * @param {number} row - row number 
   * @param {number} col - column number
   * @return {boolean} - true if row and col are in bounds of the grid
   */  
  inBounds(row, col) {
    return _.inRange(row, this.rows) &&
           _.inRange(col, this.cols);
  }

  /**
   * Computes a linear index in an array from the row and column numbers
   * @param {number} row - row number 
   * @param {number} col - column number
   * @returns {number} - index in an array
   */
  cellToIndex(row, col) {
    return row*this.cols + col;
  }

  /**
   * Computes a position in the grid from a position in the array
   * @param {number} index - position in the array
   * @returns {number[]} - Array of two elements [row, col]
   */
  indexToCell(index) {
    const row = Math.floor(index / this.cols);
    const col = index % this.cols;
    return [row, col];
  }

  /**
   * Gets element from a given cell. 
   * @param {number} row - row number 
   * @param {number} col - column number
   * @returns {Object|null} - null if cell is not in bounds
   */
  getCell(row, col) {
    if (!this.inBounds(row, col)) {
      return null;
    }
    const index = this.cellToIndex(row, col);
    return this.array[index];
  }

  /**
   * Sets an element under a given position. 
   * @param {number} row - row number 
   * @param {number} col - column number
   * @param {Object} element - element
   */
  setCell(row, col, element) {
    if (this.inBounds(row, col)) {
      const index = this.cellToIndex(row, col);
      this.array[index] = element;
    }
  }

  /**
   * Returns an array of all cells in this grid.
   * @returns {Array[]} - An array of all cells
   */
  getCells() {
    const result = [];
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        result.push([row, col]);
      }
    }
    return result;
  }

  /**
   * Converts the grid into a string 
   * @returns {string} - string in human friendly form
   */
  toString() {
    return _.chain(this.getCells())
            .chunk(this.cols)
            .map(rowCells => rowCells.map(
              ([row, col]) => this.getCell(row, col)).join(' '))
            .join('\n')
            .value();
  }

  /**
   * Checks if two positions are adjacent in the grid
   * @returns {boolean} - true if two cells are adjacent to each other
   */
  isAdjacent(rowA, colA, rowB, colB) {
    return Math.abs(rowA - rowB) + Math.abs(colA - colB) === 1;
  }

  /**
   * Lists all adjacent cells
   * @param {number} row - row number 
   * @param {number} col - column number
   */
  getAdjacent(row, col) {
    const vectors = [
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    return vectors.map(
      ([dx, dy]) => [row+dx, col+dy]
    ).filter(
      ([row, col]) => this.inBounds(row, col)
    );
  }

  /**
   * Checks if two positions are neighbors in the 2d grid
   * @param {number} rowA - row A number
   * @param {number} colA - column A number
   * @param {number} rowB - row B number
   * @param {number} colB - column B number
   * @returns {Boolean} 
   */
  areNeighbors(rowA, colA, rowB, colB) {
    const rowDiff = Math.abs(rowA - rowB);
    const colDiff = Math.abs(colA - colB);
    return (rowDiff === 1 && colDiff === 1) ||
           (rowDiff       +  colDiff === 1);
  }

  /**
   * Swaps two positions in the grid
   */
  swap(rowA, colA, rowB, colB) {
    const cellA = [rowA, colA];
    const cellB = [rowB, colB];
    if (this.inBounds(...cellA) &&
        this.inBounds(...cellB)) {
      const tmpCell = this.getCell(...cellA);
      this.setCell(...cellA, this.getCell(...cellB));
      this.setCell(...cellB, tmpCell);
    }
  }

  /**
   * Finds and returns a position representing 
   * the first cell which satisfies the predicate.
   * Returns null if no cell satisfies the predicate
   * @param {function(*):Boolean} predicate - predicate
   * @returns {Array|null}
   */
  find(predicate) {
    const index = this.array.findIndex(predicate);
    if (index === -1) {
      return null;
    }
    return this.indexToCell(index);
  }

  /**
   * Finds and returns all positions which satisfy the predicate.
   * @param {function(*):Boolean} predicate - predicate
   * @returns {Array}
   */
  filter(predicate) {
    return this.getCells().filter(
      ([row, col]) => predicate.call(this, this.getCell(row, col))
    );
  }

  /**
   * Lists all neighbors of the cell
   * @param {number} row - row number 
   * @param {number} col - column number
   * @returns {Array}
   */
  getNeighbors(row, col) {
    const result = [];
    for (let dx = -1; dx < 2; ++dx) {
      for (let dy = -1; dy < 2; ++dy) {
        if (dx !== 0 || dy !== 0) {
          const cell = [row+dx, col+dy];
          if (this.inBounds(...cell)) {
            result.push(cell);
          }
        }
      }
    }
    return result;
  }

}

export default Grid;