const keypress = require('keypress');
const Chroma = require('./');

// make process.stdin begin emitting "keypress" events 
keypress(process.stdin);
process.stdin.setRawMode(true);

/**
 * App Namespace
 */
var chromaHCIapp = {};

/**
 * Some Constants.
 */
chromaHCIapp.CONSTANTS = {
	'refreshInterval': 10,		// in ms.
	'keyboardRows': 6,
	'keyboardCols': 22,
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
		}
	},
	'keymap': {
		'q': [2, 2],
		'w': [2, 3],
		'e': [2, 4],
		'r': [2, 5],
		't': [2, 6],
		'y': [2, 7],
		'u': [2, 8],
		'i': [2, 9],
		'o': [2, 10],
		'p': [2, 11],
		'a': [3, 2],
		's': [3, 3],
		'd': [3, 4],
		'f': [3, 5],
		'g': [3, 6],
		'h': [3, 7],
		'i': [3, 8],
		'j': [3, 9],
		'k': [3, 10],
		'l': [3, 11],
		'z': [4, 3],
		'x': [4, 4],
		'c': [4, 5],
		'v': [4, 6],
		'b': [4, 7],
		'n': [4, 8],
		'm': [4, 9]
	}
};

/**
 * Key Combinations
 */
chromaHCIapp.keyCombinations = {
	'c': {
		'e': 'Open the Garage Door',
		'y': 'Turn on the Air Conditioner',
		'b': 'Turn off the air conditioner',
		'f': 'Turn off the Water Heater',
		'z': 'Lower the Upstairs Blinds',
		'l': 'Raise the Upstairs Blinds',
		'p': 'Turn off Bathroom Fan',
		'h': 'Lock Front Door',
		'o': 'Dim Living Room Lights',
		'k': 'Turn on Alarm System'
	},
	'a': {
		'i': 'Close the Garage Door',
		'n': 'Turn on the Water Heater',
		'e': 'Adjust Temperature Up 1 degree',
		'c': 'Adjust Temperature Down 1 degree', // this is problematic
		'q': 'Turn on Bathroom Fan',
		'b': 'Unlock Front Door',
		'j': 'Turn off Alarm System'
	}
}

/**
 * Default Grid Layout.
 */
chromaHCIapp.defaultGrid = function(){
	for (let row = 0; row < this.CONSTANTS.keyboardRows; row++) {
		this.grid[row] = [];
		for (let col = 0; col < this.CONSTANTS.keyboardCols; col++) {
			this.grid[row][col] = this.CONSTANTS.color.white;
		}
	}
};

/**
 * Loops the current layout every 10ms.
 */
chromaHCIapp.looper = function() {
	Chroma.Keyboard.SetCustom(this.grid);
};

/**
 * changes key color by key name.
 * @param {string} key
 * @param {string} color
 */
chromaHCIapp.changeColor = function(key, color) {
	if (key in this.CONSTANTS.keymap) {
		let k = this.CONSTANTS.keymap[key];
		this.grid[k[0]][k[1]] = color;
	} else {
		console.log('Key ' + key + ' not mapped.');
	}
};

/**
 * Handles key press events
 * @param {string} char
 * @param {object} key
 */
chromaHCIapp.onKeyPressHandler = function(char, key) {
	console.log('got "keypress"', key);
	this.defaultGrid();
	if (key && key.ctrl && key.name == 'c') {
		process.exit();
	}
	if (key.name in this.keyCombinations) {
		this.changeColor(key.name, this.CONSTANTS.color.red);
		for (var k in this.keyCombinations[key.name]) {
			this.changeColor(k, this.CONSTANTS.color.green);
		}
	}
};

/**
 * Init method.
 */
chromaHCIapp.init = function() {
	this.SDK = Chroma.InitChroma();
	this.grid = [];
	this.defaultGrid();
	if (this.SDK) {
		console.log('Chroma SDK initialized.');
		console.log('Starting Key Listener Daemon.');
		process.stdin.on('keypress', this.onKeyPressHandler.bind(this));
		console.log('Starting Looper');
		setInterval(this.looper.bind(this), this.CONSTANTS.refreshInterval);
	} else {
		console.log("Couldn't initalize SDK");
	}
};

// start here
chromaHCIapp.init();