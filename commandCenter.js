/**
 * This builds over the Razer's Chroma API providing an interface to be used for
 * an HCI project where we're trying to detect the usability of backlit Keys
 * in learning shortcuts faster
 * 
 * @author me@nishantarora.in (Nishant Arora)
 */

'use strict'

// Imports
const Chroma = require('./');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const socket = require('socket.io')(server);


/**
 * App Namespace
 */
var chromaHCIapp = {};


/**
 * Some Constants.
 */
chromaHCIapp.CONSTANTS = {
  // can be anything >1000
  'serverPort': 5000,
  // The time after which we recolor the keyboard.
  'refreshInterval': 1,
  // This is how Razer defines their keyboards.
  'keyboardRows': 6,
  'keyboardCols': 22,
  // The block of commands we work on without breaks.
  'blockSize': 30,
  // Delays between commands
  'delayIfCommandIsCorrect': 500,
  'delayIfCommandIsWrong': 3000,
  'breakBetweenBlocks': 5000,
  // Colors for rgb backlit keyboard.
  'color': {
    'black': {
      Red: 0,
      Green: 0,
      Blue: 0
    },
    'white': {
      Red: 255,
      Green: 255,
      Blue: 255
    },
    'red': {
      Red: 255,
      Green: 0,
      Blue: 0
    },
    'green': {
      Red: 0,
      Green: 255,
      Blue: 0
    },
    'blue': {
      Red: 0,
      Green: 0,
      Blue: 255
    },
  },
  // Key Mappings.
  'keyname': {
    'A': {
      'name': 'a',
      'map': [3, 2]
    },
    'B': {
      'name': 'b',
      'map': [4, 7]
    },
    'C': {
      'name': 'c',
      'map': [4, 5]
    },
    'D': {
      'name': 'd',
      'map': [3, 4]
    },
    'E': {
      'name': 'e',
      'map': [2, 4]
    },
    'F': {
      'name': 'f',
      'map': [3, 5]
    },
    'G': {
      'name': 'g',
      'map': [3, 6]
    },
    'H': {
      'name': 'h',
      'map': [3, 7]
    },
    'I': {
      'name': 'i',
      'map': [2, 9]
    },
    'J': {
      'name': 'j',
      'map': [3, 8]
    },
    'K': {
      'name': 'k',
      'map': [3, 9]
    },
    'L': {
      'name': 'l',
      'map': [3, 10]
    },
    'M': {
      'name': 'm',
      'map': [4, 9]
    },
    'N': {
      'name': 'n',
      'map': [4, 8]
    },
    'O': {
      'name': 'o',
      'map': [2, 10]
    },
    'P': {
      'name': 'p',
      'map': [2, 11]
    },
    'Q': {
      'name': 'q',
      'map': [2, 2]
    },
    'R': {
      'name': 'r',
      'map': [2, 5]
    },
    'S': {
      'name': 's',
      'map': [3, 3]
    },
    'T': {
      'name': 't',
      'map': [2, 6]
    },
    'U': {
      'name': 'u',
      'map': [2, 8]
    },
    'V': {
      'name': 'v',
      'map': [4, 6]
    },
    'W': {
      'name': 'w',
      'map': [2, 3]
    },
    'X': {
      'name': 'x',
      'map': [4, 4]
    },
    'Y': {
      'name': 'y',
      'map': [2, 7]
    },
    'Z': {
      'name': 'z',
      'map': [4, 3]
    },
    'CTRL': {
      'name': 'control',
      'map': [5, 1]
    },
    'SHIFT': {
      'name': 'shift',
      'map': [4, 1]
    },
    'ALT': {
      'name': 'alt',
      'map': [5, 3]
    },
  },
  // We came up with a random command list
  'commandList': [{
      'id': 0,
      'command': 'Turn up living room lights',
      'key_1': 'CTRL',
      'key_2': 'S',
      'tfreq': 4,
      'efreq': 2
    },
    {
      'id': 1,
      'command': 'Turn down living room lights',
      'key_1': 'CTRL',
      'key_2': 'A',
      'tfreq': 4,
      'efreq': 2
    },
    {
      'id': 2,
      'command': 'Raise the upstairs blinds',
      'key_1': 'CTRL',
      'key_2': 'G',
      'tfreq': 6,
      'efreq': 3
    },
    {
      'id': 3,
      'command': 'Lower the upstairs blinds',
      'key_1': 'CTRL',
      'key_2': 'B',
      'tfreq': 6,
      'efreq': 3
    },
    {
      'id': 4,
      'command': 'Turn off all lights',
      'key_1': 'CTRL',
      'key_2': 'M',
      'tfreq': 3,
      'efreq': 1
    },
    {
      'id': 5,
      'command': 'Set lights to party mode',
      'key_1': 'CTRL',
      'key_2': 'U',
      'tfreq': 2,
      'efreq': 1
    },
    {
      'id': 6,
      'command': 'Turn on/off porch lights',
      'key_1': 'CTRL',
      'key_2': 'P',
      'tfreq': 4,
      'efreq': 2
    },
    {
      'id': 7,
      'command': 'Adjust temperature up 1 deg',
      'key_1': 'ALT',
      'key_2': 'O',
      'tfreq': 3,
      'efreq': 1
    },
    {
      'id': 8,
      'command': 'Adjust temperature down 1 deg',
      'key_1': 'ALT',
      'key_2': 'L',
      'tfreq': 3,
      'efreq': 1
    },
    {
      'id': 9,
      'command': 'Increase bedroom fan speed',
      'key_1': 'ALT',
      'key_2': 'T',
      'tfreq': 2,
      'efreq': 1
    },
    {
      'id': 10,
      'command': 'Decrease bedroom fan speed',
      'key_1': 'ALT',
      'key_2': 'R',
      'tfreq': 2,
      'efreq': 1
    },
    {
      'id': 11,
      'command': 'Run the dehumidifier',
      'key_1': 'ALT',
      'key_2': 'A',
      'tfreq': 1,
      'efreq': 1
    },
    {
      'id': 12,
      'command': 'Change air conditioner mode',
      'key_1': 'ALT',
      'key_2': 'N',
      'tfreq': 6,
      'efreq': 3
    },
    {
      'id': 13,
      'command': 'Turn on/off dining room fan',
      'key_1': 'ALT',
      'key_2': 'C',
      'tfreq': 12,
      'efreq': 6
    },
    {
      'id': 14,
      'command': 'Open the garage door',
      'key_1': 'SHIFT',
      'key_2': 'I',
      'tfreq': 2,
      'efreq': 1
    },
    {
      'id': 15,
      'command': 'Close the garage door',
      'key_1': 'SHIFT',
      'key_2': 'U',
      'tfreq': 2,
      'efreq': 1
    },
    {
      'id': 16,
      'command': 'Lock the main door',
      'key_1': 'SHIFT',
      'key_2': 'F',
      'tfreq': 12,
      'efreq': 6
    },
    {
      'id': 17,
      'command': 'Unlock the main door',
      'key_1': 'SHIFT',
      'key_2': 'V',
      'tfreq': 12,
      'efreq': 6
    },
    {
      'id': 18,
      'command': 'Call emergency services',
      'key_1': 'SHIFT',
      'key_2': 'Q',
      'tfreq': 1,
      'efreq': 1
    },
    {
      'id': 19,
      'command': 'Test the smoke detector',
      'key_1': 'SHIFT',
      'key_2': 'X',
      'tfreq': 1,
      'efreq': 1
    },
    {
      'id': 20,
      'command': 'Turn on/off alarm system',
      'key_1': 'SHIFT',
      'key_2': 'N',
      'tfreq': 2,
      'efreq': 1
    }
  ]
};


/**
 * Logging method, to make sure the logs are consistent.
 * 
 * @param {string} event
 * @param {string} msg
 */
chromaHCIapp.log = function (event, msg) {
  let msgString = 'Time: ' + new Date().getTime() + ', ' +
    'Block: ' + this.block + ', ' +
    'User: ' + this.user + ', ' +
    'Event: ' + event + ', ' +
    'Msg: ' + msg;
  console.log(msgString);
};


/**
 * Shuffles the array in place.
 * 
 * @param {array} arr
 * @return {array} shuffled array.
 */
chromaHCIapp.shuffle = function (arr) {
  for (let i = arr.length; i; i--) {
    let j = Math.floor(Math.random() * i);
    [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
  }
  return arr;
}


/**
 * Generates a random command deck based on the frequency provided.
 * 
 * @param {string} deckType
 * @return {array} shuffled command ids.
 */
chromaHCIapp.generateCommandDeck = function (deckType) {
  let commandIds = []
  for (let i in this.CONSTANTS.commandList) {
    let command = this.CONSTANTS.commandList[i];
    for (let c = 0; c < command[deckType]; c++) {
      commandIds.push(command.id);
    }
  }
  return this.shuffle(commandIds);
};


/**
 * Default Grid Layout. We decided the default color should be white.
 */
chromaHCIapp.defaultGrid = function () {
  for (let row = 0; row < this.CONSTANTS.keyboardRows; row++) {
    this.grid[row] = [];
    for (let col = 0; col < this.CONSTANTS.keyboardCols; col++) {
      this.grid[row][col] = this.CONSTANTS.color.white;
    }
  }
};


/**
 * Loops the current layout every few ms. This value is set in:
 * CONSTANT.refreshInterval
 */
chromaHCIapp.looper = function () {
  Chroma.Keyboard.SetCustom(this.grid);
};


/**
 * changes key color by key name.
 * 
 * @param {string} key
 * @param {string} color
 */
chromaHCIapp.changeColor = function (keyName, color) {
  let key = this.CONSTANTS.keyname[keyName.toUpperCase()].map;
  this.grid[key[0]][key[1]] = color;
};


/**
 * Get's all possible commands for the pressed key.
 * e.g. if CTRL key is pressed, this gets all the valid commads with CTRL key
 * pressed
 * 
 * @param {strin} keyName
 */
chromaHCIapp.getPossibleCommandsByKeyName = function (keyName) {
  let possibleCommands = [];
  for (let i in this.CONSTANTS.commandList) {
    let command = this.CONSTANTS.commandList[i];
    if (keyName == this.getKeyByKeyName(command.key_1).name ||
      keyName == this.getKeyByKeyName(command.key_2).name) {
      possibleCommands.push(command);
    }
  }
  return possibleCommands;
};


/**
 * Lights up all possible combinations for a given key
 * 
 * @param {string} keyName
 */
chromaHCIapp.lightUpAllPossibleCombintationsForKeyName = function (keyName) {
  if (this.lit) {
    let possibleCommands = this.getPossibleCommandsByKeyName(keyName);
    for (let p in possibleCommands) {
      let command = possibleCommands[p];
      this.changeColor(command.key_2, this.CONSTANTS.color.green);
    }
  }
};


/**
 * Get's Key by keyname
 * 
 * @param {string} keyName
 * @return {object} key
 */
chromaHCIapp.getKeyByKeyName = function (keyName) {
  if (keyName.toUpperCase() in this.CONSTANTS.keyname) {
    return this.CONSTANTS.keyname[keyName];
  }
  return false;
}


/**
 * Handles key press events
 * @param {object} key
 */
chromaHCIapp.onKeyPressHandler = function (key) {
  if (this.pressedKeyStack.indexOf(key.key) == -1) {
    this.pressedKeyStack.push(key.key);
    this.log('New Key Press', this.pressedKeyStack);
    if (this.pressedKeyStack.length == 1) {
      this.lightUpAllPossibleCombintationsForKeyName(key.key);
    }
    if (this.pressedKeyStack.length == 2) {
      if (this.lit) {
        this.changeColor(key.key, this.CONSTANTS.color.green)
      }
      if (this.pressedKeyStack[0] != this.key1.name ||
        this.pressedKeyStack[1] != this.key2.name) {
        this.isCorrect = false;
      }
      this.sendResult();
    }
  }
};


/**
 * Handles the on KeyUp Event.
 * 
 * @param {object} key
 */
chromaHCIapp.onKeyUpHandler = function (key) {
  this.log('Key Up', key.key);
  /**
  this.pressedKeyStack.pop(key.key);
  if (this.pressedKeyStack.length == 0) {
    this.log('Msg', 'All Keys Key Up.')
    this.defaultGrid();
  }*/
};


/**
 * Pings the frontend with new data
 * 
 * @param {string} type
 * @param {string} message
 */
chromaHCIapp.pingFrontEnd = function (type, message) {
  this.log('Msg', type + '[ ' + message + ']');
  socket.emit(type, {
    msg: message
  });
};


/**
 * Sends Command to the frontend
 */
chromaHCIapp.sendCommand = function () {
  this.pingFrontEnd('command', this.activeCommand.command);
  this.pingFrontEnd('result', '');
};


/**
 * Sends Result to the frontend.
 */
chromaHCIapp.sendResult = function () {
  let result = (this.isCorrect) ? 'Correct' : 'Incorrect';
  this.pingFrontEnd('result', result);
  this.commandManager();
};


/**
 * Manages which command needs to be sent.
 */
chromaHCIapp.commandManager = function () {
  this.defaultGrid();
  let wait = this.CONSTANTS.delayIfCommandIsCorrect;
  if ((this.trainCommandDeck.length % this.CONSTANTS.blockSize) == 0) {
    this.pingFrontEnd('command', 'Rest, next command in 30 Sec.');
    wait = this.CONSTANTS.breakBetweenBlocks;
  }
  setTimeout(this.initNextCommand.bind(this), wait);
};


/**
 * Get's the next command
 */
chromaHCIapp.initNextCommand = function () {
  this.activeCommand = this.CONSTANTS.commandList[this.trainCommandDeck.pop()];
  this.key1 = this.CONSTANTS.keyname[this.activeCommand.key_1];
  this.key2 = this.CONSTANTS.keyname[this.activeCommand.key_2];
  this.isCorrect = true;
  this.pressedKeyStack = [];
  this.sendCommand();
}


/**
 * Handles new user.
 * 
 * @param {object} req
 * @param {object} res
 */
chromaHCIapp.handleNewUser = function (req, res) {
  res.sendFile(__dirname + '/index.html');
  this.user = req.params.user;
  this.lit = (req.params.lit == 'backlit') ? true : false;
  this.pressedKeyStack = [];
  this.activeCommand;
  this.block = 0;
  this.trainCommandDeck = this.generateCommandDeck('tfreq');
  this.log('Msg', 'New User [backlit = ' + this.lit + ']');
  this.log('Msg', 'Command Order [' + this.trainCommandDeck + ']');
  socket.on('connection', this.socketListener.bind(this));
};


/**
 * Socket Listener.
 * @param {object} socket
 */
chromaHCIapp.socketListener = function (socket) {
  socket.on('keypress', this.onKeyPressHandler.bind(this));
  //  socket.on('keyup', this.onKeyUpHandler.bind(this));
  this.commandManager();
};


/**
 * Sends no content for some requests.
 * 
 * @param {object} request
 * @param {object} response
 */
chromaHCIapp.noContent = function (request, response) {
  response.send(204);
};


/**
 * Set's up routes for this app.
 */
chromaHCIapp.setUpRoutes = function () {
  this.log('Msg', 'Setting up routes.');
  app.use(express.static(__dirname + '/'));
  app.get('/favicon.ico', this.noContent);
  app.get('/apple-touch-icon.png', this.noContent);
  app.get('/:user/:lit/', this.handleNewUser.bind(this));
};


/**
 * Serves the app to the user.
 */
chromaHCIapp.serve = function () {
  this.log('Msg', 'Starting Server');
  this.setUpRoutes();
  server.listen(this.CONSTANTS.serverPort, function () {
    this.log('Msg', 'Server Started')
  }.bind(this));
};

/**
 * Init method.
 */
chromaHCIapp.init = function () {
  this.SDK = Chroma.InitChroma();
  this.grid = [];
  this.defaultGrid();
  this.user = '';
  this.block = '';
  if (this.SDK) {
    this.log('Msg', 'Chroma SDK initialized...');
    this.serve();
    this.log('Msg', 'Starting Looper Service.');
    setInterval(this.looper.bind(this), this.CONSTANTS.refreshInterval);
  } else {
    this.log('Msg', 'Chrome SDK Failed');
  }
};

// start here
chromaHCIapp.init();