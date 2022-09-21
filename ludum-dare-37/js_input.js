var mouseX = 0, mouseY = 0;
var leftClick = false, rightClick = false;
var keys = [], canKey = [];

document.addEventListener("mousemove", function(e)
{
	mouseX = e.clientX;
	mouseY = e.clientY;
});

document.addEventListener("mousedown", function(e)
{
	if(e.button == 0)//Left Click
	{
		leftClick = true;
	}
	else if(e.button == 2)//Right Click
	{
		rightClick = true;
	}
});

document.addEventListener("mouseup", function(e)
{
	if(e.button == 0)//Left Click
	{
		leftClick = false;
	}
	else if(e.button == 2)//Right Click
	{
		rightClick = false;
	}
});

//Checks for key down
window.addEventListener("keydown", function(e)
{
	keys[e.keyCode] = true;
	if(!canKey[e.keyCode])
		canKey[e.keyCode] = true;
}, false);

//Checks for key up
window.addEventListener("keyup", function(e)
{
	delete keys[e.keyCode];
	delete canKey[e.keyCode];
}, false);

function pushed(value)
{
	if(keys[value] && canKey[value])
	{
		canKey[value] = false;
		return true;
	}else
		return false;
}
