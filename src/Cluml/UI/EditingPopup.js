import {MainSingleton} from "../MainSingleton";
import {Attribute} from "../SanityElement/Attribute";
import {Operation} from "../SanityElement/Operation";

export const EditingPopup = function (component) {
    Object.defineProperty(this, 'popup', {
    });

    this.component = component;
    this.margin = 5;

    this.height = 35;
    this.width = 200;

    this.x = component.lastSelectedX;
    this.y = component.lastSelectedY;

    this.context = null;
    this.view = null;

    this.editingWhat = "";

    this.enterClose = false;

    this.font = "14px Times";
    this.text = null;
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.style.font = this.font;
    this.inputElement.style.position = 'absolute';
    this.inputElement.style.backgroundColor = '#e7e8b0';
    this.inputElement.style.outlineWidth = "0";
    this.inputElement.style.borderWidth = "0";
    this.inputElement.style.padding = "0";
    this.inputElement.style.margin = "0";

    this.inputElement.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            this.enterClose = true;
            this.close();
        }
    });
};

/**
 * Constructor
 * @type {EditingPopup}
 */
EditingPopup.prototype.constructor = EditingPopup;

/**
 * Draw function for the editing popup over the class name
 * @param context the context needed to draw this popup
 * @param view the view this popup will be drawn in
 * @param bounds the bounds of the class' name box
 * @param width the width of the class name box
 * @param height the height of the class name box
 * @param initialText the current name of the class
 */
EditingPopup.prototype.drawNameEdit = function(context, view, bounds, width, height, initialText) {
    this.context = context;
    this.view = view;
    this.editingWhat = "name";
    this.inputElement.defaultValue = initialText;
    this.inputElement.selectionStart = initialText.length;
    this.inputElement.style.top = bounds.bottom + "px";
    this.inputElement.style.left = bounds.left + 1 + "px";
    this.inputElement.style.width = width - 2 + "px";
    this.inputElement.style.height = height - 2 + "px";
    this.inputElement.style.textAlign = "center";
    MainSingleton.currentTabDiv.append(this.inputElement);
    this.inputElement.focus();
    this.inputElement.select();
}

/**
 * Draw function for the editing popup over the attributes/operations of the class
 * @param context the context needed to draw this popup
 * @param view the view this popup will be drawn in
 * @param x the x value of this popup rectangle
 * @param y the y value of this popup rectangle
 * @param width the width of this popup rectangle
 * @param height the height of this popup rectangle
 * @param type are you editing an attribute or an operation?
 * @param initialText the current value of the attribute/operation being edited
 */
EditingPopup.prototype.drawAttributionEdit = function(context, view, x, y,
                                                      width, height, type, initialText) {
    this.context = context;
    this.view = view;
    this.editingWhat = type;
    this.inputElement.defaultValue = initialText;
    this.inputElement.selectionStart = initialText.length;
    this.inputElement.style.top = y + 1 + "px";
    this.inputElement.style.left = x + 4 + "px";
    this.inputElement.style.width = width - 6 + "px";
    this.inputElement.style.height = height - 2 + "px";
    MainSingleton.currentTabDiv.append(this.inputElement);
    this.inputElement.focus();
    this.inputElement.select();
}

/**
 * Close the EditingPopup if the class is touched outside the EditingPopup
 * @param x touch position (unused)
 * @param y touch position (unused)
 */
EditingPopup.prototype.touch = function(x, y) {
    if(!this.enterClose) {
        this.close();
    }
}

/**
 * A function that runs once this EditingPopup.js has been closed
 * by the user through Enter or clicking off of the inputElement.
 */
EditingPopup.prototype.close = function() {
    this.text = this.inputElement.value;
    this.inputElement.remove();
    this.updateClass();
}

/**
 * Updates the class based on changes made by the inputElement inside
 * this EditingPopup.js object
 */
EditingPopup.prototype.updateClass = function() {
    // Create a backup of the class before making edits
    MainSingleton.singleton.backup();
    // Editing the name field
    if (this.editingWhat === "name") {
        // Only edit the class name if the editing box is not empty
        if(this.text !== "") {
            const diagram = this.component.diagram;
            const count = diagram.classMap.get(this.component.naming);
            if (count === 1) {
                diagram.classMap.delete(this.component.naming);
            }
            else {
                diagram.classMap.set(this.component.naming, count - 1);
            }
            this.component.naming = this.text;

            if(!diagram.classMap.has(this.text)) {
                diagram.classMap.set(this.text, 0);
            }
            diagram.classMap.set(this.text, diagram.classMap.get(this.text) + 1);
        }
    }
    // Editing an attribute field
    else if (this.editingWhat === "attribute") {
        // Determine what attribute needs to be changed first, then change it
        let boxHeight = this.component.attributesHeight /
            this.component.attributes.length;
        let selectedAttributeNumber = Math.floor((this.component.lastSelectedY
            - this.component.attributesBounds.bottom) / boxHeight)
        // Only edit an existing attribute if the editing box is not empty
        if(this.text !== "") {
            this.component.attributes[selectedAttributeNumber] =
                new Attribute(this.text, this.component);
        }
        // If the editing box is empty, delete the attribute from the class
        else {
            this.component.deleteAttribute(selectedAttributeNumber);
        }
    }
    // Editing an operation field
    else if (this.editingWhat === "operation") {
        // Determine what operation needs to be changed first, then change it
        let boxHeight = this.component.operationsHeight /
            this.component.operations.length;
        let selectedOperationNumber = Math.floor((this.component.lastSelectedY
            - this.component.operationsBounds.bottom) / boxHeight)
        // Only edit an existing operation if the editing box is not empty
        if(this.text !== "") {
            let newOperation = new Operation(this.text);
            newOperation.abstract = this.component.operations[selectedOperationNumber].abstract;
            this.component.operations[selectedOperationNumber] = newOperation;
        }
        // If the editing box is empty, delete the operation from the class
        else {
            this.component.deleteOperation(selectedOperationNumber);
        }
    }
    this.component.setClassWidth();
}