var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = 640, height = 480;
var fps = 45; 

var mouseX = 0, mouseY = 0;
var mouseDown = false;

var walls = [];
var enemies = [];
var warps = [];
var exp = [];

var room = 1;

var healthDot = new Image();
healthDot.src = "res/health.png";
var deathScreen = new Image();
deathScreen.src = "res/death_screen.png";
var complete = new Image();
complete.src = "res/level_complete.png";
var menuMain = new Image();
menuMain.src = "res/game_title.png";
var yes = new Image(), no = new Image(), next = new Image(), play = new Image();
yes.src = "res/yes.png";
no.src = "res/no.png"
next.src = "res/next.png";
play.src = "res/play.png";
var cloud = new Image();
cloud.src = "res/cloud.png";
var endScreen = new Image();
endScreen.src = "res/ending_screen.png";
var introScreen = new Image();
introScreen.src = "res/intro.png";

var mute = false;

var showDeath = false;
var showComplete = false;

var mainMenu = true;
var showIntro = false;
var showEnd = false;

var finalX = 100*32;

var fullyLoaded = false;
var loading = new Image();
loading.src = "res/loading.png";

window.onload = function(){
	fullyLoaded = true;
}

canvas.addEventListener('contextmenu', function(e){
	if(e.button == 2){
		e.preventDefault();
		return false;
	}
}, false);

document.addEventListener("mousemove", function(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
});

document.addEventListener("mousedown", function(e){
	if(e.button == 0){
		mouseDown = true;
	}

	if(e.button == 2)
		player.activatePunch();
});

document.addEventListener("mouseup", function(e){
	if(e.button == 0){
		mouseDown = false;
	}
});

function update(){
	
	player.update();	
	camera.update();
	//particleUpdate();

	//Enemy Update
	for(var i = 0; i < enemies.length; i++){
		enemies[i].update();
	}

	//Death Click
	if(showDeath){
		if(mouseDown){
			if(mouseY >= 235 && mouseY <= 235+60){//Clicked in the y area of the buttons
				if(mouseX >= 32 && mouseX <= 32+256){//Clicked on the yes button
					showDeath = false;
					player.x = player.startingX;
					player.y = player.startingY;
					player.dead = false;
					document.getElementById('music').src="audio/Test.wav";
					document.getElementById("music").loop = true;
					document.getElementById("music").play();
				}//End of yes button
			}//End of y check
		}//End of mouse down
	}

	//Next Click
	if(showComplete){
		if(mouseDown){
			if(mouseY >= 409 && mouseY <= 409+60){
				if(mouseX >= 372 && mouseX <= 372+256){//Next button clicked
					showComplete = false;
					room++;
					loadLevel();
				}
			}
		}//End of mouse down
	}

	if(mainMenu){
		if(mouseDown){
			if(mouseX >= width/2-256/2 && mouseX <= width/2-256/2+256){
				if(mouseY >= height/2+20 && mouseY <= height/2+20+60){
					mainMenu = false;
					showIntro = true;
				}
			}
		}
	}

	if(showIntro){
		if(mouseDown){
		if(mouseY >= 409 && mouseY <= 409+60){
				if(mouseX >= 372 && mouseX <= 372+256){//Next button clicked
					showIntro = false;
					playButton();
				}
			}
		}
	}
}

var tip1 = new Image();
tip1.src = "res/tip1.png";
var tip2 = new Image();
tip2.src = "res/tip2.png";
var tip3 = new Image();
tip3.src = "res/tip3.png";
var background = new Image();
background.src = "res/background.png";

function render(){
	ctx.clearRect(0, 0, width, height);

	ctx.drawImage(background, 0, 0);

	ctx.translate(camera.x, camera.y);//Camera after this point

	ctx.drawImage(cloud, 50, 100);
	ctx.drawImage(cloud, 500, 80);
	ctx.drawImage(cloud, 1000, 120);
	ctx.drawImage(cloud, 1500, 100);
	ctx.drawImage(cloud, 2000, 80);
	ctx.drawImage(cloud, 2500, 50);
	ctx.drawImage(cloud, 2900, 100);

	if(room == 1){
		ctx.drawImage(tip1, 0, 0);
		ctx.drawImage(tip2, 700, 0);
		ctx.drawImage(tip3, 50*32, 0);
	}

	if(player.visable){

		if(player.facing == 1 && !player.playingIdle){//Draw Normaly
			ctx.save();
			ctx.translate(player.x+32, player.y);
			ctx.scale(-1, 1);
			ctx.drawImage(player.img, 0, 0, player.imageX, player.height);
			ctx.restore();
		}else{
			ctx.drawImage(player.img, player.x, player.y, player.imageX, player.height);
		}
		//ctx.strokeStyle = "red";
		//ctx.strokeRect(player.punch.x, player.punch.y, player.punch.width, player.punch.height);

		//ctx.strokeRect(player.side1.x, player.side1.y, player.side1.width, player.side1.height);
		//ctx.strokeRect(player.side2.x, player.side2.y, player.side2.width, player.side2.height);
		//ctx.strokeRect(player.side3.x, player.side3.y, player.side3.width, player.side3.height);
		//ctx.strokeRect(player.side4.x, player.side4.y, player.side4.width, player.side4.height);
	}

	//Draws the walls
	for(var i = 0; i < walls.length; i++){
		if(!walls[i].useSS){
			ctx.drawImage(walls[i].img, walls[i].x, walls[i].y, walls[i].width, walls[i].height);
		}else{
			//console.log(walls[i].ssX);
			ctx.drawImage(walls[i].img, walls[i].ssX, walls[i].ssY, walls[i].width, walls[i].height, walls[i].x, walls[i].y, walls[i].width, walls[i].height);
		}
	}

	//Draw the enemies
	for(var i = 0; i < enemies.length; i++){
		ctx.drawImage(enemies[i].img, enemies[i].x, enemies[i].y);
	}

	//Draw the exp
	for(var i = 0; i < exp.length; i++){
		ctx.drawImage(exp[i].img, exp[i].x, exp[i].y);
	}

	//for(var i in particles){
	//	particles[i].draw();
	//}

	ctx.translate(-camera.x, -camera.y);//No Camera

	//GUI
	if(player.health > 0){
		//if(player.health >= 1)ctx.drawImage(healthDot, 5, 5);
		//if(player.health >= 2)ctx.drawImage(healthDot, 5+32+5, 5);
		//if(player.health >= 3)ctx.drawImage(healthDot, 5+32+5+32+5, 5);

		for(var i = 0; i < player.health; i++){
			ctx.drawImage(healthDot, 5+((32+5)*i), 5);
		}
	}

	ctx.font = "25px Arial";
	ctx.fillText("Level " + player.level, 5, 62);
	if(player.level != 10){
		ctx.fillText("EXP:  " + player.exp + "/"+player.nextLevel, 5, 92);
	}else{
		ctx.fillText("EXP: 45/45", 5, 92);
	}

	if(showDeath){
		ctx.drawImage(deathScreen, 0, 0);
		ctx.drawImage(yes, 32, 235);
		ctx.drawImage(no, 338, 235);
	}

	if(showComplete){
		ctx.drawImage(complete, 0, 0);
		ctx.drawImage(next, 372, 409);
	}

	if(mainMenu){
		ctx.drawImage(menuMain, 0, 0);
		ctx.drawImage(play, width/2-256/2, height/2+20);
	}

	if(showIntro){
		ctx.drawImage(introScreen, 0, 0);
		ctx.drawImage(next, 372, 409);
	}

	if(showEnd)
		ctx.drawImage(endScreen, 0, 0);

	if(!fullyLoaded){
		ctx.drawImage(loading, 0, 0);
	}
	//console.log(camera.x);
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

//Finds distance from two different objects
function distance(obj1, obj2){
	var d = Math.sqrt( 
		((obj1.x-obj2.x)*(obj1.x-obj2.x)) 
		+ 
		((obj1.y-obj2.y)*(obj1.y-obj2.y)));

	return d;
}

function loadLevel(){
	walls = [];
	enemies = [];
	warps = [];
	exp = [];

	readData();
	switch(room){
		case 1:
			finalX = 32*100;

			var enemy1 = clone(enemy);
			enemy1.setEnemy(36*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 1;
			enemy1.facing = 0;
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.setEnemy(68*32, 8*32, 32, 32, "res/enemy.png", 1);
			enemy2.reward = 2;
			enemy2.health = 1;
			enemy2.facing = 0;
			enemies.push(enemy2);

			var warp1 = clone(warp);
			warp1.setWarp(100*32, 12*32, 32, 64);
			warps.push(warp1);
			
			player.x = 128;
			player.y = 300;
		break;
		case 2:

			var enemy1 = clone(enemy);
			enemy1.setEnemy(30*32, 2*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 1;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(67*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 1;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(75*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 1;
			enemies.push(enemy1);

			var enemy2 = clone(enemy);
			enemy2.setEnemy(96*32, 9*32, 32, 32, "res/enemy.png", 1);
			enemy2.reward = 2;
			enemy2.health = 1;
			enemies.push(enemy2);

			var warp1 = clone(warp);
			warp1.setWarp(100*32, 12*32, 32, 64);
			warps.push(warp1);

			player.x = 128;
			player.y = 300;
		break;
		case 3:

			var warp1 = clone(warp);
			warp1.setWarp(21*32, 14*32, 32*4, 32);
			warp1.room = 3.5;
			warps.push(warp1);

			var warp1 = clone(warp);
			warp1.setWarp(100*32, 12*32, 32, 64);
			warps.push(warp1);

			/*var enemy1 = clone(enemy);
			enemy1.setEnemy(64, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);*/

			var enemy1 = clone(enemy);
			enemy1.setEnemy(37*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(54*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(65*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(80*32, 5*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);

			if(player.startingX == 0 || player.startingX == 128){
				player.x = 128;
				player.y = 300;
			}else{
				console.log(player.startingX + " " + player.startingY);
				player.x = player.startingX;
				player.y = player.startingY;
				player.startingX = 128;
				player.startingY = 300;
			}
		break
		case 3.5:
			var warp1 = clone(warp);
			warp1.setWarp(82*32, 0, 64, 32);
			warp1.room = 3;
			warp1.startX = 78*32;
			warp1.startY = height-65;
			warps.push(warp1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(64, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			//player.x = 128;
			player.y = 32;
		break;
		case 4:
			if(player.startingX == 0 || player.startingX == 128){
				player.x = 128;
				player.y = 300;
			}else{
				console.log(player.startingX + " " + player.startingY);
				player.x = player.startingX;
				player.y = player.startingY;
				player.startingX = 128;
				player.startingY = 300;
			}

			var warp1 = clone(warp);
			warp1.setWarp(78*32, 12*32, 32, 64);
			warps.push(warp1);

			var warp1 = clone(warp);
			warp1.setWarp(34*32, 14*32, 64, 32);
			warp1.room = 4.5;
			warp1.startY = 32;
			warp1.startX = 35*32;
			warps.push(warp1);

			var warp1 = clone(warp);
			warp1.setWarp(51*32, 14*32, 32*3, 32);
			warp1.room = 4.5;
			warp1.startY = 32;
			warp1.startX = 52*32;
			warps.push(warp1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(26*32, 9*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(31*32, 9*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(53*32, 3*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(59*32, 3*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(66*32, 3*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(60*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);
		break;
		case 4.5:
			player.x = player.startingX;
			player.y = player.startingY;

			var warp1 = clone(warp);
			warp1.setWarp(10*32, 0, 32*4, 16);
			warp1.room = 4;
			warp1.startY = 9*32;
			warp1.startX = 9*32;
			warps.push(warp1);

			var warp1 = clone(warp);
			warp1.setWarp(63*32, 0, 32*4, 16);
			warp1.room = 4;
			warp1.startY = 12*32;
			warp1.startX = 38*32;
			warps.push(warp1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(3*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(14*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(27*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 1;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(46*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(65*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 2;
			enemies.push(enemy1);
		break;
		case 5:
			player.x = 128;
			player.y = 300;
			player.startingX = 128;
			player.startingY = 300;

			var warp1 = clone(warp);
			warp1.setWarp(100*32, 12*32, 32, 64);
			warps.push(warp1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(39*32, 2*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(57*32, 2*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 3;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(65*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 3;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(78*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);
		break;
		case 6:
			player.x = 128;
			player.y = 4*32;

			var warp1 = clone(warp);
			warp1.setWarp(0, 11*32, 32, 32*3);
			warps.push(warp1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(15*32, 6*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(23*32, 6*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(44*32, 6*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(63*32, 6*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(82*32, 6*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(90*32, 6*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(15*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(23*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(44*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(63*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(82*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);

			var enemy1 = clone(enemy);
			enemy1.setEnemy(90*32, 12*32, 32, 32, "res/enemy.png", 1);
			enemy1.reward = 2;
			enemy1.health = 3;
			enemies.push(enemy1);
		break;
	}
}

function muteButton(){
	if(mute)
		mute = false;
	else 
		mute = true;

	document.getElementById("music").muted = mute;
}

function playButton(){
	showDeath = false;
	player.x = player.startingX;
	player.y = player.startingY;
	player.dead = false;
	document.getElementById("music").src="audio/Test.wav";
	document.getElementById("music").loop = true;
	document.getElementById("music").play();
	loadLevel();
}

var images = [];

var hasLoaded = false;
function main(){
	if(!hasLoaded){//FIRST INIT LOAD
		player.img.src = "res/player.png";//Loads player image
		document.getElementById('music').src="audio/Test.wav";

		for(var i = 0; i < 31; i++){
			images[i] = new Image();
			if(i > 0)
				images[i].src = "res/punch/player_right_punch_"+i.toString()+".png";
			else
				images[i].src = "res/punch/player_right_punch.png";
		}
		images[1000] = new Image();
		images[1000].src = "res/player_fall.png";
		images[1001] = new Image();
		images[1001].src = "res/player_jump.png";
		images[1002] = new Image();
		images[1002].src = "res/player_jump_left.png";
		images[1003] = new Image();
		images[1003].src = "res/player_left.png";
		images[1004] = new Image();
		images[1004].src = "res/player_right.png";
		images[1005] = new Image();
		images[1005].src = "res/player_left_1.png";
		images[1006] = new Image();
		images[1006].src = "res/player_left_2.png";
		images[1007] = new Image();
		images[1007].src = "res/player_left_3.png";
		images[1008] = new Image();
		images[1008].src = "res/player_left_4.png";
		images[1009] = new Image();
		images[1009].src = "res/player_right_1.png";
		images[1010] = new Image();
		images[1010].src = "res/player_right_2.png";
		images[1011] = new Image();
		images[1011].src = "res/player_right_3.png";
		images[1012] = new Image();
		images[1012].src = "res/player_right_4.png";

		/*var block1 = clone(block);
		block1.setBlock(0, height-32, width*3, 32, "res/img.png");
		walls.push(block1);
		var block1 = clone(block);
		block1.setBlock(0, 0, width, 32, "res/img.png");
		walls.push(block1);
		var block1 = clone(block);
		block1.setBlock(0, 32, 32, height-64, "res/img.png");
		walls.push(block1);
		var block1 = clone(block);
		block1.setBlock(width/2, height-32-64, 32, 64, "res/img.png");
		walls.push(block1);

		var block1 = clone(block);
		block1.setBlock(width, height-32-64, 32, 64, "res/img.png");
		walls.push(block1);

		var block1 = clone(block);
		block1.setBlock(width+width/2, height-32-64, 32, 64, "res/img.png");
		walls.push(block1);*/

		//LOADING IS DONE AT THIS POINT
		hasLoaded = true;
	}else{
		update();
		render();
	}
}

setInterval(function(){
	main();
}, 1000/fps);