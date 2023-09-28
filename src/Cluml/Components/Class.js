import {Component} from "../Component";
import {Rect} from "../Utility/Rect";
import {PaletteImage} from "../Graphics/PaletteImage";
import {AddPopup} from "../UI/AddPopup";
import Vector from "../Utility/Vector";
import {ClassName} from "../SanityElement/ClassName";
import {EditingPopup} from "../UI/EditingPopup";
import Selectable from "../Selectable";

export const Class = function () {
    Component.call(this);

    this.forwardSanityCheck = function* () {
        yield new ClassName(this.naming);
    }

    /**
     * Component height.
     * @type {number}
     */
    Object.defineProperty(this, 'height', {
        get: function () {
            return this.nameHeight + this.attributesHeight + this.operationsHeight;
        }
    })

    /**
     * Component width.
     * @type {number}
     */
    this.width = 200;

    Object.defineProperty(this, 'size', {
        get: function () {
            return new Vector(this.width, this.height);
        }
    })

    /**
     * The array of attributes.
     * @type{Array<String>}
     */
    this.attributes = ["-attribute1 :"];

    /**
     * The array of operations.
     * @type{Array<String>}
     */
    this.operations = ["+operation1() :"];

    this.addPopup = null;

    /**
     * The editing popup for this class when editing the class
     */
    this.editingPopup = null;

    /**
     * Attached termination nodes.
     * @type {TerminationNode[]}
     */
    this.attachedTNodes = [];

    //this doesn't actually control font its just what it seemed to be hardcoded into
    this.fontHeight = 14;

    Object.defineProperty(this, 'lineHeight', {
        get: function() {
            return this.fontHeight * 1.5;
        }
    });

    Object.defineProperty(this, 'nameHeight', {
        get: function () {
            return this.fontHeight * 2.5;
        }
    });

    Object.defineProperty(this, 'nameBounds', {
        get: function () {
            return Rect.fromTopAndSize(
                new Vector(this.x, this.y),
                new Vector(this.width, this.nameHeight)
            )
        }
    });

    Object.defineProperty(this, 'attributesHeight', {
        get: function () {
            return this.lineHeight * this.attributes.length;
        }
    });

    Object.defineProperty(this, 'attributesBounds', {
        get: function () {
            return Rect.fromTopAndSize(
                new Vector(this.x, this.y + this.nameHeight),
                new Vector(this.width, this.attributesHeight)
            )
        }
    });

    Object.defineProperty(this, 'operationsHeight', {
        get: function () {
            return this.lineHeight * this.operations.length;
        }
    });

    Object.defineProperty(this, 'operationsBounds', {
        get: function () {
            return Rect.fromTopAndSize(
                new Vector(this.x, this.y + this.nameHeight + this.attributesHeight),
                new Vector(this.width, this.operationsHeight)
            )
        }
    });
}

Class.prototype = Object.create(Component.prototype);
Class.prototype.constructor = Class;


Class.prototype.fileLbl = "Class";
Class.prototype.helpLbl = 'class';
Class.prototype.paletteLbl = "Class";
Class.prototype.paletteDesc = "Class component.";
Class.prototype.htmlDesc = '<h2>Class</h2><p>A basic class.</p>';
Class.prototype.paletteOrder = 1;

/**
 * Copies from another component.
 * @param component {Class}
 */
Class.prototype.copyFrom = function (component) {
    this.operations = component.operations;
    this.attributes = component.attributes;
    this.width = component.width;
    Component.prototype.copyFrom.call(this, component);
}

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse x.
 * @param y {number} Mouse y.
 * @return {Class|null}
 */
Class.prototype.touch = function (x, y) {
    // Have we touched the component itself?
    if (this.bounds().contains(x, y)) {
        return this;
    }

    return null;
}

Class.prototype.doubleClick = function(x, y) {
    Selectable.prototype.doubleClick.call(this, x, y);

    this.enableEditing(true);
    this.enableAddPopup(true);
}

Class.prototype.move = function (dx, dy, x, y) {
    Component.prototype.move.call(this, dx, dy, x, y);

    for (const node of this.attachedTNodes) {
        node.refreshPosition();
    }
}

Class.prototype.tryTouchAddPopup = function (x, y) {
    if (this.addPopup != null) {
        return this.addPopup.touch(x, y);
    }
    return null;
}
/**
 * Returns the bounds of the Class, used to ensure the
 * object remains on screen.
 * @return {Rect}
 */
Class.prototype.bounds = function () {
    return Rect.fromTopAndSize(
        this.position, this.size
    );
}

Class.prototype.enableAddPopup = function (enable) {
    if (enable) {
        this.addPopup = new AddPopup(this);
    } else {
        this.addPopup = null;
    }
}

Class.prototype.enableEditing = function (enable) {
    if (enable) {
        this.editingPopup = new EditingPopup(this);
    } else {
        this.editingPopup = null;
    }
}

/**
 * Draws the class object.
 *
 * @param context {CanvasRenderingContext2D} Display context
 * @param view {View} View object
 */
Class.prototype.draw = function (context, view) {
    this.selectStyle(context, view);

    context.beginPath();
    context.fillStyle = "#e7e8b0";
    context.strokeStyle = "#000000";

    // Class Name rect
    this.nameBounds.contextRect(context);

    // Attribute rect
    this.attributesBounds.contextRect(context);

    // Operations rect
    this.operationsBounds.contextRect(context);


    context.fill();
    context.stroke();

    // Defaults the name to NewClass if no name is given
    if (this.naming == null) {
        this.naming = "ClassName"
    }


    // Naming text
    context.fillStyle = "#000000";
    this.drawName(context,
        0,
        this.fontHeight * 1.5);

    context.textAlign = "left"

    // boolean to check if attributes/operations' visibility should be drawn
    const visibility = this.diagram.diagrams.model.main.options.showVisibility;

    // Attributes text
    let fromTop = this.nameHeight + this.fontHeight;
    for (let i = 0; i < this.attributes.length; i++) {
        context.fillText(this.attributes[i].substring(visibility ? 0 : 1),
            this.x - this.width / 2 + 5,
            this.y + fromTop + i * this.lineHeight,
            this.width)
    }

    // Operations text
    fromTop += this.attributesHeight;
    for (let j = 0; j < this.operations.length; j++) {
        context.fillText(this.operations[j].substring(visibility ? 0 : 1),
            this.x - this.width / 2 + 5,
            this.y + fromTop + j * this.lineHeight,
            this.width)
    }

    if (this.addPopup != null) {
        this.addPopup.draw(context, view, this.x, this.y);
    }

    if (this.editingPopup != null) {
        this.editingPopup.draw(context, view, this.x, this.y)
    }

    Component.prototype.draw.call(this, context, view);
}

Class.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
    obj.attributes = this.attributes;
    obj.operations = this.operations;
    obj.width = this.width;
    return obj;
}

Class.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent.call(this, obj);

    this.attributes = obj.attributes;
    this.operations = obj.operations;
    this.width = +obj["width"];
}

/**
 * Makes sure this component is at least partially within the bounds of screen.
 */
Class.prototype.drop = function () {
    if (this.x < this.width / 2) {
        this.x = this.width / 2;
    }

    if (this.y < 0) {
        this.y = 0;
    }
};

/**
 * Create a PaletteImage object for the component
 * @returns {PaletteImage}
 */
Class.prototype.paletteImage = function () {
    // let size=16;  // Box size
    let width = 60;       // Image width
    let height = 40;      // Image height

    const pi = new PaletteImage(width, height);

    pi.box(40, 30);
    pi.fillStroke("#e7e8b0");
    pi.box(40, 15);
    pi.fillStroke("#e7e8b0");

    return pi;
}

/**
 * Add an attribute to this Class
 */
Class.prototype.addAttribute = function (attribute) {
    this.attributes.push(attribute)
}

/**
 * Edit an existing attribute in the class
 */
Class.prototype.editAttribute = function (attributeIndex, newAttribute) {
    this.attributes[attributeIndex] = newAttribute
}

/**
 * Add an operation to this Class
 */
Class.prototype.addOperation = function (operation) {
    this.operations.push(operation)
}

/**
 * Edit an existing operation in the class
 */
Class.prototype.editOperation = function (operationIndex, newOperation) {
    this.attributes[operationIndex] = newOperation
}

/**
 * Handles the visibility operation in the Options menu
 */
Class.prototype.changeVisibility = function () {
    // If the +/- is currently visible, make it not visible
    if(this.isVisible) {
        for (let i = 0; i < this.attributes.length; i++) {
            // Code for making attributes invisible here
        }
        for (let j = 0; j < this.operations.length; j++) {
            // Code for making operations invisible here
        }
    }
    // If the +/- is not currently visible, make it visible
    else {
        for (let i = 0; i < this.attributes.length; i++) {
            // Code for making attributes visible here
        }
        for (let j = 0; j < this.operations.length; j++) {
            // Code for making operations visible here
        }
    }
}
