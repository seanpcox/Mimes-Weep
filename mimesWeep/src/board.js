import BoardSquare from './boardSquare.js'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import * as logic from './gameLogic.js';
import { Box } from '@mui/material';

const Board = forwardRef(function Board(props, inputRef) {
    var array = props.array;
    var height = array.length;
    var width = array[0].length;

    var ref = useRef(null);
    var tempRef = [];

    const pushRef = (square) => {
        if (square !== null) {
            tempRef.push(square);
        }
    };

    useEffect(() => {
        ref.current = tempRef;

        return () => {
            ref.current = null;
        }
    });

    function getRefIndex(width, indexI, indexJ) {
        return (indexI * width) + indexJ;
    }

    useImperativeHandle(inputRef, () => {
        return {
            refresh(newArray, newHeight, newWidth) {
                array = newArray;
                height = newHeight;
                width = newWidth;
                refreshAllSquares();
            }
        };
    }, []);

    const [guessButtonToggled, setGuessButtonToggled] = useState(false);

    useEffect(() => {
        props.guessButtonToggledCallback([guessButtonToggled, setGuessButtonToggled]);
    }, [props.guessButtonToggledCallback, guessButtonToggled]);

    function btnLeftClickCallback(indexI, indexJ) {
        if (guessButtonToggled) {
            btnRightClickCallback(indexI, indexJ);
            return;
        }

        if (array[indexI][indexJ] >= 9) {
            return;
        }

        array[indexI][indexJ] = Number((array[indexI][indexJ] - 0.1).toFixed(1));

        if (array[indexI][indexJ] === -1) {
            array[indexI][indexJ] = -2;
            props.lostGameCallback();
            return;
        } else {
            var zeroNeighbors = [];

            if (array[indexI][indexJ] === 0) {
                zeroNeighbors = logic.visitZeroNeighbors(array, indexI, indexJ);
            }

            props.incrementSquaresWonCallback(zeroNeighbors.length + 1);

            for (var n = 0; n < zeroNeighbors.length; n++) {
                var refIndex = getRefIndex(width, zeroNeighbors[n][0], zeroNeighbors[n][1]);
                ref.current[refIndex].refresh(array[zeroNeighbors[n][0]][zeroNeighbors[n][1]]);
            }
        }

        ref.current[getRefIndex(width, indexI, indexJ)].refresh(array[indexI][indexJ]);
    }

    function btnRightClickCallback(indexI, indexJ) {
        if (array[indexI][indexJ] >= 9) {
            array[indexI][indexJ] = Number((array[indexI][indexJ] - 10).toFixed(1));
            props.incrementGuessCountCallback(-1);
        } else {
            array[indexI][indexJ] = Number((array[indexI][indexJ] + 10).toFixed(1));
            props.incrementGuessCountCallback(1);
        }

        ref.current[getRefIndex(width, indexI, indexJ)].refresh(array[indexI][indexJ]);
    }

    function refreshAllSquares() {
        for (var i = 0; i < height; i++) {
            for (var j = 0; j < width; j++) {
                ref.current[getRefIndex(width, i, j)].refresh(array[i][j]);
            }
        }
    }

    return <Box sx={{ overflowX: "scroll", justifyContent: "center" }}>
        {Array.from(Array(height)).map((_, indexI) => (
            <Box key={indexI} sx={{ display: "flex", justifyContent: "center", mx: 3 }}>
                {Array.from(Array(width)).map((_, indexJ) => (
                    <BoardSquare numOfMimeNeighbors={array[indexI][indexJ]} indexI={indexI} indexJ={indexJ} key={indexJ}
                        ref={pushRef}
                        btnLeftClickCallback={btnLeftClickCallback} btnRightClickCallback={btnRightClickCallback} />
                ))}
            </Box>
        ))}
    </Box>;
});

Board.propTypes = {
    array: PropTypes.array,
    incrementSquaresWonCallback: PropTypes.func,
    lostGameCallback: PropTypes.func,
    incrementGuessCountCallback: PropTypes.func,
    guessButtonToggledCallback: PropTypes.func
}

export default Board;