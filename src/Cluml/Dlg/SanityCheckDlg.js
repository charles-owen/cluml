import {Dialog} from './Dialog';
import {SanityElement} from "../SanityElement/SanityElement";

/**
 * Sanity Check dialog box.
 * @constructor
 */
export const SanityCheckDlg = function(main) {
    Dialog.call(this);

    this.open = function() {
        this.buttonCancel = null;

        const h1 = document.createElement('h1');
        h1.textContent = 'Sanity Check';
        const html = document.createElement('div');
        html.appendChild(h1);

        let errorCount = 0;
        const errorList = document.createElement('ul');
        const errorTbl = document.createElement('table');
        errorTbl.className = 'cluml-sanity-check-tbl';

        // error check the diagram in view
        for (const element of SanityElement.getAllSanityElements()) {
            const sanityElemErrors = element.processSanityCheck();

            for (const error of sanityElemErrors) {
                if (typeof error === "string") {
                    const li = document.createElement('li');
                    li.textContent = error;
                    errorList.appendChild(li);
                } else {
                    // Use new format.
                    errorTbl.appendChild(error.HTMLRepresentation);
                }

                errorCount += 1;
            }
        }

        const h2 = document.createElement('h2');
        h2.textContent = `(${errorCount}) errors have been detected`;
        html.appendChild(h2);
        html.appendChild(errorList);
        html.appendChild(errorTbl);

        this.contents(html, "Cluml Sanity Check");
        Dialog.prototype.open.call(this);
    }

    const isAlphaNumeric = function(s) {
        let array = s.match(/\w/g);
        return array !== null && array.length === s.length;
    }
}

SanityCheckDlg.prototype = Object.create(Dialog.prototype);
SanityCheckDlg.prototype.constructor = SanityCheckDlg;
