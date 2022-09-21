var player = {
	x: 128, y: 300, width: 40, height: 40,
	img: new Image(),
	velX: 0, velY: 0,
	startingX: 128, startingY: 300,
	speed: 4, jumpHeight: -7,
	gravity: 0.3, max_speed: 20,
	falling: true, jumping: false,
	facing: 0, level: 1, punchSpeed: 2, punching: false, maxPunchWidth: 32,
	blinking: false, health: 3, maxHealth: 3, maxBlinks: 5, currentBlinks: 0, blinkTimer: 0, visable: true, 
	forwardPunch: false, grounded: false, 
	frameIndex: 0, tickCount: 0, ticksPerFrame: 1, moving: false, punchTickPF: 1,
	imageX: 40, punchX: 228, punchFrames: 10,
	exp: 0, nextLevel: 5, dead: false, playingIdle: true,
	side1: {x: 0, y: 0, width: 3, height: 18},
	side2: {x: 0, y: 0, width: 3, height: 18},
	side3: {x: 0, y: 0, width: 15, height: 3},
	side4: {x: 0, y: 0, width: 15, height: 3},
	punch: {x: 0, y: 16, width: 0, height: 8},
	update: function(){
		if(this.dead || showComplete || mainMenu){
			this.velX = 0;
			this.velY = 0;
		}

		this.x += this.velX;
		this.y += this.velY;

		if(this.falling || this.jumping){
			this.velY += this.gravity;
			if(this.velY > this.max_speed){
				this.velY = this.max_speed;
			}
		}

		//Animations
		if(this.velX != 0)
			this.moving = true;
		else{
			this.moving = false;
			this.frameIndex = 0;
		}

		if(this.moving && !this.jumping && !this.falling){
			this.tickCount++;
			if(this.tickCount > this.ticksPerFrame){
				this.tickCount = 0;
				this.frameIndex++;
			}

			if(this.frameIndex > 4)
				this.frameIndex = 0;
		}

		if(this.falling && !this.jumping && !this.grounded && !this.moving){
			this.imageX = 40;
			this.img.src = "res/player_fall.png";
		}

		if(this.jumping && !this.punching){
			if(this.facing == 0){
					this.imageX = 40;
					this.img.src = "res/player_jump.png";
				}else if(this.facing == 1){
					this.imageX = 40;
					this.img.src = "res/player_jump_left.png";
				}
		}

		if(this.facing == 0 && !this.jumping && !this.falling && !this.punching){
			this.imageX = 40;
			this.playingIdle = true;
			switch(this.frameIndex){
				case 0:
					this.img.src = "res/player_right.png";
				break;
				case 1:
					this.img.src = "res/player_right_1.png";
				break;
				case 2:
					this.img.src = "res/player_right_2.png";
				break;
				case 3:
					this.img.src = "res/player_right_3.png";
				break;
				case 4:
					this.img.src = "res/player_right_4.png";
				break;
			}
		}else if(this.facing == 1 && !this.jumping && !this.falling && !this.punching){
			this.imageX = 40;
			this.playingIdle = true;
			switch(this.frameIndex){
				case 0:
					this.img.src = "res/player_left.png";
				break;
				case 1:
					this.img.src = "res/player_left_1.png";
				break;
				case 2:
					this.img.src = "res/player_left_2.png";
				break;
				case 3:
					this.img.src = "res/player_left_3.png";
				break;
				case 4:
					this.img.src = "res/player_left_4.png";
				break;
			}
		}

		//Sets colliders
		this.side1.x = this.x;
		this.side1.y = this.y+6;
		this.side2.x = (this.x+32)-3;
		this.side2.y = this.y+6;

		this.side3.x = this.x+6;
		this.side3.y = this.y;
		this.side4.x = this.x+6;
		this.side4.y = (this.y+40)-3;

		//Death
		if(this.health <= 0 || this.y >= height){
			if(!showComplete)
				this.death();
		}

		//Movement
		//console.log(mouseDown);
		if(mouseDown && !this.punching){
			if(mouseX+camera.x*-1 > this.x+this.width || mouseX+camera.x*-1 < this.x){
				var dx = (mouseX+camera.x*-1)-this.x;
				var dy = (mouseY+camera.y*-1)-this.y;

				var angle = Math.atan2(dy, dx);

				this.velX = this.speed * Math.cos(angle);
			}else{
				this.velX = 0;
			}			

			if(this.velX > 0){//Currently moving to the right
				this.facing = 0;
			}else{//Currently Moving to the left
				this.facing = 1;
			}
			
			if(mouseY < this.y-32 && !this.jumping && !this.falling){
				//console.log("Should do a jump");
				this.jumping = true;
				this.velY = this.jumpHeight;
				if(this.facing == 0){
					this.img.src = "res/player_jump.png";
					this.imageX = 40;
				}else if(this.facing == 1){
					this.img.src = "res/player_jump_left.png";
					this.imageX = 40;
				}
				document.getElementById("sound").src="audio/temp_jump.wav"
				document.getElementById("sound").play();
			}
		}else
			this.velX = 0;

		//Done with movement

		//Level up
		if(this.level == 10)
			this.exp = 0;

		if(this.exp >= this.nextLevel){
			this.levelUp();
		}

		//Punching
		if(this.punching){
			this.punch.y = this.y+16;
			if(this.facing == 0){
				this.frameIndex = Math.floor(this.punchFrames * (this.punch.width/this.maxPunchWidth));
				//console.log(this.frameIndex);
				this.playingIdle = false;
				switch(this.frameIndex){
					case 0:
					this.img.src="res/punch/player_right_punch.png";
					this.imageX = this.punchX;
					break;
					case 1:
					this.img.src="res/punch/player_right_punch_1.png";
					this.imageX = this.punchX;
					break;
					case 2:
					this.img.src="res/punch/player_right_punch_2.png";
					this.imageX = this.punchX;
					break;
					case 3:
					this.img.src="res/punch/player_right_punch_3.png";
					this.imageX = this.punchX;
					break;
					case 4:
					this.img.src="res/punch/player_right_punch_4.png";
					this.imageX = this.punchX;
					break;
					case 5:
					this.img.src="res/punch/player_right_punch_5.png";
					this.imageX = this.punchX;
					break;
					case 6:
					this.img.src="res/punch/player_right_punch_6.png";
					this.imageX = this.punchX;
					break;
					case 7:
					this.img.src="res/punch/player_right_punch_7.png";
					this.imageX = this.punchX;
					break;
					case 8:
					this.img.src="res/punch/player_right_punch_8.png";
					this.imageX = this.punchX;
					break;
					case 9:
					this.img.src="res/punch/player_right_punch_9.png";
					this.imageX = this.punchX;
					break;
					case 10:
					this.img.src="res/punch/player_right_punch_10.png";
					this.imageX = this.punchX;
					break;
					case 11:
					this.img.src="res/punch/player_right_punch_11.png";
					this.imageX = this.punchX;
					break;
					case 12:
					this.img.src="res/punch/player_right_punch_12.png";
					this.imageX = this.punchX;
					break;
					case 13:
					this.img.src="res/punch/player_right_punch_13.png";
					this.imageX = this.punchX;
					break;
					case 14:
					this.img.src="res/punch/player_right_punch_14.png";
					this.imageX = this.punchX;
					break;
					case 15:
					this.img.src="res/punch/player_right_punch_15.png";
					this.imageX = this.punchX;
					break;
					case 16:
					this.img.src="res/punch/player_right_punch_16.png";
					this.imageX = this.punchX;
					break;
					case 17:
					this.img.src="res/punch/player_right_punch_17.png";
					this.imageX = this.punchX;
					break;
					case 18:
					this.img.src="res/punch/player_right_punch_18.png";
					this.imageX = this.punchX;
					break;
					case 19:
					this.img.src="res/punch/player_right_punch_19.png";
					this.imageX = this.punchX;
					break;
					case 20:
					this.img.src="res/punch/player_right_punch_20.png";
					this.imageX = this.punchX;
					break;
					case 21:
					this.img.src="res/punch/player_right_punch_21.png";
					this.imageX = this.punchX;
					break;
					case 22:
					this.img.src="res/punch/player_right_punch_22.png";
					this.imageX = this.punchX;
					break;
					case 23:
					this.img.src="res/punch/player_right_punch_23.png";
					this.imageX = this.punchX;
					break;
					case 24:
					this.img.src="res/punch/player_right_punch_24.png";
					this.imageX = this.punchX;
					break;
					case 25:
					this.img.src="res/punch/player_right_punch_25.png";
					this.imageX = this.punchX;
					break;
					case 26:
					this.img.src="res/punch/player_right_punch_26.png";
					this.imageX = this.punchX;
					break;
					case 27:
					this.img.src="res/punch/player_right_punch_27.png";
					this.imageX = this.punchX;
					break;
					case 28:
					this.img.src="res/punch/player_right_punch_28.png";
					this.imageX = this.punchX;
					break;
					case 29:
					this.img.src="res/punch/player_right_punch_29.png";
					this.imageX = this.punchX;
					break;
					case 30:
					this.img.src="res/punch/player_right_punch_30.png";
					this.imageX = this.punchX;
					break;
				}
				if(this.forwardPunch){//Punch is currently moving outwards
					//this.img.src="res/player_right_punch.png";
					if(this.punch.width >= this.maxPunchWidth){
						this.forwardPunch = false;
					}else{
						this.punch.width += this.punchSpeed;
						//console.log("Punching");
					}
				}else{//Punch moving back in
					if(this.punch.width > 0){
						this.punch.width -= this.punchSpeed;
					}else{
						this.punch.x = 0;
						this.punch.y = 0;
						this.punching = false;
						this.forwardPunch = false;
					}
				}
			}else if(this.facing == 1){
				this.punch.x = this.x-this.punch.width+1;
				this.frameIndex = Math.floor(this.punchFrames * (this.punch.width/this.maxPunchWidth));
				//console.log(this.imageX);
				this.playingIdle = false;
				switch(this.frameIndex){
					case 0:
					this.img.src="res/punch/player_right_punch.png";
					this.imageX = this.punchX;
					break;
					case 1:
					this.img.src="res/punch/player_right_punch_1.png";
					this.imageX = this.punchX;
					break;
					case 2:
					this.img.src="res/punch/player_right_punch_2.png";
					this.imageX = this.punchX;
					break;
					case 3:
					this.img.src="res/punch/player_right_punch_3.png";
					this.imageX = this.punchX;
					break;
					case 4:
					this.img.src="res/punch/player_right_punch_4.png";
					this.imageX = this.punchX;
					break;
					case 5:
					this.img.src="res/punch/player_right_punch_5.png";
					this.imageX = this.punchX;
					break;
					case 6:
					this.img.src="res/punch/player_right_punch_6.png";
					this.imageX = this.punchX;
					break;
					case 7:
					this.img.src="res/punch/player_right_punch_7.png";
					this.imageX = this.punchX;
					break;
					case 8:
					this.img.src="res/punch/player_right_punch_8.png";
					this.imageX = this.punchX;
					break;
					case 9:
					this.img.src="res/punch/player_right_punch_9.png";
					this.imageX = this.punchX;
					break;
					case 10:
					this.img.src="res/punch/player_right_punch_10.png";
					this.imageX = this.punchX;
					break;
					case 11:
					this.img.src="res/punch/player_right_punch_11.png";
					this.imageX = this.punchX;
					break;
					case 12:
					this.img.src="res/punch/player_right_punch_12.png";
					this.imageX = this.punchX;
					break;
					case 13:
					this.img.src="res/punch/player_right_punch_13.png";
					this.imageX = this.punchX;
					break;
					case 14:
					this.img.src="res/punch/player_right_punch_14.png";
					this.imageX = this.punchX;
					break;
					case 15:
					this.img.src="res/punch/player_right_punch_15.png";
					this.imageX = this.punchX;
					break;
					case 16:
					this.img.src="res/punch/player_right_punch_16.png";
					this.imageX = this.punchX;
					break;
					case 17:
					this.img.src="res/punch/player_right_punch_17.png";
					this.imageX = this.punchX;
					break;
					case 18:
					this.img.src="res/punch/player_right_punch_18.png";
					this.imageX = this.punchX;
					break;
					case 19:
					this.img.src="res/punch/player_right_punch_19.png";
					this.imageX = this.punchX;
					break;
					case 20:
					this.img.src="res/punch/player_right_punch_20.png";
					this.imageX = this.punchX;
					break;
					case 21:
					this.img.src="res/punch/player_right_punch_21.png";
					this.imageX = this.punchX;
					break;
					case 22:
					this.img.src="res/punch/player_right_punch_22.png";
					this.imageX = this.punchX;
					break;
					case 23:
					this.img.src="res/punch/player_right_punch_23.png";
					this.imageX = this.punchX;
					break;
					case 24:
					this.img.src="res/punch/player_right_punch_24.png";
					this.imageX = this.punchX;
					break;
					case 25:
					this.img.src="res/punch/player_right_punch_25.png";
					this.imageX = this.punchX;
					break;
					case 26:
					this.img.src="res/punch/player_right_punch_26.png";
					this.imageX = this.punchX;
					break;
					case 27:
					this.img.src="res/punch/player_right_punch_27.png";
					this.imageX = this.punchX;
					break;
					case 28:
					this.img.src="res/punch/player_right_punch_28.png";
					this.imageX = this.punchX;
					break;
					case 29:
					this.img.src="res/punch/player_right_punch_29.png";
					this.imageX = this.punchX;
					break;
					case 30:
					this.img.src="res/punch/player_right_punch_30.png";
					this.imageX = this.punchX;
					break;
				}
				if(this.forwardPunch){//Punch is currently moving outwards
					//this.imageX = this.punchX;
					if(this.punch.width >= this.maxPunchWidth){
						this.forwardPunch = false;
					}else{
						this.punch.width += this.punchSpeed;
						//console.log("Punching");
					}
				}else{//Punch moving back in
					if(this.punch.width > 0){
						this.punch.width -= this.punchSpeed;
					}else{//Punching is done
						this.punch.x = 0;
						this.punch.y = 0;
						this.punching = false;
						this.forwardPunch = false;
					}
				}
			}
		}

		//Collision
		var bottomTouching = false;
		for(var i = 0; i < walls.length; i++){

			if(isColliding(this.side4, walls[i]) && walls[i].solid){//Bottom collision
				this.y = walls[i].y-this.height;
				this.velY = 0;
				if(this.jumping){
					document.getElementById("sound").src="audio/temp_land.wav"
					document.getElementById("sound").play();
				}
				this.falling = false;
				this.jumping = false;
				bottomTouching = true;
				this.grounded = true;
				//console.log("Bottom Collision");
			}

			if(isColliding(this.side1, walls[i])&& walls[i].solid){
				this.x = walls[i].x+walls[i].width-1;
				//console.log((this.side1.y + this.side1.height));
				//console.log("Left Collision" + walls[i].y);
			}
			if(isColliding(this.side2, walls[i])&& walls[i].solid){
				this.x = walls[i].x-32+1;
				//console.log(this.side2.x);
				//console.log("Right Collision" + walls[i].x);
			}
			if(isColliding(this.side3, walls[i])&& walls[i].solid){
				this.y = walls[i].y+walls[i].height+1;
				this.velY = 0;
				console.log("Top Collision");
			}
			
		}
		if(!bottomTouching){
			this.falling = true;
			this.grounded = true;
		}

		//Sets colliders
		this.side1.x = this.x;
		this.side1.y = this.y+6+10;
		this.side2.x = (this.x+32)-3;
		this.side2.y = this.y+6+10;

		this.side3.x = this.x+6;
		this.side3.y = this.y+10;
		this.side4.x = this.x+6;
		this.side4.y = (this.y+40)-3;

		//Damage Collision
		if(!this.blink){
			if(!this.visable)
				this.visable = true;
			for(var i = 0; i < enemies.length; i++){
				if(isColliding(enemies[i], this)){
					this.blink = true;
					this.health--;
					this.visable = false;
				}
			}
		}else{//Player has been damaged and is blinking
			if(this.blinkTimer < fps/2){
				this.blinkTimer++;//Increase blink time which is about 1 second
			}else{
				if(this.currentBlinks < this.maxBlinks){//Still have more blinks to do
					this.blinkTimer = 0;
					this.currentBlinks++;
					if(this.visable)
						this.visable = false;
					else
						this.visable = true;
				}else{
					this.currentBlinks = 0;
					this.blink = false;
				}
			}
		}

		//Exp Collision
		for(var i = 0; i < exp.length; i++){
			if(isColliding(this, exp[i])){
				this.exp++;
				exp.splice(i, 1);
				playPickUp();
			}
		}

		//Warp Collision
		for(var i = 0; i < warps.length; i++){
			if(isColliding(this, warps[i])){
				if(warps[i].room == 0){
					if(!showComplete){
						showComplete = true;
						mouseDown = false;
						playFinish();
					}
				}else{//Room is defined
					room = warps[i].room;
					this.startingX = warps[i].startX;
					this.startingY = warps[i].startY;
					loadLevel();
				}
			}
		}
	},
	activatePunch: function(){
		if(this.punching)
			return;

		this.punching = true;
		this.forwardPunch = true;
		if(this.facing == 0){//Facing to the right
			this.punch.x = this.x+this.width;
		}else if(this.facing == 1){//Facing to the left
			this.punch.x = this.x;
		}
	},
	levelUp: function(){
		this.level++;
		this.exp = 0;
		switch(this.level){
			case 2:
				this.maxPunchWidth = 45;
				this.maxHealth = 3;
				this.nextLevel = 10;
				this.punchSpeed = 3;
				this.punchFrames = 15;
			break;
			case 3:
				this.maxPunchWidth = 60;
				this.maxHealth = 4;
				this.nextLevel = 15;
				this.punchFrames = 19;
			break;
			case 4:
				this.maxPunchWidth = 75;
				this.maxHealth = 4;
				this.nextLevel = 20;
				this.punchSpeed = 4;
				this.punchFrames = 22;
			break;
			case 5:
				this.maxPunchWidth = 90;
				this.maxHealth = 4;
				this.nextLevel = 25;
				this.punchFrames = 25;
			break;
			case 6:
				this.maxPunchWidth = 100;
				this.maxHealth = 5;
				this.nextLevel = 30;
				this.punchSpeed = 5;
				this.punchFrames = 26;
			break;
			case 7:
				this.maxPunchWidth = 110;
				this.maxHealth = 5;
				this.nextLevel = 35;
				this.punchFrames = 28;
			break;
			case 8:
				this.maxPunchWidth = 120;
				this.maxHealth = 6;
				this.nextLevel = 40;
				this.punchSpeed = 6;
				this.punchFrames = 30;
			break;
			case 9:
				this.maxPunchWidth = 130;
				this.maxHealth = 6;
				this.nextLevel = 45;
			break;
			case 10:
				this.maxPunchWidth = 150;
				this.punchSpeed = 5;
				this.maxHealth = 7;
				this.nextLevel = 45;
			break;
		}
		this.health = this.maxHealth;
		playLevelUp();
	},
	death: function(){
		this.health = this.maxHealth;
		this.y = -32;
		showDeath = true;
		this.dead = true;
		if(!showEnd){
			document.getElementById('music').src="audio/death.wav";
			document.getElementById("music").loop = true;
			document.getElementById("music").play();
		}
	}
};

var block = {
	x: 0, y: 0, width: 32, height: 32,
	solid: true, img: new Image(),
	ssX: 0, ssY: 0, useSS: false,
	setBlock: function(x, y, width, height, img){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = new Image();
		this.img.src = img;
		this.solid = true;
	},
	setSolid: function(x, y, width, height, img, solid){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		//this.solid = solid;
		this.img = new Image();
		this.img.src = img;
	},
	setBlockSS: function(x, y, width, height, img, ssX, ssY){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.ssX = ssX;
		this.ssY = ssY;
		this.img = new Image();
		this.img.src = img;
		this.useSS = true;
	},
};

var enemy = {
	x: 0, y: 0, width: 0, height: 0,
	img: new Image(),
	health: 1, reward: 1,
	velX: -3, velY: 0,
	gravity: 0.3, max_speed: 10,
	falling: false,
	canDamage: true, timer: 0,
	facing: 1, speed: 3,
	side1: {x: 0, y: 0, width: 3, height: 20},
	side2: {x: 0, y: 0, width: 3, height: 20},
	side3: {x: 0, y: 0, width: 20, height: 3},
	side4: {x: 0, y: 0, width: 20, height: 3},

	setEnemy: function(x, y, width, height, img, health){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img.src = img;
		this.health = health;
	},
	update: function(){
		//console.log(this.velX);
		this.x += this.velX;
		this.y += this.velY;

		//Sets colliders
		this.side1.x = this.x;
		this.side1.y = this.y+6;
		this.side2.x = (this.x+32)-3;
		this.side2.y = this.y+6;

		this.side3.x = this.x+6;
		this.side3.y = this.y;
		this.side4.x = this.x+6;
		this.side4.y = (this.y+32)-3;

		//Gravity
		if(this.falling){
			this.velY += this.gravity;
			if(this.velY > this.max_speed){
				this.velY = this.max_speed;
			}
		}

		//Movement
		if(this.canDamage){
			if(this.facing == 0)
				this.velX = this.speed;
			else if(this.facing == 1)
				this.velX = -this.speed;
		}

		//Damage Cooldown
		if(!this.canDamage){
			if(this.timer >= fps*2){
				this.canDamage = true;
				this.timer = 0;
			}else
				this.timer++;
		}

		//Death
		if(this.health <= 0){//Health is 0 or less
			player.exp += this.reward;
			var index = enemies.indexOf(this);
			if(index > -1)
				enemies.splice(index, 1);
		}

		//Collision
		var bottomTouching = false;
		for(var i = 0; i < walls.length; i++){
			if(isColliding(this.side1, walls[i])){
				this.x = walls[i].x+walls[i].width-1;
				this.facing = 0;
				this.velX = this.speed;
			}
			if(isColliding(this.side2, walls[i])){
				this.x = walls[i].x-this.width+1;
				this.facing = 1;
				this.velX = -this.speed;
			}
			if(isColliding(this.side3, walls[i])){
				this.y = walls[i].y+walls[i].height-1;
			}
			if(isColliding(this.side4, walls[i])){//Bottom collision
				this.y = walls[i].y-this.height;
				this.velY = 0;
				this.falling = false;
				bottomTouching = true;
			}
		}
		if(!bottomTouching)
			this.falling = true;

		//Collision with punch
		if(isColliding(this, player.punch)){//Colliding with the punch
			if(player.facing == 0){//Move to the right
				this.velX = player.punchSpeed;
			}
			if(player.facing == 1){
				this.velX = -player.punchSpeed;
			}
			if(this.canDamage){
				playHurt();
				this.health--;
				this.canDamage = false;
				this.timer = 0;
			}
		}else{
			if(!this.canDamage){
				this.velX = 0;
			}
		}
	}
}

var warp = {
	x: 0, y: 0, width: 0, height: 0, room: 0,
	startX: 0, startY: 0,
	setWarp: function(x, y, width, height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

var expBubble = {
	x: 0, y: 0, width: 32, height: 32, img: new Image()
}

var camera = {
	x: 0, y: 0,
	update: function(){

		//this.x += ((-player.x + 640/2) - player.x) * 0.01;
		//this.x--;
		this.x = -player.x + width/2;
		//console.log(player.x + " " + thi);

		if(this.x >= 0){
			this.x = 0;
		}
	}
}

function playSound(soundName){
	document.getElementById("sound").src="audio/"+soundName;
	document.getElementById("sound").play();
}

function playLevelUp(){
	document.getElementById("levelup").play();
}

function playPickUp(){
	document.getElementById("pickup").src="audio/lvl_pickup.wav";
	document.getElementById("pickup").play();
}

function playFinish(){
	document.getElementById("pickup").src="audio/level_fin.wav";
	document.getElementById("pickup").play();
}

function playHurt(){
	document.getElementById("pickup").src="audio/snd_punch.wav";
	document.getElementById("pickup").play();
}