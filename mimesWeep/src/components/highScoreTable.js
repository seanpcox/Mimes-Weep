import * as gameText from '../resources/text/gameText.js';
import * as highScoreDB from '../logic/highScoreDB.js';
import * as sx from '../style/highScoreTableSx.js'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PropTypes from 'prop-types';
import { Period } from "../models/index.js";
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

/**
 * Component table showing high score and personal best times for different difficulty levels
 * Note: The last row displayed is the personal best data row
 */

// COMPONENT

const HighScoreTable = forwardRef(function HighScoreTable(props, inputRef) {

    // STATES

    const [rows, setRows] = useState([]);


    // LOCAL VARIABLES

    // Store the rows locally as well, as state rows will not return on callback
    var rowsLocal = [];


    // EFFECTS

    useEffect(() => {
        // We retrieve the high score and personal best results
        highScoreDB.getTopResults(props.level, Period.ALL, setRowsCallback);
    }, []);


    // HANDLER

    useImperativeHandle(inputRef, () => {
        return {
            /**
             * Function to get the highlighted high score row
             * @returns Highlighted high score row, else highlighted personal best code -2, else no highlighted row code -1
             */
            getHighlightedHighScoreRow() {
                // If the highlighted row is a valid high score row return it
                if (isHighScoreRowHighligted()) {
                    return rowsLocal[props.highlightRowNumber - 1];
                }
                // Else check if the selected row is our personal best row, we indicate this using code -2
                else if (isPersonalBestRowHighlighted()) {
                    return -2;
                }
                // Else return no highlighted row condition, we indicate this using code -1
                else {
                    return -1;
                }
            },
            /**
             * Function to return the bottom position high score row
             * @returns Bottom position high score row, or -1 if an empty placeholder row
             */
            getBottomHighScoreRow() {
                // Get the second last row of our high score table, this is the bottom result. 
                // The last row is the personal best.
                let bottomHighScoreRow = rowsLocal[rowsLocal.length - 2];

                // If the row does not have a valid time or date then we have an empty placeholder row.
                // This occurs when we have not yet filled all the available high score positions.
                if (bottomHighScoreRow.timeMs === null || bottomHighScoreRow.timeMs === ""
                    || bottomHighScoreRow.dateES === null || bottomHighScoreRow.dateES === "") {
                    return -1;
                }
                // Else return the bottom high score row
                else {
                    return bottomHighScoreRow;
                }
            }
        };
    }, []);


    // LOCAL FUNCTIONS

    /**
     * Function to load in the high score rows from the data store and personal best row from local storage
     * @param {High score and personal best rows} rows 
     */
    function setRowsCallback(rows) {
        // We save a local copy as these are needed for callback functions, state rows do not return data
        rowsLocal = rows;
        // Set the state rows for render
        setRows(rows);
    }

    /**
     * Function to determine if a high score row is highlighted. 
     * Highscore rows are from 0 to row count -1. The last row is our personal best row.
     * @returns True if highscore row is highlighted, else False
     */
    function isHighScoreRowHighligted() {
        return props.highlightRowNumber >= 0 && props.highlightRowNumber <= rowsLocal.length - 1;
    }

    /**
     * Function to determine if the personal best row is highlighted. The last row is our personal best row.
     * @returns True if personal best row is highlighted, else False
     */
    function isPersonalBestRowHighlighted() {
        return props.highlightPersonalBest;
    }

    /**
     * Function to return whether we should highlight the current highscore row
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if we wish to highlight, else False
     */
    function isHighlightedHighScoreRow(currentRow) {
        // Are we highlighting this high score row
        return currentRow.position === props.highlightRowNumber;
    }

    /**
     * Function to return whether this is the personal best row and whether it should be highlighted
     * @param {table row} currentRow
     * @param {all table rows} rows
     * @returns True if we want to highlight the personal best row, else False
     */
    function isHighlightPersonalBestRow(currentRow) {
        // Are we highlighting the personal best row
        return props.highlightPersonalBest && currentRow.position === gameText.personalBestRowID;
    }


    // RENDER

    return (
        <TableContainer component={Paper}>
            <Table size={sx.tableSize}>
                <TableHead>
                    <TableRow>
                        <sx.StyledTableCell>{gameText.hsTablePosition}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableUsername}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableTime}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableDate}</sx.StyledTableCell>
                        <sx.StyledTableCell>{gameText.hsTableDevice}</sx.StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) =>
                        // Check if row should be highlighted and style accordingly
                        isHighlightedHighScoreRow(row) || isHighlightPersonalBestRow(row) ?
                            (
                                <sx.HighlightedTableRow key={row.position}>
                                    <sx.StyledTableCell component="th" scope="row">
                                        {row.position}
                                    </sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                    <sx.StyledTableCell align={sx.timeColumnDataAlign}>{row.time}</sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.device}</sx.StyledTableCell>
                                </sx.HighlightedTableRow>
                            )
                            // Else apply the default style to the row
                            : (
                                <sx.StyledTableRow key={row.position}>
                                    <sx.StyledTableCell component="th" scope="row">
                                        {row.position}
                                    </sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.user}</sx.StyledTableCell>
                                    <sx.StyledTableCell align="right">{row.time}</sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.date}</sx.StyledTableCell>
                                    <sx.StyledTableCell>{row.device}</sx.StyledTableCell>
                                </sx.StyledTableRow>
                            )
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
});

// PROP LIST

HighScoreTable.propTypes = {
    level: PropTypes.string,
    highlightRowNumber: PropTypes.number,
    highlightPersonalBest: PropTypes.bool
}

// EXPORT

export default HighScoreTable;
