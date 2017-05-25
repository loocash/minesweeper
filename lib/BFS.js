/**
 * @module BFS
 */

import _ from 'lodash';

const BFS = (function() {

  const from = (sourceNode, neighbors) => {
    const queue = [sourceNode];
    const result = [];
    sourceNode.visited = true;
    while (!_.isEmpty(queue)) {
      const node = queue.shift();
      result.push(node);
      const unvisitedNeighbors = neighbors.call(this, node).filter(n => !n.visited);
      unvisitedNeighbors.forEach(n => n.visited = true);
      queue.push(...unvisitedNeighbors);
    }
    return result;
  }; 

  return {
    from
  };

})();

export {
  BFS
};

export default BFS;