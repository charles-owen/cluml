import { MainSingleton } from "../MainSingleton";
import Unique from "../Utility/Unique";
import { Dialog } from "./Dialog";

export class TerminationNodeDlg extends Dialog {

    /**
     * ID for the tag text input.
     * @type {string}
     */
    tagInputID;

    /**
     * ID for the multiplicity text input.
     * @type {string}
     */
    multiInputID;

    /**
     * Creates a new termination node dialog.
     * @param {TerminationNode} node 
     */
    constructor(node) {
        super('association_tnode');
        this.node = node;
    }

    open() {
        const multiSE = this.node.multiplicityValue;
        const roleSE = this.node.roleValue;

        const div = document.createElement('div');

        const multiDiv = document.createElement('div');
        multiDiv.style.float = 'right';
        multiDiv.style.width = "45%";

        const multiLbl = document.createElement('label');
        multiLbl.innerText = "Multiplicity";

        const multiInput = document.createElement('input');
        multiInput.id = Unique.uniqueName();
        multiInput.type = 'text';
        multiInput.defaultValue = multiSE.elementValue;
        multiInput.value = multiSE.elementValue;
        multiInput.autocomplete = 'on';
        multiInput.style.width = "100%";

        multiLbl.htmlFor = multiInput.id;
        multiDiv.append(multiLbl, multiInput);


        const roleDiv = document.createElement('div');
        roleDiv.style.float = 'left';
        roleDiv.style.width = '45%';

        const roleLbl = document.createElement('label');
        roleLbl.innerText = "Role";

        const roleInput = document.createElement('input');
        roleInput.id = Unique.uniqueName();
        roleInput.type = 'text';
        roleInput.defaultValue = roleSE.elementValue;
        roleInput.value = roleSE.elementValue;
        roleInput.autocomplete = 'on';
        roleInput.style.width = "100%";

        roleLbl.htmlFor = roleInput.id;
        roleDiv.append(roleLbl, roleInput);


        div.append(roleDiv, multiDiv);

        this.tagInputID = roleInput.id;
        this.multiInputID = multiInput.id;

        const endType = this.node.isTail ? 'Arrow' : 'End';
        super.contents(
            div.outerHTML,
            `Edit ${this.node.association.paletteLbl} ${endType}`
        );
        Dialog.prototype.open.call(this);
    }

    ok() {
        const multiSE = this.node.multiplicityValue;
        const roleSE = this.node.roleValue;

        const mInput = document.getElementById(this.multiInputID);
        const tInput = document.getElementById(this.tagInputID);

        multiSE.elementValue = mInput.value;
        roleSE.elementValue = tInput.value;

        Dialog.prototype.ok.call(this);

        console.log('ok');

        // Force a redraw and backup.
        MainSingleton.singleton.currentView.draw();
        MainSingleton.singleton.backup();
    }
}
