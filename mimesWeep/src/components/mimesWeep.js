import '../style/mimesWeep.css';
import * as commonSx from '../style/commonSx.js';
import * as gameText from '../resources/text/gameText.js';
import * as logic from '../logic/gameLogic.js';
import * as settings from '../logic/gameSettings.js';
import * as sx from '../style/mimesweepSx.js';
import CustomDialog from './dialogs/customDialog.js';
import Divider from '@mui/material/Divider';
import FinishedMessage from './dialogs/finishedMessage.js';
import FlagBadge from './flagBadge.js'
import FormControl from '@mui/material/FormControl';
import GameBoard from './gameBoard.js'
import HelpDialog from './dialogs/helpDialog.js';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { Box, Button } from '@mui/material';
import { useState } from 'react';

/**
 * Component at the root of the game. Contains the header, toolbar, and game board.
 */

function MimesWeep() {

  // STATES

  const [numOfGamesPlayed, setNumOfGamesPlayed] = useState(1);

  const [difficulty, setDifficulty] = useState(1);

  const [customHeight, setCustomHeight] = useState(9);
  const [customWidth, setCustomWidth] = useState(9);
  const [customNumOfMimes, setCustomNumOfMimes] = useState(9);
  const [isCustomGame, setCustomGame] = useState(false);


  // LOCAL VARIABLES

  // Tracks the number of flags placed on the board
  var guessCount = 0;


  // CALLBACK METHODS

  var setGuessCountChildFunction;

  /**
   * Callback function executed when a flag guess is placed or removed from the board
   * @param {Either the child function or the amount to change the current flag guess count} callbackParams 
   */
  const incrementGuessCountCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      setGuessCountChildFunction = callbackParams[1];
    }

    // Else we already have the child callback function and a flag guess was placed or removed
    else {
      // Increment or decrement (if a negative number) our number of flag guesses on the board
      guessCount += callbackParams;

      // Call the recived child function with the updated count
      setGuessCountChildFunction(guessCount);
    }
  };

  var setGuessButtonToggledChildFunction;

  /**
   * Callback function executed when a flag guess button is selected or unselected
   * @param {Either the child function or the state of the flag guess button} callbackParams 
   */
  const guessButtonToggledCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      setGuessButtonToggledChildFunction = callbackParams[1];
    }

    // Else we already have the child callback function and we call it with the updated state
    else {
      setGuessButtonToggledChildFunction(!callbackParams);
    }
  };

  var setButtonToggleChildFunction;

  /**
   * Callback function to set the flag guess button selected or unselected
   * @param {Either the child function or the state to set the flag guess button} callbackParams 
   */
  const setButtonToggleCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      setButtonToggleChildFunction = callbackParams[1];
    }

    // Else we already have the child callback function and we call to set the Flag Guess button state
    else {
      setButtonToggleChildFunction(callbackParams);
    }
  };

  var showLoseMessage;


  /**
   * Function to display the lost game message to the user
   * @param {Either the child function or a command to display the lost game message} setStateCallback 
   */
  const displayLoseMessageCallback = (setStateCallback) => {

    // If an array we are getting the child callback function we need, store it
    if (setStateCallback) {
      showLoseMessage = setStateCallback[1];
    }

    // Else display the lost game message to the user
    else {
      showLoseMessage(true);
    }
  };

  var showWinMessage;

  /**
   * Function to display the won game message to the user
   * @param {Either the child function or a command to display the won game message} setStateCallback 
   */
  const displayWinMessageCallback = (setStateCallback) => {

    // If an array we are getting the child callback function we need, store it
    if (setStateCallback) {
      showWinMessage = setStateCallback[1];
    }

    // Else display the won game message to the user
    else {
      showWinMessage(true);
    }
  };

  var openCustomDialog;

  /**
   * Function to display the custom game dialog to the user
   * @param {Either the child function or a command to display the custom game dialog} callbackParams 
   */
  const openCustomDialogCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      openCustomDialog = callbackParams[1];
    }

    // Else display the custom game dialog to the user
    else {
      openCustomDialog(true);
    }
  };

  var openHelpDialog;

  /**
   * Function to display the help dialog to the user
   * @param {Either the child function or a command to display the help dialog} callbackParams 
   */
  const openHelpDialogCallback = (callbackParams) => {

    // If an array we are getting the child callback function we need, store it
    if (Array.isArray(callbackParams)) {
      openHelpDialog = callbackParams[1];
    }

    // Else display the help dialog to the user
    else {
      openHelpDialog(true);
    }
  };


  // LOCAL METHODS

  /**
   * Function to restart the game using the same game parameters (though mime positions will be again randomized)
   */
  function handleRestart() {

    // Update the state, which will refresh the component
    setNumOfGamesPlayed(numOfGamesPlayed + 1);

    // Reset all child game components
    resetGameChildComponentStates();
  };


  /**
   * Function called when the a new value is selected in the difficulty dropdown
   * @param {Drop down selection event object} event 
   */
  function handleDifficultyChange(event) {

    // If custom game is selected (value is 4) do nothing, this is handled elsewhere
    if (event.target.value === 4) {
      return;
    }

    // Set the state, will refresh the component
    setCustomGame(false);

    // Restart and refresh the game to the new difficulty
    resetGameSettings(event.target.value);
  };

  /**
   * Callback function when a custom game is started 
   * @param {Rows in the custom game} height 
   * @param {Columns in the custom game} width 
   * @param {Mimes in the custom game} mimeCount 
   */
  function startCustomGameCallback(height, width, mimeCount) {

    // Add check that numOfMimes not greater than number of board squares, 
    // if not it is set to number of board squares
    mimeCount = logic.sanitizeMimeCount(height, width, mimeCount);

    // Set all the states to represent the custom game, if New game selected these will be reused
    setCustomGame(true);
    setCustomHeight(height);
    setCustomWidth(width);
    setCustomNumOfMimes(mimeCount);
    resetGameSettings(4);
  }

  /**
   * Function to change the difficulty and start a new game
   * @param {Difficulty value} value 
   */
  function resetGameSettings(value) {

    // Set the difficult state
    setDifficulty(value);

    // Reset all child game components
    resetGameChildComponentStates();
  }

  /**
   * Function to reset all states in the game
   */
  function resetGameChildComponentStates() {

    // No flags are now placed
    setGuessCountChildFunction(0);

    // Set Flag Guess button to unselected and inform child component
    setGuessButtonToggledChildFunction(false);
    setButtonToggleChildFunction(false);
  }


  // LOGIC

  // Get the game parameters from the set difficulty level, or from user input custom parameters

  var gameSettings;

  if (isCustomGame) {
    gameSettings = [customHeight, customWidth, customNumOfMimes];
  } else {
    gameSettings = settings.getGameSettings(difficulty);
  }

  var height = gameSettings[0];
  var width = gameSettings[1];
  var numOfMimes = gameSettings[2];


  // COMPONENT

  return (
    <div className="mimesWeep" onContextMenu={(e) => {
      // Prevent any default behaviour when any component in this App is right clicked
      e.preventDefault();
    }}>
      <div>
        <header className="mimesWeep-header" >
          <p>
            {gameText.title}
          </p>
        </header>
      </div>
      <Box sx={sx.spacingHeight} />
      <Toolbar sx={sx.toolbar}>
        <Tooltip
          title={gameText.tooltipNew}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
        >
          <Button
            variant={sx.btnVariant}
            onClick={handleRestart}
            sx={sx.btnSmall}
          >
            {gameText.newButtonText}
          </Button>
        </Tooltip>
        <Box width={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipDifficulty}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
        >
          <FormControl>
            <Select
              value={difficulty}
              onChange={handleDifficultyChange}
              sx={sx.difficultySelect}
            >
              <MenuItem
                value={1}
                sx={commonSx.font}
              >
                {gameText.difficultyEasy}
              </MenuItem>
              <MenuItem
                value={2}
                sx={commonSx.font}
              >
                {gameText.difficultyMedium}
              </MenuItem>
              <MenuItem
                value={3}
                sx={commonSx.font}
              >
                {gameText.difficultyHard}
              </MenuItem>
              <Divider />
              <MenuItem
                value={4}>
                <Button
                  sx={sx.customBtn}
                  onClick={openCustomDialogCallback}
                >
                  {gameText.difficultyCustom}
                </Button>
              </MenuItem>
            </Select>
          </FormControl>
        </Tooltip>
        <Box sx={sx.btnSpacingWidth} />
        <FlagBadge
          numOfMimes={numOfMimes}
          incrementGuessCountCallback={incrementGuessCountCallback}
          guessButtonToggledCallback={guessButtonToggledCallback}
          setButtonToggleCallback={setButtonToggleCallback} />
        <Box sx={sx.btnSpacingWidth} />
        <Tooltip
          title={gameText.tooltipHelp}
          placement={commonSx.tooltipPlacement}
          arrow={commonSx.tooltipArrow}
        >
          <Button
            variant={sx.btnVariant}
            onClick={openHelpDialogCallback}
            sx={sx.btnSmall}>
            <sx.helpIcon />
          </Button>
        </Tooltip>
      </Toolbar>
      <Box sx={sx.spacingHeight} />
      <GameBoard
        height={height}
        width={width}
        numOfMimes={numOfMimes}
        displayLoseMessageCallback={displayLoseMessageCallback}
        displayWinMessageCallback={displayWinMessageCallback}
        incrementGuessCountCallback={incrementGuessCountCallback}
        guessButtonToggledCallback={guessButtonToggledCallback}
      />
      <FinishedMessage
        displayLoseMessageCallback={displayLoseMessageCallback}
        displayWinMessageCallback={displayWinMessageCallback} />
      <CustomDialog
        openCustomDialogCallback={openCustomDialogCallback}
        startCustomGameCallback={startCustomGameCallback}
      />
      <HelpDialog openHelpDialogCallback={openHelpDialogCallback} />
    </div>
  );
}

// EXPORT

export default MimesWeep;
