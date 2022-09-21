enchant();

var game;

var fps = 45;//Games fps
var width=640, height=480;

var velX = 5, velY = 5;

var score = 0;
var createRing = false, ringOut = false;
var ring;

var movement;

var bPushed = false;
var speed = 5;

var scoreLabel;
var nextColor;
var energyBar, energyBack;

var level = 0;

//Group
var mainGroup;
var blockGroup;
var gateGroup;
var bulletGroup;
var enemyGroup;
var particleGroup;
var coinGroup;
var turretGroup;
var changerGroup;
var heatlhGroup;
var guiGroup;

var bgm;

//Buttons
var mmBg;
var playButton;
var titleGroup;

//Maps
var map;
var camX, camY;

//Scene
var mainGame;
var mainMenu;
var credits;

var state = 1; 

var player;
var currentEndPoint;

var checkDirection = 0;//1: up  2: down  3: right  4: left
var checkLength = 0;

window.focus();

var keys = [];
window.addEventListener("keydown", function(e){
	if(loaded){
		if(e.keyCode == 32){
			if(player.shape == 2){
				var bullet = new Bullet(player.scaleY); 
				bullet.x = player.x+16;
				bullet.y = player.y+16;
				if(player.scaleY > 1){
					player.energy -= 1+player.scaleY;
					player.scaleY -= 0.5;
				}else
					player.energy -= 1;
				energyBar.scaleX = player.energy/player.maxEnergy;
				console.log("The player has shoot a bullet");
				bullet.shoot(player.dir);
				//Sets Speed
				if(player.shape == 2)
					speed = 5-player.scaleY;
				else
					speed = 5;
				bulletGroup.addChild(bullet);
				game.shoot.play();
			}
		}else
			keys[e.keyCode] = true;
	}
});

window.addEventListener('keyup', function(e){
	delete keys[e.keyCode];
});

window.onload = function(){//Window load function
	window.focus();

	game = new Core(width, height);

	game.fps = fps;

	game.preload('res/player.png', 'res/player2.png', 'res/player3.png', 'res/player4.png', 'res/player5.png', 'res/spritesheet.png',
		'res/glow_ring.png', 'res/eye.png', 'res/bullet.png', 'res/player_circ.png', 'res/player_circ2.png', 'res/player_circ3.png', 'res/player_circ4.png',
		'res/player_circ5.png', 'res/enemy.png', 'sound/change_shape.mp3', 'sound/death.mp3', 'sound/hit.mp3', 'res/coin_sheet.png', 'res/play_button.png',
		'res/block.png', 'sound/change_color.mp3', 'sound/coin_pickup.mp3', 'sound/laser_off.mp3', 'res/health.png',
		'res/endpoint.png', 'sound/level_next.mp3', 'sound/music.mp3', 'res/topGate.png', 'res/bottomGate.png', 'sound/shoot.mp3', 'res/title.png',
		'res/credits.png', 'res/red_changer.png', 'res/red_changer_light.png', 'res/blue_changer.png', 'res/blue_changer_light.png', 
		'res/green_changer.png', 'res/green_changer_light.png', 'res/purple_changer.png', 'res/purple_changer_light.png',
		'res/energyBack.png', 'res/energyBar.png');

	game.keybind(32, 'a');
	game.keybind(68, 'b');

	for(var i = 0; i < mapData.length; i++){
		for(var l = 0; l < mapData[i].length; l++){
			mapData[i][l]-=1;
		}
	}

	for(var i = 0; i < mapData2.length; i++){
		for(var l = 0; l < mapData2[i].length; l++){
			mapData2[i][l]-=1;
		}
	}

	for(var i = 0; i < mapData3.length; i++){
		for(var l = 0; l < mapData3[i].length; l++){
			mapData3[i][l]-=1;
		}
	}

	for(var i = 0; i < mapData4.length; i++){
		for(var l = 0; l < mapData4[i].length; l++){
			mapData4[i][l]-=1;
		}
	}

	for(var i = 0; i < mapData5.length; i++){
		for(var l = 0; l < mapData5[i].length; l++){
			mapData5[i][l]-=1;
		}
	}

	for(var i = 0; i < mapData6.length; i++){
		for(var l = 0; l < mapData6[i].length; l++){
			mapData6[i][l]-=1;
		}
	}

	for(var i = 0; i < mapData7.length; i++){
		for(var l = 0; l < mapData7[i].length; l++){
			mapData7[i][l]-=1;
		}
	}

	game.onload = function(){//Game load function

		mainGame = new Scene();
		mainMenu = new Scene();
		credits = new Scene();
		mainGroup = new Group();
		blockGroup = Group();
		gateGroup = Group();
		bulletGroup = new Group();
		enemyGroup = new Group();
		particleGroup = new Group();
		coinGroup = new Group();
		turretGroup = new Group();
		endPointGroup = new Group();
		changerGroup = new Group();
		healthGroup = new Group();
		titleGroup = new Group();
		guiGroup = new Group();

		player = new Player();

		game.shapeChange = game.assets['sound/change_shape.mp3'];
		game.hit = game.assets['sound/hit.mp3'];
		game.death = game.assets['sound/death.mp3'];
		game.colorChange = game.assets['sound/change_color.mp3'];
		game.coinPickup = game.assets['sound/coin_pickup.mp3'];
		game.laserOff = game.assets['sound/laser_off.mp3'];
		game.levelNext = game.assets['sound/level_next.mp3'];
		game.shoot = game.assets['sound/shoot.mp3'];
		bgm = game.assets['sound/music.mp3'];
		//bgm.play();

		scoreLabel = new Label();
		scoreLabel.text = "Score: " + score;
		scoreLabel.color = "#FFFFFF";

		energyBack = new Sprite(200, 28);
		energyBack.image = game.assets['res/energyBack.png'];
		energyBar = new Sprite(200, 28);
		energyBar.image = game.assets['res/energyBar.png'];

		loadNewLevel();

		mainGame.addChild(mainGroup);
		mainGame.backgroundColor = "#D3D3D3";

		var tutorial = new Tutorial();
		mainGroup.addChild(tutorial);

		//Main Menu
		playButton = new Sprite(300, 75);
		playButton.image = game.assets['res/play_button.png'];
		playButton.x = 640/2-150;
		playButton.y = 480/2-75/2;

		mmBg = new Sprite(640, 480);
		mmBg.image = game.assets['res/title.png'];

		mainMenu.addChild(mmBg);

		var titleText = new Label();
		titleText.text = "Press 'A or D' to change your shape!";
		titleText.y = 480/2+50;
		titleText.x = 640/2-90;
		titleGroup.addChild(titleText);

		var square = new Sprite(32, 32);
		square.image = game.assets['res/player.png'];
		square.x = 640/2-80;
		square.y = 480/2+70;
		titleGroup.addChild(square);

		var circle = new Sprite(32, 32);
		circle.image = game.assets['res/player_circ.png'];
		circle.x = 640/2+70;
		circle.y = 480/2+70;
		titleGroup.addChild(circle);

		var titleText2 = new Label("Squares change color<br>by pressing 'Space'");
		titleText2.x = 640/2-210;
		titleText2.y = 480/2+70+40;
		titleText2.textAlign = "center";
		titleGroup.addChild(titleText2);

		var titleText2 = new Label("Circles shoot bullets<br>by pressing 'Space'");
		titleText2.x = 640/2-60;
		titleText2.y = 480/2+70+40;
		titleText2.textAlign = "center";
		titleGroup.addChild(titleText2);

		mainMenu.addChild(titleGroup);

		mainMenu.addChild(playButton);
		playButton.addEventListener(Event.TOUCH_START, function(){
			state = 2;
			game.pushScene(mainGame);
			window.focus();
		});

		game.pushScene(mainMenu);

		var creditsImage = new Sprite(640, 480);
		creditsImage.image = game.assets['res/credits.png'];
		credits.addChild(creditsImage);

		mainGame.addEventListener(Event.ENTER_FRAME, function(){//Tick Function
			if(state != 2)
				return;

			/*if(bgm.currentTime >= bgm.duration){
				bgm.play();
			}*/

			if(!player.dead){
				player.x += velX;
				player.y += velY;
			}

			//INPUT\\
			if(game.input.up){
				velY = -speed;
				player.dir = 1;
			}
			if(game.input.down){
				velY = speed;
				//player.applyForce(new b2Vec2(0, 1));
				player.dir = 2;
			}
			if(game.input.left){
				velX = -speed;
				player.dir = 4;
			}
			if(game.input.right){
				velX = speed;
				player.dir = 3;
			}
			if(!game.input.up && !game.input.down){
				velY = 0;
			}
			if(!game.input.left && !game.input.right)
				velX = 0;

			if(keys[65]){
				if(!bPushed){
					player.ChangeShape();
					game.shapeChange.play();
				}
				bPushed = true;
			}else{
				bPushed = false;
			}

			player.setCollision();

			var top = false, bottom = false;
			for(var i = 0; i < blockGroup.childNodes.length; i++){
					if(player.color != blockGroup.childNodes[i].colorPass){//Different colors
						checkInside(blockGroup.childNodes[i]);
					}
					if(!player.dead){
						var tempEntity = new Entity();
						tempEntity.width = blockGroup.childNodes[i].width*blockGroup.childNodes[i].scaleX;
						tempEntity.height = blockGroup.childNodes[i].height*blockGroup.childNodes[i].scaleY;
						tempEntity.x = blockGroup.childNodes[i].x;
						tempEntity.y = blockGroup.childNodes[i].y-tempEntity.height/2+blockGroup.childNodes[i].height/2;

						if(checkIntersect(tempEntity, player.top)){//Top Collision
							var newHeight = player.height*player.scaleY;
							var origin = player.y-16;
							player.y = tempEntity.y+tempEntity.height+(newHeight/2-16)+1;
							velY = 0;
							console.log("Top");
							top = true;
							if(bottom)
								player.Death();
						}

						if(checkIntersect(tempEntity, player.bottom)){//Bottom Collision
							var newHeight = player.height*player.scaleY;
							player.y = tempEntity.y-newHeight/2-16-1;
							velY = 0;
							console.log(top);
							bottom = true;
							if(top)
								player.Death();
						}

						if(checkIntersect(tempEntity, player.left)){//Bottom Collision
							var newWidth = player.width*player.scaleX;
							player.x = tempEntity.x+tempEntity.width+(newWidth/2-16)+1;
							velX = 0;
						}

						if(checkIntersect(tempEntity, player.right)){//Bottom Collision
							var newWidth = player.width*player.scaleX;
							player.x = tempEntity.x-newWidth/2-16-1;
							velX = 0;
						}
					}
			}

			for(var i = 0; i < changerGroup.childNodes.length; i++){
				if(player.color != changerGroup.childNodes[i].cValue){
					if(changerGroup.childNodes[i].intersect(player)){
						player.color = changerGroup.childNodes[i].cValue;
						player.UpdateColor();
					}
				}
			}

			if(currentEndPoint.intersect(player)){
				loadNewLevel();
				game.levelNext.play();
			}

			for(var i = 0; i < enemyGroup.childNodes.length; i++){
				enemyGroup.childNodes[i].update();
			}

			player.SetEyes();

			//Animations
			if(createRing){
				ring = new Sprite(90, 90);
				ring.image = game.assets['res/glow_ring.png'];
				ring.x = player.x; 
				ring.y = player.y;
				ring.scaleX = 0.1;	
				ring.scaleY = 0.1;
				mainGroup.addChild(ring);
				ringOut = true;
				ring.tl.scaleTo(1, 15).fadeOut(15).then(function(){
					mainGroup.removeChild(ring);
					ringOut = false;
				});
				createRing = false;
			}

			if(ringOut){
				ring.x = player.x-90/4-8; 
				ring.y = player.y-90/4-8;
			}

			//Gates
			for(var i = 0; i < gateGroup.childNodes.length; i++){
				if(gateGroup.childNodes[i].active){
					if(gateGroup.childNodes[i].intersect(player)){//Touching a gate
						if(player.color == gateGroup.childNodes[i].colorPass){//Pass
							if(player.height*player.scaleY < gateGroup.childNodes[i].height/2){
								//player.Death();
							}else
								gateGroup.childNodes[i].playerIn = true;
						}else{//Death
							//player.Death();
						}
					}else if(gateGroup.childNodes[i].playerIn){
						gateGroup.childNodes[i].turnOff();
						game.laserOff.play();
						gateGroup.removeChild(gateGroup.childNodes[i]);
					}
				}
			}

			//Bullets
			for(var i = 0; i < bulletGroup.childNodes.length; i++){
				bulletGroup.childNodes[i].update();
			}

			//Particles
			if(particleGroup.childNodes.length > 0){
				for(var i = 0; i < particleGroup.childNodes.length; i++){
					particleGroup.childNodes[i].update();
				}
			}

			//Coins
			for(var i = 0; i < coinGroup.childNodes.length; i++){
				if(player.intersect(coinGroup.childNodes[i])){
					score += 3;
					coinGroup.removeChild(coinGroup.childNodes[i]);
					game.coinPickup.play();
					if(player.health < 5){
						player.health++;
						player.UpdateHealth();
					}
				}
			}

			//Scalling
			if(keys[87] && player.scaleY < 4){
				player.scaleY += 0.1;
				//Sets Speed
				if(player.shape == 2)
					speed = 5-player.scaleY;
				else
					speed = 5;
			}
			if(keys[83] && player.scaleY > 0.5){
				player.scaleY -= 0.1;
				if(player.shape == 2)
					speed = 5-player.scaleY;
				else
					speed = 5;
			}

			//Camera
			camX = Math.min((game.width  - 32) / 2 - player.x, 0);
            camY = Math.min((game.height - 32) / 2 - player.y, 0);
            camX = Math.max(game.width,  camX + map.width)  - map.width;
            camY = Math.max(game.height, camY + map.height) - map.height;
            mainGroup.x = camX;
            mainGroup.y = camY;

            scoreLabel.x = -camX+5;
			scoreLabel.y = -camY+5;
			scoreLabel.text = "Score: " + score;
			healthGroup.x = -camX+(640-100);
			healthGroup.y = 8;

			//Energy Bar
			energyBack.x = -camX+(640-210);
			energyBack.y = -camY+(480-30);
			energyBar.x = -camX+(640-210);
			energyBar.y = -camY+(480-30);
		});

		game.addEventListener(Event.B_BUTTON_DOWN, function(){
				if(!bPushed){
					player.ChangeShape();
					game.shapeChange.play();
				}
				bPushed = true;
			});

			game.addEventListener(Event.B_BUTTON_UP, function(){
				bPushed = false;
			});

		loaded = true;

		/*mainGame.addEventListener(Event.A_BUTTON_DOWN, function(){
			if(player.shape == 1){
				player.color++;
				if(player.color > 5)
					player.color = 2;
				player.UpdateColor();
				game.colorChange.play();
			}
		});*/
	}

	game.start();
}

var loaded = false;

function checkInside(block){
	if(player.x+16 > block.x && player.x+16 < block.x+block.width){
		if(player.y+16 > block.y && player.y+16 < block.y+block.height){
			player.Death();
			console.log("Death");
		}
	}
}

function checkIntersect(block, playerObj){
	if(player.color == block.colorPass)
		return false;

	if(playerObj.x<block.x+block.width*block.scaleX)//Left Side Check
		if(playerObj.x+playerObj.width>block.x)//Right Side Check
			if(playerObj.y<block.y+block.height*block.scaleY)//Top Check
				if(playerObj.y+playerObj.height>block.y)//Bottom Check
					return true;
		
}

function isCamera(obj){
	
}

function addGUI(){
	guiGroup.addChild(scoreLabel);
	guiGroup.addChild(healthGroup);
	guiGroup.addChild(energyBack);
	guiGroup.addChild(energyBar);
}

function clearGroup(group){
	//for(var i = 0; i < group.childNodes.length; i++){
	//	group.removeChild(group.childNodes[i]);
	//}
	group.childNodes = [];
}

function clearLevel(){
	clearGroup(blockGroup);
	clearGroup(bulletGroup);
	clearGroup(particleGroup);
	clearGroup(coinGroup);
	clearGroup(turretGroup);
	clearGroup(changerGroup);
	clearGroup(enemyGroup);
	clearGroup(gateGroup);
	mainGroup.removeChild(currentEndPoint);
	clearGroup(mainGroup);
}

var currentMapData;

function loadNewLevel(){
	clearLevel();
	level+=1;
	player.x = player.startX;
	player.y = player.startY;

	mainGroup.addChild(player);
	mainGroup.addChild(blockGroup);
	mainGroup.addChild(bulletGroup);
	mainGroup.addChild(particleGroup);
	mainGroup.addChild(coinGroup);
	mainGroup.addChild(turretGroup);
	mainGroup.addChild(changerGroup);
	mainGroup.addChild(enemyGroup);
	mainGroup.addChild(gateGroup);
	mainGroup.addChild(player.eye1);
	mainGroup.addChild(player.eye2);

	var topSprite = new Sprite();
	topSprite.image = game.assets['res/block.png'];
	topSprite.x = 0;
	topSprite.y = 0;
	topSprite.width = 100*32;
	topSprite.height = 32;

	var bottomBar = new Sprite();
	bottomBar.image = game.assets['res/block.png'];
	bottomBar.x = 0;
	bottomBar.y = 480-32;
	bottomBar.width = 100*32;
	bottomBar.height = 32;

	var leftBar = new Sprite();
	leftBar.image = game.assets['res/block.png'];
	leftBar.x = 0;
	leftBar.y = 0;
	leftBar.width = 32;
	leftBar.height = 15*32;

	var rightBar = new Sprite();
	rightBar.image = game.assets['res/block.png'];
	rightBar.x = 99*32;
	rightBar.y = 0;
	rightBar.width = 32;
	rightBar.height = 15*32;

	blockGroup.addChild(topSprite);
	blockGroup.addChild(bottomBar);
	blockGroup.addChild(leftBar);
	blockGroup.addChild(rightBar);

	currentMapData = mapData;
	switch(level){
		case 1:
		currentMapData = mapData;
		break;
		case 2:
		currentMapData = mapData2;
		break;
		case 3:
		currentMapData = mapData3;
		break;
		case 4:
		currentMapData = mapData4;
		break;
		case 5:
		currentMapData = mapData5;
		break;
		case 6:
		currentMapData = mapData6;
		break;
		case 7:
		currentMapData = mapData7;
		break;
		case 8:
		game.pushScene(credits);
		return;
		break;
	}

	map = new Map(32, 32);
	map.image = game.assets['res/spritesheet.png'];
	map.loadData(currentMapData);
	mainGroup.addChild(map);
	mainGroup.addChild(guiGroup);

	for(var i = 0; i < currentMapData.length; i++){
			for(var k = 0; k < currentMapData[i].length; k++){
				if(currentMapData[i][k] == 1){//Start a gate
					var x = k*32+16;
					var y = i*32+16;
					var width = 32;
					var height = 32;
					for(var l = 0; l < i+10; l++){
						if(l > 14)
							break;
						if(currentMapData[l][k] == 3){
							height = (l-i)*32;
						}
					}
					var gate = new Gate(x, y, width, height);
					gate.setColor(Math.floor(Math.random()*4 )+2);
					gateGroup.addChild(gate);
				}

				if(currentMapData[i][k] == 0){//A box
					/*var box = new Entity();
					box.x = k*32;
					box.y = i*32;
					box.width = 32;
					box.height = 32;
					blockGroup.addChild(box);*/
					if(!blocksTaken[i][k]){//This block has not been taken
						checkSurroundings(i, k);
					}
				}

				if(currentMapData[i][k] == 5){//Coin
					var coin = new Coin(k*32, i*32);
					coinGroup.addChild(coin);
				}

				if(currentMapData[i][k] == 6){//Enemy
					var enemy = new Enemy(k*32, i*32, 'res/enemy.png');
					enemyGroup.addChild(enemy);
				}

				if(currentMapData[i][k] == 7){//Block
					var color = Math.floor((((k/5)%1)/2)*10 );
					if(color == 0)
						color = 1;
					var block = new Block(color);
					block.x = k*32;
					block.y = i*32;
					block.width = 32;
					block.height = 32;
					blockGroup.addChild(block);
				}

				if(currentMapData[i][k] == 8 || currentMapData[i][k] == 10 || currentMapData[i][k] == 11){//Turrets
					var circleTurret = new CircleTurret(k*32, i*32);
					if(currentMapData[i][k] == 10)
						circleTurret.dir = 1;
					else if(currentMapData[i][k] == 11)
						circleTurret.dir = 4;
					turretGroup.addChild(circleTurret);
				}

				if(currentMapData[i][k] == 9){
					var endPoint = new EndPoint(k*32, i*32);
					currentEndPoint = endPoint;
					mainGroup.addChild(currentEndPoint);
				}

				if(currentMapData[i][k] == 12){
					var colorChanger = new ColorChanger(k*32, i*32, 2);
					changerGroup.addChild(colorChanger);
				}
				if(currentMapData[i][k] == 13){
					var colorChanger = new ColorChanger(k*32, i*32, 3);
					changerGroup.addChild(colorChanger);
				}
				if(currentMapData[i][k] == 14){
					var colorChanger = new ColorChanger(k*32, i*32, 4);
					changerGroup.addChild(colorChanger);
				}
				if(currentMapData[i][k] == 15){
					var colorChanger = new ColorChanger(k*32, i*32, 5);
					changerGroup.addChild(colorChanger);
				}
			}
		}
		console.log("Block Length " + blockGroup.childNodes.length);
}

function checkSurroundings(i, k){
	if(checkDirection == 0){//There is no deticated direction
		if(currentMapData[i][k+1] == 0){
			checkDirection = 1;
		}else if(currentMapData[i][k-1]){
			checkDirection = 2;
		}else if(currentMapData[i+1][k]){
			checkDirection = 3;
		}else if(currentMapData[i-1][k]){
			checkDirection = 4;
		}
	}

	switch(checkDirection){
		case 1:
			for(var ii = 0; ii < 100; ii++){
				if(currentMapData[i][k+ii] == 0){
					checkLength++;
				}else{
					if(checkLength > 0){
						for(var t = 0; t < checkLength; t++){
							blocksTaken[i,k+t] = true;
							var box = new Entity();
							box.x = k*32;
							box.y = i*32;
							box.width = 32*checkLength;
							box.height = 32;
							blockGroup.addChild(box);
							console.log("Added a block " + checkLength);
							checkLength = 0;
						}
					}
					break;
				}
			}
		break;
		case 2:
		for(var ii = 0; ii < 100; ii++){
				if(currentMapData[i][k-ii] == 0){
					checkLength++;
				}else{
					for(var t = 0; t < checkLength; t++){
						blocksTaken[i,k-t] = true;
						checkLength = 0;
						var box = new Entity();
						box.x = k*32;
						box.y = i*32;
						box.width = 32*checkLength;
						box.height = 32;
						blockGroup.addChild(box);
						console.log("Added a block");
					}
					break;
				}
			}
		break;
		case 3:
		for(var ii = 0; ii < 100; ii++){
				if(currentMapData[i+ii][k] == 0){
					checkLength++;
				}else{
					for(var t = 0; t < checkLength; t++){
						blocksTaken[i+t,k] = true;
						checkLength = 0;
						var box = new Entity();
						box.x = k*32;
						box.y = i*32;
						box.width = 32;
						box.height = 32*checkLength;
						blockGroup.addChild(box);
						console.log("Added a block");
					}
					break;
				}
			}
		break;
		case 4:
		for(var ii = 0; ii < 100; ii++){
				if(currentMapData[i-ii][k] == 0){
					checkLength++;
				}else{
					for(var t = 0; t < checkLength; t++){
						blocksTaken[i-t,k] = true;
						checkLength = 0;
						var box = new Entity();
						box.x = k*32;
						box.y = i*32;
						box.width = 32;
						box.height = 32*checkLength;
						blockGroup.addChild(box);
						console.log("Added a block");
					}
					break;
				}
			}
		break;
	}
}