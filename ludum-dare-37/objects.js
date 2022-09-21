vec2 = {
	x: 0, y: 0
};

var player = 
{
	x: 75, y: 70,
	velX: 0, velY: 0,
	speed: 5,
	width: 64, height: 64,
	image: new Image(),

	update: function()
	{
		//Movement
		this.x += this.velX;
		this.y += this.velY;

		var collision = false;
		for(var i = 0; i < npcGroup.length; i++)
		{
			if(isColliding(player, npcGroup[i]))//Colliding with npc
			{
				collision = true;
				collidingWith = i;
			}
		}

		if(!collision)//There is no collision
			collidingWith = -1;

		//Collision Bounds
		if(this.x < 65)
		{
			this.velX = 0;
			this.x = 65;
		}

		if(this.y < 65)
		{
			this.velY = 0;
			this.y = 65;
		}

		if(this.x+this.width > 1856)
		{
			this.velX = 0;
			this.x = 1856-this.width;
		}

		if(this.y+this.height > 475)
		{
			this.velY = 0;
			this.y = 475-this.width;
		}

		if(this.x >= 820 && this.x <= 948+64 && this.y >= 10 && this.y <= 202+64)
		{
			if(this.x+32 <= 884)//First Row
			{
				if(this.y+32 <= 70+64)//First Patch
				{
					inPatch = 1;
				}
				else if(this.y+32 >= 70+64 && this.y+32 <= 70+64*2)//Second Patch
				{
					inPatch = 2;
				}
				else if(this.y+32 >= 70+64*2 && this.y+32 <= 70+64*3)//Third Patch
				{
					inPatch = 3;
				}
				else if(this.y+32 >= 70+64*3)//Fourth Patch
				{
					inPatch = 4;
				}
			}
			else if(this.x+32 >= 884 && this.x+32 <= 948)//Second Row
			{
				if(this.y+32 <= 70+64)//First Patch
				{
					inPatch = 5;
				}
				else if(this.y+32 >= 70+64 && this.y+32 <= 70+64*2)//Second Patch
				{
					inPatch = 6;
				}
				else if(this.y+32 >= 70+64*2 && this.y+32 <= 70+64*3)//Third Patch
				{
					inPatch = 7;
				}
				else if(this.y+32 >= 70+64*3)//Fourth Patch
				{
					inPatch = 8;
				}
			}
			else if(this.x+32 >= 948)//Third Row
			{
				if(this.y+32 <= 70+64)//First Patch
				{
					inPatch = 9;
				}
				else if(this.y+32 >= 70+64 && this.y <= 70+64*2)//Second Patch
				{
					inPatch = 10;
				}
				else if(this.y+32 >= 70+64*2 && this.y <= 70+64*3)//Third Patch
				{
					inPatch = 11;
				}
				else if(this.y+32 >= 70+64*3)//Fourth Patch
				{
					inPatch = 12;
				}
			}
		}
	}
};

var npcManager = 
{
	nextNPC: 30000, //How long until a new npc is created (depends on happiness levels)
	nextAttack: 30000,//How much longer until there is an enemy attack
	createNPC: function()//Waits seconds to create a new npc
	{
		setTimeout(function(){
			npcManager.newNPC();
		}, npcManager.nextNPC);
	},
	newNPC: function()
	{
		var temp = clone(npc);
		temp.x = randX();
		temp.y = randY();
		console.log("New NPC at " + temp.x + " " + temp.y)
		temp.image = new Image();
		if(createdNPC)
			temp.ocupation = 3;
		else
			temp.ocupation = 1;
		createdNPC = true;
		if(temp.ocupation == 1)
			temp.image.src = "res/knight_blue.png";//TODO Make random npc image
		else
			temp.image.src = "res/knight_brown.png";//TODO Make random npc image
		temp.strength = 3;
		npcGroup.push(temp);
		nonmoving.push(temp);
		this.nextNPC *= 1.2;//Increases time a little
		timeLeft = Math.floor(this.nextNPC/1000);
		this.createNPC();
		document.getElementById("newNPC").play();
	},
	newEnemy: function(target, x, y, strength)
	{
		var temp = clone(npc);
		//Will be scripted depending on start point
		temp.x = x;
		temp.y = y;
		temp.image = new Image();
		temp.image.src = "res/knight_blond.png";
		temp.ocupation = 2;
		temp.speed = 1.5;
		temp.strength = strength;
		temp.target = target;
		emyGroup.push(temp);
	},
	moveNPC: function()
	{
		var min = Math.ceil(0);
		var max = Math.floor(nonmoving.length);
		var index = Math.floor(Math.random()*(max-min)) + min;
		//if(index != 0)
			//index--;

		if(nonmoving[index].canMove)
		{
			var i = npcGroup.indexOf(nonmoving[index]);
			if(i > -1 && i != collidingWith)
			{
				nonmoving[index].moveTo.x = randXWith(nonmoving[index].x, 100);
				nonmoving[index].moveTo.y = randYWith(nonmoving[index].y, 100);
				//console.log("Moving To " + nonmoving[index].moveTo.x);
				moving.push(nonmoving[index]);//Moves npc to moving group
				nonmoving.splice(index, 1);//Removes npc from nonmoving group
			}
		}
	},
	waitToMove: function()
	{
		setTimeout(function(){
			if(nonmoving.length > 0)//We can move shit
				npcManager.moveNPC();
			npcManager.waitToMove();
		}, 2000);
	},
	checkAttack: function()
	{
		setTimeout(function(){
			console.log("Checking an attack!");
			var rand = Math.random()*100;
			if(!firstAttack)//Normal Functions
			{
				if(rand >= 60)//There is an attack (0 should be 60 pls change that for final)
				{
					npcManager.attackInbound();
					document.getElementById("warn").play();
				}
				else
				{
					npcManager.nextAttack *= 0.9;
					npcManager.checkAttack();
				}
			}else
			{
				firstAttack = false;
				npcManager.attackInbound();
				document.getElementById("warn").play();
			}
		}, this.nextAttack)
	},
	attackInbound: function()
	{
		attackLeft = 10;
		drawAttack = true;
		setTimeout(function(){
			var min = Math.ceil(1);
			var max = Math.floor(8);
			var index = Math.floor(Math.random()*(max-min+1)) + min;
			panCamera(index);
			npcManager.nextAttack *= 2;
			npcManager.checkAttack();
		}, 10000);
	},
	launchAttack: function(index)
	{
		drawAttack = false;
		enemiesAlive = true;
		var xPoint = getPointX(index);
		var yPoint = getPointY(index);

		var size = npcGroup.length;
		var strength = 1;
		var diff = 0;
		if(size > 5)
		{
			diff = size-5;
			size = 5;
		}

		strength += diff/2;

		for(var i = 0; i < size; i++)
		{
			this.newEnemy(i, xPoint, yPoint, strength);//Makes a new enemy for each npc that exsists
		}
		
	}
};

var npc = 
{
	x: 0, y: 0,
	width: 64, height: 64,
	velX: 0, velY: 0,
	speed: 3,
	image: new Image(),
	happiness: 3, ocupation: 0, strength: 1, defense: 1,
	rot: 60,
	target: -1,
	maxHlth: 20, curHlth: 20,
	attacking: false, canMove: true,  acting: false,
	moveTo: clone(vec2), canMove: true, waitFrames: 0,
	move: function()
	{
		this.x += this.velX;
		this.y += this.velY;

		//Collision Bounds
		if(this.x < 5)
		{
			this.velX = 0;
			this.x = 5;
			this.moveTo.x = this.x;
		}

		if(this.y < 5)
		{
			this.velY = 0;
			this.y = 5;
			this.moveTo.y = this.y;
		}

		if(this.x+this.width > 1915)
		{
			this.velX = 0;
			this.x = 1915-this.width;
			this.moveTo.x = this.x;
		}

		if(this.y+this.height > 475)
		{
			this.velY = 0;
			this.y = 475-this.width;
			this.moveTo.y = this.y;
		}
	},
	attack: function()
	{
		this.waitFrames++;
		if(this.waitFrames >= this.rot && !this.attacking)
		{
			this.attacking = true;
			this.waitFrames = 0;
			this.damageTarget(this.target, this.strength);
		}

	},
	damageTarget: function(index, strength)
	{
		console.log("Damaging Target");
		if(this.ocupation == 2)
			npcGroup[index].damage(strength);
		else
			emyGroup[index].damage(strength);
		this.attacking = false;
		this.waitFrames = 0;
	},
	damage: function(dam)
	{
		this.curHlth -= dam;
		if(this.curHlth <= 0)//We dead
		{
			var index = npcGroup.indexOf(this);
			if(index > -1)
			{
				npcGroup.splice(index, 1);
			}else
			{
				index = emyGroup.indexOf(this);
				emyGroup.splice(index, 1);
			}
		}
		document.getElementById("damage").play();
	},
	giveFood: function()
	{
		this.strength += 1;
		if(this.curHlth < this.maxHlth)
			this.curHlth += this.maxHlth/4;
		if(this.curHlth > this.maxHlth)
			this.curHlth = this.maxHlth;
		this.happiness++;
		foodLeft--;
	},
	act: function()
	{
		if(this.acting)
			return;

		this.acting = true;
		this.canMove = false;
		this.moveTo = clone(vec2);
		if(this.ocupation == 3)
		{
			this.target = getLand();
			this.moveTo.x = findLand(this.target)[0];
			this.moveTo.y = findLand(this.target)[1];
		}
	},
	farm: function()
	{
		this.waitFrames++;
		var length = (60*60)*((10-(this.strength-4))/10)
		if(this.waitFrames >= 60*60)
		{
			console.log("Done Farming");
			this.canMove = true;
			this.acting = false;
			plantGroup[this.target] = plant;
			this.target = -1;
			this.waitFrames = 0;
		}
	}
};

var camera = {
	x: 0, y: 0,
	update: function(){

		if(!panning)
			this.x += ((-player.x + 640/2) - this.x) * 0.1;
		else
		{
			canMove = false;
			player.velX = 0;
			player.velY = 0;
			this.x += (panToX - this.x) * 0.1;
			console.log("Panning Too " + Math.floor(this.x) + " " + (panToX));
			if(Math.floor(this.x) >= panToX-1 && Math.floor(this.x) <= panToX+1 && !finishedPan)
			{
				finishedPan = true;
				npcManager.launchAttack(panIndex);
				hadAttack = true;
				setTimeout(function(){
					canMove = true;
					panning = false;
					finishedPan = false;
				}, 3000);
			}
		}
		//this.x--;
		//this.x = -player.x + width/2;
		//console.log(player.x + " " + thi);

		if(this.x >= 0){
			this.x = 0;
		}
	}
}

//Clones an object
function clone(obj){
	if(null == obj || "object" != typeof obj) return obj;
	var copy = obj.constructor();
	for(var attr in obj){
		if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
	}
	return copy;
}

//Checks if two objects are colliding
function isColliding(obj1, obj2){
	if(obj1.x < obj2.x+obj2.width  && obj1.x+obj1.width > obj2.x && 
	   obj1.y < obj2.y+obj2.height && obj1.y+obj1.height > obj2.y){
	   	//console.log("Collision is true");
		return true;
	}else 
		return false;
}

function distance(obj1, obj2)
{
	return Math.sqrt(Math.pow(obj2.x-obj1.x, 2)+Math.pow(obj2.y-obj1.y, 2));
}

function linDistance(pos1, pos2)
{
	return Math.abs(pos2-pos1);
}

function randX()
{
	return Math.random() * (1880 - 70) + 70;//Picks a random x coord
}

function randY()
{
	return Math.random() * (440 - 70) + 70;//Picks a random y coord
}

function randXWith(close, within)
{
	var max, min;
	max = close+within;
	min = close-within;

	if(max >= 1920)
		max = 1900;

	if(min <= 0)
		min = 10;

	return Math.random() * (max - min) + min;//Picks a random x coord
}

function randYWith(close, within)
{
	var max, min;
	max = close+within;
	min = close-within;

	if(max >= 480)
		max = 470;

	if(min <= 0)
		min = 10;

	return Math.random() * (max - min) + min;//Picks a random y coord
}

function panCamera(value)
{
	console.log("Panning Camera " + value);
	if(value === 1)
	{
		panToX = 0;
		console.log("Setting X to " + panToX);
	}
	else if(value === 2 || value === 6)
	{
		panToX = -160;
		console.log("Setting X to " + panToX);
	}
	else if(value === 3 || value === 5)
	{
		panToX = -1120;
		console.log("Setting X to " + panToX);
	}
	else if(value === 4)
	{
		panToX = -1920+640;
		console.log("Setting X to " + panToX);
	}
	else if(value === 7)
	{
		panToX = -320;
		console.log("Setting X to " + panToX);
	}
	else if(value === 8)
	{
		panToX = -960;
		console.log("Setting X to " + panToX);
	}

	console.log("The pan x has been set to " + panToX);
	panning = true;
	panIndex = value;
}

function getPointX(value)
{
	switch(value)
	{
		case 1:
			return 0;
		break;
		case 2:
			return 320;
		break;
		case 3:
			return 1600;
		break;
		case 4:
			return 1920;
		break;
		case 5:
			return 1600;
		break;
		case 6:
			return 320;
		break;
		case 7:
			return 640;
		break;
		case 8:
			return 1280;
		break;
	}
}

function getPointY(value)
{
	switch(value)
	{
		case 1:
			return 240;
		break;
		case 2:
			return 0;
		break;
		case 3:
			return 0;
		break;
		case 4:
			return 240;
		break;
		case 5:
			return 480;
		break;
		case 6:
			return 480;
		break;
		case 7:
			return 360;
		break;
		case 8:
			return 120;
		break;
	}
}