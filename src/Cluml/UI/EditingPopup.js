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

    this.font = "14px Times";
    this.text = "";
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
    this.inputElement.style.top = y + "px";
    this.inputElement.style.left = x + 6 + "px";
    this.inputElement.style.width = width - 7 + "px";
    this.inputElement.style.height = height - 2 + "px";
    MainSingleton.currentTabDiv.append(this.inputElement);
    this.inputElement.focus();
    this.inputElement.select();
}

EditingPopup.prototype.touch = function(x, y) {
    this.close();
}

EditingPopup.prototype.close = function() {
    this.text = this.inputElement.value;
    this.inputElement.remove();
    this.updateClass();
    this.component.draw(this.context, this.view);
}

EditingPopup.prototype.updateClass = function() {
    // Only update the text field if the user enters something
    if(this.text !== "") {
        // Editing the name field
        if (this.editingWhat === "name") {
            this.component.naming = this.text
        }
        // Editing an attribute field
        else if (this.editingWhat === "attribute") {
            // Determine what attribute needs to be changed first, then change it
            let boxHeight = this.component.attributesHeight /
                this.component.attributes.length;
            let selectedAttributeNumber = Math.floor((this.component.lastSelectedY
                - this.component.attributesBounds.bottom) / boxHeight)
            this.component.attributes[selectedAttributeNumber] =
                new Attribute(this.text);
        }
        // Editing an operation field
        else if (this.editingWhat === "operation") {
            // Determine what operation needs to be changed first, then change it
            let boxHeight = this.component.operationsHeight /
                this.component.operations.length;
            let selectedOperationNumber = Math.floor((this.component.lastSelectedY
                - this.component.operationsBounds.bottom) / boxHeight)
            this.component.operations[selectedOperationNumber] =
                new Operation(this.text);
        }
    }
}