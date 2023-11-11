import {Component} from "../Component";
import {Rect} from "../Utility/Rect";
import {PaletteImage} from "../Graphics/PaletteImage";
import {AddPopup} from "../UI/AddPopup";
import Vector from "../Utility/Vector";
import {ClassName} from "../SanityElement/ClassName";
import {EditingPopup} from "../UI/EditingPopup";
import Selectable, {ITALICS_FONT, NAME_FONT} from "../Selectable";
import {ClassPropertiesDlg} from "../Dlg/ClassPropertiesDlg";
import {SanityElement} from "../SanityElement/SanityElement";
import {Attribute} from "../SanityElement/Attribute";
import {Operation} from "../SanityElement/Operation";
import {SanityErrorInfo} from "../SanityElement/SanityErrorInfo";

export const Class = function () {
    Component.call(this);

    this.forwardSanityCheck = function* () {
        yield new ClassName(this.naming);
        yield * this.attributes;
        yield * this.operations;

        // Check if the number of attributes and operations exceeds the property limit
        if (this.attributes.length + this.operations.length > this.propertyLimit)
        {
            let error = new SanityElement(this.naming, undefined);
            error.processSanityCheck = function() {
                return [new SanityErrorInfo("1100", "Class", this.elementValue,
                    `Exceeded the limit of ${
                    Class.prototype.propertyLimit} attributes and operations per class`)];
            };
            yield error;
        }

        // check for attributes having the same name
        const map = new Map();
        const name = this.naming;
        for (const attribute of this.attributes) {
            if (!map.has(attribute.name)) {
                map.set(attribute.name, 1);
            }
            else {
                const count = map.get(attribute.name);
                // only generate the error once per unique attribute name
                if (count === 1) {
                    let error = new SanityElement(this.naming, undefined);
                    error.processSanityCheck = function() {
                        return [new SanityErrorInfo("1100", "Class",
                            name, `Multiple attributes with the name <b>${attribute.name}</b>`)];
                    };
                    yield error;
                }
                map.set(attribute.name, count + 1);
            }
        }
    }

    /**
     * Component height.
     * @type {number}
     */
    Object.defineProperty(this, 'height', {
        get: function () {
            if (!this.attributesHeight && !this.operationsHeight)
                return this.nameHeight + this.lineHeight;
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
     * @type{Array<Attribute>}
     */
    this.attributes = [new Attribute('-attribute: string')];

    /**
     * The array of operations.
     * @type{Array<Operation>}
     */
    this.operations = [new Operation('-operation(): string')];

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

    /**
     * The font height for this class
     * @type {number}
     */
    this.fontHeight = 14;

    /**
     * The x-value of the mouse the last time this class was selected
     * @type {number}
     */
    this.lastSelectedX = 0;

    /**
     * The y-value of the mouse the last time this class was selected
     * @type {number}
     */
    this.lastSelectedY = 0;

    /**
     * Represents whether this class is a regular class or a variation
     * @type {boolean}
     */
    this.isVariation = false;

    Object.defineProperty(this, 'lineHeight', {
        get: function() {
            return this.fontHeight * 1.5;
        }
    });

    Object.defineProperty(this, 'nameHeight', {
        get: function () {
            if(this.isVariation) {
                return this.fontHeight * 2.8;
            }
            else {
                return this.fontHeight * 1.75;
            }
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

Class.help = 'class';
Class.label = 'Class';
Class.desc = 'Class';

Class.prototype.showVisibility = false;

// limit on the total number of attributes and operations a class can have
Class.prototype.propertyLimit = 20;

/**
 * Copies from another component.
 * @param component {Class}
 */
Class.prototype.copyFrom = function (component) {
    // Create a new array of attributes and operations for the
    // new class
    this.attributes = []
    this.operations = []
    // Copy over the attribute objects from the existing class
    for (let i = 0; i < component.attributes.length; i++) {
        // Attributes in the new class must be initialized first
        this.attributes.push(new Attribute(""));
        // Then copied from the old class
        this.attributes[i].copyFrom(component.attributes[i]);
    }
    // Copy over the operation objects from the existing class
    for (let j = 0; j < component.operations.length; j++) {
        // Operations in the new class must be initialized first
        this.operations.push(new Operation(""));
        // Then copied from the old class
        this.operations[j].copyFrom(component.operations[j]);
    }
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

Class.prototype.move = function (dx, dy, x, y) {
    Selectable.prototype.move.call(this, dx, dy, x, y);

    // Make sure any attached tNodes are moved with this class.
    for (const tNode of this.attachedTNodes) {
        tNode.refreshPosition();
    }
}

/**
 * Double click event handler for Class boxes
 * @param x touch position
 * @param y touch position
 */
Class.prototype.doubleClick = function(x, y) {
    Selectable.prototype.doubleClick.call(this, x, y);
    this.lastSelectedX = x;
    this.lastSelectedY = y;
    this.enableEditing(true);
}

/**
 * Right click event handler for Class boxes
 * @param x touch position
 * @param y touch position
 */
Class.prototype.rightClick = function(x,y)
{
    this.enableAddPopup(true);
}

/**
 * Open a ClassPropertiesDlg box
 */
Class.prototype.openProperties = function() {
    const propertiesDlg = new ClassPropertiesDlg(this, this.main, false);
    propertiesDlg.open();
}

/**
 * Verify if the context menu was touched
 * @param x touch position
 * @param y touch position
 * @returns {touched}
 */
Class.prototype.tryTouchAddPopup = function (x, y) {
    if (this.addPopup != null) {
        return this.addPopup.touch(x, y);
    }
    return null;
}

/**
 * Verify if the editing popup was touched
 * @param x touch position x
 * @param y touch position y
 * @returns {touched}
 */
Class.prototype.tryTouchEditingPopup = function (x, y) {
    if (this.editingPopup != null) {
        return this.editingPopup.touch(x, y);
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

/**
 * Open or close the context menu
 * @param enable
 */
Class.prototype.enableAddPopup = function (enable) {
    if (enable) {
        this.addPopup = new AddPopup(this);
    } else {
        this.addPopup = null;
    }
}

/**
 * Go into and out of editing mode
 * @param enable determines whether editing mode is enabled or not
 */
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

    // Sort Attributes/Operations before drawing text to the class
    this.sortAttributions();

    context.beginPath();
    context.fillStyle = "#e7e8b0";
    context.strokeStyle = "#000000";

    // Class Name rect
    this.nameBounds.contextRect(context);

    // Attribute rect
    this.attributesBounds.contextRect(context);

    // Operations rect
    this.operationsBounds.contextRect(context);

    // If class is empty, draw a 1 line box
    if (this.attributes.length == 0 && this.operations.length == 0)
        context.rect(this.x-(this.width/2),this.y + this.nameHeight, this.width, this.lineHeight);

    context.fill();
    context.stroke();

    // Defaults the name to ClassName: UniqueName if no name is given
    if (this.naming == null) {
        this.naming = "Class";
    }

    // Naming text
    context.fillStyle = "#000000";
    let oldColor = new ClassName(this.naming).modifyContextFill(context);
    if (this.abstract)
    {
        if (this.isVariation) {
            this.drawName(context,
                0,
                this.fontHeight * 2.25,
                ITALICS_FONT);
        }
        else {
            this.drawName(context,
                0,
                this.fontHeight * 1.25,
                ITALICS_FONT);
        }
    }
    else
    {
        if (this.isVariation) {
            this.drawName(context,
                0,
                this.fontHeight * 2.25,
                NAME_FONT);
        }
        else {
            this.drawName(context,
                0,
                this.fontHeight * 1.25,
                NAME_FONT);
        }
    }
    context.fillStyle = oldColor;

    context.textAlign = "left"
    context.font = NAME_FONT;

    // Attributes text
    let fromTop = this.nameHeight + this.fontHeight;
    for (let i = 0; i < this.attributes.length; i++) {
        const attribute = this.attributes[i];
        oldColor = attribute.modifyContextFill(context);
        const attributeText = attribute.elementValue.substring(
            !this.showVisibility && attribute.visibility !== '' ? 1 : 0);
        context.fillText(attributeText,
            this.x - this.width / 2 + 5,
            this.y + fromTop + i * this.lineHeight,
            this.width)
        context.fillStyle = oldColor;
    }

    // Operations text
    fromTop += this.attributesHeight;
    for (let j = 0; j < this.operations.length; j++) {
        if (this.operations[j].abstract)
        {
            context.font = ITALICS_FONT;
        }
        else
        {
            context.font = NAME_FONT;
        }
        const operation = this.operations[j];
        oldColor = operation.modifyContextFill(context);
        const operationText = operation.elementValue.substring(
            !this.showVisibility && operation.visibility !== '' ? 1 : 0);
        context.fillText(operationText,
            this.x - this.width / 2 + 5,
            this.y + fromTop + j * this.lineHeight,
            this.width)
        context.fillStyle = oldColor;
    }
    context.font = NAME_FONT;
    if (this.addPopup != null) {
        this.addPopup.draw(context, view, this.x, this.y);
    }

    if (this.editingPopup != null) {
        if (this.editingPopup.text === null) {
            // name box
            if (this.lastSelectedY < this.attributesBounds.bottom) {
                if (this.isVariation) {
                    this.editingPopup.drawNameEdit(context, view,
                        Rect.fromTopAndSize(new Vector(this.x, this.y + this.nameHeight/2),
                            new Vector(this.width, this.nameHeight)),
                        this.width, this.nameHeight/3, this.naming);
                }
                else {
                    this.editingPopup.drawNameEdit(context, view, this.nameBounds,
                        this.width, this.nameHeight, this.naming);
                }
            }
            // attribute box
            else if (this.lastSelectedY < this.operationsBounds.bottom) {
                let boxHeight = this.attributesHeight / this.attributes.length;
                let selectedAttributeNumber = Math.floor((this.lastSelectedY
                    - this.attributesBounds.bottom) / boxHeight)
                let selectedAttributeHeight = this.attributesBounds.bottom
                    + (selectedAttributeNumber * boxHeight)
                this.editingPopup.drawAttributionEdit(context,
                    view,
                    this.x - this.width / 2,
                    selectedAttributeHeight,
                    this.width,
                    boxHeight,
                    "attribute",
                    this.attributes[selectedAttributeNumber].elementValue);
            }
            // operation box
            else if (this.lastSelectedY < this.operationsBounds.top) {
                let boxHeight = this.operationsHeight / this.operations.length;
                let selectedOperationNumber = Math.floor((this.lastSelectedY
                    - this.operationsBounds.bottom) / boxHeight)
                let selectedOperationHeight = this.operationsBounds.bottom
                    + (selectedOperationNumber * boxHeight)
                this.editingPopup.drawAttributionEdit(context,
                    view,
                    this.x - this.width / 2,
                    selectedOperationHeight,
                    this.width,
                    boxHeight,
                    "operation",
                    this.operations[selectedOperationNumber].elementValue);
            }
        }
    }
    Component.prototype.draw.call(this, context, view);
}

Class.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
    obj.attributes = SanityElement.saveMultiple(this.attributes);
    obj.operations = SanityElement.saveMultiple(this.operations);
    obj.width = this.width;
    return obj;
}

Class.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent.call(this, obj);
    
    this.attributes = SanityElement.loadMultiple(Attribute, 'attributes', obj, this);
    this.operations = SanityElement.loadMultiple(Operation, 'operations', obj, this);
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
    // Create a backup of the class before adding a new attribute
    this.main.backup();
    this.attributes.push(attribute);
}

/**
 * Deletes an attribute from this class' attributes
 * @param attributeIndex the index in attributes of the attribute to be deleted
 */
Class.prototype.deleteAttribute = function (attributeIndex) {
    this.attributes.splice(attributeIndex, 1);
}

/**
 * Deletes an operation from this class' operations
 * @param operationIndex the index in operations of the operation to be deleted
 */
Class.prototype.deleteOperation = function (operationIndex) {
    this.operations.splice(operationIndex, 1);
}

/**
 * Get attributes (component.attributes was giving me issues in a diff class)
 * @returns {Array<Attribute>}
 */
Class.prototype.getAttributes = function() {
    return this.attributes;
}


/**
 * Get operations
 * @returns {Array<Operation>}
 */
Class.prototype.getOperations = function() {
    return this.operations;
}

/**
 * Sorts attributes/operations with regex so that operations appear
 * in the operations box and attributes appear in the attributes box
 */
Class.prototype.sortAttributions = function() {
    let pattern = /\(/i
    // Get operations out of the attributes array and into the operations
    // array
    for(let i = 0; i < this.attributes.length; i++) {
        if(pattern.test(this.attributes[i].elementValue)) {
            let operation = this.attributes.splice(i, 1);
            // This code will need to be updated when Operations.js is
            // implemented
            this.operations.push(new Operation(operation[0].elementValue));
        }
    }
    // Get attributes out of the operations array and into the attributes
    // array
    for(let j = 0; j < this.operations.length; j++) {
        if(!pattern.test(this.operations[j].elementValue)) {
            let attribute = this.operations.splice(j, 1);
            this.attributes.push(new Attribute(attribute[0].elementValue));
        }
    }
}

/**
 * Delete function that is called when a class is deleted.
 * This function overrides the Component.js delete function.
 * This deletes all the associations attached to the class with the class.
 */
Class.prototype.delete = function() {
    if(this.attachedTNodes !== []) {
        for(let i = 0; i < this.attachedTNodes.length; i++) {
            this.attachedTNodes[i].delete();
        }
    }
    Component.prototype.delete.call(this);
}
