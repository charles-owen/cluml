import {Dialog} from './Dialog';

/**
 * Sanity Check dialog box.
 * @constructor
 */
export const SanityCheckDlg = function() {
    Dialog.call(this);

    this.open = function() {
        this.buttonCancel = null;

        let content = '<h1>Sanity Check</h1>';
        this.contents(content, "Cluml Sanity Check");

        Dialog.prototype.open.call(this);
    }
}

SanityCheckDlg.prototype = Object.create(Dialog.prototype);
SanityCheckDlg.prototype.constructor = SanityCheckDlg;