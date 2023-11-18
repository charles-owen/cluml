import {Class} from "./Class";
import {PaletteImage} from "../Graphics/PaletteImage";
import {NAME_FONT} from "../Selectable";
import {Operation} from "../SanityElement/Operation";
import {ClassPropertiesDlg} from "../Dlg/ClassPropertiesDlg";
import {MainSingleton} from "../MainSingleton";

export const InterfaceClass = function () {
    Class.call(this);

    this.isVariation = true;

    // Interfaces don't have attributes
    this.attributes = [];

    // All operations in an interface class must be abstract
    for(let i = 0; i < this.operations.length; i++) {
        this.operations[i].abstract = true;
    }
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

/**
 * Draws the interface class to the diagram
 * @param context the context needed to draw to the diagram
 * @param view the view that this diagram is located in
 */
InterfaceClass.prototype.draw = function (context, view) {
    Class.prototype.draw.call(this, context, view);
    context.beginPath();
    context.font = NAME_FONT;
    context.textAlign = "center";
    context.fillText("<<interface>>", this.x, this.y + this.fontHeight * 1.2);
    context.stroke();
}

/**
 * Instead of adding an attribute to this Interface class, it adds
 * an operation (Interface classes can't have attributes)
 * @param attribute the attribute to be added (and immediately discarded)
 */
InterfaceClass.prototype.addAttribute = function(attribute) {
    Class.prototype.addAttribute.call(this, attribute);
    this.attributes = [];
    let operation = new Operation("+Operation(): String");
    operation.abstract = true;
    this.operations.push(operation);
}

/**
 * Need to tell the Properties box it's dealing with an interface so
 * abstraction toggles can be disabled
 */
InterfaceClass.prototype.openProperties = function() {
    const propertiesDlg = new ClassPropertiesDlg(this,  MainSingleton.singleton, true);
    propertiesDlg.open();
}

/**
 * No more attributes means no reason to sort Attributions
 */
InterfaceClass.prototype.sortAttributions = function() {
}