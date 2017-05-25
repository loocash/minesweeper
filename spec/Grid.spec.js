import Grid from '../lib/Grid';
import _ from 'lodash';

describe("Grid", () => {
  let grid;

  beforeEach(() => {
    grid = new Grid(2, 2, _.range(4));
  });

  it("checks if cells are in bounds", () => {
    expect(grid.inBounds(2, 2)).toBe(false);
    expect(grid.inBounds(0, 1)).toBe(true);
  });

  it("translates between cells and linear indices", () => {
    const cells = [
      {row: 0, col: 0, pos: 0},
      {row: 0, col: 1, pos: 1},
      {row: 1, col: 0, pos: 2},
      {row: 1, col: 1, pos: 3}
    ];
    cells.forEach(({row, col, pos}) => 
      expect(grid.cellToIndex(row, col)).toBe(pos)
    );
    cells.forEach(({row, col, pos}) => 
      expect(grid.indexToCell(pos)).toEqual([row, col])
    );
  });

  it("can get and set a cell", () => {
    const payload = {value: 12};
    const [row, col] = [0, 1];
    grid.setCell(row, col, payload);
    const fetched = grid.getCell(row, col);
    expect(fetched).toEqual(payload);
  });

  it("gives all cells in the grid", () => {
    expect(grid.getCells()).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1]
    ]);
  });

  it("produces a human friendly string", () => {
    expect(grid.toString()).toBe("0 1\n2 3");
  });

  it("checks if two positions are adjacent", () => {
    const posul = [0, 0];
    const posur = [0, 1];
    const posll = [1, 0];
    const poslr = [1, 1];
    expect(grid.isAdjacent(...posul, ...posur)).toBe(true);
    expect(grid.isAdjacent(...posul, ...posll)).toBe(true);
    expect(grid.isAdjacent(...posul, ...poslr)).toBe(false);
  });

  it("swaps two positions", () => {
    grid.swap(0, 0, 1, 1);
    expect(grid.getCell(0, 0)).toBe(3);
    expect(grid.getCell(1, 1)).toBe(0);
  });

  it("implements find method", () => {
    const res = grid.find(cell => cell === 2);
    const res2 = grid.find(cell => cell === 4);
    expect(res).toEqual([1, 0]);
    expect(res2).toBe(null);
  });

  it("implements filter method", () => {
    const result = grid.filter(cell => cell % 2 == 0);
    expect(result).toEqual([[0, 0], [1, 0]]);
  });

  it("lists all neighboring cells", () => {
    grid = new Grid(5, 5, _.range(25));
    const cell = [2, 3];
    const neighborsExpected = new Set([
      [1, 3], [3, 3], [2, 2], [2, 4],
      [1, 2], [1, 4], [3, 2], [3, 4]
    ]);
    const actualNeighbors = new Set(grid.getNeighbors(...cell));
    expect(_.isEqual(neighborsExpected, actualNeighbors)).toBe(true);
  });

  it("lists all adjacent cells", () => {
    const neighborsExpected = new Set([ [0, 1], [1, 0] ]);
    const actualNeighbors = new Set(grid.getAdjacent(1, 1));
    expect(_.isEqual(neighborsExpected, actualNeighbors)).toBe(true);
  });

  it("chcecks if two cells are neighbors", () => {
    const neighborCell = [1, 2];
    const distantCell = [5, 5];
    expect(grid.areNeighbors(...neighborCell, 2, 2)).toBe(true);
    expect(grid.areNeighbors(...neighborCell, ...distantCell)).toBe(false);
  });
});
