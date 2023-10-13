import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";


/**
 * Inheritance-type association
 * @constructor
 */
export const Containment = function(){
    Association.call(this);
}

Containment.prototype = Object.create(Association.prototype);
Containment.prototype.constructor = Containment;

//region Type
Containment.prototype.fileLbl = "Containment";
Containment.prototype.isAssociation = true;
Containment.prototype.helpLbl = 'containment';
Containment.prototype.paletteLbl = "Containment";
Containment.prototype.paletteDesc = "Containment component.";
Containment.prototype.htmlDesc = '<h2>Containment</h2><p>Containment between 2 classes.</p>';
Containment.prototype.paletteOrder = 23;
Containment.prototype.loadOrder = 23;
//endregion

Containment.prototype.drawTail = function(context, x, y, side){
    //this will determine the size of the tail, in this case the diameter of the circle
    let offsetVal = 12;
    //this will determine the size of the plus sign
    let plusSize = 5;
    //this is the center of the circle
    let circleCenterX = x;
    let circleCenterY  = y;

    //declare the variables representing the different points
    // //coordinates of first point
    // let oneX = 0;
    // let oneY = 0;
    // //coordinates of second point
    // let twoX = 0;
    // let twoY = 0;
    // //coordinates of third point
    // let threeX = 0;
    // let threeY = 0;

    switch(side){
        //top
        case 0:
            circleCenterY = y + (offsetVal/2);
            break;
        //Right
        case 1:
            circleCenterX = x + (offsetVal/2);
            break;
        //bottom
        case 2:
            circleCenterY = y - (offsetVal/2);
            break;
        //left
        case 3:
            circleCenterX = x - (offsetVal/2);
            console.log("The composition is connected to the left");
            break;
    }
    context.fillStyle = "white";
    context.beginPath();
    context.arc(circleCenterX, circleCenterY, (offsetVal/2), 0, 2 * Math.PI, true);
    context.fill();

    //horizontal line of plus sign
    context.moveTo(circleCenterX - plusSize , circleCenterY);
    context.lineTo(circleCenterX + plusSize, circleCenterY);

    //vertical line of plus sign
    context.moveTo(circleCenterX, circleCenterY + plusSize);
    context.lineTo(circleCenterX, circleCenterY - plusSize);

    context.stroke();
}


//Draw the paletteImage for the palette
Containment.prototype.paletteImage = function() {
    let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(22, 20, 50, 20);
    pi.circle(-14, 0, 6);
    pi.drawLine(16, 24, 16, 16);
    pi.drawLine(12, 20, 20, 20);
    return pi;
}