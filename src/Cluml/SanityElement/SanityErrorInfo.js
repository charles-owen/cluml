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
        this.errorCode = errorCode;
        this.elementName = elementName;
        this.elementType = elementType;
        this.description = description;

        this.rowElement = document.createElement('tr');
        this.rowElement.className = 'cluml-sanity-check-row';
        let cell = document.createElement('td');

        const icon = document.createElement('img');
        icon.className = 'clipboard-icon';
        // icon.src = 'src/img/clipboard-regular.svg';
        icon.title = 'Copy error code';
        icon.style.width = '1em';
        icon.style.height = '1lh';

        let iconBtn = document.createElement('button');
        iconBtn.type = 'button';
        iconBtn.disabled = true;
        iconBtn.style.width = '2em';
        iconBtn.addEventListener('click', (event) => {
            // This isn't working right for some reason.
            // Select the text field
            errorBox.select();
            errorBox.setSelectionRange(0, 99999); // For mobile devices

            // Copy the text inside the text field
            navigator.clipboard.writeText(errorBox.innerText);

            console.log("Clicked");

            iconBtn.title = 'Copied';
        });
        iconBtn.appendChild(icon);

        cell.appendChild(iconBtn);
        this.rowElement.appendChild(cell);
        cell = document.createElement('td');

        const errorBox = document.createElement('textarea');
        errorBox.readOnly = true;
        errorBox.value = errorCode;
        errorBox.style.width = '6em';
        errorBox.style.height = '1lh';
        errorBox.appendChild(document.createTextNode(errorCode));

        cell.appendChild(errorBox);
        this.rowElement.appendChild(cell);
        cell = document.createElement('td');

        cell.appendChild(document.createTextNode(description));
        this.rowElement.appendChild(cell);

        // document.getElementById('error-tbl');
        // document.body.appendChild(rowElement);
    }

    testThingy(event) {
        console.log("Tested");
    }
}