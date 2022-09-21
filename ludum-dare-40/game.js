enchant();

var game;
var fps = 30, WIDTH = 640, HEIGHT = 480;

//Array Data
var scene = [];
var group = [];//0: Blocks  1: Enemies

//Constants
var DIR_UP = 1, DIR_DOWN = 2, DIR_LEFT = 3, DIR_RIGHT = 4;

//Camera
var camX, camY;

//Objects
var player, targetImg;

//Level Data
var intro = false, playingIntro = false;
var loc = [0,0];
var enemyTime = 45*7, generating = false;
var curChunk;
var started = false;
var txt, txt2;
var screenTransition;
var totalScore = 0;
var info, about, aboutObj;
var showTip1 = false, showTip2 = false;

window.onload = function(){
	window.focus();
	game = new Core(WIDTH, HEIGHT);
	game.fps = fps;

	//Preload all images here
	game.preload('res/player.png', 'res/tileset.png', 'res/target.png', 'res/black.png', 'res/enemy.png', 'res/good_guy.png', 'res/bullet.png',
		'res/health_bg.png', 'res/health_bar.png', 'res/particle.png', 'res/textbox.png', 'res/textbox1.png', 'res/textbox2.png', 'res/textbox3.png',
		'res/textbox4.png', 'res/textbox5.png', 'res/title.png', 'res/about.png', 'sounds/shoot.wav', 'sounds/music.mp3', 'sounds/powerup_got.wav',
		 'sounds/powerup_recieved.wav', 'sounds/enemy_hurt.wav', 'sounds/door.wav', 'res/tooltip.png', 'res/tooltip2.png');

	game.onload = function(){
		window.focus();
		init();//Init all objects
		scene[0].addEventListener(Event.ENTER_FRAME, function(){
			tick();//The update function
		});
		scene[1].addEventListener(Event.ENTER_FRAME, function(){
			if(click){
				if(about){
					about = false;
					scene[1].removeChild(aboutObj);
				}
				if(mouseX/game.scale > 195 && mouseX/game.scale < 445 && mouseY/game.scale > 222 && mouseY/game.scale < 286 && !about){
					started = true;
					game.pushScene(scene[0]);
				}else if(mouseX/game.scale > 195 && mouseX/game.scale < 445 && mouseY/game.scale > 325 && mouseY/game.scale < 390){
					//about
					aboutObj = new Sprite(960, 720);
					aboutObj.image = game.assets['res/about.png'];
					aboutObj.x = -160;
					aboutObj.y = -120;
					aboutObj.scaleX = 2/3;
					aboutObj.scaleY = 2/3;
					scene[1].addChild(aboutObj);
					about = true;
				}
				click = false;
			}
		});
	}

	game.start();//Starts the actual game
}

function init(){
	game.keybind(87, 'up');
	game.keybind(83, 'down');
	game.keybind(65, 'left');
	game.keybind(68, 'right');

	//Group Inits
	group.push(new Group());//Block Group
	group.push(new Group());//Enemy Group
	group.push(new Group());//Bullet Group
	group.push(new Group());//Exit Group
	group.push(new Group());//Particle Group
	scene.push(new Scene());//Main Scene
	scene.push(new Scene());//Title Scene

	//Objects
	player = new Player();
	var collection = new Chunk(0, 1, colRoom, colRoom);
	chunks.push(collection);

	info = new Label();
	info.text = "You collected 0 new blobs!";
	info.font = "25px Arial"; 
	info.color = "#ffffff";
	info.x = 200;
	info.y = 240;

	//Load Level
	screenTransition = new Sprite(640, 480);
	screenTransition.image = game.assets['res/black.png'];
	screenTransition.x = 0;
	screenTransition.y = 0;
	screenTransition.opacity = 0;
	transitionRoom([0,0],[0,0]);
	player.y = 100;

	//Load Tutorial Guy
	var guy = new GoodGuy(0, 320-16, 300, 2, 2);
	group[0].addChild(guy);

	//Add Groups to scene
	player.addPlayer();
	scene[0].addChild(group[0]);
	scene[0].addChild(group[1]);
	scene[0].addChild(group[2]);
	scene[0].addChild(group[3]);
	scene[0].addChild(group[4]);

	//Tutorial
	var title = new Sprite(960, 720);
	title.image = game.assets['res/title.png'];
	title.x = -160;
	title.y = -120;
	title.scaleX = 2/3;
	title.scaleY = 2/3;
	scene[1].addChild(title);

	//Sounds
	game.shoot = game.assets['sounds/shoot.wav'];
	game.energyGet = game.assets['sounds/powerup_got.wav'];
	game.energyRec = game.assets['sounds/powerup_recieved.wav'];
	game.enemyHurt = game.assets['sounds/enemy_hurt.wav'];
	game.door = game.assets['sounds/door.wav'];
	game.music = game.assets['sounds/music.mp3'];
	game.music.play();

	game.pushScene(scene[1]);
}

function tick(){
	if(!started)
		return;

	if(game.music.currentTime >= game.music.duration)
		game.music.play();

	if(!intro && player.y > 240){
		if(!playingIntro){
			playingIntro = true;
			txt = new Sprite(669,327);
			txt2 = new Sprite(669,327);
			txt.image = game.assets['res/textbox.png'];
			txt2.image = game.assets['res/textbox1.png'];
			txt.x = -180;
			txt.y = 100;
			txt2.x = -180;
			txt2.y = 100;
			txt.scaleX = 0.4;
			txt.scaleY = 0.4;
			txt2.scaleX = 0.4;
			txt2.scaleY = 0.4;
			txt.opacity = 0;
			txt2.opacity = 0;
			scene[0].addChild(txt);
			scene[0].addChild(txt2);
			txt.tl.fadeIn(10);
			txt2.tl.delay(10).fadeIn(10).delay(30*5).fadeOut(10).then(function(){txt2.image=game.assets['res/textbox2.png'];})
			.fadeIn(10).delay(30*5).fadeOut(10).then(function(){txt2.image=game.assets['res/textbox3.png'];})
			.fadeIn(10).delay(30*5).fadeOut(10).then(function(){txt2.image=game.assets['res/textbox4.png'];})
			.fadeIn(10).delay(30*5).fadeOut(10).then(function(){txt2.image=game.assets['res/textbox5.png'];})
			.fadeIn(10).delay(30*3).fadeOut(10).then(function(){intro = true; scene[0].removeChild(txt);}).removeFromScene();
		}
	}else
		player.tick();

	//Player Update
	for(var i = 0; i < getBulletGroup().childNodes.length; i++){
		getBulletGroup().childNodes[i].tick();
	}

	//Enemy Update
	for(var i = 0; i < getEnemyGroup().childNodes.length; i++)
		if(getEnemyGroup().childNodes[i].speed)
			getEnemyGroup().childNodes[i].tick();

	//Particle Update
	for(var i = 0; i < group[4].childNodes.length; i++)
		group[4].childNodes[i].tick();

	//Camera
	camX = (game.width-32)/2-Math.round(player.x);
	camY = (game.height-32)/2-Math.round(player.y);
	scene[0].x = camX;
	scene[0].y = camY;

	//Enemy Generator
	if(!(loc[0] == 0 && loc[1] == 0) && !(loc[0] == 0 && loc[1] == 1) && !generating){
		generating = true;
		var mult = Math.max(1, 6-(player.energy/10));
		enemyTime = 45*mult;
		scene[0].tl.delay(enemyTime).then(function(){
			//Create an enemy
			var tempLoc = getRandomSpace(curChunk);
			var temp = new Enemy(1, tempLoc[1]*32, tempLoc[0]*32);
			group[1].addChild(temp);
			generating = false;
		});
	}

	if(click){
		var temp = new Bullet('res/bullet.png', 16, 8, mouseX/game.scale, mouseY/game.scale, 0);
		if(player.energy >= 50){
			var temp2 = new Bullet('res/bullet.png', 16, 8, mouseX/game.scale, mouseY/game.scale, 1);
			var temp3 = new Bullet('res/bullet.png', 16, 8, mouseX/game.scale, mouseY/game.scale, 2);
			group[2].addChild(temp2);
			group[2].addChild(temp3);
		}
		group[2].addChild(temp);
		player.shootBullet();
		click = false;
		game.shoot.play();
	}
}

//Utility Methods
var map, goTo, goFrom, isTransition = false;
function transition(to, from){
	if(isTransition)
		return;
	isTransition = true;
	goTo = to;
	goFrom = from;
	screenTransition.tl.fadeIn(10).then(function(){transitionRoom(goTo, goFrom); isTransition = false;});
}

function transitionRoom(to, from){
	//console.log("Transition " + from + " to " + to);
	for(var i = 0; i < group.length; i++)
		group[i].childNodes = [];
	player.removePlayer();
	scene[0].removeChild(map);
	scene[0].removeChild(group[0]);
	scene[0].removeChild(group[1]);
	scene[0].removeChild(group[2]);
	scene[0].removeChild(group[3]);
	scene[0].removeChild(group[4]);
	scene[0].removeChild(screenTransition);

	if(to[0] == 0 && to[1] == 0){
		map = new Map(32, 32);
		map.image = game.assets['res/tileset.png'];
		map.loadData(startRoom);
		map.collisionData = startCollision;
		scene[0].addChild(map);
		var exit = new Exit([0,0], [0,1], 9*32, 14*32);
		var exit1 = new Exit([0,0], [0,1], 10*32, 14*32);
		var exit2 = new Exit([0,0], [0,1], 11*32, 14*32);
		group[3].addChild(exit);
		group[3].addChild(exit1);
		group[3].addChild(exit2);
		player.addPlayer();
		scene[0].addChild(group[0]);
		scene[0].addChild(group[1]);
		scene[0].addChild(group[2]);
		scene[0].addChild(group[3]);
		scene[0].addChild(group[4]);
		var guy = new GoodGuy(0, 320-16, 300, 2, 2);
		group[0].addChild(guy);
		screenTransition.opacity = 0;
		scene[0].addChild(screenTransition);
		loc = to;
		player.y = 480-100;
		totalScore += Math.round(player.energy/10)-1;
		info.text = "You rescued " + (Math.round(player.energy/10)-1) + " new blobs!";
		player.energy = 10;
		player.health =  10;
		if(!intro)
			group[1].addChild(info);

		for(var i = 0; i < totalScore; i++){
			var randX = Math.floor(Math.random()*(640-64))+32;
			var randY = Math.floor(Math.random()*(480-64))+32;
			var temp = new GoodGuy(0, randX, randY, 1.1, 1.1);
			group[0].addChild(temp);
		}

		return;
	}

	var room, side;
	if(to[0] < from[0]){//Moving to the left
		player.x = 640*2-64;
		side = 3;
		room = 2;
	}
	if(to[0] > from[0]){//Right
		player.x = 64;
		side = 1;
		room = 1;
	}
	if(to[1] > from[1]){//Down
		player.y = 64;
		side = 2;
		room = 1;
	}
	if(to[1] < from[1]){//Up
		player.y = 480*2-100;
		side = 4;
		room = 3;
	}

	var generate = true;
	for(var i = 0; i < taken.length; i++){
		if(taken[i][0] == to[0] && taken[i][1] == to[1])
			generate = false;
	}

	map = new Map(32, 32);
	map.image = game.assets['res/tileset.png'];
	var collisionMap;

	if(generate){
		taken.push(to);
		var newChunk = generateChunk(to[0], to[1], room, side);
		chunks.push(newChunk);
		collisionMap = getCollisionData(newChunk.full, to);
		map.loadData(newChunk.full);
		curChunk = newChunk;
	}else{
		for(var i=0; i<chunks.length; i++){
			if(chunks[i].x == to[0] && chunks[i].y == to[1]){
				curChunk = chunks[i];
				collisionMap = getCollisionData(chunks[i].full, to);
				map.loadData(chunks[i].full);
			}
		}
	}
	map.collisionData = collisionMap;
	scene[0].addChild(map);
	player.addPlayer();
	scene[0].addChild(group[0]);
	scene[0].addChild(group[1]);
	scene[0].addChild(group[2]);
	scene[0].addChild(group[3]);
	scene[0].addChild(group[4]);
	scene[0].addChild(screenTransition);
	screenTransition.opacity = 0;
	loc = to;
}

function generateParticles(x, y, image){
	var count = Math.floor(Math.random()*10)+7;
	for(var i = 0; i < count; i++){
 		var temp = new Particle(image, 98, 98, x, y);
 		group[4].addChild(temp);
	}
}

function getRandomSpace(chunk){
	var y = Math.floor(Math.random()*chunk.full.length);
	var x = Math.floor(Math.random()*chunk.full[y].length);
	if(chunk.full[y][x] != 0)
		return getRandomSpace(chunk);
	else
		return [y,x];
}

function degrees(radians){
	return radians*180/Math.PI;
}

function arrayClone( arr ) {
    var i, copy;
    if( Array.isArray( arr ) ) {
        copy = arr.slice( 0 );
        for( i = 0; i < copy.length; i++ ) {
            copy[ i ] = arrayClone( copy[ i ] );
        }
        return copy;
    } else if( typeof arr === 'object' ) {
        throw 'Cannot clone array containing an object!';
    } else {
        return arr;
    }
}

function intersect(obj1, obj2){
	return obj1.x < obj2.x+obj2.width  && obj1.x+obj1.width > obj2.x && 
	   obj1.y < obj2.y+obj2.height && obj1.y+obj1.height > obj2.y;
}

function getCollisionData(data, to){
	var collisionMap = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
	for(var y = 0; y < data.length; y++)
	{
		for(var x = 0; x < data[y].length; x++)
		{
			if(data[y][x] == 2 || data[y][x] == 3){
				if(x == 0){
					var temp = new Exit(to, [to[0]-1, to[1]], 0, y*32);
					group[3].addChild(temp);
				}
				if(x == 39 || x == 19){
					var temp = new Exit(to, [to[0]+1, to[1]], x*32, y*32);
					group[3].addChild(temp);
				}
				if(y == 0){
					var temp = new Exit(to, [to[0], to[1]-1], x*32, 0);
					group[3].addChild(temp);
				}
				if(y == 29){
					var temp = new Exit(to, [to[0], to[1]+1], x*32, y*32);
					group[3].addChild(temp);
				}
			}else if(data[y][x] == 4 && !curChunk.blob){
				var guy = new GoodGuy(0, x*32, y*32, 1, 1);
				group[0].addChild(guy);

			}

			if(data[y][x] != 0 && data[y][x] != 2 && data[y][x] != 4 && data[y][x] != 3)
				collisionMap[y].push(1);
			else{
				collisionMap[y].push(0);
			}
			
		}
	}
	return collisionMap;
}

//Key Input
var keys = [];
window.addEventListener("keydown", function(e){
	//console.log("Key: " + e.keyCode);
	keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e){
	delete keys[e.keyCode];
});

var mouseX = 0, mouseY = 0;
var click = false;
//Mouse
window.addEventListener("mousemove", function(e){
	mouseX = e.clientX;
	mouseY = e.clientY;
});

window.addEventListener("click", function(e){
	click = true;
})

//Getters
function getMainScene(){
	return scene[0];
}

function getBlockGroup(){
	return group[0];
}

function getEnemyGroup(){
	return group[1];
}

function getBulletGroup(){
	return group[2];
}

function preDraw(ctx){
	var black = new Image(640, 480);
	black.src = "res/black.png";
	ctx.drawImage(black, 0, 0, 640, 480);
}

var tip1Count = 0, tip2Count = 0;
function lateUpdate(ctx){
	if(!player || !started)
		return;

	var imgd = ctx.getImageData(0,0,WIDTH,HEIGHT);
	var data1 = imgd.data;
	var img1 = new Image(640, 480);
	img1.src = "res/fov.png";
	ctx.drawImage(img1,0,0);
	var imgd2 = ctx.getImageData(0,0,WIDTH,HEIGHT);
	var data2 = imgd2.data;

	for(var i = 0; i < data2.length; i += 4){
		data2[i] = data2[i]*(5-((player.energy/10)*0.5));
		data2[i+1] = data2[i+1]*(5-((player.energy/10)*0.5));
		data2[i+2] = data2[i+2]*(5-((player.energy/10)*0.5));
	}

	for(var i = 0; i < data1.length; i+= 4){
		data1[i] = data1[i]*data2[i]/255;
		data1[i+1] = data1[i+1]*data2[i+1]/255;
		data1[i+2] = data1[i+2]*data2[i+2]/255;
	}

	imgd.data = data1;
	ctx.putImageData(imgd, 0,0);

	targetImg = new Image(18, 18);
	targetImg.src = "res/target.png";
	ctx.drawImage(targetImg, mouseX/game.scale-9, mouseY/game.scale-9);

	var guiIcon = new Image(32, 32);
	guiIcon.src = "res/gui.png";
	ctx.drawImage(guiIcon, 5, 5);

	ctx.font = "30px Arial";
	ctx.fillStyle = "white";
	ctx.fillText((player.energy/10)+"", 40, 36);
	ctx.fillText("Rescued: " + totalScore, 450, 36);

	if(player.energy >= 30 && !showTip1){
		var tip = new Image(330, 136);
		tip.src = "res/tooltip.png";
		ctx.drawImage(tip, 5, 150);
		tip1Count++;
		if(tip1Count >= 30*5)
			showTip1 = true;
	}else if(player.energy >= 50 && !showTip2){
		var tip = new Image(329, 131);
		tip.src = "res/tooltip2.png";
		ctx.drawImage(tip, 5, 150);
		tip2Count++;
		if(tip2Count >= 30*5)
			showTip2 = true;
	}

	//Mini-Map
	var offsetX = Math.max(0, Math.abs(loc[0])-3);
	var offsetY = Math.max(0, Math.abs(loc[1])-3);
	if(loc[0] < 0)
		offsetX *= -1;
	if(loc[1])
		offsetY *= -1;
	for(var y = 0; y<4; y++){
		for(var x = -3; x<4; x++){
			ctx.fillStyle = "white";
			for(var i = 0; i < taken.length; i++)
				if(taken[i][0] == x+offsetX && taken[i][1] == y+offsetY)
					ctx.fillStyle = "black";
			if(x+offsetX == 0 && y+offsetY == 0)
				ctx.fillStyle = "green";
			if(loc[0] == x+offsetX && loc[1] == y+offsetY)
				ctx.fillStyle = "red";
			ctx.fillRect(x*32+101, y*32+379, 32, 32);
		}
	}
}

//-3,0 -2,0 -1,0 0,0 1,0 2,0 3,0