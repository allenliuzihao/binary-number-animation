/*
 *	File created by Zihao Liu. I create this animation effect on my personal
 *	website without	use of any library. 
 *  
 * 	Copyright Zihao Liu
 */

(function(){
	var canvas = document.getElementById('mycanvas'),
		ctx = canvas.getContext("2d");
	//for stoping the setTimeout
	var timer; 
	//specify the maximum number of binary string we draw onto the canvas
	var MAX_BINARY_STRING = 200;
	//specify the size of the hash table
	var hashTableForX_Size = 21;

    //	This hashTable count how many strings are in the same bucket as hashAnimation
    //	I use greedy algorithm to make the binary string more spread out on the screen cuz 
    //	otherwise, the randomlly generated string will create cluster effect 

	var hashTableForX = new Array(hashTableForX_Size);

	//	This hash table stores the binary string and hash them based on their x location
	//	For example, if a binary string's x is 25px, canvas width is 250px and size of hashtable
	//	is 10. This binary string will be hashed to the first bucket in the hashTableForX
	var hashAnimation = new Array(hashTableForX_Size);

	//	This table stores:
	//	index 0: all the 1st binary strings in the hashAnimation of each bucket
	//	index 1: all the second binary strings in the hashAnimation of each bucket 
	//	And so on


	//Initialize the tables
	var animateSequence = [];
	for (var i = hashTableForX.length - 1; i >= 0; i--) {
			hashTableForX[i] = 0;
	}
	for (var j = hashAnimation.length - 1; j >= 0; j--) {
			hashAnimation[j] = [];
	}
	/**
	 *	generate the binary string that we are going to display on to the canvas
	 *	the length from 6 - 11
	 */
	function stringGenerator()
	{
		var str = [], str_length = Math.floor(Math.random() * 6) + 6;
		for (var i = 0; i < str_length; i++) {
			var temp = Math.ceil(Math.random() * 1000) + 2001;
			str.push(temp % 2);
		}
		return str;
	}
	/**
	 * return between 50% to 400%
	 * @return percentage of the font
	 */
	function sizeGenerator()
	{
		return Math.ceil(Math.random() * 350) + 50; 
	}
	/**
	 * randomly generate y. For x, I use hashtable to collect stat of where the x has been fallen onto the 
	 * canvas. For each step when we are generating x, we look for the bucket with the least number of x that
	 * has been fallen into. And then we update the hashtable correspondingly. This will make sure the binary
	 * string evenly spread out on the canvas
	 */
	function coordinateGenerator()
	{
		var x, y, smallest = 1000000, smallest_index;

		for(var i = hashTableForX.length; i >= 0 ; i--)
		{
			if(hashTableForX[i] < smallest)
			{
				smallest_index = i;
				smallest = hashTableForX[i];
			}
		}
		x = Math.ceil((Math.random() + smallest_index) * Math.ceil(canvas.width / hashTableForX_Size));
		hashTableForX[smallest_index] += 1;
		y = Math.ceil(Math.random() * canvas.height);
		return {
			"x" : x,
			"y" : y
		};
	}
	/*
	 * For each Binary String we draw onto the screen,
	 * it will have the following property: 
	 *	x, y: coordinate of where the leading char is 
	 *	dim: how large the text is
	 *	string: what does the string contain "010101" etc
	 */
	function BinaryNumberString()
	{
		this.string = stringGenerator();
		var dim = sizeGenerator();
		this.font =  dim + "% verdana";
		this.dim = dim;
		this.transparency = 0.8 * Math.random() + 0.2;
		var coor = coordinateGenerator();
		this.x = coor.x;
		this.y = -650;
		this.speed = Math.random() * 20 + 1;
		this.id = 0;
	}
	/**
	 * return all properties for current string
	 * @return object that contains all properties for a given binary string
	 */
	BinaryNumberString.prototype.getProperties = function()
	{
		var prop = {
			"font": this.font,
			"x": this.x,
			"y": this.y,
			"string": this.string
		};
		return prop;
	};
	/**
	 * start drawing the thing onto the canvas
	 */
	BinaryNumberString.prototype.drawOnScreen = function()
	{
		ctx.save();
		ctx.textBaseline = "top";
		ctx.fillStyle = "#56d5ff";
		ctx.scale(1 / canvas.width, 1 / canvas.height);
		ctx.globalAlpha = this.transparency;
		var y = this.y;
		for(var i = 0; i < this.string.length; i++)
		{
			ctx.font = this.font;
			ctx.fillText(this.string[i], this.x, y);
			y += 60 / (400 / this.dim);
		}
		ctx.restore();
	};
	/**
	 * To increment the y coordinate of current binary string
	 * 
	 */
	BinaryNumberString.prototype.incrementY = function()
	{
		this.y += this.speed;
		if(this.y > canvas.height)
		{
			this.y = -650;					//make the string to go back to the top of the canvas
		}
	};
	/**
	 * This function will do the following to set up the animation:
	 */
    function prepareForAnimate()
    {
		var index = 0, largest = -1;
		for(var i = 0; i < hashAnimation.length; i++)
		{
			if(hashAnimation[i].length > largest)
			{
				largest = hashAnimation[i].length;
			}
		}
		while(index < largest)
		{
			var currSequences = [];
			for(i = 0; i < hashAnimation.length; i++)
			{
				if(hashAnimation[i][index] !== undefined)
				{
					currSequences.push(hashAnimation[i][index]);
				}
			}
			index++;
			animateSequence.push(currSequences);
		}
    }
    /**
     * start the animation
     */
	function startAnimate()
	{
		drawBackground();			//this will override the frame before
		//then for each string in the animateSequence, draw then onto the screen and increment their y position
		for (var i = 0; i < animateSequence.length; i++)
		{
			var currSequences = animateSequence[i];
			for(var j = 0; j < currSequences.length; j++)
			{
				currSequences[j].drawOnScreen();
				currSequences[j].incrementY();
			}
		}
		timer = setTimeout(startAnimate, 50);
	}
	/**
	 * hash all the binary string to its corresponding position in the hashtable
	 * Basically divide the width of the window into the size of the hashtable. And then
	 * when create new binary string, hash those binary string into the hashtable
	 */
	function hashAllBinaryStringToTable()
	{
		for (var i = 0; i < MAX_BINARY_STRING; i++) {
			var temp = new BinaryNumberString();
			hashAnimation[temp.x % hashTableForX_Size].push(temp);
		}
	}
    /**
     * create background for the animation using Canvas linear gradient
     * 
     */
    function drawBackground()
    {
		ctx.save();
		var lingrad = ctx.createLinearGradient(0, 1, 1, 0);
		lingrad.addColorStop(0, "#184473");
		lingrad.addColorStop(0.5, "#569BC7");
		lingrad.addColorStop(1, "#9FCCE3");
		ctx.fillStyle = lingrad;
		ctx.fillRect(0, 0, 1, 1);
		ctx.restore();
    }
    /**
     * draw the entire image
     */
    function startApp()
    {
		ctx.save();
		drawBackground();
		hashAllBinaryStringToTable();
		prepareForAnimate();
		startAnimate();
		ctx.restore();
    }
    function resumeApp()
    {
		ctx.save();
		startAnimate();
		ctx.restore();
    }
    /**
     * return the eucleadian distance from x to y
     */
    function getDistance(x1, y1, x2, y2)
    {
		return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }
	//Stretch the canvas out to cover the entire browser
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    //do this to scale the canvas so we can position from 0 to 1 instead of the actual pixel
    ctx.scale(canvas.width, canvas.height);
	startApp();

	//handling stop and start the animation
	var count = 0;
	document.getElementById('animate_btn').addEventListener("click", function(){
		count++;
		if(count % 2 == 1)
		{
			this.innerHTML = "Start Animation";
			clearTimeout(timer);
		}
		else
		{
			this.innerHTML = "Stop Animation";
			resumeApp();
		}
	}, false);
	//handling clear the animation
	document.getElementById('remove_animate_btn').addEventListener("click", function(){
		resumeApp();
		for (var i = 0; i < animateSequence.length; i++)
		{
			var currSequences = animateSequence[i];
			for(var j = 0; j < currSequences.length; j++)
			{
				currSequences[j].transparency = 0;
			}
		}
	}, false);
})();