// ------
//  When Piggies Fly, based on flappybird
//  (c) Sadie Post, Walker ...  2021
//      
//  Lots of help from Sadie's dad...
//  --------

// When compiling one file, this needs to be removed
// import { CImages } from './cimages'

// The function gets called when the window is fully loaded
window.onload = function() {

    // Get the canvas and the context
    var cvs: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
    var ctx: CanvasRenderingContext2D = cvs.getContext("2d");
    
    interface ImageInfo {
        id: number;
        name: string;
        fileName: string;
        cimage: CImages;
    };

    enum imageEnums {
        kBIRD,
        kFOREGROUND,
        kBACKGROUND,
        kPIPENORTH,
        kPIPESOUTH,
        kMAX_IMAGES
    };

    var imageInfoArray: Array<ImageInfo> = [
        { id: imageEnums.kBIRD, name: "bird", fileName: "images/bird.png", cimage: null },
        { id: imageEnums.kFOREGROUND, name: "fg", fileName: "images/fg.png", cimage: null  },
        { id: imageEnums.kBACKGROUND, name: "bg", fileName: "images/bg.png", cimage: null  },
        { id: imageEnums.kPIPENORTH, name: "pipeNorth", fileName: "images/pipeNorth.png", cimage: null  },
        { id: imageEnums.kPIPESOUTH, name: "pipeSouth", fileName: "images/pipeSouth.png", cimage: null  }
    ];

    var loadcount = 0;
    var loadtotal = imageInfoArray.length;
    var preloaded = false;
    
    /* 
     * checkLoaded()
     *
     * Checks to make sure that all the `onload` callbacks have been called so that
     * we can ensure that resources are loaded.
     */
    function checkLoaded()
    {
        loadcount++;

        if (loadcount == loadtotal) {
            // Done loading
            preloaded = true;
        }
    }
   
    /*
     *  loadImages
     *
     * Function to load the images and setup the CImage object.
     */
    function loadImages()
    {
        for( var i = 0; i < imageInfoArray.length; i++)
        {
            var tmpImage: CImages = new CImages( imageInfoArray[i].name, imageInfoArray[i].fileName,  checkLoaded)
            if (tmpImage != null)
            {
                tmpImage.load();
                imageInfoArray[ i ].cimage = tmpImage;
            }
        }

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
        x: number = 0;
        y: number = 0;

        constructor(inX: number,inY: number)
        {
            this.x = inX;
            this.y = inY;
        }
    }

    var pipe: Array<PipePoint> = [
        { x : cvs.width / 2, y : 0 },
        { x : cvs.width / 1, y : 0 }
    ];

    /*
     *  getImage
     *
     * Returns the image from list of images if exists else NULL
     */
    function getImage( inImageID: number )
    {
        var imageReturned = null;

        if (inImageID >= 0 && inImageID <= imageEnums.kMAX_IMAGES)
        {
            imageReturned = imageInfoArray[ inImageID ].cimage.getImage();
        }
        
        return imageReturned;
    }

    /*
     *  drawImage
     *  
     * Given a context, image id and x & y draw the image.
     */
    function drawImage( inCTX: CanvasRenderingContext2D, inImageID: number, inX: number, inY: number)
    {
        var imageToDraw = getImage( inImageID );

        if (imageToDraw != null)
            inCTX.drawImage( imageToDraw, inX, inY );
    }

    /*
     * draw()
     *
     * Main draw routine.
     */
    function draw()
    {    
        var fg: HTMLImageElement = getImage( imageEnums.kFOREGROUND );
        var bg: HTMLImageElement = getImage( imageEnums.kBACKGROUND );
        var pipeNorth: HTMLImageElement = getImage( imageEnums.kPIPENORTH );
        var pipeSouth: HTMLImageElement = getImage( imageEnums.kPIPESOUTH );
        var bird: HTMLImageElement = getImage( imageEnums.kBIRD );

        if (!pauseGame && preloaded)
        {
            for( var i = 0; i < cvs.width; i+= bg.width)
            {
                ctx.drawImage(bg,i,0);
            }
            
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
                
                var birdWidth: number = bird.width;

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
            {
                ctx.drawImage(fg,i,cvs.height - fg.height);
            }

            ctx.drawImage(bird,bX,bY);
            
            bY += gravity;
        }   // if !pauseGame

        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : "+score,10,cvs.height-80);
        ctx.fillText("Level : "+level,10,cvs.height-20);    
        requestAnimationFrame(draw);

    }

    loadImages();

    draw();
}























