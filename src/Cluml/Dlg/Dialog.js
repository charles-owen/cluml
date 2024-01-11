import {Unique} from '../Utility/Unique';
import {Tools} from '../DOM/Tools';

import DOMPurify from 'dompurify';
import DialogCL from 'dialog-cl';


/**
 * Base object for general-purpose dialog boxes where the
 * functionality is assumed to be implemented in a derived object.
 * @param classes Classes to add to the dialog box
 * @constructor
 */
export const Dialog = function (classes) {
    this.classes = classes !== undefined ? 'cluml ' + classes : 'cluml';
    this.buttonOk = "Ok";
    this.buttonCancel = "Cancel";
    this.resize = 'none;'
    this.titleBarButtons = null;
}

/**
 * Set the dialog box contents
 * @param html {string, HTMLElement} HTML for the body
 * @param title Title for the title bar
 */
Dialog.prototype.contents = function (html, title) {
    this.html = html;
    this.title = title;
}

/**
 * Open the dialog box
 */
Dialog.prototype.open = function () {
    let form = document.createElement('form');
    let div = Tools.createClassedDiv('cluml-dlg-content');
    form.appendChild(div);

    if (typeof this.html === 'string') {
        div.innerHTML = this.html;
    } else {
        div.appendChild(this.html);
    }

    const p = document.createElement('p');
    p.className = 'error';
    div.appendChild(p);

    const inputSubmit = document.createElement('input');
    inputSubmit.type = 'submit';
    inputSubmit.tabIndex = -1;
    inputSubmit.style.position = 'absolute';
    inputSubmit.style.top = '-1000px';

    this.element = div;

    let buttons = [];
    if (this.buttonOk !== null) {
        buttons.push({
            contents: 'Ok',
            click: (dialog) => {
                this.ok();
            },
            focus: true,
            'class': 'cs-ok'
        });
    }

    if (this.buttonCancel !== null) {
        buttons.push({
            contents: 'Cancel',
            click: (dialog) => {
                dialog.close();
            },
            'class': 'cs-cancel'
        });
    }

    let dialog = new DialogCL({
        'addClass': this.classes,
        title: this.title,
        content: form,
        buttons: buttons,
        resize: this.resize,
        titleBarButtons: this.titleBarButtons
    });

    this.dialog = dialog;

    this.onOpen();

    this.close = function () {
        dialog.close();
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        this.ok();
    });

    this.buttonOk = function () {
        return this.dialog.div.querySelector('button.cs-ok');
    }
}

Dialog.prototype.ok = function () {
    this.close();
}


Dialog.prototype.error = function (msg) {
    if (msg !== undefined) {
        this.element.querySelector('.error').innerHTML = msg;
    }
}

Dialog.prototype.cancel = function () {
}

Dialog.prototype.onOpen = function () {
}

/**
 * Sanitize text from user input to prevent XSS attacks.
 * @param text Text to sanitize
 * @returns Sanitized version
 */
Dialog.prototype.sanitize = function (text) {
    return DOMPurify.sanitize(text);
}

/**
 * Get a unique ID to use in dialog boxes
 */
Dialog.prototype.uniqueId = function () {
    return Unique.uniqueName();
}
