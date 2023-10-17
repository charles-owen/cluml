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
        const tagSE = this.node.tagValue;

        const div = document.createElement('div');

        const multiDiv = document.createElement('div');
        multiDiv.style.float = 'left';
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


        const tagDiv = document.createElement('div');
        tagDiv.style.float = 'right';
        tagDiv.style.width = '45%';

        const tagLbl = document.createElement('label');
        tagLbl.innerText = "Tag";

        const tagInput = document.createElement('input');
        tagInput.id = Unique.uniqueName();
        tagInput.type = 'text';
        tagInput.defaultValue = tagSE.elementValue;
        tagInput.value = tagSE.elementValue;
        tagInput.autocomplete = 'on';
        tagInput.style.width = "100%";

        tagLbl.htmlFor = tagInput.id;
        tagDiv.append(tagLbl, tagInput);


        div.append(multiDiv, tagDiv);

        this.tagInputID = tagInput.id;
        this.multiInputID = multiInput.id;

        super.contents(div.outerHTML, 'Edit Association Termination');
        Dialog.prototype.open.call(this);
    }

    ok() {
        const multiSE = this.node.multiplicityValue;
        const tagSE = this.node.tagValue;

        const mInput = document.getElementById(this.multiInputID);
        const tInput = document.getElementById(this.tagInputID);

        multiSE.elementValue = mInput.value;
        tagSE.elementValue = tInput.value;

        Dialog.prototype.ok.call(this);

        console.log('ok');

        // Force a redraw and backup.
        MainSingleton.singleton.currentView.draw();
        MainSingleton.singleton.backup();
    }
}
