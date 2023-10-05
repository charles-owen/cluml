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
        const diagram = main.currentView().diagram;
        const classes = diagram.getComponentsByType("Class");

        for (const element of classes)
        {
            /*
            // check if the class names are capitalized properly
            if (element.naming[0].toUpperCase() !== element.naming[0])
            {
                errors += `<li>Class ${element.naming} not capitalized</li>`;
                errorCount++;
            }

            if (!isAlphaNumeric(element.naming))
            {
                errors += `<li>Class ${element.naming} is not alphanumeric</li>`
                errorCount++;
            }
            */

            // Will later convert this code over to sanity elements.
            const classTemplate = `Class <a>${element.naming}</a>`;
            /*
            for (const attribute of element["attributes"])
            {
                const attributeTemplate = `${classTemplate}, attribute <a>${attribute}</a>`;
                const colonIndex = attribute.indexOf(":");
                const attributeName = attribute.substring(1, colonIndex).trim();
                const attributeType = attribute.substring(colonIndex + 1).trim();

                if (/\s/.test(attributeName))
                {
                    errors += `<li>${attributeTemplate}: name contains spaces.</li>`;
                    errorCount++;
                }
                if (/[^A-Za-z0-9]/.test(attributeName))
                {
                    errors += `<li>${attributeTemplate}: name contains non-alphanumeric characters.</li>`;
                    errorCount++;
                }
                if (attributeName[0].toLowerCase() !== attributeName[0])
                {
                    errors += `<li>${attributeTemplate}: name not in camelCase format.</li>`;
                    errorCount++;
                }
            }
            */

            for (const operation of element["operations"])
            {
                const operationTemplate = `${classTemplate}, operation <a>${operation}</a>`;
                const colonIndex = operation.indexOf(":");
                const operationName = operation.substring(1, operation.indexOf('(')).trim();

                if (/\s/.test(operationName))
                {
                    errorHtml += `<li>${operationTemplate}: name contains spaces.</li>`;
                    errorCount++;
                }
                if (/[^A-Za-z0-9]/.test(operationName))
                {
                    errorHtml += `<li>${operationTemplate}: name contains non-alphanumeric characters.</li>`;
                    errorCount++;
                }
                if (operationName[0].toLowerCase() !== operationName[0])
                {
                    errorHtml += `<li>${operationTemplate}: name not in camelCase format.</li>`;
                    errorCount++;
                }
            }
        }

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
