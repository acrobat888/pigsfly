// ------
//  When Piggies Fly, based on flappybird
//  (c) Sadie Post, Walker ...  2021
//      
//  Lots of help from Sadie's dad...
//  --------

// The function gets called when the window is fully loaded
window.onload = function() {

    // Get the canvas and the context
    var cvs: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    var ctx: CanvasRenderingContext2D = cvs.getContext("2d");

    // load images
    // ImageClass
    class CImages
    {
        name: string = null;
        file: string = null;
        image: HTMLImageElement = null;
        loaded: boolean = false;

        constructor(inName: string, inFile: string)
        {
            this.name = inName;
            this.file = inFile;
        }

    
        load()
        {
            this.image = new Image();

            // Add onload event handler
            this.image.onload = function () {
                    // Done loading
                    // this.loaded = true;
            };
            
            this.image.src = this.file;
        }
    }

    var images: Array<HTMLImageElement> = [];
    var bg: HTMLImageElement = null;
    var bird: HTMLImageElement = null;
    var fg: HTMLImageElement = null;
    var pipeNorth: HTMLImageElement = null;
    var pipeSouth: HTMLImageElement = null;

    function loadIndividualImages() {
        bird = new Image();
        bird.src = "images/bird.png";     

        bg = new Image();
        bg.src = "images/bg.png";

        fg = new Image();
        fg.src = "images/fg.png";

        pipeNorth = new Image();
        pipeNorth.src = "images/pipeNorth.png";

        pipeSouth = new Image();
        pipeSouth.src = "images/pipeSouth.png";
    }

    // Image loading global variables
    var loadcount = 0;
    var loadtotal = 0;
    var preloaded = false;
    
    var imageNames: Array<string> = [   "images/bird.png",
                                        "images/bg.png",
                                        "images/fg.png",
                                        "images/pipeNorth.png",
                                        "images/pipeSouth.png" ];
    // Load images
    function loadImages(imagefiles) {
        // Initialize variables
        loadcount = 0;
        loadtotal = imagefiles.length;
        preloaded = false;
        
        // Load the images
        var loadedimages = [];
        for (var i=0; i<imagefiles.length; i++) {
            // Create the image object
            var image = new Image();
            
            // Add onload event handler
            image.onload = function (inEvent: Event) {
                loadcount++;

                // typecast to get to the src
                var tgt: HTMLImageElement = (inEvent.target as HTMLImageElement);
                var str = tgt.src;

                console.log( tgt );

                if (str.endsWith("images/bird.png"))
                    console.log("Found a bird");

                if (loadcount == loadtotal) {
                    // Done loading
                    preloaded = true;
                }
            };
            
            // Set the source url of the image
            image.src = imagefiles[i];
            
            // Save to the image array
            loadedimages[i] = image;
        }
        
        // Return an array of images
        return loadedimages;
    }
    
    // some variables

    var gap: number = 85;
    var constant: number;

    var bX: number = 10;
    var bY: number = 150;

    var gravity: number = 0.5;

    var score: number = 0;
    var level: number = 1;

    var pauseGame: boolean = false;

    // audio files

    var fly: HTMLAudioElement = new Audio();
    var scor: HTMLAudioElement = new Audio();

    fly.src = "sounds/fly.mp3";
    scor.src = "sounds/vo_ben_whoopy_02.wav";   // "sounds/score.mp3";

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
        x: number = 0;
        y: number = 0;

        constructor(inX: number,inY: number)
        {
            this.x = inX;
            this.y = inY;
        }
    }

    var pipe: Array<PipePoint> = [];

    pipe[0] = {
        x : cvs.width / 2,
        y : 0
    };

    pipe[1] = {
        x : cvs.width / 1,
        y : 0
    };

    // draw images

    function draw(){
        
        if (!pauseGame && preloaded)
        {
            for( var i = 0; i < cvs.width; i+= bg.width)
                ctx.drawImage(bg,i,0);
            
            
            for(var i = 0; i < pipe.length; i++){
                
                constant = pipeNorth.height+gap;
                ctx.drawImage(pipeNorth,pipe[i].x,pipe[i].y);
                ctx.drawImage(pipeSouth,pipe[i].x,pipe[i].y+constant);
                    
                pipe[i].x--;
                
                if( pipe[i].x == (cvs.width / 2))    // was 125 -- NOTE -- need to make these dynamic on the window size...
                {     
                    pipe.push({
                        x : cvs.width,
                        y : Math.floor(Math.random()*pipeNorth.height)-pipeNorth.height
                    }); 
                }

                // detect collision
                
                var birdWidth = bird.width;

                if( bX + birdWidth >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY+bird.height >= pipe[i].y+constant) || bY + bird.height >=  cvs.height - fg.height){
                    location.reload(); // reload the page
                }
                
                if(pipe[i].x == 5){
                    score++;
                    scor.play();
                    
                    if (score > 5){
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
        }   // if !pauseGame

        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : "+score,10,cvs.height-80);
        ctx.fillText("Level : "+level,10,cvs.height-20);    
        requestAnimationFrame(draw);

    }

    images = loadImages(imageNames);
    
    loadIndividualImages();

    draw();
}























