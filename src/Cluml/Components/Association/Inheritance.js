import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";
import {SanityElement} from "../../SanityElement/SanityElement";
import {SanityErrorInfo} from "../../SanityElement/SanityErrorInfo";


/**
 * Inheritance-type association
 * @constructor
 */
export const Inheritance = function () {
    Association.call(this);

    this.forwardSanityCheck = function* () {
        if (this.nodes !== undefined) {
            if (this.nodes.start !== null) {
                yield this.nodes.start.multiplicityValue;
                yield this.nodes.start.roleValue;
            }

            if (this.nodes.end !== null) {
                yield this.nodes.end.multiplicityValue;
                yield this.nodes.end.roleValue;
            }

            // Check for upside down inheritance
            const head = this.nodes.start.isTail ? this.nodes.start : this.nodes.end;
            const tail = this.nodes.start.isTail ? this.nodes.end : this.nodes.start;
            if (head.y > tail.y) {
                let element = new SanityElement("", undefined);
                element.processSanityCheck = function () {
                    return [new SanityErrorInfo("8888", "Generalization",
                        "", "Upside down")];
                }
                yield element;
            }
        }
    }
}

Inheritance.prototype = Object.create(Association.prototype);
Inheritance.prototype.constructor = Inheritance;

//region Type
Inheritance.prototype.fileLbl = "Inheritance";
Inheritance.prototype.isAssociation = true;
Inheritance.prototype.helpLbl = 'inheritance';
Inheritance.prototype.paletteLbl = "Inheritance";
Inheritance.prototype.paletteDesc = "Inheritance component.";
Inheritance.prototype.htmlDesc = '<h2>Inheritance</h2><p>Inheritance between 2 classes.</p>';
Inheritance.prototype.paletteOrder = 10;
Inheritance.prototype.loadOrder = 10;

Inheritance.help = 'inheritance';
Inheritance.label = 'Inheritance';
Inheritance.desc = 'Inheritance';

Inheritance.prototype.showTags = false;
//endregion

Inheritance.prototype.drawTail = function (context, view, tail) {
    //this will determine the size of the tail
    let offsetVal = 10;
    let val1 = offsetVal;
    let val2 = offsetVal;
    let val3 = offsetVal;
    let val4 = offsetVal;

    const side = Math.floor(tail.side);
    const x = tail.x;
    const y = tail.y;

    switch (side) {
        case 0:
            //top
            val1 = x - offsetVal;
            val2 = y + offsetVal;
            val3 = x + offsetVal;
            val4 = y + offsetVal;
            break;
        case 1:
            //right
            val1 = x + offsetVal;
            val2 = y + offsetVal;
            val3 = x + offsetVal;
            val4 = y - offsetVal;
            break;
        case 2:
            //bottom
            val1 = x + offsetVal;
            val2 = y - offsetVal;
            val3 = x - offsetVal;
            val4 = y - offsetVal;
            break;
        case 3:
            //left
            val1 = x - offsetVal;
            val2 = y - offsetVal;
            val3 = x - offsetVal;
            val4 = y + offsetVal;
            break;
        default:
            val1 = x + offsetVal;
            val2 = y - offsetVal;
            val3 = x - offsetVal;
            val4 = y - offsetVal;
            break;
    }

    // Draw the line from the shape to the lineup point.
    context.beginPath();
    const ap = tail.lineupPoint();
    if (side % 2 === 0) {
        context.moveTo(x, val2);
    } else {
        context.moveTo(val1, y);
    }
    context.lineTo(ap.x, ap.y);
    context.closePath();
    context.stroke();

    context.fillStyle = "white";
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(val1, val2);
    context.lineTo(val3, val4);
    context.closePath();
    context.fill();
    context.stroke();
}

//Draw the paletteImage for the palette
Inheritance.prototype.paletteImage = function () {
    let size = 16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(17, 20, 50, 20);
    pi.drawLine(10, 20, 17, 13);
    pi.drawLine(10, 20, 17, 27);
    pi.drawLine(17, 13, 17, 27);
    return pi;
}
