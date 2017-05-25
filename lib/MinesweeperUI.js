/**
 * @module MinesweeperUI
 */

import { makeTable , makeTdElements } from './UIUtils';
import Minesweeper, { SIDE, SIZE } from './Minesweeper';
import Timer from './Timer';

const MinesweeperUI = (function(){

  const Elements = _.mapValues({
    table:          "#minesweeper .board",
    newGameButton:  "#minesweeper .new-game",
    flagCounter:    "#minesweeper .flag-counter-value",
    timer:          "#minesweeper .timer-elapsed"
  }, queryString => document.querySelector(queryString));

  Elements.td = makeTdElements(SIZE);

  const timer = new Timer((elapsed) => {
    Elements.timer.innerText = elapsed;
  });

  const game = new Minesweeper({
    timer
  });

  const draw = () => {
    Elements.td.forEach((td, i) => {
      td.className = "";
      td.innerText = "";
    });
    Elements.flagCounter.innerText = game.flags;
    Elements.td.forEach((td, i) => {
      const field = game.getTile(i);
      if (field.isRevealed) {
        td.classList.add('revealed');
        if (field.hasBomb) {
          td.classList.add('mine');
        } else if (field.bombsAround > 0){
          td.innerText = field.bombsAround;
        }
      } 
      if (field.isFlagged()) {
        td.classList.add('flag');
      } else {
        td.classList.remove('flag');
      }
      if (field.getMark() === '?') {
        td.classList.add('question');
      } else {
        td.classList.remove('question');
      }
    });
  };

  const addEventListeners = () => {
    const { table } = Elements;

    table.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      if (event.target.tagName.toLowerCase() === "td") {
        const tile = event.target.getAttribute("data-tile");
        game.markTile(+tile);
        draw();
      }
    });

    table.addEventListener("click", ({target}) => {
      if (target.tagName.toLowerCase() === "td") {
        const tile = target.getAttribute("data-tile");
        game.revealTile(+tile);
        draw();
      }
    });

    Elements.newGameButton.addEventListener("click", () => {
      game.init();
      draw();
    });

  };

  const init = () => {
    makeTable(Elements.table, Elements.td, SIDE);
    addEventListeners();
    draw();
  };

  return {
    init
  };

})();

export default MinesweeperUI;