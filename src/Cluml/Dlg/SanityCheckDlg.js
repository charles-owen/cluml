import {Dialog} from './Dialog';

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
        let errors = '';

        // error check the diagram in view
        const diagram = main.currentView().diagram;
        const classes = diagram.getComponentsByType("Class");
        for (const element of classes)
        {
            // check if the class names are capitalized properly
            if (element.naming[0].toUpperCase() !== element.naming[0])
            {
                errors += `<li>Class ${element.naming} not capitalized</li>`;
                errorCount++;
            }

            if (!isAlphaNumeric(element.naming))
            {
                errors += `<li>Class ${element.naming} is not alphanumeric</li>`;
            }
        }
        content += `<h2>(${errorCount}) errors have been detected</h2>`;
        content += `<ul>${errors}</ul>`;

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