import {Dialog} from './Dialog';
import {SanityElement} from "../SanityElement/SanityElement";
import {MainSingleton} from "../MainSingleton";

/**
 * Sanity Check dialog box.
 * @constructor
 */
export const SanityCheckDlg = function(main) {
    Dialog.call(this);

    this.open = function() {
        this.buttonCancel = null;

        let content = '<h1>Sanity Check</h1>';

        let errorCount = 0;
        let errorHtml = '';

        // error check the diagram in view
        for (const element of SanityElement.getAllSanityElements()) {
            const sanityElemErrors = element.processSanityCheck();

            for (const error of sanityElemErrors) {
                errorHtml += `<li>${error}</li>`;
                errorCount += 1;
            }
        }

        content += `<h2>(${errorCount}) errors have been detected</h2>`;
        content += `<ul>${errorHtml}</ul>`;

        this.contents(content, "Cluml Sanity Check");
        Dialog.prototype.open.call(this);
    }

    const isAlphaNumeric = function(s) {
        let array = s.match(/\w/g);
        return array !== null && array.length === s.length;
    }
}

SanityCheckDlg.prototype = Object.create(Dialog.prototype);
SanityCheckDlg.prototype.constructor = SanityCheckDlg;
