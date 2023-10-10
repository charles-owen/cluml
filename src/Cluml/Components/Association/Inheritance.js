import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";


/**
 * Inheritance-type association
 * @constructor
 */
export const Inheritance = function(){
    Association.call(this);
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
Inheritance.prototype.paletteOrder = 20;
Inheritance.prototype.loadOrder = 20;
//endregion

//Draw the paletteImage for the palette
Inheritance.prototype.paletteImage = function() {
    let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(17, 20, 50, 20);
    pi.drawLine(10, 20, 17, 13);
    pi.drawLine(10, 20, 17, 27);
    pi.drawLine(17, 13, 17, 27);
    return pi;
}
