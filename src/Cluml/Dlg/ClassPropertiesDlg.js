import {Dialog} from './Dialog';
import {Unique} from '../Utility/Unique';
import {Tools} from '../DOM/Tools';
import {Class} from "../Components/Class";

/**
 * Component properties dialog box
 * @constructor
 */
export const ClassPropertiesDlg = function(component, main) {
    Dialog.call(this, 'component');

    this.resize = 'both';

    /**
     * A unique ID for the component name input control
     * @type {string}
     */
    let nameId = null;

    // A unique ID for the abstract toggle
    let toggleId = null;

    let extraHTML = '';
    let extraCreate = function() {};
    let extraValidate = function() {return null;};
    let extraTake = function() {return null;};

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
            toggleId = Unique.uniqueName();
            dlg += '<div class="control1 center gap"><label for="' + nameId + '">Name: </label>' +
                '<input type="text" name="' + nameId + '" id="' + nameId + '" value="' + name + '" spellcheck="false" class="compname text ui-widget-content ui-corner-all">' +
                '</div>';
        }

        /*let abstractDiv = document.createElement("div");
        abstractDiv.style.textAlign = 'center';

        let abstractToggle = document.createElement('input');
        abstractToggle.type = "checkbox";
        abstractToggle.id = toggleId;

        if (component.abstract)
        {
            abstractToggle.setAttribute("checked", "true");
        }
        else
        {
            abstractToggle.removeAttribute("checked");
        }

        let toggleLabel = document.createElement('label');
        toggleLabel.appendChild(document.createTextNode('Abstract Class: '));

        abstractDiv.appendChild(toggleLabel);
        abstractDiv.append(abstractToggle);

        dlg += abstractDiv.outerHTML;

        for (let operation in component.operations)
        {
            let operationToggleId = Unique.uniqueName();
            let abstractOperationDiv = document.createElement("div");
            //abstractOperationDiv.style.textAlign = 'center';

            let abstractOperationToggle = document.createElement('input');
            abstractOperationToggle.style.textAlign = "right";
            abstractOperationToggle.type = "checkbox";
            abstractOperationToggle.id = operationToggleId;
            if (component.operations[operation].abstract)
            {
                abstractOperationToggle.setAttribute("checked", "true");
            }
            else
            {
                abstractOperationToggle.removeAttribute("checked");
            }

            let toggleOperationLabel = document.createElement('label');
            toggleOperationLabel.appendChild(document.createTextNode("Abstract " + component.operations[operation].toString() + ":"));

            abstractOperationDiv.appendChild(toggleOperationLabel);
            abstractOperationDiv.append(abstractOperationToggle);

            dlg += abstractOperationDiv.outerHTML;
        }*/

        // Create container for the abstract &v visibility content
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

        let visContentDiv = document.createElement("div");
        visContentDiv.style.overflowY = "auto";
        visContentDiv.style.maxHeight = "100px";

        let absContentDiv = document.createElement("div");
        absContentDiv.style.overflowY = "auto";
        absContentDiv.style.maxHeight = "100px";

        // Abstract Class Input and Label
        let abstractClassDiv = document.createElement("div");
        let classInput = document.createElement("input");
        classInput.type = "checkbox";
        classInput.id = Unique.uniqueName();
        abstractClassDiv.append(classInput);

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
            let visInput = document.createElement("input");
            visInput.type = "text";
            visInput.maxLength = 1;
            visInput.style.width = "20px";
            visInput.style.height = "20px";
            visInput.id = Unique.uniqueName();
            visDiv.append(visInput);

            let label = document.createElement("label");
            let attributeName = " " + attribute.name;
            label.appendChild(document.createTextNode(attributeName));
            label.style.float = "center";
            visDiv.append(label);

            visContentDiv.append(visDiv);
        }

        for (let operation in component.operations)
        {
            // Visibility Operation Input and Name
            let visDiv = document.createElement("div");
            let visInput = document.createElement("input");
            visInput.type = "text";
            visInput.maxLength = 1;
            visInput.style.width = "20px";
            visInput.style.height = "20px";
            visInput.id = Unique.uniqueName();
            visDiv.append(visInput);

            let visLabel = document.createElement("label");
            let operationName = " " + component.operations[operation].toString().replace(/(?!\w|\s)./g, '');
            visLabel.appendChild(document.createTextNode(operationName));
            visDiv.append(visLabel);
            visContentDiv.append(visDiv);

            // Abstract Operation Input and Name
            let abstractDiv = document.createElement("div");
            let absInput = document.createElement("input");
            absInput.type = "checkbox";
            absInput.id = Unique.uniqueName();
            abstractDiv.append(absInput);

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

        //Get abstract state
        let isAbstract = false;


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

            //const toggleElement = document.getElementById(toggleId);
            //isAbstract = toggleElement.checked;
        }

        var extraRet = extraValidate();
        if(extraRet !== null) {
            this.error(extraRet);
            return;
        }

        main.backup();
        if(component.prefix !== null) {
            component.naming = name.length > 0 ? name : null;

            //component.abstract = isAbstract;
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
