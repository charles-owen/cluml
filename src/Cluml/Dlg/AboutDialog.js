import {Dialog} from './Dialog';

/**
 * The standard About dialog box.
 * @constructor
 */
export const AboutDialog = function (main) {
    Dialog.call(this, "about");

    this.open = function () {
        this.buttonCancel = null;
        let root = main.cluml.root;

        // Dialog box contents
        let content = `
<figure><img src="${root}cluml/img/logo-icon.svg" alt="Cluml Logo"></figure>
<h1>Cluml UML Editor</h1>
<p>Version: ${main.cluml.version}</p>
<p>Written by: MSU CSE Capstone Students</p>
<p>With help from: Professor Charles B. Owen</p>`;

        if (main.cluml.root.indexOf('cluml-dev') >= 0) {
            content += `<p class="gap">Running from the development site.</p>`;
        }

        this.contents(content, "About Cluml");
        Dialog.prototype.open.call(this);
    }
}

AboutDialog.prototype = Object.create(Dialog.prototype);
AboutDialog.prototype.constructor = AboutDialog;

