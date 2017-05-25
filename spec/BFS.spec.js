import _ from 'lodash';
import BFS from '../lib/BFS';
import Grid from '../lib/Grid';

describe("BFS", () => {

  const matrix = [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 0, 1, 1]
  ];

  const flatMatrix = _.flatten(matrix);

  const [rows, cols] = [5, 5];

  const grid = new Grid(rows, cols, flatMatrix); 

  const Node = function(value, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.visited = false;
  };

  Node.prototype.isNeighbor = function(node) {
    return grid.areNeighbors(node.row, node.col, this.row, this.col);
  };

  it("finds all 1's", () => {

    const nodes = [];

    _.times(rows, row => {
      _.times(cols, col => {
        const node = new Node(matrix[row][col], row, col);
        nodes.push(node);
      });
    });

    const neighbors = (node) => {
      return nodes.filter(n => grid.areNeighbors(n.row, n.col, node.row, node.col) && 
                               n.value === node.value);
    };

    const sourceNode = nodes.find(
      node => node.row === 2 && node.col === 2);

    const ones = nodes.filter(node => node.value === 1);

    const bfs = BFS.from(sourceNode, neighbors);

    expect(bfs.length).toBe(ones.length);

  });

});