import {Class} from "./Class";
import {PaletteImage} from "../Graphics/PaletteImage";

export const InterfaceClass = function () {
    Class.call(this);
}

InterfaceClass.prototype = Object.create(Class.prototype);
InterfaceClass.prototype.constructor = InterfaceClass;


InterfaceClass.prototype.fileLbl = "InterfaceClass";
InterfaceClass.prototype.helpLbl = 'interfaceClass';
InterfaceClass.prototype.paletteLbl = "Interface Class";
InterfaceClass.prototype.paletteDesc = "Interface Class component.";
InterfaceClass.prototype.htmlDesc = '<h2>Class</h2><p>An Interface class.</p>';
InterfaceClass.prototype.paletteOrder = 2;

//draw the paletteImage for the Interface Class
/**
 * Create a PaletteImage object for the component
 * @returns {PaletteImage}
 */
InterfaceClass.prototype.paletteImage = function () {
    // let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height

    const pi = new PaletteImage(width, height);

    pi.box(40, 30);
    pi.fillStroke("#e7e8b0");
    pi.box(40, 15);
    pi.fillStroke("#e7e8b0");

    //draw '<' and '>'
    pi.drawLine(20, 20, 24, 24);
    pi.drawLine(20, 20, 24, 16);
    pi.drawLine(40, 20, 36, 24);
    pi.drawLine(40, 20, 36, 16);

    return pi;
}