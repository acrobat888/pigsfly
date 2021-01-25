/*
 * CImages class
 *
 *  Used to create images for use, handles loading.
 */
// load images
var CImages = /** @class */ (function () {
    function CImages(inName, inFile, onloadcallback) {
        if (onloadcallback === void 0) { onloadcallback = null; }
        this.name = null;
        this.file = null;
        this.image = null;
        this.loaded = false;
        this.imageCallback = null;
        this.name = inName;
        this.file = inFile;
        this.imageCallback = onloadcallback;
    }
    CImages.prototype.load = function () {
        this.image = new Image();
        var self = this;
        // Add onload event handler
        this.image.onload = function () {
            console.log(self.name + " was loaded");
            self.loaded = true;
            if (self.imageCallback != null)
                self.imageCallback();
            return true;
        };
        this.image.src = this.file;
    };
    CImages.prototype.getImage = function () {
        return this.image;
    };
    CImages.prototype.getIsLoaded = function () {
        return this.loaded;
    };
    return CImages;
}());
// When compiling one file, this needs to be removed
// export { CImages };
// ------
//  When Piggies Fly, based on flappybird
//  (c) Sadie Post, Walker ...  2021
//      
//  Lots of help from Sadie's dad...
//  --------
// When compiling one file, this needs to be removed
// import { CImages } from './cimages'
// The function gets called when the window is fully loaded
window.onload = function () {
    // Get the canvas and the context
    var cvs = document.getElementById("canvas");
    var ctx = cvs.getContext("2d");
    ;
    var imageEnums;
    (function (imageEnums) {
        imageEnums[imageEnums["kBIRD"] = 0] = "kBIRD";
        imageEnums[imageEnums["kFOREGROUND"] = 1] = "kFOREGROUND";
        imageEnums[imageEnums["kBACKGROUND"] = 2] = "kBACKGROUND";
        imageEnums[imageEnums["kPIPENORTH"] = 3] = "kPIPENORTH";
        imageEnums[imageEnums["kPIPESOUTH"] = 4] = "kPIPESOUTH";
        imageEnums[imageEnums["kMAX_IMAGES"] = 5] = "kMAX_IMAGES";
    })(imageEnums || (imageEnums = {}));
    ;
    var imageInfoArray = [
        { id: imageEnums.kBIRD, name: "bird", fileName: "images/bird.png", cimage: null },
        { id: imageEnums.kFOREGROUND, name: "fg", fileName: "images/fg.png", cimage: null },
        { id: imageEnums.kBACKGROUND, name: "bg", fileName: "images/bg.png", cimage: null },
        { id: imageEnums.kPIPENORTH, name: "pipeNorth", fileName: "images/pipeNorth.png", cimage: null },
        { id: imageEnums.kPIPESOUTH, name: "pipeSouth", fileName: "images/pipeSouth.png", cimage: null }
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
    function checkLoaded() {
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
    function loadImages() {
        for (var i = 0; i < imageInfoArray.length; i++) {
            var tmpImage = new CImages(imageInfoArray[i].name, imageInfoArray[i].fileName, checkLoaded);
            if (tmpImage != null) {
                tmpImage.load();
                imageInfoArray[i].cimage = tmpImage;
            }
        }
    }
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
    document.addEventListener("keydown", direction);
    function direction(event) {
        var key = event.keyCode;
        if (key == 32) { // space key
            pauseGame = !pauseGame;
        }
        else {
            if (!pauseGame) {
                if (key == 37) { // left arrow
                    moveLeft();
                }
                else if (key == 38) { // up arrow
                    moveUp();
                }
                else if (key == 39) { // right arrow
                    moveRight();
                }
                else if (key == 40) { // down arrow
                    moveDown();
                }
            }
        }
    }
    // pipe coordinates
    var PipePoint = /** @class */ (function () {
        function PipePoint(inX, inY) {
            this.x = 0;
            this.y = 0;
            this.x = inX;
            this.y = inY;
        }
        return PipePoint;
    }());
    var pipe = [
        { x: cvs.width / 2, y: 0 },
        { x: cvs.width / 1, y: 0 }
    ];
    /*
     *  getImage
     *
     * Returns the image from list of images if exists else NULL
     */
    function getImage(inImageID) {
        var imageReturned = null;
        if (inImageID >= 0 && inImageID <= imageEnums.kMAX_IMAGES) {
            imageReturned = imageInfoArray[inImageID].cimage.getImage();
        }
        return imageReturned;
    }
    /*
     *  drawImage
     *
     * Given a context, image id and x & y draw the image.
     */
    function drawImage(inCTX, inImageID, inX, inY) {
        var imageToDraw = getImage(inImageID);
        if (imageToDraw != null)
            inCTX.drawImage(imageToDraw, inX, inY);
    }
    /*
     * draw()
     *
     * Main draw routine.
     */
    function draw() {
        var fg = getImage(imageEnums.kFOREGROUND);
        var bg = getImage(imageEnums.kBACKGROUND);
        var pipeNorth = getImage(imageEnums.kPIPENORTH);
        var pipeSouth = getImage(imageEnums.kPIPESOUTH);
        var bird = getImage(imageEnums.kBIRD);
        if (!pauseGame && preloaded) {
            for (var i = 0; i < cvs.width; i += bg.width) {
                ctx.drawImage(bg, i, 0);
            }
            for (var i = 0; i < pipe.length; i++) {
                constant = pipeNorth.height + gap;
                ctx.drawImage(pipeNorth, pipe[i].x, pipe[i].y);
                ctx.drawImage(pipeSouth, pipe[i].x, pipe[i].y + constant);
                pipe[i].x--;
                if (pipe[i].x == (cvs.width / 2)) // was 125 -- NOTE -- need to make these dynamic on the window size...
                 {
                    pipe.push({
                        x: cvs.width,
                        y: Math.floor(Math.random() * pipeNorth.height) - pipeNorth.height
                    });
                }
                // detect collision
                var birdWidth = bird.width;
                if (bX + birdWidth >= pipe[i].x && bX <= pipe[i].x + pipeNorth.width && (bY <= pipe[i].y + pipeNorth.height || bY + bird.height >= pipe[i].y + constant) || bY + bird.height >= cvs.height - fg.height) {
                    location.reload(); // reload the page
                }
                if (pipe[i].x == 5) {
                    score++;
                    scor.play();
                    if (score > 5) {
                        level++;
                    }
                }
            }
            if (pipe[0].x < -pipeNorth.width)
                pipe.shift();
            for (var i = 0; i < cvs.width; i += fg.width) {
                ctx.drawImage(fg, i, cvs.height - fg.height);
            }
            ctx.drawImage(bird, bX, bY);
            bY += gravity;
        } // if !pauseGame
        ctx.fillStyle = "#000";
        ctx.font = "20px Verdana";
        ctx.fillText("Score : " + score, 10, cvs.height - 80);
        ctx.fillText("Level : " + level, 10, cvs.height - 20);
        requestAnimationFrame(draw);
    }
    loadImages();
    draw();
};
//# sourceMappingURL=main.js.map