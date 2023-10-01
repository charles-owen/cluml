import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";


/**
 * Inheritance-type association
 * @constructor
 */
export const Aggregation = function(){
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
Aggregation.prototype.paletteOrder = 22;
Aggregation.prototype.loadOrder = 22;
//endregion

//Draw the paletteImage for the palette
Aggregation.prototype.paletteImage = function() {
    let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(22, 20, 50, 20);
    pi.drawLine(22, 20, 16, 26);
    pi.drawLine(16, 26, 10, 20);
    pi.drawLine(10, 20, 16, 14);
    pi.drawLine(16, 14, 22, 20);
    return pi;

    // //Containment
    // pi.drawLine(22, 20, 50, 20);
    // pi.circle(-14, 0, 6);
    // pi.drawLine(16, 24, 16, 16);
    // pi.drawLine(12, 20, 20, 20);
    // return pi;
    // const pi = this.nodes.end.paletteImage();
    // return pi;
}