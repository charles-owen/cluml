import {MainSingleton} from "../MainSingleton";

const ERROR_PREFIX = 'CS';

export const ICON_BTN_CLASS = 'cl-copy-btn';

export class SanityErrorInfo {
    /**
     * The error code for this error.
     * @type {string}
     */
    errorCode;

    /**
     * Short description for this error.
     * @type {string}
     */
    description;

    /**
     * The identifier of the SanityElement that's raising this error.
     * The user should be able to identify which element
     * is raising the error from this, so avoid static strings.
     * @type {string}
     */
    elementName;

    /**
     * The type of SanityElement.
     * @type {string}
     */
    elementType;

    /**
     * Creates a new error info object.
     * @param errorCode {string} Error code for the error.
     * @param elementType {string} The type of SanityElement.
     * @param elementName {string} The identifier of the SanityElement that's
     * raising this error. The user should be able to identify which element
     * is raising the error from this, so avoid static strings.
     * @param description {string} Description of the error.
     */
    constructor(errorCode, elementType, elementName, description) {
        // Extract error code number and prepend the prefix.
        errorCode = ERROR_PREFIX + errorCode.match(/\d+/)[0];
        this.errorCode = errorCode;
        this.elementName = elementName;
        this.elementType = elementType;
        this.description = description;
    }

    /**
     * Generates and returns the HTML table row representation for this
     * SanityErrorInfo.
     * @return {HTMLTableRowElement}
     */
    get HTMLRepresentation() {
        const rowElement = document.createElement('tr');
        rowElement.className = 'cl-sc-row';
        let cell = document.createElement('td');

        const errorBox = document.createElement('textarea');
        errorBox.readOnly = true;
        errorBox.rows = 1;
        errorBox.cols = 6;
        errorBox.appendChild(document.createTextNode(this.errorCode));

        const icon = document.createElement('img');
        icon.className = 'clipboard-icon';
        icon.src = `${MainSingleton.singleton.root}cluml/img/clipboard-regular.svg`;

        const iconTooltip = document.createElement('span');
        iconTooltip.className = "tooltip";
        iconTooltip.textContent = 'Copy error code';
        iconTooltip.style.left = '-50%';    // Avoid cutting off tooltip

        const tooltipCenter = document.createElement('div');
        tooltipCenter.className = 'tooltip-centerer';
        tooltipCenter.appendChild(iconTooltip);

        const iconBtn = document.createElement('button');
        iconBtn.classList.add(ICON_BTN_CLASS, 'tooltip-target');
        iconBtn.type = 'button';
        iconBtn.addEventListener('click', function (event) {
            // Copy the text inside the text field
            navigator.clipboard.writeText(errorBox.value).then(
                () => {
                    // On success.
                    iconTooltip.textContent = "Copied";
                },
                () => {
                    // On failure.
                    iconTooltip.textContent = "Your browser does not support clipboard access"
                }
            );
        });
        iconBtn.addEventListener('pointerleave', function (event) {
            iconTooltip.textContent = 'Copy error code';
        });
        tooltipCenter.appendChild(icon);
        iconBtn.appendChild(tooltipCenter);

        cell.appendChild(iconBtn);
        rowElement.appendChild(cell);
        cell = document.createElement('td');

        cell.appendChild(errorBox);
        rowElement.appendChild(cell);
        cell = document.createElement('td');

        const pErrMsg = document.createElement('p');
        pErrMsg.innerHTML = `${this.elementType} <b>${this.elementName}</b>: ${this.description}`;

        cell.appendChild(pErrMsg);
        rowElement.appendChild(cell);

        // document.getElementById('error-tbl');
        // document.body.appendChild(rowElement);

        return rowElement;
    }
}
