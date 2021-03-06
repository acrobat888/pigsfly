// ------
//  When Piggies Fly, based on flappybird
//  (c) Sadie Post, Walker ...  2021
//      
//  Lots of help from Sadie's dad...
//  --------

// The function gets called when the window is fully loaded
window.onload = function() {

    // Get the canvas and the context
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");

    // load images
    var bird = new Image(38,26);
    var bg = new Image(288, 512);
    var fg = new Image(306,118);
    var pipeNorth = new Image(52,242);
    var pipeSouth = new Image(52,378);

    bird.src = "images/bird.png";
    bg.src = "images/bg.png";
    fg.src = "images/fg.png";
    pipeNorth.src = "images/pipeNorth.png";
    pipeSouth.src = "images/pipeSouth.png";


    // some variables

    var gap = 85;
    var constant;

    var bX = 10;
    var bY = 150;

    var gravity = 0.5;

    var score = 0;
    var level = 1;

    var pauseGame = false;

    // audio files

    var fly = new Audio();
    var scor = new Audio();

    fly.src = "sounds/fly.mp3";
    scor.src = "sounds/score.mp3";

    // on key down

    // document.addEventListener("keydown",moveUp);

    function moveUp() {
        bY -= 25;
        fly.play();
    }

    function moveDown() {
        bY += 25;
        fly.play();
    }

    function moveLeft() {
        bX -= 25;
        fly.play();
    }

    function moveRight() {
        bX += 25;
        fly.play();
    }

    document.addEventListener("keydown",direction);

    function direction(event){
        let key = event.keyCode;

        if (key == 32) {                // space key
            pauseGame = !pauseGame;
        } else {
            if (!pauseGame){
                if( key == 37){           // left arrow
                    moveLeft();
                }else if(key == 38){            // up arrow
                    moveUp();
                }else if(key == 39){            // right arrow
                    moveRight();
                }else if(key == 40){            // down arrow
                    moveDown();
                }
            }
        }
    }


    // pipe coordinates
    class PipePoint
    {
        x = 0;
        y = 0;

        constructor(inX,inY)
        {
            this.x = inX;
            this.y = inY;
        }
    }

    var pipe = [];

    pipe[0] = {
        x : cvs.width / 2,
        y : 0
    };

    pipe[1] = {
        x : cvs.width / 1,
        y : 0
    };

    // draw images

    function draw()
    {    
        if (!pauseGame)
        {
            for( var i = 0; i < cvs.width; i+= bg.width)
                ctx.drawImage(bg,i,0);
            
            
            for(var i = 0; i < pipe.length; i++){
                
                constant = pipeNorth.height+gap;
                ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
                ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
                    
                pipe[i].x--;
                
                if( pipe[i].x == (cvs.width / 2) ){     // was 125 -- NOTE -- need to make these dynamic on the window size...
                    pipe.push({
                        x : cvs.width,
                        y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
                    }); 
                }

                // detect collision
                
                if( bX + bird.width >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
                    location.reload(); // reload the page
                }
                
                if(pipe[i].x == 5){
                    score++;
                    scor.play();
                    
                    if (score > 5){
                        score = 0;
                        level++;
                    }
                }
            }

            if (pipe[0].x < -pipeNorth.width)
                pipe.shift();

            for( var i = 0; i < cvs.width; i += fg.width )
                ctx.drawImage(fg,i,cvs.height - fg.height);
            
            ctx.drawImage(bird,bX,bY);
            
            bY += gravity;
        }   // if (!pauseGame)

        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : "+score,10,cvs.height-80);
        ctx.fillText("Level : "+level,10,cvs.height-20);    
        requestAnimationFrame(draw);
        
    }

    draw();
}























