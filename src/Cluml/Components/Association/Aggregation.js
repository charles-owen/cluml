import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";


/**
 * Inheritance-type association
 * @constructor
 */
export const Aggregation = function () {
    Association.call(this);
}

Aggregation.prototype = Object.create(Association.prototype);
Aggregation.prototype.constructor = Aggregation;

//region Type
Aggregation.prototype.fileLbl = "Aggregation";
Aggregation.prototype.isAssociation = true;
Aggregation.prototype.helpLbl = 'aggregation';
Aggregation.prototype.paletteLbl = "Aggregation";
Aggregation.prototype.paletteDesc = "Aggregation component.";
Aggregation.prototype.htmlDesc = '<h2>Aggregation</h2><p>Aggregation between 2 classes.</p>';
Aggregation.prototype.paletteOrder = 12;
Aggregation.prototype.loadOrder = 12;

Aggregation.help = 'aggregation';
Aggregation.label = 'Aggregation';
Aggregation.desc = 'Aggregation';

//endregion

//Draw the paletteImage for the palette
Aggregation.prototype.paletteImage = function () {
    let size = 16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(22, 20, 50, 20);
    pi.drawLine(22, 20, 16, 26);
    pi.drawLine(16, 26, 10, 20);
    pi.drawLine(10, 20, 16, 14);
    pi.drawLine(16, 14, 22, 20);
    return pi;
}

Aggregation.prototype.drawTail = function (context, view, tail) {
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

    const side = Math.floor(tail.side);
    const x = tail.x;
    const y = tail.y;

    switch (side) {
        //top
        case 0:
            oneX = x - (offsetVal / 2);
            oneY = y + (offsetVal / 2);

            twoX = x;
            twoY = y + offsetVal;

            threeX = x + (offsetVal / 2);
            threeY = y + (offsetVal / 2);
            break;
        //Right
        case 1:
            oneX = x + (offsetVal / 2);
            oneY = y + (offsetVal / 2);

            twoX = x + offsetVal;
            twoY = y;

            threeX = x + (offsetVal / 2);
            threeY = y - (offsetVal / 2);
            break;
        //bottom
        case 2:
            oneX = x + (offsetVal / 2);
            oneY = y - (offsetVal / 2);

            twoX = x;
            twoY = y - offsetVal;

            threeX = x - (offsetVal / 2);
            threeY = y - (offsetVal / 2);
            break;
        //left
        case 3:
            oneX = x - (offsetVal / 2);
            oneY = y - (offsetVal / 2);

            twoX = x - offsetVal;
            twoY = y;

            threeX = x - (offsetVal / 2);
            threeY = y + (offsetVal / 2);
            break;
        default:
            oneX = x - (offsetVal / 2);
            oneY = y + (offsetVal / 2);

            twoX = x;
            twoY = y + offsetVal;

            threeX = x + (offsetVal / 2);
            threeY = y + (offsetVal / 2);
            break;
    }

    // Draw the line from the shape to the lineup point.
    context.beginPath();
    const ap = tail.lineupPoint();
    context.moveTo(twoX, twoY);
    context.lineTo(ap.x, ap.y);
    context.stroke();

    if (view.selection.isSelected(this))
        context.lineWidth = 3;
    context.fillStyle = "white";
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(oneX, oneY);
    context.lineTo(twoX, twoY);
    context.lineTo(threeX, threeY);
    context.closePath();
    context.fill();
    context.stroke();
    context.lineWidth = 1;
}
