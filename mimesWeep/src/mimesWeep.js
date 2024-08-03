import './mimesWeep.css';
import { useState } from 'react';
import Board from './board.js'

function MimesWeep() {
  var height = 9;
  var width = 9;
  var numOfMimes = 10;

  var squaresToWin = (height * width) - numOfMimes;
  var squaresWon = 0;

  const array = createEmptyBoard(height, width);

  addMimes(array, numOfMimes);

  addMimeNeighborCount(array);

  const [startNewGame, startNewGameInternal] = useState(false);

  function lostGameCallback() {
    alert("Sorry, you have lost.");
    startNewGameInternal(!startNewGame);
  }

  function incrementSquaresWonCallback(count) {
    squaresWon += count;

    if(squaresWon == squaresToWin) {
      alert("Congratulations! You have won!");
      startNewGameInternal(!startNewGame);
    }
  }

  return (
    <div className="mimesWeep" onContextMenu={(e) => {
      e.preventDefault(); // prevent the default behaviour when right clicked
      console.log("Right Click");
    }}>
      <div>
        <header className="mimesWeep-header">
          <p>
            M I M E S W E E P
          </p>
        </header>
      </div>
      <Board array={array} incrementSquaresWonCallback={incrementSquaresWonCallback} lostGameCallback={lostGameCallback} />
    </div>
  );
}

function createEmptyBoard(height, width) {
  const array = new Array(height)

  for (var i = 0; i < height; i++) {
      array[i] = new Array(width).fill(0.1)
  }

  return array;
};

function addMimes(array, numOfMimes) {
  var height = array.length;
  var width = array[0].length;

  // Add check that numOfMimes is less than the number of board squares
  if (numOfMimes > (height * width)) {
      numOfMimes = (height * width);
      console.warn("Mime count exceeded board spaces. Mime count will be set to the number of board spaces.")
  }

  // Is there a better way to do this? May take a while for a large board and a high mime count.
  for (var count = 0; count < numOfMimes; count++) {
      do {
          var i = Math.floor(Math.random() * height);
          var j = Math.floor(Math.random() * width);
      } while (array[i][j] !== 0.1);

      array[i][j] = -0.9;
  }
}

function addMimeNeighborCount(array) {
  var height = array.length;
  var width = array[0].length;

  for (var i = 0; i < height; i++) {
      for (var j = 0; j < width; j++) {
          if (array[i][j] < 0) {
              visitMimeNeighbors(array, i, j);
          }
      }
  }
}

function visitMimeNeighbors(array, i, j) {
  var height = array.length;
  var width = array[0].length;

  const neighbors = [[i + 1, j],
  [i + 1, j + 1],
  [i + 1, j - 1],
  [i - 1, j],
  [i - 1, j + 1],
  [i - 1, j - 1],
  [i, j + 1],
  [i, j - 1]];

  for (var count = 0; count < neighbors.length; count++) {
      // Check neighbor location is within the array boundary
      if (neighbors[count][0] >= 0 && neighbors[count][0] < height &&
          neighbors[count][1] >= 0 && neighbors[count][1] < width) {

          // Update the number of nearby mimes on the neighbour. We ignore neighbors that are themselves mimes.
          if (array[neighbors[count][0]][neighbors[count][1]] >= 0) {
              array[neighbors[count][0]][neighbors[count][1]]++;
          }
      }
  }
}

export default MimesWeep;
