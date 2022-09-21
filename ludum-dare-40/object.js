var Player = enchant.Class(enchant.Sprite, {
	initialize: function(){
		enchant.Sprite.call(this, 32, 44);
		this.image = game.assets['res/player.png'];
		this.x = 100;
		this.y = 100;
		this.velX = 0;
		this.velY = 0;
		this.speed = 6;
		this.energy = 10;
		this.frame = [0,1,2,3];
		this.shoot = false;
		this.health = 10;
		this.maxHealth = 10;
		this.canDamage = true;
		this.dir = DIR_RIGHT;
		this.healthBg = new Sprite(32, 8);
		this.healthBar = new Sprite(32, 8);
		this.healthBg.image = game.assets['res/health_bg.png'];
		this.healthBar.image = game.assets['res/health_bar.png'];
	},
	tick: function(){
		this.x+=this.velX;
		this.y+=this.velY;
		this.healthBg.x = this.x;
		this.healthBg.y = this.y-10;
		this.healthBar.x = this.x;
		this.healthBar.y = this.y-10;
		this.healthBar.width = 32*(this.health/this.maxHealth);

		//Input
		if(game.input.left){
			this.velX = -this.speed;
			this.dir = DIR_LEFT;
		}
		else if(game.input.right){
			this.velX = this.speed;
			this.dir = DIR_RIGHT;
		}
		else
			this.velX = 0;

		if(game.input.up){
			this.velY = -this.speed;
			this.dir = DIR_UP;
		}
		else if(game.input.down){
			this.velY = this.speed;
			this.dir = DIR_DOWN;
		}
		else
			this.velY = 0;

		//Collision
		if(map){
			if(this.velX > 0)
				if(map.hitTest(this.x+this.velX+32, this.y+this.velY+44)) this.velX = 0;
			if(this.velX < 0)
				if(map.hitTest(this.x+this.velX, this.y+this.velY)) this.velX = 0;
			if(this.velY > 0)
				if(map.hitTest(this.x+this.velY+32, this.y+this.velY+44)) this.velY = 0;
			if(this.velY < 0)
				if(map.hitTest(this.x+this.velX, this.y+this.velY)) this.velY = 0;			
		}

		//Door Intersection
		for(var i = 0; i < group[3].childNodes.length; i++){
			if(group[3].childNodes[i] !== undefined){
				if(intersect(this, group[3].childNodes[i])){
					transition(group[3].childNodes[i].to, group[3].childNodes[i].from);
					game.door.play();
				}
			}
		}
		
		//Blob Intersection
		for(var i=0; i < group[0].childNodes.length; i++){
			if(intersect(this, group[0].childNodes[i]) && group[0].childNodes[i].scaleX < 1.1){
				generateParticles(group[0].childNodes[i].x,group[0].childNodes[i].y, 'res/particle.png');
		 		group[0].removeChild(group[0].childNodes[i]);
		 		curChunk.blob = true;
				this.powerUp();
				game.energyGet.play();
			}
		}

		//Enemy Intersection
		for(var i = 0; i < group[1].childNodes.length; i++){
			if(intersect(this, group[1].childNodes[i]))
				this.hit();
		}

		//Animation
		if(this.shoot){
			if(this.dir == DIR_LEFT)
				this.frame = 3;
			else if(this.dir == DIR_RIGHT)
				this.frame = 1;
			else if(this.dir == DIR_DOWN)
				this.frame = 5;
			else if(this.dir == DIR_UP)
				this.frame = 6;
		}else{
			if(this.velX > 0)
				this.frame = 0;
			else if(this.velX < 0)
				this.frame = 2;
			else{
				if(this.dir == DIR_RIGHT)
					this.frame = 0;
				else if(this.dir == DIR_LEFT)
					this.frame = 2;
			}

			if(this.velY > 0)
				this.frame = 4;
			else if(this.velY < 0)
				this.frame = 7;
		}

	},
	shootBullet(){
		this.shoot = true;
		this.tl.delay(30/2).then(function(){
			this.shoot = false;
		});
	},
	addPlayer(){
		scene[0].addChild(this);
		scene[0].addChild(this.healthBg);
		scene[0].addChild(this.healthBar);
	},
	removePlayer(){
		scene[0].removeChild(this);
		scene[0].removeChild(this.healthBg);
		scene[0].removeChild(this.healthBar);
	},
	powerUp(){
		this.energy+=10;
	},
	death(){
		this.health = 10;
		this.energy = 1;
		this.x = 100;
		this.y = 100;
		transition([0,0],[0,0]);
	},
	hit(){
		if(!this.canDamage)
			return;
		this.health--;
		if(this.health <= 0)
			this.death();
		this.canDamage = false;
		this.tl.delay(15).then(function(){player.canDamage = true});
	}
});

var Bullet = enchant.Class(enchant.Sprite, {
	initialize: function(image, width, height, targetX, targetY, spread){
		enchant.Sprite.call(this, width, height);
		this.image = game.assets[image];
		this.x = player.x;
		this.y = player.y;
		if(spread == 1){
			this.x += 20;
			this.y += 20;
		}
		else if(spread == 2){
			this.x -= 20;
			this.y -= 20;
		}
		this.targetX = targetX-camX;
		this.targetY = targetY-camY;
		this.velX = 0;
		this.velY = 0;
		var dx = this.targetX-this.x;
		var dy = this.targetY-this.y;
		var angle = Math.atan2(dy,dx);
		this.rotation = degrees(angle);
		this.tl.delay(fps*3).removeFromScene();
	},
	tick: function(){
		this.x += this.velX;
		this.y += this.velY;

		var dx = this.targetX-this.x;
		var dy = this.targetY-this.y;
		var angle = Math.atan2(dy,dx);
		this.velX = 16*Math.cos(angle);
		this.velY = 16*Math.sin(angle);

		if(Math.abs(this.x-this.targetX) < 8 && Math.abs(this.y-this.targetY) < 8)
			group[2].removeChild(this);
	}
});

var Enemy = enchant.Class(enchant.Sprite, {
	initialize: function(type, x, y){
		enchant.Sprite.call(this, 45, 22);
		this.image = game.assets['res/enemy.png'];
		this.x = x;
		this.y = y;
		this.scaleX = 2;
		this.scaleY = 2;
		this.velX = 0;
		this.velY = 0;
		this.speed = 2.5;
		this.health = 5;
		this.frame = [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1];
		this.healthBg = new Sprite(32, 8);
		this.healthBar = new Sprite(32, 8);
		this.healthBg.image = game.assets['res/health_bg.png'];
		this.healthBar.image = game.assets['res/health_bar.png'];
		group[1].addChild(this.healthBg);
		group[1].addChild(this.healthBar);
	},
	tick: function(){
		this.x += this.velX;
		this.y += this.velY;
		var dx = player.x-this.x;
		var dy = player.y-this.y;
		var angle = Math.atan2(dy,dx);
		this.velX = this.speed*Math.cos(angle);
		this.velY = this.speed*Math.sin(angle);

		this.healthBg.x = this.x;
		this.healthBg.y = this.y-10;
		this.healthBar.x = this.x;
		this.healthBar.y = this.y-10;

		this.healthBar.width = 32*(this.health/5);

		for(var i = 0; i < group[2].childNodes.length; i++){
			if(intersect(this, group[2].childNodes[i])){
				this.hit();
				group[2].removeChild(group[2].childNodes[i]);
			}

		}

		if(this.health < 0){
			group[1].removeChild(this);
			group[1].removeChild(this.healthBg);
			group[1].removeChild(this.healthBar);
			player.energy += 1;
		}
	},
	hit: function(){
		if(player.energy > 3)
			this.health -= 0.5;
		this.health--;
		game.enemyHurt.play();
	}
});

var GoodGuy = enchant.Class(enchant.Sprite, {
	initialize: function(type,x,y, sx, sy){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/good_guy.png'];
		this.x = x;
		this.y = y;
		this.scaleX = sx;
		this.scaleY = sy;
		this.frame = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,
					1,1,1,1,1,
					2,2,2,2,2,
					1,1,1,1,1];
	}
});

var Exit = enchant.Class(enchant.Entity, {
	initialize: function(from, to, x, y){
		enchant.Entity.call(this, 32, 32);
		//this.image = game.assets['res/enemy.png'];
		this.x = x;
		this.y = y;
		this.width = 32;
		this.height = 32;
		this.from = from;
		this.to = to;
	}
});

var Particle = enchant.Class(enchant.Sprite, {
	initialize: function(image,width,height,x,y){
  		enchant.Sprite.call(this, width, height);
		this.image = game.assets[image];
		this.x = x;
		this.y = y;
		this.velX = Math.floor(Math.random()*6)+2;
		this.velY = Math.floor(Math.random()*6)+2;
		this.scaleX = 0.5;
		this.scaleY = 0.5;
		this.end = false;

		var sign = Math.floor(Math.random()*2)+1;
		if(sign == 1)
			this.velX *= -1;
		sign = Math.floor(Math.random()*2)+1;
		if(sign == 1)
			this.velY *= -1;
 	},
 	tick: function(){
 		this.x += this.velX;
 		this.y += this.velY;

 		if(!this.end){
 			if(Math.abs(this.velX) <= 0.2 && Math.abs(this.velY) <= 0.2)
 				this.end = true;
 			if(this.velX > 0)
 				this.velX -= 0.2;
 			else
 				this.velX += 0.2;
 			if(this.velY > 0)
 				this.velY -= 0.2;
 			else
 				this.velY += 0.2;
 		}else{
 			var dx = player.x-this.x;
			var dy = player.y-this.y;
			var angle = Math.atan2(dy,dx);
			this.velX = Math.cos(angle)*15;
			this.velY = Math.sin(angle)*15;
			if(this.x-player.x < 5 && this.y-player.y < 5){
				group[4].removeChild(this);
				game.energyRec.play();
			}
 		}
 	}
});