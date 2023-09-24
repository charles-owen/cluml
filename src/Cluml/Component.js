import {Selectable} from './Selectable';
import {ComponentPropertiesDlg} from './Dlg/ComponentPropertiesDlg';

import DOMPurify from 'dompurify';
import {Rect} from "./Utility/Rect";

//region Constants
/**
 * The default font for the drawName function.
 * @type {string}
 */
export const NAME_FONT = "14px Times";

/**
 * The default font for the drawText function.
 * @type {string}
 */
export const CONTENT_FONT = "14px Times";

/**
 * If true, then show the bounds of the component.
 * @type {boolean}
 */
export const DEBUG_BOUNDS = true;
//endregion

/**
 * Base object for a component in a diagram.
 * @constructor
 */
export const Component = function () {
    Selectable.call(this);

    /**
     * The diagram.
     * @type {Diagram}
     */
    let diagram = null;

    Object.defineProperty(this, 'diagram', {
        get: function () {
            return diagram;
        },
        set: function (value) {
            diagram = value;
        }
    });

    this.prev = null;

    /**
     * Will be set to a unique id for this component.
     * @type {string}
     */
    this.id = '';
    /**
     * The diagram.
     * @type {Diagram}
     */
    this.diagram = null;
    /**
     * Naming, as in U1 or I1.
     * @type {string | null}
     */
    this.naming = null;
};

Component.prototype = Object.create(Selectable.prototype);
Component.prototype.constructor = Component;


//region Variables
/**
 * Prefix for component naming
 * @type {string}
 */
Component.prototype.prefix = "U";
/**
 * Whether the name is required or not.
 * @type {boolean}
 */
Component.prototype.nameRequired = false;
/**
 * Propagation delay in nanoseconds (doubt that we will be using this for
 * Cluml, but I'll keep it for now.)
 * @type {number}
 */
Component.prototype.delay = 11;

/**
 * Assign this component a unique ID. This is done when a
 * component is created by the view.
 */
Component.prototype.brand = function () {
    // Every component get a unique ID when it is created
    this.id = 'd' + (++Component.maxId);
}

/**
 * A simple description for the component.
 * @type {string}
 */
Component.prototype.paletteDesc = '[UNSET]';

/**
 * A longer HTML description.
 * @type {string}
 */
Component.prototype.htmlDesc = '[UNSET]'

/**
 * Label for the palette.
 * @type {string}
 */
Component.prototype.paletteLbl = '[UNSET]';

/**
 * Label for the save file.
 * @type {string}
 */
Component.prototype.fileLbl = '[UNSET]';

/**
 * Label used to determine which help screen to show.
 * @type {string}
 */
Component.prototype.helpLbl = '[UNSET]';

/**
 * Order of which the component will appear in the palette.
 * @type {number}
 */
Component.prototype.paletteOrder = -1;

/**
 * Maximum ID integer value for any component
 * @type {number}
 */
Component.maxId = 1000;
//endregion

/**
 * Copies from another component
 * @param component {Component}
 */
Component.prototype.copyFrom = function (component) {
    this.prev = component.prev;
    this.naming = component.naming;
    this.id = component.id;
    this.placedOnCanvas = component.placedOnCanvas;
    component.prev = this;
    Selectable.prototype.copyFrom.call(this, component);
};

/**
 * Called right after the object in undone. This does not pass
 * any variables, so everything needs to be saved with the component.
 */
Component.prototype.onUndo = function () {

}

Component.prototype.grab = function () {
    Selectable.prototype.grab.call(this);

    this.diagram.moveToFront(this);
}

Component.prototype.mouseUp = function () {

};



/**
 * Called when a component is added to a diagram
 * @param diagram {Diagram}
 */
Component.prototype.added = function (diagram) {
    this.diagram = diagram;

    if (this.naming === null && this.nameRequired) {
        // Create a new name
        for (let i = 1; ; i++) {
            let naming;
            if (this.prefix.charAt(0) === "*") {
                if (i <= 26) {
                    naming = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i - 1);
                } else {
                    naming = this.prefix.charAt(1) + (i - 26);
                }
            } else {
                naming = this.prefix + i;
            }

            const existing = this.diagram.getComponentByNaming(naming);
            if (existing === null) {
                this.naming = naming;
                break;
            }
        }
    }
};

/**
 * Try to touch this component or some part of
 * the component.
 * @param x {number} Mouse X
 * @param y {number} Mouse Y
 * @return {Component}
 */
Component.prototype.touch = function (x, y) {
    throw new Error("Not implemented");
};

/**
 * Collect all of this component and any bends that
 * are contained in the rectangle.
 * @param rect {Rect} Rectangle to test
 * @param collect Collection (array) to add items to.
 */
Component.prototype.inRect = function (rect, collect) {
    if (rect.contains(this.x, this.y)) {
        collect.push(this);
    }

    // this.outs.forEach(function (out) {
    //     out.selectRect(rect, collect);
    // });
};

Component.prototype.enableAddPopup = function(enable) {

}

Component.prototype.delete = function () {
    // let i;
    // // Delete all connections
    // for (i = 0; i < this.ins.length; i++) {
    //     this.ins[i].clear();
    // }
    //
    // for (i = 0; i < this.outs.length; i++) {
    //     this.outs[i].clear();
    // }

    this.diagram.delete(this);
};

/**
 * Compute a bounding box that completely contains the component
 * @returns {Rect}
 */
Component.prototype.bounds = function () {
    throw new Error('No implementation');
}

/**
 * Draw component object.
 *
 * Default version for simple box objects
 * @param context Display context
 * @param view View object
 */
Component.prototype.draw = function (context, view) {
    if (DEBUG_BOUNDS) {
        context.fillStyle = "rgba(231,89,89,0.25)";
        this.bounds().fillRect(context);
    }
}

/**
 * Save the component basic properties to an object
 *
 * The character ' is replaced with `. This is so the
 * output JSON won't have any ' characters that would
 * cause problems in PHP and Javascript
 *
 * @returns {{id: string, x: number, y: number, name: string, type: *}}
 */
Component.prototype.saveComponent = function () {
    let naming = this.naming;
    if (naming !== null) {
        naming = naming.replace(/'/g, '`');
    }
    return {
        "id": this.id,
        "x": this.x,
        "y": this.y,
        "name": naming,
        "placed": this.placedOnCanvas,
        "paletteDesc": this.paletteDesc,
        "htmlDesc": this.htmlDesc,
        "paletteLbl": this.paletteLbl,
        "fileLbl": this.fileLbl,
        "helpLbl": this.helpLbl
    };
};

/**
 * Loads the specified component
 * @param obj {*}
 */
Component.prototype.loadComponent = function (obj) {
    this.id = this.sanitize(obj["id"]).toString();

    // Determine the maximum loaded ID value as we load
    // in new diagrams.
    const idValue = +this.id.substring(1);
    if (idValue > Component.maxId) {
        Component.maxId = idValue;
    }

    this.x = +obj["x"];
    this.y = +obj["y"];
    this.moveX = this.x;
    this.moveY = this.y;
    let naming = obj["name"];
    this.placedOnCanvas = obj.placed;
    if (naming !== null) {
        this.naming = this.sanitize(naming).toString().replace(/`/g, "'");
    } else {
        this.naming = null;
    }

    this.paletteDesc = obj["paletteDesc"];
    this.htmlDesc = obj["htmlDesc"];
    this.paletteLbl = obj["paletteLbl"];
    this.fileLbl = obj["fileLbl"];
    this.helpLbl = obj["helpLbl"];
};

Component.prototype.properties = function (main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    dlg.open();
};

/**
 * Advance the animation for this component by delta seconds
 * @param delta {number} Time to advance in seconds
 * @returns {boolean} true if animation needs to be redrawn
 */
Component.prototype.advance = function (delta) {
    return false;
};

/**
 * Clone this component.
 * @return {Component} or inherited.
 * @instance Component or inherited.
 */
Component.prototype.clone = function () {
    const copy = new this.constructor();
    copy.copyFrom(this);
    return copy;
}

/**
 * Create a PaletteImage object for the component
 * @returns {PaletteImage}
 */
Component.prototype.paletteImage = function() {
    return null;
}

/**
 * Many components are just a box. This is a function to draw that box
 * @param context Context to draw on
 * @param fillStyle
 * @param width {number} Width of the box.
 * @param height {number} Height of the box.
 */
Component.prototype.drawBox = function (context, fillStyle, width, height) {
    if (fillStyle !== 'none') {
        let save = context.fillStyle;
        context.fillStyle = fillStyle !== undefined ? fillStyle : '#ffffff';
        context.fillRect(this.x - width / 2 - 0.5,
            this.y - height / 2 - 0.5,
            width, height);
        context.fillStyle = save;
    }

    context.beginPath();
    context.rect(
        this.x - width / 2 - 0.5,
        this.y - height / 2 - 0.5,
        width, height);
    context.stroke();
}


/**
 * This function is called when an input is changed on this
 * component. It indicates that we need to queue a simulation
 * event for this component.
 */
Component.prototype.pending = function () {
    const delay = this.delay * 0.1;
    const state = [];
    // for (let i = 0; i < this.ins.length; i++) {
    //     state.push(this.ins[i].value);
    // }

    if (this.diagram.diagrams !== null) {
        this.diagram.diagrams.simulation.queue(this, delay, state);
    }
};

Component.prototype.getSimulation = function () {
    if (this.diagram !== null) {
        return this.diagram.diagrams.simulation;
    }

    return null;
}

/**
 * Determine the propagation delay for this device
 */
Component.prototype.getDelay = function () {
    return this.delay;
};

Component.prototype.compute = function (state) {
};

Component.prototype.newTab = function () {
};

/**
 * Draw the name of a component
 * @param context Context to draw on
 * @param x X location
 * @param y Y location
 * @param font Optional font to use
 */
Component.prototype.drawName = function (context, x, y, font) {
    // Name
    if (this.naming !== null) {
        context.beginPath();
        context.font = font !== undefined ? font : NAME_FONT;
        context.textAlign = "center";
        context.fillText(this.naming, this.x + x, this.y + y);
        context.stroke();
    }
};

/**
 * Draw text on a component
 * @param context Context to draw on
 * @param text Text to draw
 * @param x X location
 * @param y Y location
 * @param font Optional font to use
 */
Component.prototype.drawText = function (context, text, x, y, font) {
    context.beginPath();
    context.font = font !== undefined ? font : CONTENT_FONT;
    context.textAlign = "center";
    context.fillText(text, this.x + x, this.y + y);
    context.stroke();
}

/**
 * Many diagrams are a trapezoid. This is a function to draw that trapezoid
 * @param context Context to draw on
 * @param indentL {number} Top/bottom indent size for left side (default = 0)
 * @param indentR {number} Top/bottom indent size for right size (default = 20)
 * @param width {number} Width of the trapezoid.
 * @param height {number} Height of the trapezoid.
 */
Component.prototype.drawTrapezoid = function (context, width, height, indentL, indentR) {
    if (indentL === undefined) {
        indentL = 0;
    }

    if (indentR === undefined) {
        indentR = 20;
    }

    const leftX = this.x - width / 2 - 0.5;
    const rightX = this.x + width / 2 + 0.5;
    const topY = this.y - height / 2 - 0.5;
    const botY = this.y + height / 2 + 0.5;

    context.fillStyle = '#ffffff';
    // Left side
    context.beginPath();
    context.moveTo(leftX, topY + indentL);
    context.lineTo(leftX, botY - indentL);

    // Bottom
    context.lineTo(rightX, botY - indentR);

    // Right side
    context.lineTo(rightX, topY + indentR);

    // Top
    context.lineTo(leftX, topY + indentL);

    context.fill();

    context.stroke();
}

// /**
//  * Ability to send a command to a component.
//  *
//  * Commands are sent by tests.
//  *
//  * Default commands are...
//  * type:InPinBus - Validates that a component is the correct type.
//  *
//  * @return null if not handled, or command result otherwise.
//  */
// Component.prototype.command = function (value) {
//     if ((typeof value === 'string' || value instanceof String) &&
//         value.substr(0, 5) === "type:") {
//         const expected = value.substr(5);
//         if (expected !== this.constructor.fileLbl) {
//
//             let expectedType = this.diagram.diagrams.model.main.diagrams.get(expected);
//             if (expectedType !== null) {
//                 expectedType = expectedType.label;
//             } else {
//                 expectedType = expected;
//             }
//
//             return {
//                 ok: false,
//                 msg: "Component " + this.naming + " should be type <strong>" +
//                 expectedType + "</strong> but is <strong>" +
//                 this.constructor.label + "</strong>"
//             }
//         }
//     } else {
//         return null;
//     }
//
//     return {ok: true};
// }

// /**
//  * Override in the settable types, such as InPin and InPinBus
//  * @param value Value to set
//  */
// Component.prototype.setAsString = function (value) {
// }
//
//
// /**
//  * Override in the string testable types, such as InPin and InPinBus
//  * @param value Value to set
//  * @param input In object
//  */
// Component.prototype.testAsString = function (value, input) {
//     console.log(value);
// }

/**
 * Draw a jagged (stair-step) line from x1,y1 to x2,y2
 * @param context Context to draw on
 * @param x1 Starting x
 * @param y1 Starting y
 * @param x2 Ending x
 * @param y2 Ending y
 * @param t Percentage of say from x1 to x2 the vertical line is
 */
Component.prototype.jaggedLine = function (context, x1, y1, x2, y2, t) {
    const xh = Math.round(x1 + (x2 - x1) * t) + 0.5;
    y1 += 0.5;
    y2 += 0.5;

    context.moveTo(x1, y1);
    context.lineTo(xh, y1);
    context.lineTo(xh, y2)
    context.lineTo(x2, y2);
    context.stroke();
}


/**
 * Sanitize text from user input and files to prevent XSS attacks.
 * @param text Text to sanitize
 * @returns Sanitized version
 */
Component.prototype.sanitize = function (text) {
    return DOMPurify.sanitize(text);
}

/**
 * Update component after a diagram change.
 * This is used by DiagramRef diagrams to ensure
 * references are always correct.
 */
Component.prototype.update = function () {

}