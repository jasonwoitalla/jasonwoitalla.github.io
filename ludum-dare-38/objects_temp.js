var Box = enchant.Class(enchant.Entity, {
	initialize: function(x, y, width, height){
		enchant.Entity.call(this);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.inGroup = false;
		this.gorupDir = 0; //1: up  2: down  3: right   4: left
		//this.backgroundColor = "#FF0000";
	}
});

var Player = enchant.Class(enchant.Sprite, {
	initialize: function(){
		enchant.Sprite.call(this, 32, 32);
		this.x = 200;
		this.y = 200;
		this.startX = 64*2;
		this.startY = 64*5;
		this.maxHealth = 5;
		this.health = 5;
		this.energy = 50;
		this.maxEnergy = 50;
		this.canDamage = true;
		this.image = game.assets['res/player.png'];

		this.dead = false;
		this.animating = false;
		this.shape = 1;//1: Square   2: Circle
		this.eye1 = new Sprite(1, 3);
		this.eye2 = new Sprite(1, 3);
		this.eye1.image = game.assets['res/eye.png'];
		this.eye2.image = game.assets['res/eye.png'];
		this.eye1.x = this.x;
		this.eye1.y = this.y;
		this.eye1.tl.delay(60*3).tween({scaleY:0.1, time:10}).tween({scaleY:1, time:10}).loop();
		this.eye2.tl.delay(60*3).tween({scaleY:0.1, time:10}).tween({scaleY:1, time:10}).loop();

		this.dir = 1;

		//Colors: 2: Red   3: Blue   4: Green    5: Purple
		this.color = 2;
		this.normalColor = 2;

		healthGroup.childNodes = [];
		for(var i = 0; i < this.health*2; i++){
			var healthBit = new Sprite();
			healthBit.width = 8;
			healthBit.height = 16;
			healthBit.x = 10*i;
			healthBit.y = 0;
			healthBit.image = game.assets['res/health.png'];
			healthGroup.addChild(healthBit);
		}

		this.top = new Box(this.x+8,this.y+0,16,7);
		this.bottom = new Box(this.x+8, this.y+this.height-7, 16, 7);
		this.left = new Box(this.x+0, this.y+5, 5, this.height-10);
		this.right = new Box(this.x+this.width-5, this.y+5, 5, this.height-10);
	},

	setCollision: function(){
		var newHeight = this.height*this.scaleY;
		var newWidth = this.width*this.scaleX;
		var origin = this.y-16;
		var originx = this.x-16;

		this.top.x = (this.x+8)-newWidth/2+16;
		this.top.y = origin+32-newHeight/2;
		this.top.width = newWidth-16;
		this.bottom.x = this.x+8-newWidth/2+16;
		this.bottom.y = (origin+32)+newHeight/2-7;
		this.bottom.width = newWidth-16;
		this.left.x = this.x+16-newWidth/2;
		this.left.y = (origin+5+32)-newHeight/2
		this.left.height = (this.height*this.scaleY)-10;
		this.right.x = this.x+16+newWidth/2-5;
		this.right.y = (origin+5+32)-newHeight/2;
		this.right.height = (this.height*this.scaleY)-10;

		if(!this.animating){
			if(this.shape == 1)
				this.scaleX = 1;
			else
				this.scaleX = this.scaleY;
		}
	},

	SetEyes: function(){
		var newHeight = this.height*this.scaleY;
		//Eye Setting
		switch(this.shape){
			case 1:
			this.eye1.x = this.x+7;
			this.eye2.x = this.x+this.width-7;
			this.eye1.y = this.y-newHeight/2+5+16;
			this.eye2.y = this.y-newHeight/2+5+16;
			break;
			case 2:
			this.eye1.x = this.x+9;
			this.eye2.x = this.x+this.width-9;
			this.eye1.y = this.y-newHeight/2+5+16;
			this.eye2.y = this.y-newHeight/2+5+16;
			break;
		}
	},

	UpdateColor: function(animation){
		if(!animation){
			createRing = true;
			if(this.color == 1)
				this.color = 2;
			if(this.shape == 1)
				this.image = game.assets['res/player'+this.color+'.png'];
			else
				this.image = game.assets['res/player_circ'+this.color+'.png'];

		}else{
			this.animating = true;
			this.tl.tween({
				scaleX: 1,
				scaleY: 1,
				rotation: 360,
				time: 10
			}).then(function(){
				this.animating = false;
				this.rotation = 0;
				createRing = true;
				if(this.color == 1)
					this.color = 2;
				if(this.shape == 1)
					this.image = game.assets['res/player'+this.color+'.png'];
				else
					this.image = game.assets['res/player_circ'+this.color+'.png'];
			});
		}
	},

	DealDamage: function(damage){
		if(!this.canDamage)
			return;
		this.canDamage = false;
		this.health -= damage;
		game.hit.play();
		healthGroup.childNodes = [];
		for(var i = 0; i < this.health*2; i++){
			var healthBit = new Sprite();
			healthBit.width = 8;
			healthBit.height = 16;
			healthBit.x = 10*i;
			healthBit.y = 0;
			healthBit.image = game.assets['res/health.png'];
			healthGroup.addChild(healthBit);
		}
		if(this.health <= 0)
			this.Death();
		else
			this.tl.delay(1).then(function(){this.visible=false;}).delay(30).then(function(){this.visible=true;}).delay(30).
				then(function(){this.visible=false;}).delay(30).then(function(){this.visible=true; this.canDamage=true});
	},

	UpdateHealth: function(){
		healthGroup.childNodes = [];
		for(var i = 0; i < this.health*2; i++){
			var healthBit = new Sprite();
			healthBit.width = 8;
			healthBit.height = 16;
			healthBit.x = 10*i;
			healthBit.y = 0;
			healthBit.image = game.assets['res/health.png'];
			healthGroup.addChild(healthBit);
		}
	},

	ChangeShape: function(){
		//TODO Animation
		if(this.shape == 1)
			this.shape = 2;
		else{
			this.shape = 1;
			speed = 5;
		}
		this.UpdateColor(true);
	},

	Death: function(){
		if(this.dead)
			return;
		game.death.play();
		this.visible = false;
		this.dead = true;
		this.eye1.visible = false;
		this.eye2.visible = false;
		var objects = Math.floor((Math.random()*30)+20);
		for(var i = 0; i < objects; i++){
			var particle = new Particle();
			particle.x = this.x;
			particle.y = this.y;
			particle.image = this.image;
			particle.target = this;
			particleGroup.addChild(particle);
		}
		this.tl.delay(60).then(function(){
			this.x = this.startX;
			this.y = this.startY;
			console.log("Death");
			this.setCollision();
			this.visible = true;
			this.dead = false;
			this.eye1.visible = true;
			this.eye2.visible = true;
			this.health = 5;
			this.canDamage = true;
			healthGroup.childNodes = [];
		for(var i = 0; i < this.health*2; i++){
			var healthBit = new Sprite();
			healthBit.width = 8;
			healthBit.height = 16;
			healthBit.x = 10*i;
			healthBit.y = 0;
			healthBit.image = game.assets['res/health.png'];
			healthGroup.addChild(healthBit);
		}
		});
		//TODO Make death animation
	}
});

var Bullet = enchant.Class(enchant.Sprite, {
	initialize: function(damage){
		enchant.Sprite.call(this, 8, 8);
		this.image = game.assets['res/bullet.png'];
		this.velX = 0;
		this.velY = 0;
		this.damage = damage;
		this.scaleX = damage;
		this.scaleY = damage;
		this.player = true;
		this.tl.delay(45*2).then(function(){
			bulletGroup.removeChild(this);
		});
	},

	update: function(){
		this.x += this.velX;
		this.y += this.velY;
		if(this.player){
			for(var i = 0; i < enemyGroup.childNodes.length; i++){
				if(this.intersect(enemyGroup.childNodes[i])){
					enemyGroup.childNodes[i].dealDamage(this.damage);
					bulletGroup.removeChild(this);
				}
			}

			for(var i = 0; i < turretGroup.childNodes.length; i++){
				if(this.intersect(turretGroup.childNodes[i])){
					turretGroup.childNodes[i].Death();
					bulletGroup.removeChild(this);
					score += 3;
				}
			}
		}else{
			//var newPlayer = new Box(player.x-(player.width*(player.scaleX/2)-16), player.y-(player.height*(player.scaleY/2)-16), player.width*player.scaleX, player.height*player.scaleY);
			//mainGroup.addChild(newPlayer);
			
			//if(this.intersect(newPlayer)){
			//	player.DealDamage(1);
			//	bulletGroup.removeChild(this);
			//}
			//mainGroup.removeChild(newPlayer);
		}

	},

	shoot: function(dir){
		//1:up    2:down    3:right    4:left
		switch(dir){
			case 1:
			this.velY = -7;
			break;
			case 2:
			this.velY = 7;
			break;
			case 3:
			this.velX = 7;
			break;
			case 4:
			this.velX = -7;
			break;
		}
	}
});

var Block = enchant.Class(enchant.Sprite, {
	initialize: function(colorPass){
		enchant.Sprite.call(this, 64, 64);
		this.x = 100;
		this.y = 100;
		this.colorPass = colorPass;
		switch(colorPass){
			case 1:
			this.image = game.assets['res/player.png'];
			break;
			case 2:
			this.image = game.assets['res/player2.png'];
			break;
			case 3:
			this.image = game.assets['res/player3.png'];
			break;
			case 4:
			this.image = game.assets['res/player4.png'];
			break;
			case 5:
			this.image = game.assets['res/player5.png'];
			break;
		}
		this.animtion = 0;
		this.doUpdate = false;
		this.playing = false;
		this.constY = 0;
		this.newScale = 0;
		this.time = 0;
		this.kills = false;
	}
});

var Gate = enchant.Class(enchant.Entity, {
	initialize: function(x, y, width, height){
		enchant.Entity.call(this);
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;

		this.active = true;
		this.playerIn = false;
		this.colorPass = 1;
		this.backgroundColor = "#000000";
		this.tl.tween({scaleX:0.8, scaleY:0.95, time:10}).tween({scaleX:1, scaleY:1, time:20}).loop();

	}, 

	setColor: function(color){
		this.colorPass = color;
		switch(this.colorPass){
			case 1:
			this.backgroundColor = "#000000";
			break;
			case 2:
			this.backgroundColor = "#FF0000";
			break;
			case 3:
			this.backgroundColor = "#0026FF";
			break;
			case 4:
			this.backgroundColor = "#007F0E";
			break;
			case 5:
			this.backgroundColor = "#B200FF";
			break;
		}
	},

	turnOff: function(){
		if(this.active){
			score+=5;
		}
		this.active = false;
		this.visible = false;
		this.playerIn = false;
	}
});

var Enemy = enchant.Class(enchant.Sprite, {
	initialize: function(x, y, image){
		enchant.Sprite.call(this, 32, 32);
		this.x = x;
		this.y = y;
		this.velX = 0;
		this.velY = 0;
		this.speed = 4;
		this.image = game.assets[image];
		this.color = 2;//2: Red   3: Blue   4: Green   5: Purple
		this.focused = false;
		this.shooting = false;
		this.health = 3;
		this.friendly = false;
		this.dead = false;
	},

	update: function(){
		if(this.dead)
			return;
		this.x += this.velX;
		this.y += this.velY;

		if(this.within(player, 200) && this.color != player.color){//Noticed Player
			this.focused = true;
		}

		if(this.focused){
			var dx = player.x-this.x;
			var dy = player.y-this.y;
			var angle = Math.atan2(dy, dx);

			if(Math.abs(dx) >= 200)
				this.velX = this.speed * Math.cos(angle);
			else
				this.velX = 0;
			this.velY = this.speed * Math.sin(angle);

			this.rotation %= 360;

			var targetAngle = angle * (180/Math.PI)+90;
			targetAngle = (targetAngle+360)%360;
			if(this.rotation != targetAngle){
				var netAngle = (this.rotation - targetAngle + 360) % 360;
			    var delta = Math.min(Math.abs(netAngle - 360), netAngle, 10);
			    var sign  = (netAngle - 180) >= 0 ? 1 : -1;
			    this.rotation += sign * delta + 360;
			    this.rotation %= 360;
			}

			if(!this.shooting){
				this.tl.delay(60).then(function(){
					if(this.within(player, 200))
						this.shoot();
				}).loop();
				this.shooting = true;
			}
		}

	},

	shoot: function(){
		bullet = new Bullet();
		bullet.x = this.x;
		bullet.y = this.y;

		var dx = player.x-this.x;
		var dy = player.y-this.y;
		var angle = Math.atan2(dy, dx);

		bullet.velX = 6 * Math.cos(angle);
		bullet.velY = 6 * Math.sin(angle);
		bullet.player = false;
		bulletGroup.addChild(bullet);
		game.shoot.play();
		console.log("Shooting");
	},

	dealDamage: function(damage){
		this.health -= damage;
		game.hit.play();
		if(this.health <= 0)
			this.Death();
	},

	Death: function(){
		if(this.dead)
			return;
		game.death.play();
		this.visible = false;
		this.dead = true;
		score += 5;
		var objects = Math.floor((Math.random()*30)+20);
		for(var i = 0; i < objects; i++){
			var particle = new Particle();
			particle.x = this.x;
			particle.y = this.y;
			particle.image = this.image;
			particle.target = this;
			particleGroup.addChild(particle);
		}
		this.tl.delay(60).then(function(){
			enemyGroup.removeChild(this);
		});
	}
});

var Coin = enchant.Class(enchant.Sprite, {
	initialize: function(x, y){
		enchant.Sprite.call(this, 47, 47);
		this.image = game.assets['res/coin_sheet.png'];
		this.x = x;
		this.y = y;
		this.frame = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,15,15,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,
		26,26,27,27,28,28,29,29,30,30,31,31,32,32,33,33,34,34];
	}
});

var Particle = enchant.Class(enchant.Sprite, {
	initialize: function(){
		enchant.Sprite.call(this, 32, 32);
		this.scaleX = 0.25;
		this.scaleY = 0.25;
		this.speed = Math.floor((Math.random()*15)+5);
		this.negative = 1;
		this.doNegative = Math.floor((Math.random()*2)+1);
		this.target = player;
		//console.log(this.doNegative);
		if(this.doNegative == 1)
			this.negative = -1;
		else
			this.negative = 1;
		this.velX = Math.random() * this.speed*this.negative;
		this.doNegative = Math.floor((Math.random()*2)+1);
		//console.log(this.doNegative);
		if(this.doNegative == 1)
			this.negative = -1;
		else
			this.negative = 1;
		this.velY = Math.random() * this.speed*this.negative;
		this.tl.fadeOut(60).then(function(){
			particleGroup.removeChild(this);
		});
	},
	update: function(){
		this.x += this.velX;
		this.y += this.velY;
		//console.log(this.velX);

		if(!this.within(this.target, 50)){
			this.velX *= 0.75;
			this.velY *= 0.75;
		}
	}
});

var CircleTurret = enchant.Class(enchant.Sprite, {
	initialize: function(x, y){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/player_circ.png'];
		this.x = x;
		this.y = y;
		this.dead = false;
		this.tl.delay(10).then(function(){
			for(var i = 0; i < blockGroup.childNodes.length; i++){
				if(blockGroup.childNodes[i].y >= this.y+32 && blockGroup.childNodes[i].y < this.y+64)
					dir = 1;

				if(blockGroup.childNodes[i].y == this.y-32)
					dir = 2;
			}
		});
		this.dir = 2;
		this.tl.delay(90).then(function(){
			if(this.dead)
				return;
			if(this.within(player, 600)){
				var bullet = new Bullet();
				bullet.x = this.x+16;
				bullet.y = this.y;
				bullet.player = false;
				bulletGroup.addChild(bullet);
				bullet.shoot(this.dir);
			}
		}).loop();
	},

	Death: function(){
		if(this.dead)
			return;
		game.death.play();
		this.visible = false;
		this.dead = true;
		var objects = Math.floor((Math.random()*30)+20);
		for(var i = 0; i < objects; i++){
			var particle = new Particle();
			particle.x = this.x;
			particle.y = this.y;
			particle.image = this.image;
			particle.target = this;
			particleGroup.addChild(particle);
		}
		this.tl.delay(60).then(function(){
			turretGroup.removeChild(this);
		});
	}
});

var EndPoint = enchant.Class(enchant.Sprite, {
	initialize: function(x, y){
		enchant.Sprite.call(this, 52, 52);
		this.image = game.assets['res/endpoint.png'];
		this.x = x;
		this.y = y;
		this.tl.tween({rotation: 360, scaleX: 0.8, scaleY: 0.95, time:10}).tween({rotation: 0, scaleX: 1, scaleY: 1, time:10}).loop();
	}
});

var ColorChanger = enchant.Class(enchant.Sprite, {
	initialize: function(x, y, value){
		enchant.Sprite.call(this, 52, 52);
		this.x = x;
		this.y = y;

		this.backImage = new Sprite(52,52);
		this.backImage.x = this.x;
		this.backImage.y = this.y;

		this.cValue = 2;
		this.cValue = value;//2: Red   3: Blue   4: Green   5: Purple
		switch(this.cValue){
			case 2:
				this.image = game.assets['res/red_changer.png'];
				this.backImage.image = game.assets['res/red_changer_light.png'];
				this.backImage.opacity = 0;
			break;
			case 3:
				this.image = game.assets['res/blue_changer.png'];
				this.backImage.image = game.assets['res/blue_changer_light.png'];
				this.backImage.opacity = 0;
			break;
			case 4:
				this.image = game.assets['res/green_changer.png'];
				this.backImage.image = game.assets['res/green_changer_light.png'];
				this.backImage.opacity = 0;
			break;
			case 5:
				this.image = game.assets['res/purple_changer.png'];
				this.backImage.image = game.assets['res/purple_changer_light.png'];
				this.backImage.opacity = 0;
			break;
		}
		mainGroup.addChild(this.backImage);
		this.tl.tween({opacity:0, time:30}).tween({opacity:1, time:30}).loop();
		this.backImage.tl.tween({opacity:1, time:30}).tween({opacity:0, time:30}).loop();
	}
})

var Tutorial = enchant.Class(enchant.Group, {
	initialize: function(){
		enchant.Group.call(this);
		this.playerSprite = new Sprite();
		this.playerSprite.width = 32;
		this.playerSprite.height = 32;
		this.playerSprite.x = 64;
		this.playerSprite.y = 64+32+16;
		this.playerSprite.opacity = 0.5; 
		this.playerSprite.image = game.assets['res/player.png'];
		this.playerSprite.tl.tween({scaleY: 2.5, time:20}).then(function(){this.image = game.assets['res/player2.png'];}).delay(30).moveTo(128+64, 64+32+16, 45).delay(30).
									then(function(){this.x = 64; this.y = 64+32+16; this.image = game.assets['res/player.png']; this.scaleY = 1}).delay(30).loop();

		this.topGate = new Sprite();
		this.topGate.image = game.assets['res/topGate.png'];
		this.topGate.width = 64;
		this.topGate.height = 32;
		this.topGate.x = 128;
		this.topGate.y = 64;
		this.topGate.opacity = 0.5;

		this.bottomGate = new Sprite();
		this.bottomGate.image = game.assets['res/bottomGate.png'];
		this.bottomGate.width = 64;
		this.bottomGate.height = 32;
		this.bottomGate.x = 128;
		this.bottomGate.y = 64*2+32;
		this.bottomGate.opacity = 0.5;

		this.fakeGate = new Sprite();
		this.fakeGate.image = game.assets['res/player2.png'];
		this.fakeGate.width = 32;
		this.fakeGate.height = 64+32;
		this.fakeGate.x = 128+16;
		this.fakeGate.y = 64+16;
		this.fakeGate.opacity = 0.5;
		this.fakeGate.tl.tween({scaleX:0.8, scaleY:0.95, time:10}).tween({scaleX:1, scaleY:1, time:20}).loop();

		this.label = new Label();
		this.label.x = 64+16;
		this.label.y = 64*3;
		this.label.text="A";
		this.label.tl.delay(20).then(function(){this.text="Space";}).delay(80).then(function(){this.text="W";}).delay(55).loop();

		this.label2 = new Label();
		this.label2.x = 128+64+32+16;
		this.label2.y = 64*2;
		this.label2.text="Match the gates size<br>as close as possible.";

		ring = new Sprite(90, 90);
		ring.image = game.assets['res/glow_ring.png'];
		ring.x = 64-90/4-8; 
		ring.y = 64+32+16-90/4-8;
		ring.scaleX = 0.1;	
		ring.scaleY = 0.1;
		ring.visible = false;
		ring.tl.delay(20).then(function(){this.visible=true;}).scaleTo(1, 15).fadeOut(15).then(function(){
					this.visible = false;
					this.opacity = 1;
					this.scaleY = 0.1;
					this.scaleX = 0.1;
				}).delay(110).loop();

		this.explain = new Label();
		this.explain.text = "W: Grow <br>S: Shrink <br>Space: Change Color/Shoot <br>A or D: Change Shape"
		this.explain.x = 32;
		this.explain.y = 390;

		this.addChild(this.playerSprite);
		this.addChild(this.topGate);
		this.addChild(this.fakeGate);
		this.addChild(this.bottomGate);
		this.addChild(this.label);
		this.addChild(this.label2);
		this.addChild(ring);
		this.addChild(this.explain);
	}
});