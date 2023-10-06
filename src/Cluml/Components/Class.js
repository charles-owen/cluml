import {Component} from "../Component";
import {Rect} from "../Utility/Rect";
import {PaletteImage} from "../Graphics/PaletteImage";
import Vector from "../Utility/Vector";
import {ClassName} from "../SanityElement/ClassName";
import Selectable, {ITALICS_FONT, NAME_FONT} from "../Selectable";
import {ClassPropertiesDlg} from "../Dlg/ClassPropertiesDlg";
import Unique from "../Utility/Unique";
import {SanityElement} from "../SanityElement/SanityElement";
import {Operation} from "../SanityElement/Operation";
import {TextInput} from "../Input/TextInput";
import {Attribute} from "../SanityElement/Attribute";
import {CustomContextMenu} from "../ContextMenu/CustomContextMenu";
import {MainSingleton} from "../MainSingleton";

export const Class = function () {
    Component.call(this);

    this.forwardSanityCheck = function* () {
        // yield this.className;
        yield* this.attributes;
        yield* this.operations;
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

    Object.defineProperty(this, 'width', {
        get: function () {
            let widest = this.className.minBounds().width;

            for (const element of [...this.attributes, ...this.operations]) {
                const w = element.minBounds().width;
                if (widest < w) {
                    widest = w;
                }
            }

            return Math.max(200, widest + 5);
        }
    })


    Object.defineProperty(this, 'size', {
        get: function () {
            return new Vector(this.width, this.height);
        }
    })

    this.className = new ClassName('', this);

    /**
     * The array of attributes.
     * @type{Array<Attribute>}
     */
    this.attributes = [new Attribute('+attribute1 : type', this)];

    /**
     * The array of operations.
     * @type{Array<Operation>}
     */
    this.operations = [new Operation('+operation1(param : type) : returnType', this)];

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

    this.abstract = false;

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

    Object.defineProperty(this, 'lineHeight', {
        get: function () {
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
 * Gets the bounds of the nth operation.
 * @param n {number}
 * @return {Rect}
 */
Class.prototype.boundsOfNthOperation = function (n) {
    const topStart = this.y + this.nameHeight + this.attributesHeight;
    return Rect.fromTopAndSize(
        new Vector(this.x, topStart + this.lineHeight * n),
        new Vector(this.width, this.lineHeight)
    );
}

/**
 * Returns the bounds of the specified operation.
 * @param operation {Operation}
 * @return {Rect}
 */
Class.prototype.boundsOfOperation = function (operation) {
    return this.boundsOfNthOperation(this.operations.indexOf(operation));
}

/**
 * Gets the bounds of the nth attribute.
 * @param n {number}
 * @return {Rect}
 */
Class.prototype.boundsOfNthAttribute = function (n) {
    const topStart = this.y + this.nameHeight;
    return Rect.fromTopAndSize(
        new Vector(this.x, topStart + this.lineHeight * n),
        new Vector(this.width, this.lineHeight)
    );
}

/**
 * Returns the bounds of the specified attribute.
 * @param attribute {Attribute}
 * @return {Rect}
 */
Class.prototype.boundsOfAttribute = function (attribute) {
    return this.boundsOfNthAttribute(this.attributes.indexOf(attribute));
}

/**
 * Copies from another component.
 * @param component {Class}
 */
Class.prototype.copyFrom = function (component) {
    this.className = component.className;
    this.operations = component.operations;
    this.attributes = component.attributes;
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
    Component.prototype.move.call(this, dx, dy, x, y);

    // Not strictly needed, but helps smooth out the moving.
    for (const node of this.attachedTNodes) {
        node.move(dx, dy, x, y);
    }
}

Class.prototype.doubleClick = function (x, y) {
    Selectable.prototype.doubleClick.call(this, x, y);

    for (const elem of [this.className, ...this.attributes, ...this.operations]) {
        const txtIn = TextInput.createFromMouseClick(x, y, this, elem, undefined,
            this.autoremove, undefined);

        if (txtIn !== undefined) {
            if (elem === this.className) {
                txtIn.inputElement.style.textAlign = 'center';
            }
            return;
        }
    }

    // Name/attributes/operation was not selected.
    this.openProperties();

    //this.enableAddPopup(true);
}

Class.prototype.rightClick = function (x, y) {
    Selectable.prototype.rightClick.call(this, x, y);

    const menu = new CustomContextMenu(this, new Vector(x, y));
    menu.addEntry('Add Attribute', () => {
        this.addAttribute();
    });
    menu.addEntry('Add Operation', () => {
        this.addOperation();
    });
    menu.addEntry('Properties', () => {
        this.openProperties();
    });
    menu.addEntry('Delete', () => {
        this.delete();
    })
}

Class.prototype.openProperties = function () {
    const propertiesDlg = new ClassPropertiesDlg(this, this.main);
    propertiesDlg.open();
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
 * Refreshes the positions of all the nodes in the attached associations.
 */
Class.prototype.refreshNodePositions = function () {
    for (const node of this.attachedTNodes) {
        node.refreshPosition();
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

    // Naming text
    if (this.abstract) {
        this.className.font = ITALICS_FONT;
    } else {
        this.className.font = NAME_FONT;
    }

    // this.naming = this.className.elementValue;

    this.className.position = new Vector(0, this.lineHeight / 2);
    this.className.draw(context, view);

    context.textAlign = "left"
    context.font = NAME_FONT;
    // boolean to check if attributes/operations' visibility should be drawn
    const visibility = this.diagram.diagrams.model.main.options.showVisibility;

    // Attributes text
    const size = this.size;
    let fromTop = this.nameHeight - this.lineHeight;
    for (const attribute of this.attributes) {
        attribute.textAlign = 'left';

        fromTop += this.lineHeight / 2;
        attribute.position = new Vector(-size.x / 4, fromTop);

        attribute.draw(context, view);
    }

    // Operations text
    for (const operation of this.operations) {
        operation.textAlign = 'left';

        fromTop += this.lineHeight / 2;
        operation.position = new Vector(-size.x / 4, fromTop);

        operation.draw(context, view);
    }

    if (this.editingPopup != null) {
        // name box
        if (this.lastSelectedY < this.attributesBounds.bottom) {
            this.editingPopup.drawNameEdit(context, view, this.nameBounds,
                this.width, this.nameHeight, this.naming);
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
                this.attributes[selectedAttributeNumber].name);
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
                this.operations[selectedOperationNumber]);
        }
    }

    this.refreshNodePositions();

    Component.prototype.draw.call(this, context, view);
}

Class.prototype.saveComponent = function () {
    const obj = Component.prototype.saveComponent.call(this);
    obj.className = this.className.saveSanityElement();
    obj.attributes = SanityElement.saveMultiple(this.attributes);
    obj.operations = SanityElement.saveMultiple(this.operations);
    return obj;
}

Class.prototype.loadComponent = function (obj) {
    Component.prototype.loadComponent.call(this, obj);

    this.className = SanityElement.loadSanityElement(ClassName, obj.className, this);
    this.attributes = SanityElement.loadMultiple(Attribute, 'attributes', obj, this);
    this.operations = SanityElement.loadMultiple(Operation, 'operations', obj, this);
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

    if (this.className.elementValue === '') {
        // Need new name.
        this.className = new ClassName(Unique.uniqueClassedName('Class'), this)
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
 * Removes all empty attributes and operations.
 */
Class.prototype.autoremove = function () {
    const emptyRX = /^\s*$/;

    for (let i = 0; i < this.attributes.length; i++){
        const attribute = this.attributes[i];
        if (attribute.elementValue === null || emptyRX.test(attribute.elementValue)) {
            // Empty. Remove thing.
            this.attributes.splice(i, 1);
        }
    }

    for (let i = 0; i < this.operations.length; i++){
        const operation = this.operations[i];
        if (operation.elementValue === null || emptyRX.test(operation.elementValue)) {
            // Empty. Remove thing.
            this.operations.splice(i, 1);
        }
    }
}

/**
 * Add an attribute to this Class
 */
Class.prototype.addAttribute = function (attribute) {
    if (attribute === undefined) {
        attribute = new Attribute('', this);
        this.attributes.push(attribute);

        MainSingleton.singleton.redraw();
        TextInput.createFromSanityElement(this, attribute, undefined, this.autoremove, undefined);
    } else {
        this.attributes.push(attribute);
    }
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
    if (operation === undefined) {
        operation = new Operation('', this);
        this.operations.push(operation);

        MainSingleton.singleton.redraw();
        TextInput.createFromSanityElement(this, operation, undefined, this.autoremove, undefined);
    } else {
        this.operations.push(operation);
    }
}

/**
 * Edit an existing operation in the class
 */
Class.prototype.editOperation = function (operationIndex, newOperation) {
    this.attributes[operationIndex] = newOperation
}
