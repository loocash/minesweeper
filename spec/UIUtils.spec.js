import _ from 'lodash';
import { makeTable, makeTdElements } from '../lib/UIUtils';

describe("UIUtils", () => {

  describe("makeTable", () => {
    
    it("makes a 2 x 2 table", () => {
      const side = 2;
      const size = 4;
      const tdElements = makeTdElements(size);
      const table = document.createElement("table");
      makeTable(table, tdElements, side);
      // table should have 2 tr elements
      const trElements = table.querySelectorAll('tr');
      expect(trElements.length).toBe(2);
      // each of which should have two td elements
      trElements.forEach(tr => {
        const tds = tr.querySelectorAll('td');
        expect(tds.length).toBe(2);
      });
    });

  });

  describe("makeTdElements", () => {

    it("makes 10 td elements", () => {
      const tdElements = makeTdElements(10);
      expect(_.isArray(tdElements)).toBe(true);
      expect(tdElements.length).toBe(10);
      tdElements.forEach((td, i) => {
        expect(td.tagName.toLocaleLowerCase()).toBe("td");
        expect(+td.getAttribute('data-tile')).toBe(i);
      });
    });

  });

});