import {Dialog} from './Dialog';
import {Unique} from '../Utility/Unique';
import {Tools} from '../DOM/Tools';
import {Class} from "../Components/Class";

/**
 * Component properties dialog box
 * @constructor
 */
export const ClassPropertiesDlg = function(component, main, isInterface) {
    Dialog.call(this, 'component');

    this.resize = 'both';

    /**
     * A unique ID for the component name input control
     * @type {string}
     */
    let nameId = null;

    // A unique ID for the abstract toggle
    let abstractClassId = null;

    let extraHTML = '';
    let extraCreate = function() {};
    let extraValidate = function() {return null;};
    let extraTake = function() {return null;};

    // ids for abstraction html elements
    let abstractInputs = [];

    // ids for visibility html elements
    let visibilityInputs = [];

    // ids for dropdown html elements for visibility inputs
    let dropDowns = [];

    /**
     * Construct the Properties Box
     */
    this.open = () => {
        // Create the dialog box form
        let description = '';
        if('help' in component.constructor) {
            description += '<a class="helper">help</a>';
        }

        if('description' in component.constructor) {
            description += '<div class="description">';
            description += component.constructor.description + '</div>';
        }

        // Does this component have a naming?
        let name = '';
        if(component.naming !== null) {
            name = component.naming;
        } else {
            if(component.prefix !== null) {
                // Does not have a name. Create one
                for(let i=1; ; i++) {
                    name = component.prefix + i;
                    let existing = component.diagram.getComponentByNaming(name);
                    if(existing === null) {
                        break;
                    }
                }
            }
        }

        let dlg = '';

        if(component.prefix !== null) {
            nameId = Unique.uniqueName();
            dlg += '<div class="control1 center gap"><label for="' + nameId + '">Name: </label>' +
                '<input type="text" name="' + nameId + '" id="' + nameId + '" value="' + name + '" spellcheck="false" class="compname text ui-widget-content ui-corner-all">' +
                '</div>';
        }
        
        // Create container for the abstract & visibility content
        let propertiesDiv = document.createElement("div");

        // Abstract Title
        let abstractTitleDiv = document.createElement("div");
        abstractTitleDiv.style.float = 'left';
        let abstractLabel = document.createElement('label');
        abstractLabel.appendChild(document.createTextNode('Abstract'));
        abstractTitleDiv.append(abstractLabel);

        // Visibility Title
        let visibilityTitleDiv = document.createElement("div");
        visibilityTitleDiv.style.float = 'right';
        let visibilityLabel = document.createElement('label');
        visibilityLabel.appendChild(document.createTextNode('Visibility'));
        visibilityTitleDiv.append(visibilityLabel);

        propertiesDiv.append(abstractTitleDiv);
        propertiesDiv.append(visibilityTitleDiv);

        // Styling for visibility div
        let visContentDiv = document.createElement("div");
        visContentDiv.style.overflowY = "auto";
        visContentDiv.style.maxHeight = "100px";
        visContentDiv.style.minHeight = "100px";
        visContentDiv.style.maxWidth = "150px";
        visContentDiv.style.minWidth = "150px";
        visContentDiv.style.overflowX = "hidden";
        visContentDiv.style.textOverflow = "ellipsis";
        visContentDiv.style.whiteSpace = "nowrap";

        // Styling for abstraction div
        let absContentDiv = document.createElement("div");
        absContentDiv.style.overflowY = "auto";
        absContentDiv.style.maxHeight = "100px";
        absContentDiv.style.minHeight = "100px";
        absContentDiv.style.maxWidth = "150px";
        absContentDiv.style.minWidth = "150px";
        absContentDiv.style.overflowX = "hidden";
        absContentDiv.style.textOverflow = "ellipsis";
        absContentDiv.style.whiteSpace = "nowrap";

        // Abstract Class Input and Label
        let abstractClassDiv = document.createElement("div");
        abstractClassId = Unique.uniqueName();
        let classInput = document.createElement("input");
        classInput.type = "checkbox";
        if (isInterface)
            classInput.disabled = true;
        classInput.id = abstractClassId;
        abstractClassDiv.append(classInput);
        if (component.abstract)
            classInput.setAttribute("checked", "true");
        else
            classInput.removeAttribute("checked");

        let classLabel = document.createElement("label");
        classLabel.appendChild(document.createTextNode("Class"));
        classLabel.style.float = "center";
        abstractClassDiv.append(classLabel);
        absContentDiv.append(abstractClassDiv);

        //List Attributes for Visibility
        let attributes = component.getAttributes();
        for (let i = 0; i < attributes.length; i++)
        {
            let attribute = attributes[i];
            let visDiv = document.createElement("div");
            visDiv.class = "dropdown";
            let visInput = document.createElement("input");
            visInput.type = "text";
            visInput.maxLength = 1;
            visInput.placeholder = attribute.visibility;
            visInput.value = attribute.visibility;
            visInput.style.width = "20px";
            visInput.style.height = "20px";
            visInput.id = Unique.uniqueName();
            visInput.class = "dropinput";
            visDiv.append(visInput);
            visibilityInputs.push(visInput.id);

            let dropDiv = document.createElement("div");
            dropDiv.class = "dropdown-content";
            dropDiv.style.position = "absolute";
            dropDiv.style.display = "none";
            dropDiv.id = Unique.uniqueName();
            let o1 = document.createElement("a");
            o1.text = "+ Public";
            let o2 = document.createElement("a");
            o2.text = "# Protected";
            let o3 = document.createElement("a");
            o3.text = "- Private";
            dropDiv.append(o1);
            dropDiv.append(o2);
            dropDiv.append(o3);
            let options = dropDiv.getElementsByTagName("a");
            for (let i= 0; i < options.length; i ++)
            {
                options[i].style.display = "block";
                options[i].style.background = "#f2f2f2";
                options[i].style.borderStyle = "solid";
                options[i].style.borderWidth = "thin";
                options[i].style.border = "#00000";
            }
            dropDowns.push(dropDiv.id);
            visDiv.append(dropDiv);

            let label = document.createElement("label");
            let attributeName = " " + attribute.name;
            label.appendChild(document.createTextNode(attributeName));
            label.style.float = "center";
            visDiv.append(label);

            visContentDiv.append(visDiv);
        }

        // List Operations for Visibility and Abstraction
        let operations = component.getOperations();
        for (let i = 0; i < operations.length; i++)
        {
            // Visibility Operation Input and Name
            let operation = operations[i];
            let visDiv = document.createElement("div");
            let visInput = document.createElement("input");
            visInput.type = "text";
            visInput.maxLength = 1;
            visInput.placeholder = operation.visibility;
            visInput.value = operation.visibility;
            visInput.style.width = "20px";
            visInput.style.height = "20px";
            visInput.id = Unique.uniqueName();
            visInput.class = "dropinput";
            visDiv.append(visInput);
            visibilityInputs.push(visInput.id);

            let dropDiv = document.createElement("div");
            dropDiv.class = "dropdown-content";
            dropDiv.style.position = "absolute";
            dropDiv.style.display = "none";
            dropDiv.id = Unique.uniqueName();
            let o1 = document.createElement("a");
            o1.text = "+ Public";
            let o2 = document.createElement("a");
            o2.text = "# Protected";
            let o3 = document.createElement("a");
            o3.text = "- Private";
            dropDiv.append(o1);
            dropDiv.append(o2);
            dropDiv.append(o3);
            let options = dropDiv.getElementsByTagName("a");
            for (let i= 0; i < options.length; i ++)
            {
                options[i].style.display = "block";
                options[i].style.background = "#f2f2f2";
                options[i].style.borderStyle = "solid";
                options[i].style.borderWidth = "thin";
                options[i].style.border = "#00000";
            }
            dropDowns.push(dropDiv.id);
            visDiv.append(dropDiv);

            let visLabel = document.createElement("label");
            let operationName = " " + operation.name;
            visLabel.appendChild(document.createTextNode(operationName));
            visDiv.append(visLabel);
            visContentDiv.append(visDiv);

            // Abstract Operation Input and Name
            let abstractDiv = document.createElement("div");
            let absInput = document.createElement("input");
            absInput.type = "checkbox";
            if (isInterface)
                absInput.disabled = true;
            absInput.id = Unique.uniqueName();
            abstractDiv.append(absInput);
            abstractInputs.push(absInput.id);
            if (operation.abstract)
                absInput.setAttribute("checked", "true");
            else
                absInput.removeAttribute("checked");

            let absLabel = document.createElement("label");
            absLabel.appendChild(document.createTextNode(operationName));
            abstractDiv.append(absLabel);
            absContentDiv.append(abstractDiv);
        }
        visibilityTitleDiv.append(visContentDiv);
        abstractTitleDiv.append(absContentDiv);
        dlg += propertiesDiv.outerHTML;

        this.contents(dlg, "Cluml Component Properties");
        Dialog.prototype.open.call(this);

        // Click event for Visibility Dropdown
        for (let i = 0; i < attributes.length + operations.length; i++)
        {
            let element = document.getElementById(visibilityInputs[i]);
            element.addEventListener('click', (event) => {
                event.preventDefault();
                let dropDown = document.getElementById(dropDowns[i]);
                if (dropDown.style.display == "none")
                {
                    dropDown.style.display = "block";
                    let options = dropDown.getElementsByTagName("a");
                    for (let j= 0; j < options.length; j++)
                    {
                        options[j].addEventListener('click', (event) => {
                            event.preventDefault();
                            element.value = options[j].text.charAt();
                        });
                    }
                }
                else
                    dropDown.style.display = "none";
            });
        }

        document.addEventListener('click', (event) => {
            for (let i = 0; i < attributes.length + operations.length; i++) {
                if (!event.target.matches("input#"+visibilityInputs[i]))
                {
                    let dropDown = document.getElementById(dropDowns[i]);
                    if (dropDown)
                        dropDown.style.display = "none";
                }
            }
        });

        extraCreate();

        if(nameId !== null) {
	        document.getElementById(nameId).select();
        }

        const helper = this.element.querySelector('a.helper');
        if(helper !== null) {
        	helper.addEventListener('click', (event) => {
		        event.preventDefault();
		        let helper = component.constructor.help;
		        main.menu.helpMenu.componentHelp(helper);
	        });
        }
    }

    this.ok = () => {
        // Get name.
        // Trim spaces on either end
	    let name = '';

        if(component.prefix !== null) {
        	const nameElement = document.getElementById(nameId);
        	name = nameElement.value.replace(/^\s+|\s+$/gm,'');
            if(name.length !== 0) {
                // If name is not empty, we ensure it is unique
                var existing = component.diagram.getComponentByNaming(name);
                if(existing !== null && existing !== component) {
                	Tools.addClass(nameElement, 'cluml-error');
                    this.error("Name already exists");
                    return;
                }
            }
	        Tools.removeClass(nameElement, 'cluml-error');
	        name = this.sanitize(name);
        }

        var extraRet = extraValidate();
        if(extraRet !== null) {
            this.error(extraRet);
            return;
        }

        main.backup();
        if(component.prefix !== null) {
            component.naming = name.length > 0 ? name : null;
            const classToggle = document.getElementById(abstractClassId);
            component.abstract = classToggle.checked;
        }

        // Save Visibility for Attributes and Operations
        let attributes = component.getAttributes();
        let operations = component.getOperations();
        for (let i = 0; i < (attributes.length + operations.length); i++)
        {
            let object;
            if (i < attributes.length)
            {
                object = attributes[i];
            }
            else
            {
                object = operations[i-attributes.length];
            }
            let element = document.getElementById(visibilityInputs[i]);
            if (!element.value)
            {
                element.value = object.visibility;
            }
            object.setVisibility(element.value);
        }

        // Save Abstraction for Operations
        for (let i = 0; i < operations.length; i++)
        {
            let element = document.getElementById(abstractInputs[i]);
            operations[i].abstract = element.checked;
        }

        extraTake();

        this.close();
        main.currentView().draw();

    }

    //
    // Member functions
    //

    this.extra = function(_extraHTML, _extraValidate, _extraTake) {
        extraHTML = _extraHTML;
        extraValidate = _extraValidate;
        extraTake = _extraTake;
    };

    this.extraCreate = function(_extraCreate) {
        extraCreate = _extraCreate;
    }
};

ClassPropertiesDlg.prototype = Object.create(Dialog.prototype);
ClassPropertiesDlg.prototype.constructor = ClassPropertiesDlg;
