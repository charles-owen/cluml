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