import {Association} from "./Association";
import {PaletteImage} from "../../Graphics/PaletteImage";
import {Aggregation} from "./Aggregation";

/**
 * Inheritance-type association
 * @constructor
 */
export const Composition = function () {
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

Composition.help = 'composition';
Composition.label = 'Composition';
Composition.desc = 'Composition';
//endregion

Composition.prototype.drawTail = function (context, view, tail) {
    // Basically, hijack the existing aggregation draw function and
    // use it here also.
    Aggregation.prototype.drawTail.call(this, context, view, tail);

    if (view.selection.isSelected(this))
        context.lineWidth = 3;
    context.fillStyle = 'black';
    context.fill();
    context.stroke();
    context.lineWidth = 1;
}


//Draw the paletteImage for the palette
Composition.prototype.paletteImage = function () {
    let width = 60;       // Image width
    let height = 40;      // Image height
    const pi = new PaletteImage(width, height);

    pi.drawLine(20, 20, 50, 20);
    pi.diamond(15, 20, 10);
    pi.fillStroke("#000000");
    return pi;
}
