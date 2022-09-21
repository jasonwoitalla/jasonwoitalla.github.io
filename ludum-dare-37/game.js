var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var width = 640, height = 480;
var fps = 60, load = false;
var frames, totalFrames = 0;

//Groups
var npcGroup = [];//NPC Group
var emyGroup = [];//Enemy Group

//Aesthetic Groups
var moving = [], nonmoving = [];
var plantGroup = [];

//Public Variables
var collidingWith = -1;
var canMove = true;
var drawAttack = false, attackLeft = 10;
var timeLeft;
var bg = new Image();
var foodLeft = 5;
var plant = new Image(), plant_done = new Image(), blank = new Image();
var swinging = false;
var sword = new Image(), drawSword = false;
var facing = 0, inPatch = 0;
var enemiesAlive = false
var createdNPC = false, firstAttack = true;
var damaged = false;
var startMenu = true, title = new Image();

//Polish
var happyLoss = new Image();
var happyIndex = -1;

//UI
var uiRing = false, ringImg = new Image();
var uiIndex = 1, actionIndex = 1;
var actionMenu = false, actMen = new Image();
var actionSelect = new Image(), removeSelect = new Image(), statsSelect = new Image(), classSelect = new Image();
var feedSelect = new Image(), helpSelect = new Image(), actSelect = new Image();
var drawRemove = false;
var removeBg = new Image(), removeBox = new Image(), removeIndex = 1;
var removeYes = new Image(), removeNo = new Image();
var statWin = new Image(), youWin = new Image();

//Panning
var panning = false;
var panToX = 0;
var finishedPan = false, panIndex = 0;

//Farming
var farmland = [false, false, false, false, false, false, false, false, false, false, false, false];

//Tutorial
var inTut = true, tutIndex = 1, hadAttack = false, firstKnight = false;
var tut1 = new Image(), tut2 = new Image(), tut3 = new Image(), tut4 = new Image(), tut5 = new Image(), tut6 = new Image();

//Messages
var noWork = new Image(), noFood = new Image(), menuUsage = new Image(), tutMess = new Image(), knightMess = new Image(), tutTalk = new Image(), rMessage = new Image();
var message = new Image();

window.onload = function(){
	create();
}

function create()//Init Function
{
	load = true;
	title.src = "res/title.png";
	player.image.src = "res/player.png";
	ringImg.src = "res/ui_ring.png";
	actMen.src = "res/action_menu.png";
	actionSelect.src = "res/action_select.png";
	removeSelect.src = "res/remove_select.png";
	statsSelect.src = "res/stats_select.png";
	classSelect.src = "res/class_select.png";
	bg.src = "res/temp_grass.png";
	plant.src = "res/plant.png";
	plant_done.src = "res/ready_plant.png";
	removeBg.src = "res/removeBg.png";
	removeBox.src = "res/removeBox.png";
	removeYes.src = "res/yes.png";
	removeNo.src = "res/No.png";
	sword.src = "res/sword.png";
	blank.src = "res/blank.png";

	tut1.src = "res/tutorial_1.png";
	tut2.src = "res/tutorial_2.png";
	tut3.src = "res/tutorial_3.png";
	tut4.src = "res/tutorial_4.png";
	tut5.src = "res/tutorial_5.png";
	tut6.src = "res/tutorial_6.png";

	feedSelect.src = "res/feed_select.png";
	helpSelect.src = "res/help_select.png";
	actSelect.src = "res/act_select.png";
	statWin.src = "res/stat_window.png";
	youWin.src = "res/you_win.png";

	noWork.src = "res/no_work.png";
	noFood.src = "res/no_food.png";
	menuUsage.src = "res/menu_usage.png";
	tutMess.src = "res/tut_message.png";
	knightMess.src = "res/knight_message.png";
	tutTalk.src = "res/tut_talkMessage.png";
	rMessage.src = "res/plant_message.png";
	message = menuUsage;

	happyLoss.src = "res/happy_loss.png";

	//npcManager.newNPC();//Starts NPC cycle
	//npcManager.waitToMove();//Moves npcs around
	//setTimeout(npcManager.checkAttack, 1);
	waitPlant();

	document.getElementById("music").loop = true;
}

function update()//Updates every frame
{
	keyInput();//Performs actions from key inputs

	player.update();//Players Update Function
	camera.update();//Updates our camera

	enemyUpdate();
	farmerUpdate();
	knightUpdate();

	if(inTut)
		tutUpdate();

	if(emyGroup.length == 0 && enemiesAlive)
	{
		enemiesAlive = false;
		winRender = true;
		setTimeout(function()
		{
			winRender = false;
			textX = -640;
		}, 10000);
	}

	//console.log("VelX: " + npcGroup[0].velX + " VelY: " + npcGroup[0].velY + " Can Move: " + npcGroup[0].canMove + " Move To X: " + npcGroup[0].moveTo.x + " Move To Y: " + npcGroup[0].moveTo.y);

	for(var i = 0; i < moving.length; i++)
	{
		if(moving[i].acting || !moving[i].canMove)
			return;

		if(moving[i].canMove)
			if(moving[i].velX != 0 || moving[i].velY != 0)//There is movement with this npc
			{
				if(moving[i].moveTo.x != 0 && moving[i].moveTo.y != 0)
					moving[i].move();
				else
				{
					nonmoving.push(moving[i]);
					moving.splice(i, 1);
				}
			}

		if(distance(moving[i], moving[i].moveTo) >= 5 && moving[i].canMove)
		{
			var dx = moving[i].moveTo.x - moving[i].x;
			var dy = moving[i].moveTo.y - moving[i].y;
			var angle = Math.atan2(dy, dx);//Angle of approach
			moving[i].velX = moving[i].speed*Math.cos(angle);//Gets Horizontal velocity
			moving[i].velY = moving[i].speed*Math.sin(angle);//Gets vertical velocity
		}
		else if(!(distance(moving[i], moving[i].moveTo) >= 5) && moving[i].canMove)
		{
			//console.log("You've arrived! " + moveTo[i].canMove);
			moving[i].velX = 0//Gets Horizontal velocity
			moving[i].velY = 0//Gets vertical velocity

			moving[i].moveTo.x = 0;
			moving[i].moveTo.y = 0;

			nonmoving.push(moving[i]);
			moving.splice(i, 1);
		}
	}
}

function enemyUpdate()
{
	//Enemy Update
	for(var i = 0; i < emyGroup.length; i++)
	{
		if(drawSword)//Sword is out
		{
			switch(facing)
			{
				case 1:
				//ctx.drawImage(sword, player.x, player.y+32, -52, 12);
					if(emyGroup[i].x >= player.x-52 && emyGroup[i].x <= player.x)
					{
						if(emyGroup[i].y <= player.y+64 && emyGroup[i].y+emyGroup[i].height >= player.y)
						{
							if(!damaged)
							{
								emyGroup[i].damage(2);
								damaged = true;
							}
						}
					}
				break;
				case 2:
				if(emyGroup[i].x >= player.x+50 && emyGroup[i].x <= player.x+102)
					{
						if(emyGroup[i].y <= player.y+64 && emyGroup[i].y+emyGroup[i].height >= player.y)
						{
							if(!damaged)
							{
								emyGroup[i].damage(2);
								damaged = true;
							}
						}
					}
				break;
				case 3:
					//ctx.drawImage(sword, player.x, player.y+32, -52, 12);
					if(emyGroup[i].x >= player.x-52 && emyGroup[i].x <= player.x)
					{
						if(emyGroup[i].y <= player.y+64 && emyGroup[i].y+emyGroup[i].height >= player.y)
						{
							if(!damaged)
							{
								emyGroup[i].damage(2);
								damaged = true;
							}
						}
					}
				break;
				case 4:
					if(emyGroup[i].x >= player.x+50 && emyGroup[i].x <= player.x+102)
					{
						if(emyGroup[i].y <= player.y+64 && emyGroup[i].y+emyGroup[i].height >= player.y)
						{
							if(!damaged)
							{
								emyGroup[i].damage(2);
								damaged = true;
							}
						}
					}
				break;
			}
		}

		if(emyGroup[i].velX != 0 || emyGroup[i].velY != 0)//There is movement with this enemy
		{
			emyGroup[i].move();
		}

		if(emyGroup[i].target != -1 && npcGroup[emyGroup[i].target] != null)//Pursue target
		{
			if(distance(emyGroup[i], npcGroup[emyGroup[i].target]) >= 60)
			{
				var dx = npcGroup[emyGroup[i].target].x - emyGroup[i].x;
				var dy = npcGroup[emyGroup[i].target].y - emyGroup[i].y;
				var angle = Math.atan2(dy, dx);//Angle of approach
				emyGroup[i].velX = emyGroup[i].speed*Math.cos(angle);//Gets Horizontal velocity
				emyGroup[i].velY = emyGroup[i].speed*Math.sin(angle);//Gets vertical velocity
			}
			else
			{
				emyGroup[i].velX = 0//Gets Horizontal velocity
				emyGroup[i].velY = 0//Gets vertical velocity
				emyGroup[i].attack();
			}
		}
		else//Find a target
		{
			if(npcGroup[i%npcGroup.length] != null)//Attack!
			{
				emyGroup[i].target = i%npcGroup.length;
			}
		}
	}
}

function knightUpdate()
{
	//Knight Update
	if(emyGroup.length > 0)//There are enemies
	{
		for(var i = 0; i < npcGroup.length; i++)
		{
			if(npcGroup[i].ocupation == 1)//They are a knight
			{
				npcGroup[i].canMove = false;
				if(emyGroup[i%emyGroup.length] != null)//Attack!
				{
					npcGroup[i].target = i%emyGroup.length;
				}

				if(npcGroup[i].velX != 0 || npcGroup[i].velY != 0)//There is movement with this enemy
				{
					npcGroup[i].move();
				}

				if(npcGroup[i].target != -1)//Pursue target
				{
					if(distance(npcGroup[i], emyGroup[npcGroup[i].target]) >= 40)
					{
						var dx = emyGroup[npcGroup[i].target].x - npcGroup[i].x;
						var dy = emyGroup[npcGroup[i].target].y - npcGroup[i].y;
						var angle = Math.atan2(dy, dx);//Angle of approach
						npcGroup[i].velX = npcGroup[i].speed*Math.cos(angle);//Gets Horizontal velocity
						npcGroup[i].velY = npcGroup[i].speed*Math.sin(angle);//Gets vertical velocity
					}
					else
					{
						npcGroup[i].velX = 0//Gets Horizontal velocity
						npcGroup[i].velY = 0//Gets vertical velocity
						npcGroup[i].attack();
					}
				}
			}
		}
	}
	else
	{
		for(var i = 0; i < npcGroup.length; i++)
		{
			if(npcGroup[i].ocupation == 1)
				npcGroup[i].canMove = true;
		}
	}

}

function farmerUpdate()
{
	for(var i = 0; i < npcGroup.length; i++)
	{
		if(npcGroup[i].ocupation == 3)//Farmer
		{
			if(npcGroup[i].target != -1)//We are acting
			{
				//Movment
				if(npcGroup[i].velX != 0 || npcGroup[i].velY != 0)//There is movement with this enemy
				{
					if(npcGroup[i].moveTo.x != 0 && npcGroup[i].moveTo.y != 0)
						npcGroup[i].move();
				}

				//Target Hunting
				if(distance(npcGroup[i], npcGroup[i].moveTo) >= 5)
				{
					var dx = npcGroup[i].moveTo.x - npcGroup[i].x;
					var dy = npcGroup[i].moveTo.y - npcGroup[i].y;
					var angle = Math.atan2(dy, dx);//Angle of approach
					npcGroup[i].velX = npcGroup[i].speed*Math.cos(angle);//Gets Horizontal velocity
					npcGroup[i].velY = npcGroup[i].speed*Math.sin(angle);//Gets vertical velocity
				}
				else
				{
					npcGroup[i].velX = 0//Gets Horizontal velocity
					npcGroup[i].velY = 0//Gets vertical velocity
					npcGroup[i].farm();
					if(inTut && tutIndex == 3)
					{
						player.velX = 0;
						player.velY = 0;
						player.x = 700;
						tutIndex++;
						canMove = false;
					}
				}
			}
		}
	}
}

function tutUpdate()
{
	switch(tutIndex)
	{
		case 1:
			canMove = false;
			if(pushed(13))
			{
				tutIndex++;
				var temp = clone(npc);
				temp.x = 320;
				temp.y = 240;
				temp.image = new Image();
				temp.image.src = "res/knight_brown.png";
				temp.ocupation = 3;
				temp.strength = 3;
				npcGroup.push(temp);
				document.getElementById("menuSelect").play();
			}
		break;
		case 2:
			canMove = false;
			if(pushed(13))
			{
				tutIndex++;
				canMove = true;
				document.getElementById("menuSelect").play();
			}
		break;
		case 4:
			if(pushed(13))
			{
				tutIndex++;
				canMove = true;
				document.getElementById("menuSelect").play();
			}
		break;
		case 5:
			canMove = false;
			if(pushed(13))
			{
				tutIndex++;
				canMove = true;
				endTut();
				document.getElementById("menuSelect").play();
			}
		break;
		case 6:
			canMove = false;
			if(pushed(13))
			{
				tutIndex++;
				canMove = true;
				inTut = false;
				document.getElementById("menuSelect").play();
			}
		break;
	}
}

function endTut()
{
	console.log("End Tut");
	inTut = false;
	canMove = true;
	npcManager.newNPC();//Starts NPC cycle
	npcManager.waitToMove();//Moves npcs around
	setTimeout(npcManager.checkAttack, 36000);
	waitHunger();
}

function waitPlant()
{
	setTimeout(function(){
		growPlants();
		waitPlant();
	}, 30000);
}

function growPlants()
{
	for(var i = 0; i < plantGroup.length; i++)
	{
		console.log("Checking plant " + plantGroup[i].src);
		if(!plantGroup[i].src.includes("ready_plant") && !plantGroup[i].src.includes("blank.png"))//Plant is not done
			plantGroup[i] = plant_done;
	}
}

function waitHunger()
{
	setTimeout(function()
	{
		decreaseHunger();
		waitHunger();
	}, 30000);
}

function decreaseHunger()
{
	var index = Math.random()*(npcGroup.length-0)+0;
	if(npcGroup.length == 1)
		index = 0;
	npcGroup[index].happiness--;
	happyIndex = index;

	if(npcGroup[index].happiness <= 0)//We are not happy...
	{
		if(npcGroup[index].ocupation == 1)
		{
			npcGroup[index].ocupation = 3;
			emyGroup.push(npcGroup[index]);
			npcGroup.splice(index, 1);
		}
	}

	setTimeout(function(){
		happyIndex = -1;
	}, 3000);
}

function render()//Renders things on the screen
{
	ctx.clearRect(0, 0, width, height);//Clears each frame

	ctx.translate(camera.x, camera.y);//Camera after this point

	ctx.drawImage(bg, 0, 0);//Draws background

	for(var i = 0; i < plantGroup.length; i++)
	{
		ctx.drawImage(plantGroup[i], findLand(i)[0], findLand(i)[1]);
	}

	ctx.drawImage(player.image, player.x, player.y, 64, 64);//Draws the player on the screen
	if(drawSword)
		showSword();

	for(var i = 0; i < npcGroup.length; i++)
	{
		if(npcGroup[i].curHlth < npcGroup[i].maxHlth)
		{
			ctx.fillStyle = "#000000";
			ctx.fillRect(npcGroup[i].x, npcGroup[i].y-7, 64, 5);
			ctx.fillStyle = "#0000FF";
			ctx.fillRect(npcGroup[i].x, npcGroup[i].y-7, npcGroup[i].curHlth/npcGroup[i].maxHlth*64, 5);
		}

		if(npcGroup[i].ocupation == 3 && npcGroup[i].waitFrames > 0)//Farmer
		{
			ctx.fillStyle = "#000000";
			ctx.fillRect(npcGroup[i].x, npcGroup[i].y+64+7, 64, 5);
			ctx.fillStyle = "#FF00FF";
			ctx.fillRect(npcGroup[i].x, npcGroup[i].y+64+7, (npcGroup[i].waitFrames/(60*60))*64, 5);
		}

		if(happyIndex == i)
			ctx.drawImage(happyLoss, npcGroup[i].x, npcGroup[i].y-33);

		ctx.drawImage(npcGroup[i].image, npcGroup[i].x, npcGroup[i].y, 64, 64);
	}

	for(var i = 0; i < emyGroup.length; i++)
	{
		if(emyGroup[i].curHlth < emyGroup[i].maxHlth)
		{
			ctx.fillStyle = "#000000";
			ctx.fillRect(emyGroup[i].x, emyGroup[i].y-7, 64, 5);
			ctx.fillStyle = "#0000FF";
			ctx.fillRect(emyGroup[i].x, emyGroup[i].y-7, emyGroup[i].curHlth/emyGroup[i].maxHlth*64, 5);
		}

		ctx.drawImage(emyGroup[i].image, emyGroup[i].x, emyGroup[i].y, 64, 64);
	}

	if(uiRing && collidingWith != -1)
	{
		var uiX = npcGroup[collidingWith].x-250/2+32;
		var uiY = npcGroup[collidingWith].y-250/2+32;
		if(uiX < 2)
			uiX = 2;
		if(uiX+250 > 1918)
			uiX = 1918-250;
		if(uiY < 2)
			uiY = 2;
		if(uiY+250 > 478)
			uiY = 478-250;

		if(actionMenu)
		{
			ctx.drawImage(actMen, uiX+135, uiY);//Action Menu
			switch(actionIndex)//Action Selectors
			{
				case 1:
					ctx.drawImage(feedSelect, uiX+135, uiY);
				break;
				case 2:
					ctx.drawImage(helpSelect, uiX+135, uiY);
				break;
				case 3:
					ctx.drawImage(actSelect, uiX+135, uiY);
				break;
			}
		}
		//Draw Stats
		ctx.drawImage(statWin, uiX-52, uiY+250/2);//Stat Background
		ctx.font = "15px Arial";
		ctx.fillStyle = "#000000";
		if(npcGroup[collidingWith].ocupation == 1)
			ctx.fillText("Knight", uiX-47, uiY+250-45);
		else if(npcGroup[collidingWith].ocupation == 3)
			ctx.fillText("Farmer", uiX-47, uiY+250-45);
		ctx.fillText("Level: " + npcGroup[collidingWith].strength, uiX-47, uiY+250-25);
		ctx.fillText("Happ.: " + npcGroup[collidingWith].happiness, uiX-47, uiY+250-5);

		ctx.drawImage(ringImg, uiX, uiY);//Renders UI Ring
		switch(uiIndex)//Selectors
		{
			case 1:
				ctx.drawImage(actionSelect, uiX, uiY);
			break;
			case 2:
				ctx.drawImage(removeSelect, uiX, uiY);
			break;
			case 3:
				ctx.drawImage(statsSelect, uiX, uiY);
			break;
			case 4:
				ctx.drawImage(classSelect, uiX, uiY);
			break;
		}
	}

	ctx.translate(-camera.x, -camera.y);//No Camera

	//UI
	ctx.font = "20px Arial";
	ctx.fillStyle = "#000000";
	if(!inTut)
	{
		ctx.fillText("New NPC: " + timeLeft, 490, 460);
		//ctx.fillText("FPS: " + totalFrames, 0, 460);
		ctx.fillText("Food: " + foodLeft, 10, 85);
		ctx.fillText("NPC's: " + npcGroup.length, 10, 105);
	}

	//Attack
	if(drawAttack)
	{
		ctx.fillStyle = "#FF0000";
		ctx.fillText("ATTACK INBOUND: " + attackLeft, 415, 440);
		if(!hadAttack)
			ctx.drawImage(tut5, 10, 480-115);
	}

	if(drawRemove)
	{
		ctx.drawImage(removeBox, 0, 0);
		ctx.drawImage(removeBg, 0, 0); 
		ctx.drawImage(removeYes, 310, 248);
		ctx.drawImage(removeNo, 415, 248);
	}

	if(inTut)//Tutorial GUI
	{
		if(tutIndex == 1)
			ctx.drawImage(tut1, 10, 480-170);
		else if(tutIndex == 2)
			ctx.drawImage(tut2, 10, 480-170);
		else if(tutIndex == 3)
			ctx.drawImage(tutTalk, 320-150, 480-50);
		else if(tutIndex == 4)
			ctx.drawImage(tut3, 10, 480-170);
		else if(tutIndex == 5)
			ctx.drawImage(tut4, 10, 480-170);
		else if(tutIndex == 6)
			ctx.drawImage(tut6, 10, 480-170);
	}

	if(uiRing)
	{
		ctx.drawImage(message, 170, 430);
	}

	if(ripeMessage)
		ctx.drawImage(rMessage, 170, 430);

	if(winRender)
		renderWin();

	if(startMenu)
		ctx.drawImage(title, 0, 0);
}

var winRender = false;
var rectHeight = 0, maxRect = 100, textX = -640;
function renderWin()
{
	rectHeight += maxRect/60*3;

	if(rectHeight > maxRect)
		rectHeight = maxRect;

	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 480/2-50, 640, rectHeight);

	if(rectHeight == maxRect)//Scroll Text
	{
		textX += 2;
		if(textX > 640)
			textX = 640;
		ctx.drawImage(youWin, textX, 480/2-50);
	}
}

function keyInput()
{
	if(startMenu)
	{
		if(pushed(13))
			startMenu = false;
	}

	if(startMenu)
		return;

	if(inTut && pushed(81))
	{
		endTut();
		document.getElementById("menuSelect").play();
	}

	if(canMove)
	{
		if(keys[38])//Up Button
		{
			player.velY = -player.speed;
			facing = 1;
		}
		else if(keys[40])//Down Button
		{
			player.velY = player.speed;
			facing = 2;
		}
		else
			player.velY = 0;
		
		if(keys[37])//Left Button
		{
			player.velX = -player.speed;
			facing = 3;
		}
		else if(keys[39])//Right Button
		{
			player.velX = player.speed;
			facing = 4;
		}
		else
			player.velX = 0;

		if(pushed(88) && !swinging)
		{
			swinging = true;
			swing();
		}
	}
	else if(uiRing)//UI Ring Present
	{
		if(!actionMenu && !drawRemove)
		{
			if(pushed(37))//Left Button
			{
				uiIndex--;
				document.getElementById("menuSelect").play();
			}
			else if(pushed(39))//Right Button
			{
				uiIndex++;
				document.getElementById("menuSelect").play();
			}
			else if(pushed(32))//Space bar
			{
				console.log("You selected: " + uiIndex);
				if(uiIndex == 1)//Action Menu
				{
					actionMenu = true;
					document.getElementById("enter").play();
				}
				else if(uiIndex == 2)//Remove
				{
					if(inTut && tutIndex == 3)//We are in the tut
					{
						message = tutMess;
					}else
						drawRemove = true;
					document.getElementById("enter").play();
				}
				else if(uiIndex == 4)//Class
				{
					if(inTut && tutIndex == 3)//We are in the tut
					{
						message = tutMess;
					}else
					{
						npcGroup[collidingWith].strength = 1;
						if(npcGroup[collidingWith].ocupation == 1)
							npcGroup[collidingWith].ocupation = 3;
						else if(npcGroup[collidingWith].ocupation == 3)
							npcGroup[collidingWith].ocupation = 1;
						//Image Setting
						if(npcGroup[collidingWith].ocupation == 1)
							npcGroup[collidingWith].image.src = "res/knight_blue.png";//TODO Make random npc image
						else
							npcGroup[collidingWith].image.src = "res/knight_brown.png";//TODO Make random npc image
						uiRing = false;
						actionMenu = false;
						drawRemove = false;
						actionIndex = 1;
						canMove = true;
						npcGroup[collidingWith].velX = 0;//Enables movement
						npcGroup[collidingWith].velY = 0;//Enables movement
						npcGroup[collidingWith].moveTo.x = npcGroup[collidingWith].x;//Enables movement
						npcGroup[collidingWith].moveTo.y = npcGroup[collidingWith].y;//Enables movement
						npcGroup[collidingWith].canMove = true;//Enables movement
						npcGroup[collidingWith].acting = false;
						var index = moving.indexOf(npcGroup[collidingWith]);
						nonmoving.push(npcGroup[collidingWith]);
						moving.splice(index, 1);
					}
					document.getElementById("class").play();
				}
			}

			if(uiIndex > 4)
				uiIndex = 1;

			if(uiIndex < 1)
				uiIndex = 4;
		}
		else if(actionMenu)//Action Index
		{
			if(pushed(38))//Up Button
			{
				actionIndex--;
				document.getElementById("menuSelect").play();
			}
			else if(pushed(40))//Down Button
			{
				actionIndex++;
				document.getElementById("menuSelect").play();
			}else if(pushed(32))//Space Bar
			{
				if(actionIndex == 1)//Feed
				{
					if(inTut && tutIndex == 3)//We are in the tut
					{
						message = tutMess;
					}else
					{
						if(foodLeft > 0)//TODO give player no food message
							npcGroup[collidingWith].giveFood();
						else
							message = noFood;
					}
					document.getElementById("enter").play();
				}
				else if(actionIndex == 2)//Help
				{
					if(inTut && tutIndex == 3)//We are in the tut
					{
						message = tutMess;
					}
					document.getElementById("enter").play();
				}
				else if(actionIndex == 3)//Act
				{
					actionMenu = false;
					uiRing = false;
					canMove = true;
					var index = moving.indexOf(npcGroup[collidingWith]);
					nonmoving.push(npcGroup[collidingWith]);
					moving.splice(index, 1);
					npcGroup[collidingWith].act();
					document.getElementById("enter").play();
				}
			}

			if(actionIndex > 3)
				actionIndex = 1;

			if(actionIndex < 1)
				actionIndex = 3;
		}else if(drawRemove)
		{
			if(pushed(37))//Left Button
			{
				removeIndex--;
				document.getElementById("menuSelect").play();
			}
			else if(pushed(39))//Right Button
			{
				removeIndex++;
				document.getElementById("menuSelect").play();
			}
			else if(pushed(32))
			{
				if(removeIndex == 1)//yes
				{
					npcGroup.splice(collidingWith, 1);
					uiRing = false;
					actionMenu = false;
					drawRemove = false;
					actionIndex = 1;
					canMove = true;
				}
				drawRemove = false;
				document.getElementById("enter").play();
			}

			if(removeIndex > 2)
				removeIndex = 1;

			if(removeIndex < 1)
				removeIndex = 2;

			if(removeIndex == 1)
			{
				removeYes.src = "res/yes_selected.png";
				removeNo.src = "res/No_selected.png";
			}else
			{
				removeYes.src = "res/yes.png";
				removeNo.src = "res/No.png";
			}
		}
	}

	if(collidingWith != -1 && pushed(32))//Colliding with NPC and space is pressed
	{
		if(!firstKnight && npcGroup[collidingWith].ocupation == 1)
		{
			firstKnight = true;
			inTut = true;
			tutIndex = 6;
		}

		uiRing = true;
		message = menuUsage;
		canMove = false;
		player.velX = 0;
		player.velY = 0;
		npcGroup[collidingWith].canMove = false;
		npcGroup[collidingWith].velX = 0;
		npcGroup[collidingWith].velY = 0;
		npcGroup[collidingWith].moveTo = clone(vec2);
		var index = nonmoving.indexOf(npcGroup[collidingWith]);
		if(index > -1)
		{
			moving.push(npcGroup[collidingWith]);
			nonmoving.splice(index, 1);
		}
		document.getElementById("enter").play();
	}

	if(uiRing && keys[27])//Escape button with UI ring up
	{
		uiRing = false;
		actionMenu = false;
		drawRemove = false;
		actionIndex = 1;
		canMove = true;
		npcGroup[collidingWith].velX = 0;//Enables movement
		npcGroup[collidingWith].velY = 0;//Enables movement
		npcGroup[collidingWith].moveTo.x = npcGroup[collidingWith].x;//Enables movement
		npcGroup[collidingWith].moveTo.y = npcGroup[collidingWith].y;//Enables movement
		npcGroup[collidingWith].canMove = true;//Enables movement
		var index = moving.indexOf(npcGroup[collidingWith]);
		nonmoving.push(npcGroup[collidingWith]);
		moving.splice(index, 1);
		document.getElementById("escape").play();
	}

	if(pushed(32) && inPatch != 0)//Pick up a crop
	{
		if(plantGroup[inPatch-1].src.includes("ready_plant"))//We can pick up this plant
		{
			foodLeft++;
			plantGroup[inPatch-1] = blank;
			farmland[inPatch-1] = false;
			document.getElementById("plant").play();
		}else
		{
			showRipeMessage();
		}
	}
}

function swing()
{
	drawSword = true;
	damaged = false;
	setTimeout(function()
	{
		drawSword = false;
		swinging = false;
	}, 1000);
}

function showSword()
{
	switch(facing)
	{
		case 1:
			ctx.drawImage(sword, player.x, player.y+32, -52, 12);
		break;
		case 2:
			ctx.drawImage(sword, player.x+50, player.y+32, 52, 12);
		break;
		case 3:
			ctx.drawImage(sword, player.x, player.y+32, -52, 12);
		break;
		case 4:
			ctx.drawImage(sword, player.x+50, player.y+32, 52, 12);
		break;
	}
}

var ripeMessage = false;
function showRipeMessage()
{
	ripeMessage = true;
	setTimeout(function()
	{
		ripeMessage = false;
	}, 3000);
}

function getLand()
{
	for(var i = 0; i < farmland.length; i++)
	{
		if(!farmland[i])
		{
			farmland[i] = true;
			return i;
		}

	}
}

function findLand(value)//Retruns coords for land pos
{
	var x = 820;
	var y = 70;	

	//X Coord
	if(value == 4 || value == 5 || value == 6 || value == 7)
		x = 884;
	else if(value == 8 || value == 9 || value == 10 || value == 11)
		x = 948;

	//Y Coord
	if(value == 1 || value == 5 || value == 9)
		y = 70+64;
	else if(value == 2 || value == 6 || value == 10)
		y = 70+64*2;
	else if(value == 3 || value == 7 || value == 11)
		y = 70+64*3;

	var coords = [x, y];
	return coords;
}

setInterval(function(){
	if(load)
	{
		frames++;
		render();
		update();
	}
}, 1000/fps);

//Time Visual
setInterval(function(){
	if(!inTut)
		if(timeLeft > 0)
			timeLeft --;

	if(attackLeft > 0)
		attackLeft --;

	totalFrames = frames;
	frames = 0;
}, 1000);