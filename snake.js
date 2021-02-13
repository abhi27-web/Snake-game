

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

// create the unit
const box = 32;

// load images

const ground = new Image();
ground.src = "img/ground.png";

const foodImg = new Image();
foodImg.src = "img/food.png";

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

// create the snake

let snake = [];

snake[0] = {
    x : 9 * box,
    y : 10 * box
};

// create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score = 0;

//control the snake

let d;

document.addEventListener("keydown",direction);

document.addEventListener("touchstart",touch_start);

document.addEventListener("touchend",touch_end);


function direction(event){
    let key = event.keyCode;
    if( key == 65 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 87 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 68 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 83 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}

_touch_start= null

function touch_start(event) {
    console.log(event);
    event.preventDefault();
	var touches = event.changedTouches;
	snake._touch_start = [touches[0].pageX, touches[0].pageY];
}

//function to reload game after its over
function restartGame()
{



    location.reload()
}

function touch_end(event) {
    event.preventDefault();
	var touches = event.changedTouches;
    var end_pos = [touches[0].pageX, touches[0].pageY];
	var dX = end_pos[0] - snake._touch_start[0],
		dY = end_pos[1] - snake._touch_start[1],
		c = Math.sqrt(dX*dX + dY*dY),
		alpha = Math.acos(dX/c);
	if (alpha < Math.PI * 1/4) {
		d = "RIGHT";
    	right.play();
	} else if (alpha > Math.PI * 3/4) {
		left.play();
    	d = "LEFT";
	} else if (dY > 0) {
		d = "DOWN";
    	down.play();
	} else {
		d = "UP";
    	up.play();
	}
}

// cheack collision function
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw everything to the canvas

function draw(){
    
    ctx.drawImage(ground,0,0);
    
    for( let i = 0; i < snake.length ; i++){
        ctx.fillStyle = ( i == 0 )? "green" : "white";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);
        
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    
    ctx.drawImage(foodImg, food.x, food.y);
    
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    
    // if the snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
        // we don't remove the tail
    }else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    if(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box || collision(newHead,snake)){
        clearInterval(game);
        dead.play();
      

        //restarts game in 3 seconds after game over
        setTimeout(restartGame,3000)
    }
    
    snake.unshift(newHead);
    
    ctx.fillStyle = "white";
    ctx.font = "45px Changa one";
    ctx.fillText(score,2*box,1.6*box);
}

// call draw function every 100 ms

let game = setInterval(draw,100);


















