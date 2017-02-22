var Chroma = require('./');
var init = Chroma.InitChroma();

var current_col=0;
var grow=true;
var interval;
var customGrid = [];

for(var r=0; r<6; r++){
	customGrid[r]=[];
	for(var c=0; c<22; c++){
		customGrid[r][c]={
			Red: 255,
			Green: 255,
			Blue: 255		
		};
	}	
}



if(init){
	console.log("Successfully initialized.");
	interval = setInterval(function(){	
		var red_color = {
			Red: 255,
			Green: 0,
			Blue: 0		
		};

		var green_color = {
			Red: 0,
			Green: 255,
			Blue: 0		
		};

		var blue_color = {
			Red: 0,
			Green: 0,
			Blue: 255		
		};

		customGrid[5][1] = red_color; 		// ctrl
		customGrid[2][6] = green_color; 	// t
		customGrid[4][7] = blue_color;		// b
		
		/**
		 * This colors the entire board.
		 *
		for(var r=0; r<6; r++){
			for(var c=0; c<22; c++){
				customGrid[r][c]=color;
			}	
		}*/
		Chroma.Keyboard.SetCustom(customGrid);	
	},10);

	/**
	 * Finish session after 30 secs.
	 *
	setTimeout(function(){
		clearInterval(interval);
		console.log(Chroma.UnInitChroma());
		console.log("Closing");
	},30000);
	*/
}
else console.log("Couldn't initalize SDK");