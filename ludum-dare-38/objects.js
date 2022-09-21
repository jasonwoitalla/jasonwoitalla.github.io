var Player = enchant.Class(enchant.Sprite, {
	initialize: function(){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/player.png'];
		this.x = 50;
		this.y = 50;
		this.velX = 0;
		this.velY = 0;
		this.gravity = -1;
		this.isGrounded = false;
		this.jumpHeight = -20;
		this.speed = 10;
		this.facing = 1;
		this.canBomb = true;
		this.bombType = 1;
		this.maxHealth = 3;
		this.curHealth = 3;
		this.canDamage = true;
		this.timeout = 0;
		this.bLvl = 1;
		this.mLvl = 1;
		this.canGravType = true;
	},
	update: function(){
		this.x += this.velX;
		this.y += this.velY;

		if(!this.isGrounded)
			this.velY -= this.gravity*gravType;

		if(this.y > 480-32-16 && gravType > 0){
			this.y = 480-32-16;
			this.velY = 0;
			this.isGrounded = true;
			canGravType = true;
		}else if(this.y < 16 && gravType < 0){
			this.y = 16;
			this.velY = 0;
			this.isGrounded = true;
			canGravType = true;
		}
		
		//Input
		if(game.input.left){
			this.velX = -this.speed;
			this.facing = -1;
			this.scaleX = -1;
			if(gravType === -1)
				this.scaleX = 1;
		}else if(game.input.right){
			this.velX = this.speed;
			this.facing = 1;
			this.scaleX = 1;
			if(gravType === -1)
				this.scaleX = -1;
		}else
			this.velX = 0;

		if(getJump() && this.isGrounded){
			this.velY = this.jumpHeight*gravType;
			this.isGrounded = false;
			canUp = false;
			game.jumpSound.play();
		}else if(getJump() && !this.isGrounded && this.velY > 1*gravType && canUp && canGravType){
			gravType *= -1;
			canUp = false;
			canGravType = false;
			if(this.rotation === 0){
				this.tl.rotateTo(180, fps*0.3);
				uiGroup.tl.moveTo(5, 400, fps*0.3);
			}else{
				this.tl.rotateTo(0, fps*0.3);
				uiGroup.tl.moveTo(5, 10, fps*0.3);
			}
			game.jumpSound.play();
		}

		if(!getJump())
			canUp = true;

		if(game.input.a && this.canBomb && canLaunch){
			if(this.bombType === 1){
				var temp = new Bomb(this.x, this.y, this.facing, this.bombType);
				bombGroup.addChild(temp);
				if(this.bLvl >= 5){
					temp = new Bomb(this.x, this.y, -this.facing, this.bombType);
					bombGroup.addChild(temp);
				}
				canLaunch = false;
			}else if(this.bombType === -1){
				var temp = new Bomb(this.x, this.y, this.facing, this.bombType);
				bombGroup.addChild(temp);
				temp = new Bomb(this.x, this.y+16, this.facing, this.bombType);
				bombGroup.addChild(temp);
				canLaunch = false;
			}
			this.canBomb = false;
		}else if(!game.input.a)
			this.canBomb = true;

		if(game.input.b && canZ){
			this.bombType *= -1;
			canZ = false;
			if(this.bombType > 0){
				bombIco.image = game.assets['res/selected.png'];
				missileIco.image = game.assets['res/unselected.png'];
				maxBombTime = bombMax;
			}else if(this.bombType < 0){
				bombIco.image = game.assets['res/unselected.png'];
				missileIco.image = game.assets['res/selected.png'];
				maxBombTime = missileMax;
			}
			game.switchSound.play();
		}
		if(!game.input.b && !canZ)
			canZ = true;

		if(this.x >= 840)
			this.x = -32;
		else if(this.x < -200)
			this.x = 640-32
	},
	damage: function(){
		if(!this.canDamage)
			return;
		this.curHealth--;
		this.canDamage = false;
		updateHealthBar();
		if(this.curHealth <= 0)
			this.death();
		game.hurtSound.play();
		this.opacity = 0.5;
		ground.tl.delay(fps*3).then(function(){
			player.canDamage = true;
			player.opacity = 1;
		});
	},
	death: function(){
		isGameover = true;
		mainGame.addChild(gameOver);
	}
});

var canUp = true, canZ = true;
function getJump(){
	if(gravType > 0)
		return game.input.up;
	else
		return game.input.down;
}

var Bomb = enchant.Class(enchant.Sprite, {
	initialize: function(x, y, facing, type){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/bomb.png'];
		this.x = x;
		this.y = y;
		this.facing = facing;
		this.gravType = gravType;
		this.velY = -15*this.gravType;
		this.gravity = 1.5;
		this.speed = 9;
		this.speedBoost = 1;
		this.type = type;
		if(type === -1){
			this.image = game.assets['res/missile.png'];
			this.velY = 0;
			this.speedBoost = 2;
		}else if((gravType === 1 && player.velY < 0) || (gravType === -1 && player.velY > 0)){
			this.velY *= -1;
			this.gravType *= -1;
		}
		if(this.facing < 0)
			this.rotation = 180;
		else
			this.rotation = 0;
	},
	update: function(){
		this.x += this.speed*this.facing*this.speedBoost;
		this.y += this.velY;
		switch(this.type){
			case 1:
			this.velY += this.gravity*this.gravType;
			if(this.y > 480-16){//Remove bomb
				this.y = 480-16;
				this.death();
			}else if(this.y < -16){
				this.y = -16;
				this.death();
			}
			break;
			case -1:
				if(this.x < -32 || this.x > 640+32)//Remove bomb
					this.death();
			break;
		}
	},
	death: function(){
		var temp = new Explosion(this.x, this.y+(-32*this.gravType));
		explosionGroup.addChild(temp);
		bombGroup.removeChild(this);
		game.explosionSound.play();
	}
});

var Enemy = enchant.Class(enchant.Sprite, {
	initialize: function(dir, x, top){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/enemy.png'];
		this.x = x;
		if(top === 1)
			this.y = 480-32-16;
		else{
			this.y = 16;
			this.rotation = 180;
		}
		this.speed = 7;
		this.dir = dir;
		this.scaleX *= dir;
		if(top !== 1)
			this.scaleX *= -1;
		this.curHealth = 1;
		this.canDamage = true;
		this.timeout = 0;
	},
	update: function(){
		this.x += this.speed*this.dir;
		if(this.x < -32 || this.x > 640+32)
			this.death();
		
		if(!this.canDamage){
			this.timeout++;
			if(this.timeout >= fps){
				this.timeout = 0;
				this.canDamage = true;
			}
		}

	},
	damage: function(){
		if(!this.canDamage)
			return;
		this.canDamage = false;
		this.curHealth--;
		if(this.curHealth <= 0){
			this.death();
			score++;
		}
	},
	death: function(){
		enemyGroup.removeChild(this);
		updateScore();
	}
});

var Explosion = enchant.Class(enchant.Sprite, {
	initialize: function(x, y){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/explosion.png'];
		this.x = x;
		this.y = y;
		this.timeout = 0;
	}
});

var KillButton = enchant.Class(enchant.Sprite, {
	initialize: function(dir, x, top){
		enchant.Sprite.call(this, 32, 32);
		this.image = game.assets['res/kill.png'];
		this.x = x;
		if(top === 1)
			this.y = 480-32-16;
		else{
			this.y = 16;
			this.rotation = 180;
		}
		this.speed = 5;
		this.dir = dir;
		this.scaleX *= dir;
		if(top !== 1)
			this.scaleX *= -1;
		this.tl.scaleTo(1.5, 1.5, fps).scaleTo(1, 1, fps).loop();
	},
	update: function(){
		this.x += this.speed*this.dir;
		if(this.x < 0 || this.x > 640)
			killGroup.removeChild(this);
	}
});