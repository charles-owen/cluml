import {Dialog} from "./Dialog";
import {Class} from "../Components/Class";

/**
 * Property limit dialog box
 * @constructor
 */
export const PropertyLimitDlg = function() {
    Dialog.call(this);

    this.open = function() {
        const html = document.createElement('div');

        this.input = document.createElement('input');
        this.input.type = 'number';
        this.input.min = '0';
        this.input.value = Class.prototype.propertyLimit;
        html.appendChild(this.input);

        // description
        const p = document.createElement('p');
        p.textContent = "Sets the limit on the total number of attributes and operations " +
            "a class can have before throwing a sanity check message";
        html.appendChild(p);

        this.contents(html, "Cluml Property Limit");
        Dialog.prototype.open.call(this);
    }

    this.ok = function() {
        // only except non-negative integers
        if (Number.isInteger(this.input.valueAsNumber) && this.input.valueAsNumber >= 0) {
            Class.prototype.propertyLimit = this.input.valueAsNumber;
            Dialog.prototype.ok.call(this);
        }
    }
}

PropertyLimitDlg.prototype = Object.create(Dialog.prototype);
PropertyLimitDlg.prototype.constructor = PropertyLimitDlg;