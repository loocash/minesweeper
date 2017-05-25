/**
 * @module UIUtils
 */

import _ from 'lodash';

/**
 * Makes a table of size side x side with a given td elements and table element
 * @param {HTMLElement} table - table element 
 * @param {HTMLElement[]} tdElements - array of td elements 
 * @param {number} side - size of the one side of the table 
 */
const makeTable = (table, tdElements, side) => {
  for (let row = 0; row < side; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < side; col++) {
      const tile = row*side + col;
      const td = tdElements[tile];
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
};

/**
 * Creates an array of size td HTMLElements each of which has the data-tile attribute from 0 to size-1
 * @param {number} size - size of the output array 
 */
const makeTdElements = (size) => { 
  return _.range(size).map(i => {
    const td = document.createElement("td");
    td.setAttribute("data-tile", i);
    return td;
  });
};

export {
  makeTable,
  makeTdElements
};