enchant();

var game;

var fps = 60;
var width=640, height=480;

window.focus();

//Scenes
var mainGame, mainMenu, openingScene;

//Groups
var bombGroup, enemyGroup, explosionGroup, uiGroup, tutGroup, killGroup;

//Objects
var player;
var menuMusic, bgm;
var moon1 = new Sprite(172, 172), moon2 = new Sprite(175, 175), moon3 = new Sprite(257, 263);

//Menu
var menu = new Sprite(640, 480);

//GUI
var bg = new Sprite(640, 480), ground = new Sprite(640, 480), opening = new Sprite(640, 480);
var scoreLabel = new Label(), fpsLabel = new Label(), timerLabel = new Label('Time: 0');
var gameOver = new Label(), wave = new Label();
var healthBar = new Sprite(200, 32), healthGreen = new Sprite(200, 32);
var bombIco = new Sprite(32, 32), missileIco = new Sprite(32, 32);
var bombBg = new Sprite(32, 32), missileIcoBg = new Sprite(32, 32);
var levelup = new Sprite(150, 200);
var bombDis = new Sprite(32, 32), missDis = new Sprite(32, 32);
var bombLvlD = new Label(), missLvlD = new Label();

//Variables
var gravType = 1;
var score = 0, curWave = 10, rkPoint = 0;
var waveNum = 1;
var frames = 0;
var isGameover = false;
var offset = 5, maxBombTime = fps;
var canLaunch = true, timeoutAnimate = false;
var missileMax = fps, bombMax = fps*0.5;
var randTime = 12;

//Tutorial
var tutorial = true, startTut = false;
var curTut = 1, tutCount = 0;
var tut1 = new Label('Press the ‘Up Arrow’'), tut2 = new Label('to jump'), tut3 = new Label('(Press X to skip)');

window.onload = function(){
	window.focus();

	game = new Core(width, height);
	game.fps = fps;
	game.preload('res/player.png', 'res/bomb.png', 'res/enemy.png', 'res/explosion.png', 'res/health_bar.png', 'res/health_green.png',
				'res/background.png', 'res/ground.png', 'res/opening_scene.png', 'res/unselected.png', 'res/selected.png', 'res/level_up.png', 
				'res/missile.png', 'res/menu.png', 'res/kill.png', 'res/moon_1.png', 'res/moon_2.png', 'res/moon_3.png',
				'sound/explosion.wav', 'sound/menu.mp3', 'sound/jump.wav', 'sound/levelup.wav', 'sound/hurt.wav', 'sound/switch.wav', 'sound/music.mp3');
	game.keybind(32, 'a');
	game.keybind(90, 'b');
	game.keybind(49, 'one');
	game.keybind(50, 'two');
	game.keybind(51, 'three');
	game.keybind(13, 'enter');
	game.keybind(88, 'x');

	game.onload = function(){

		mainGame = new Scene();
		mainMenu = new Scene();
		openingScene = new Scene();

		bombGroup = new Group();
		enemyGroup = new Group();
		explosionGroup = new Group();
		uiGroup = new Group();
		tutGroup = new Group();
		killGroup = new Group();

		//Sounds
		game.explosionSound = game.assets['sound/explosion.wav'];
		game.jumpSound = game.assets['sound/jump.wav'];
		game.levelupSound = game.assets['sound/levelup.wav'];
		game.hurtSound = game.assets['sound/hurt.wav'];
		game.switchSound = game.assets['sound/switch.wav'];
		menuMusic = game.assets['sound/menu.mp3'];
		bgm = game.assets['sound/music.mp3'];
		menuMusic.play();

		//Objects
		player = new Player();
		game.pushScene(mainMenu);

		//Main Menu
		menu.image = game.assets['res/menu.png'];
		mainMenu.addChild(menu);
		menu.addEventListener(Event.TOUCH_START, function(e){
			if(e.x > 170 && e.x < 470 && e.y > 190 && e.y < 290){
				mainMenu.removeChild(menu);
				game.pushScene(openingScene);
				menuMusic.stop();
				bgm.play();
				window.focus();
			}

		});

		//Background
		bg.image = game.assets['res/background.png'];
		ground.image = game.assets['res/ground.png'];
		mainGame.addChild(bg);

		moon1.image = game.assets['res/moon_1.png'];
		moon1.x = 72;
		moon1.y = 49;
		moon1.tl.rotateTo(360, fps*30).then(function(){moon1.rotation=0;}).loop();
		mainGame.addChild(moon1);
		moon2.image = game.assets['res/moon_2.png'];
		moon2.x = 67;
		moon2.y = 35;
		moon2.tl.rotateTo(-360, fps*30).then(function(){moon2.rotation=0;}).loop();
		mainGame.addChild(moon2);
		moon3.image = game.assets['res/moon_3.png'];
		moon3.x = 383;
		moon3.y = 174;
		moon3.tl.rotateTo(-360, fps*50).then(function(){moon3.rotation=0;}).loop();
		mainGame.addChild(moon3);
		mainGame.addChild(ground);

		//Opening
		opening.image = game.assets['res/opening_scene.png'];
		opening.tl.scaleTo(3, fps*5).then(function(){
			openingScene.removeChild(opening);
			game.pushScene(mainGame);
		});
		openingScene.addChild(bg);
		openingScene.addChild(opening);

		//Groups
		mainGame.addChild(player);
		mainGame.addChild(bombGroup);
		mainGame.addChild(enemyGroup);
		mainGame.addChild(explosionGroup);

		//GUI
		scoreLabel.text = "Enemies: " + score + "/" + curWave;
		fpsLabel.text = "FPS: 0";
		scoreLabel.color = "#FFFFFF";
		fpsLabel.color = "#FFFFFF";
		timerLabel.color = "white";
		healthBar.image = game.assets['res/health_bar.png'];
		healthGreen.image = game.assets['res/health_green.png'];
		scoreLabel.x = 89;
		scoreLabel.y = 40;
		timerLabel.x = 89;
		timerLabel.y = 55;
		healthBar.x = 0;
		healthBar.y = 0;
		healthGreen.x = 0;
		healthGreen.y = 0;
		fpsLabel.x = 640-50;
		fpsLabel.y = 480-15;
		updateHealthBar();
		bombIco.image = game.assets['res/selected.png'];
		missileIco.image = game.assets['res/unselected.png'];
		bombBg.image = game.assets['res/unselected.png'];
		missileIcoBg.image = game.assets['res/unselected.png'];
		bombIco.x = 0;
		bombIco.y = 40;
		missileIco.x = 42;
		missileIco.y = 40;
		bombBg.x = bombIco.x;
		bombBg.y = bombIco.y;
		missileIcoBg.x = missileIco.x;
		missileIcoBg.y = missileIco.y;
		wave.x = -20;
		wave.y = 240;
		wave.color = "#FFFFFF";
		wave.font = "24px serif";
		levelup.image = game.assets['res/level_up.png'];
		levelup.x = 10;
		levelup.y = 275;
		bombDis.image = game.assets['res/bomb.png'];
		missDis.image = game.assets['res/missile.png'];
		bombDis.x = bombIco.x;
		bombDis.y = bombIco.y;
		bombDis.scaleX = 0.8;
		bombDis.scaleY = 0.8;
		missDis.x = missileIco.x;
		missDis.y = missileIco.y;
		missDis.scaleX = 0.8;
		missDis.scaleY = 0.8;  
		bombLvlD.text = "1";
		bombLvlD.color = "white";
		bombLvlD.x = bombIco.x+25;
		bombLvlD.y = bombIco.y+19;
		missLvlD.text = "1";
		missLvlD.color = "white";
		missLvlD.x = missileIco.x+25;
		missLvlD.y = missileIco.y+19;

		gameOver.text = "GAME OVER!";
		gameOver.color = "#FF0000";
		gameOver.font = "75px serif";
		gameOver.width = 640;
		gameOver.x = 80;
		gameOver.y = 200;

		uiGroup.addChild(scoreLabel);
		uiGroup.addChild(timerLabel);
		uiGroup.addChild(healthBar);
		uiGroup.addChild(healthGreen);
		uiGroup.addChild(bombBg);
		uiGroup.addChild(missileIcoBg);
		uiGroup.addChild(bombIco);
		uiGroup.addChild(missileIco);
		uiGroup.addChild(bombDis);
		uiGroup.addChild(missDis);
		uiGroup.addChild(bombLvlD);
		uiGroup.addChild(missLvlD);

		uiGroup.x = 5;
		uiGroup.y = 10;
		mainGame.addChild(uiGroup);

		//Tutorial
		tut1.color = "#FFFFFF";
		tut1.font = "20px serif";
		tut1.y = 200;
		tut2.color = "#FFFFFF";
		tut2.font = "20px serif";
		tut2.y = 220;
		tut3.color = "#FFFFFF";
		tut3.font = "20px serif";
		tut3.y = 240;
		tut1.x = 5;
		tut2.x = 5;
		tut3.x = 5;
		tutGroup.addChild(tut1);
		tutGroup.addChild(tut2);
		tutGroup.addChild(tut3);
		mainGame.addChild(tutGroup);
		mainGame.addChild(killGroup);

		mainGame.addEventListener(Event.ENTER_FRAME, function(){
			if(!isGameover)
				update();

			if(isGameover && game.input.enter){
				isGameover = false;
				mainGame.removeChild(gameOver);
				player.curHealth = 3;
				player.maxHealth = 3;
				player.bLvl = 1;
				player.mLvl = 1;
				rkPoint = 0;
				time = 0;
				score = 0;
				curWave = 10;
				waveNum = 1;
				for(var i = 0; i < enemyGroup.childNodes.length; i++)
					enemyGroup.removeChild(enemyGroup.childNodes[i]);
				for(var i = 0; i < bombGroup.childNodes.length; i++)
					bombGroup.removeChild(bombGroup.childNodes[i]);
				for(var i = 0; i < explosionGroup.childNodes.length; i++)
					explosionGroup.removeChild(explosionGroup.childNodes[i]);
				updateScore();
				updateHealthBar();
			}
		});

		mainMenu.addEventListener(Event.ENTER_FRAME, function(){
			if(menuMusic.currentTime >= menuMusic.duration)
				menuMusic.play();
		});	
	}

	game.start();
}

function update(){
	player.update();
	frames++;

	//Group Updates
	if(bombGroup.childNodes.length > 0)//There is a bomb
		for(var i = 0; i < bombGroup.childNodes.length; i++)
			bombGroup.childNodes[i].update();//Updates bomb
	if(enemyGroup.childNodes.length > 0)//There is an enemy
		for(var i = 0; i < enemyGroup.childNodes.length; i++){
			enemyGroup.childNodes[i].update();//Updates enemy
			if(player.intersect(enemyGroup.childNodes[i]))
				player.damage();
			if(player.bombType < 0)
				for(var b = 0; b < bombGroup.childNodes.length; b++)
					if(bombGroup.childNodes[b].intersect(enemyGroup.childNodes[i])){
						enemyGroup.childNodes[i].damage();
						bombGroup.removeChild(bombGroup.childNodes[b]);
						game.explosionSound.play();
					}
		}
	if(explosionGroup.childNodes.length > 0)
		for(var i = 0; i < explosionGroup.childNodes.length; i++){
			explosionGroup.childNodes[i].timeout++;
			if(explosionGroup.childNodes[i].timeout >= fps*3)
				explosionGroup.removeChild(explosionGroup.childNodes[i]);

			if(player.bombType > 0)
				for(var e = 0; e < enemyGroup.childNodes.length; e++)
					if(explosionGroup.childNodes.length > 0 && explosionGroup.childNodes[i] != null)
						if(explosionGroup.childNodes[i].intersect(enemyGroup.childNodes[e])){
							enemyGroup.childNodes[e].damage();
							explosionGroup.removeChild(explosionGroup.childNodes[i]);
						}
		}
	if(killGroup.childNodes.length > 0)
		for(var i = 0; i < killGroup.childNodes.length; i++){
			if(killGroup.childNodes[i].intersect(player)){
				killGroup.removeChild(killGroup.childNodes[i]);
				killAll();
			}else
				killGroup.childNodes[i].update();
		}

	//Level Up
	if(rkPoint > 0){
		if(game.input.one){
			rkPoint--;
			player.maxHealth++;
			player.curHealth = player.maxHealth;
			game.levelupSound.play();
		}else if(game.input.two){
			rkPoint--;
			player.bLvl++;
			bombLvlD.text = player.bLvl;
			switch(player.bLvl){
				case 2:
					bombMax = fps*0.4;
				break;
				case 3:
					bombMax = fps*0.3;
				break;
				case 4:
					bombMax = fps*0.2;
				break;
				case 5:
					bombMax = fps*0.1;
				break;
			}
			game.levelupSound.play();
		}else if(game.input.three){
			rkPoint--;
			player.mLvl++;
			missLvlD.text = player.mLvl;
			switch(player.mLvl){
				case 2:
					missileMax = fps*0.65;
				break;
				case 3:
					missileMax = fps*0.45;
				break;
				case 4:
					missileMax = fps*0.35;
				break;
				case 5:
					missileMax = fps*0.2;
				break;
			}
			game.levelupSound.play();
		}
		if(rkPoint <= 0)
			mainGame.removeChild(levelup);
	}

	//Bomb Timeout
	if(!canLaunch && !timeoutAnimate){
		timeoutAnimate = true;
		if(player.bombType === 1){
			bombIco.scaleX = 0;
			bombIco.tl.scaleTo(1, 1, maxBombTime).then(function(){
				canLaunch = true;
				timeoutAnimate = false;
			});
		}else if(player.bombType === -1){
			missileIco.scaleX = 0;
			missileIco.tl.scaleTo(1, 1, maxBombTime).then(function(){
				canLaunch = true;
				timeoutAnimate = false;
			});
		}
	}

	//Tutorial
	if(tutorial){
		if(game.input.x){
			tutorial = false;
			mainGame.removeChild(tutGroup);
		}

		switch(curTut){
			case 1:
				if(game.input.up)
					startTut = true;
				if(startTut)
					tutCount++;
				if(tutCount >= fps){
					tutCount = 0;
					startTut = false;
					curTut = 2;
					tut1.text = 'Press ‘Spacebar’ to fire a weapon';
					tut2.text = 'weapons have a cooldown time, so use them wisely';
					tut2.width = 500;
				}
			break;
			case 2:
				tutCount++;
				if(game.input.a)
					startTut = true;
				if(startTut && tutCount >= fps*2){
					tutCount = 0;
					startTut = false; 
					curTut = 3;
					tut1.text = 'Pres ‘Z’ to change';
					tut2.text = 'your current weapon';
				}
			break;
			case 3:
				tutCount++;
				if(game.input.b)
					startTut = true;
				if(startTut && tutCount >= fps*2){
					tutCount = 0;
					startTut = false;
					curTut = 4;
					tut1.text = 'Press the ‘Up Arrow’';
					tut2.text = 'midair to swap between planets';
				}
			break;
			case 4:
				if(gravType < 0)
					startTut = true;
				if(startTut)
					tutCount++;
				if(tutCount >= fps){
					tutCount = 0;
					startTut = false;
					curTut = 5;
					tut1.text = 'At the end of each wave you can level up a skill';
					tut2.text = 'by either pressing ‘1’, ‘2’, or ‘3’ this will';
					tut3.text = 'decrease the cooldown time of that weapon';
					tut1.width = 500;
					tut2.width = 500;
					tut3.width = 500;
				}
			break;
			case 5:
				tutCount++;
				if(tutCount >= fps*4){
					tutCount = 0;
					curTut = 6;
					tut1.text = 'You will get healed a little every 30 seconds';
					tut2.text = 'The timer resets each wave';
					tut3.text = 'Strategize your time well!';
				}
			break;
			case 6:
				tutCount++;
				if(tutCount >= fps*4){
					tutCount = 0;
					curTut = 7;
					tut1.text = 'Good luck, and STOP THAT LAVA!';
					tut2.text = '';
					tut3.text = '';
				}
			break;
			case 7:
				tutCount++;
				if(tutCount >= fps*3){
					tutorial = false;
					mainGame.removeChild(tutGroup);
				}
			break;
		}
	}

	//Spawner
	if(score < curWave && !tutorial){
		if(canSpawn){
			canSpawn = false;
			var seconds = Math.floor(Math.random()*randTime);
			setTimeout(spawn, seconds*1000);
		}

		if(canSpawn2){
			canSpawn2 = false;
			var seconds = Math.floor(Math.random()*randTime);
			setTimeout(spawn2, seconds*1000);
		}
	}

	//Music
	if(bgm.currentTime >= bgm.duration)
		bgm.play();
}

var canSpawn = true;
function spawn(){
	canSpawn = true;
	if(!(score < curWave))
		return;
	var randX = Math.floor(Math.random()*128)+1;
	var killChance = Math.floor(Math.random()*100)+1;

	if(killChance > 0 && killChance < 5){
		var killObj = new KillButton(1, randX, 1);
		killGroup.addChild(killObj);
		console.log("Kill Obj");
	}else{
		var enemy = new Enemy(1, randX, 1);
		enemyGroup.addChild(enemy);
	}

	if(killChance > 5 && killChance < 10){
		var killObj = new KillButton(-1, 640-randX, 2);
		killGroup.addChild(killObj);
	}else{
		enemy = new Enemy(-1, 640-randX, 2);
		enemyGroup.addChild(enemy);
	}
}

var canSpawn2 = true;
function spawn2(){
	canSpawn2 = true;
	if(!(score < curWave))
		return;
	var randX = Math.floor(Math.random()*128)+1;
	var enemy = new Enemy(-1, 640-randX, 1);
	enemyGroup.addChild(enemy);
	enemy = new Enemy(1, randX, 2);
	enemyGroup.addChild(enemy);
}

var canScore = true;
function updateScore(){
	scoreLabel.text = "Enemies: " + score + "/" + curWave;
	if(score >= curWave && canScore){
		rkPoint++;
		canScore = false;
		if(rkPoint === 1)
			mainGame.addChild(levelup);
		waveNum++;
		wave.text = "Wave: " + waveNum;
		mainGame.addChild(wave);
		wave.tl.moveTo(300, 240, fps).moveTo(340, 240, fps*2).moveTo(640, 240, fps).then(function(){
			mainGame.removeChild(wave);
			wave.x = -100;
			score = 0;
			curWave += 2;
			player.curHealth++;
			if(player.curHealth > player.maxHealth)
				player.curHealth = player.maxHealth;
			canScore = true;
			randTime--;
			if(randTime < 5)
				randTime = 5;
			scoreLabel.text = "Enemies: " + score + "/" + curWave;
			updateHealthBar();
			time = 0;
		});
	}
}

function updateHealthBar(){
	healthGreen.width = 200*(player.curHealth/player.maxHealth);
}

function killAll(){
	for(var i = 0; i < enemyGroup.childNodes.length; i++){
		enemyGroup.removeChild(enemyGroup.childNodes[i]);
		score++;
	}
	updateScore();
}

var time = 0;
setInterval(function(){
	fpsLabel.text = "FPS: " + frames;
	frames = 0;
	time++;
	timerLabel.text = "Time: " + time;
	if(time % 30 === 0){//Heal Every 30 seconds
		player.curHealth++;
		if(player.curHealth > player.maxHealth)
			player.curHealth = player.maxHealth;
		updateHealthBar();
	}
}, 1000);