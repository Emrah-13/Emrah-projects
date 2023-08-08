let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird

let birdWidth = 34;
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/8;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY=0;

let topPipeImg;
let bottomPipeImg;

//Physics
let velocityX = -2;
let velocityY =0; //bird jump speed
let gravity = 0.4;

let GameOver = false;
let Score =0;

window.onload = function() {
    board = document.getElementById ("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context= board.getContext("2d");

    //character
    //context.fillStyle = "green";
    context.fillRect(bird.x,bird.y,bird.width,bird.height);

    birdImg = new Image ();
    birdImg.src = "./Bird.png";
    birdImg.onload = function() {
    context.drawImage(birdImg, bird.x, bird.y,bird.width,bird.height);

    
    }


    topPipeImg = new Image();
    topPipeImg.src = "./Tube-Down.png";

bottomPipeImg = new Image();
bottomPipeImg.src = "./Tube-Up.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1200) //Every 1.5 second
    document.addEventListener("keydown", moveBird);
    document.addEventListener("touchstart", moveBird);
}



function update() {
    requestAnimationFrame(update);
    if(GameOver){
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird reset
    velocityY += gravity;
    //bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 2);
   
    context.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    if(bird.y> board.height){
        GameOver = true;
    }

    //pipes
    for (let i = 0; i< pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if(!pipe.passed && bird.x> pipe.x + pipe.width){
            Score += 0.5;
            pipe.passed = true;
        }
        if(detectCollision(bird, pipe)) {
            GameOver = true;
        }
    }
    //score
    context.fillStyle = "black";
    context.font = "50px sans-serif ";
    context.fillText(Score, 5, 45);
}

function placePipes() {
    if (GameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4- Math.random()*(pipeHeight/2);
    let openingSpace = board.height/5;
let topPipe= {
    img : topPipeImg,
    x : pipeX,
    y :  randomPipeY,
    width:pipeWidth,
    height:pipeHeight,
    passed:false
}

pipeArray.push(topPipe);

let bottomPipe = {
    img: bottomPipeImg,
    x:pipeX,
    y :randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height:pipeHeight,
    passed:false

}
pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if(e.code== "Space" || e.code == "ArrowUp"|| e.code == "KeyX" ) {
        //jump
       velocityY=-6;
    }

    if (e.targetTouches[0].target == document.documentElement) {
        velocityY=-6;
      }
}

function detectCollision(a,b){
return a.x < b.x + b.width &&
a.x + a.width > b.x &&
a.y < b.y + b.height &&
a.y + a.height> b.y;
}
