/* 
 * CImages class
 *
 *  Used to create images for use, handles loading.
 */

// load images
class CImages
{
    name: string = null;
    file: string = null;
    image: HTMLImageElement = null;
    loaded: boolean = false;
    imageCallback = null;

    constructor(inName: string, inFile: string, onloadcallback = null )
    {
        this.name = inName;
        this.file = inFile;
        this.imageCallback = onloadcallback;
    }

    load()
    {
        this.image = new Image();
        var self = this;

        // Add onload event handler
        this.image.onload = function() {
            console.log(self.name + " was loaded");
            self.loaded = true;

            if (self.imageCallback != null)
                self.imageCallback();

            return true;
        };

        this.image.src = this.file;
    }

    getImage()
    {
        return this.image;
    }

    getIsLoaded()
    {
        return this.loaded;
    }
}

// When compiling one file, this needs to be removed
// export { CImages };