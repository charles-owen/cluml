import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";

/**
 * Inheritance-type association
 * @constructor
 */
export const Composition = function(){
    Association.call(this);
}

Composition.prototype = Object.create(Association.prototype);
Composition.prototype.constructor = Composition;

//region Type
Composition.prototype.fileLbl = "Composition";
Composition.prototype.isAssociation = true;
Composition.prototype.helpLbl = 'composition';
Composition.prototype.paletteLbl = "Composition";
Composition.prototype.paletteDesc = "Composition component.";
Composition.prototype.htmlDesc = '<h2>Composition</h2><p>Composition between 2 classes.</p>';
Composition.prototype.paletteOrder = 13;
Composition.prototype.loadOrder = 13;
//endregion

Composition.prototype.drawTail = function(context, x, y, side){
    //this will determine the size of the tail
    let offsetVal = 12;
    //let midPointVal = offsetVal/Math.sin(Math.PI/4);

    //declare the variables representing the different points
    //coordinates of first point
    let oneX = 0;
    let oneY = 0;
    //coordinates of second point
    let twoX = 0;
    let twoY = 0;
    //coordinates of third point
    let threeX = 0;
    let threeY = 0;

    switch(side){
        //top
        case 0:
            oneX = x - (offsetVal/2);
            oneY = y + (offsetVal/2);

            twoX = x;
            twoY = y + offsetVal;

            threeX = x + (offsetVal/2);
            threeY = y + (offsetVal/2);
            break;
        //Right
        case 1:
            oneX = x + (offsetVal/2);
            oneY = y + (offsetVal/2);

            twoX = x + offsetVal;
            twoY = y;

            threeX = x + (offsetVal/2);
            threeY = y - (offsetVal/2);
            break;
        //bottom
        case 2:
            oneX = x + (offsetVal/2);
            oneY = y - (offsetVal/2);

            twoX = x;
            twoY = y - offsetVal;

            threeX = x - (offsetVal/2);
            threeY = y - (offsetVal/2);
            break;
        //left
        case 3:
            oneX = x - (offsetVal/2);
            oneY = y - (offsetVal/2);

            twoX = x - offsetVal;
            twoY = y;

            threeX = x - (offsetVal/2);
            threeY = y + (offsetVal/2);
            break;
        default:
            oneX = x - (offsetVal/2);
            oneY = y + (offsetVal/2);

            twoX = x;
            twoY = y + offsetVal;

            threeX = x + (offsetVal/2);
            threeY = y + (offsetVal/2);
            break;
    }
    context.fillStyle = "black";
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(oneX, oneY);
    context.lineTo(twoX, twoY);
    context.lineTo(threeX, threeY);
    context.closePath();
    context.fill();
    context.stroke();
}


//Draw the paletteImage for the palette
Composition.prototype.paletteImage = function() {
    let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(20, 20, 50, 20);
    pi.diamond(15, 20, 10);
    pi.fillStroke("#000000");
    return pi;
}
