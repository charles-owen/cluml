/**
 * File import dialog box
 */

import {Dialog} from './Dialog';
import '../Vendor/Blob.js';
import Unique from '../Utility/Unique.js';
import saveAs from '../Vendor/FileSaver.js';

export const ImportDlg = function(main, model) {
    Dialog.call(this);

    const that = this;

    // A unique ID for the input control
    const id = Unique.uniqueName();

    // Create the dialog box
    const dlg = '<div class="control gap"><input class="file" type="file" id="' + id + '" />' +
        '<br><span id="import-error" class="error"></span></div>' +
        '<p>Choose a file to import into Cluml.</p>';

    this.ok = function() {
        const files = document.getElementById(id).files;
        if(files.length < 1) {
            return;
        }

        const file = files[0];

        const reader = new FileReader();

        // // Closure to capture the file information.
        // reader.onload = function(e) {
        //     model.fmJSON(e.target.result);
        //
        //     that.close();
        //     main.reload();
        // };

        reader.onerror = function(e) {
            that.error("Error reading diagrams file");
        };

        reader.onabort = function(e) {
            that.error("Diagrams file read aborted");
        };

        // Read in the file
        reader.readAsText(file);
    }

    this.buttonOk = 'Import';
    this.contents(dlg, "Cluml Import");
};

ImportDlg.prototype = Object.create(Dialog.prototype);
ImportDlg.prototype.constructor = ImportDlg;
