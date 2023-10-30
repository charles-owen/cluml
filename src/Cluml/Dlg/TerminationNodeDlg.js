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

        const containerDiv = document.createElement('div');

        // Inputs
        const inputsDiv = document.createElement('div');

        //region Right Div
        // Multiplicity
        const multiDiv = document.createElement('div');
        multiDiv.style.float = 'right';
        multiDiv.style.width = '49%';

        const multiLbl = document.createElement('label');
        multiLbl.innerText = "Multiplicity";

        const multiInput = document.createElement('input');
        multiInput.id = Unique.uniqueName();
        multiInput.type = 'text';
        multiInput.defaultValue = multiSE.elementValue;
        multiInput.value = multiSE.elementValue;
        multiInput.autocomplete = 'on';
        multiInput.style.width = "100%";

        // Go to other node btn.
        const gotoBtn = document.createElement('button');
        gotoBtn.classList.add('tooltip-target');
        const gotoIcon = document.createElement('span');
        gotoIcon.classList.add('big-btn-txt');
        gotoIcon.innerText = `↵`;
        gotoBtn.append(gotoIcon);
        const gotoTooltip = document.createElement('span');
        gotoTooltip.className = "tooltip";
        gotoTooltip.textContent = 'Go To Other';
        gotoTooltip.style.left = '0';
        gotoTooltip.style.bottom = '-4em';    // Avoid cutting off tooltip
        const gotoTTCenter = document.createElement('div');
        gotoTTCenter.className = 'tooltip-centerer';
        gotoTTCenter.appendChild(gotoTooltip);

        gotoBtn.append(gotoTTCenter);

        gotoHandler = gotoHandler.bind(this);
        gotoBtn.addEventListener('click', gotoHandler);

        function gotoHandler(event) {
            // Close and select the other node.
            this.close();

            const nodes = this.node.association.nodes;
            let selected;

            if (this.node === nodes.start) {
                // Select end.
                selected = nodes.end;
            } else {
                // Select start.
                selected = nodes.start;
            }

            const tNodeDlg = new TerminationNodeDlg(selected);
            tNodeDlg.open();

            // Click on the other node.
            MainSingleton.singleton.currentView.selection.selected = [selected];
            MainSingleton.singleton.redraw();
        }

        multiLbl.htmlFor = multiInput.id;
        multiDiv.append(multiLbl, multiInput, gotoBtn);
        //endregion

        //region Left Div
        // Role
        const roleDiv = document.createElement('div');
        roleDiv.style.float = 'left';
        roleDiv.style.width = '49%';

        const roleLbl = document.createElement('label');
        roleLbl.innerText = "Role";

        const roleInput = document.createElement('input');
        roleInput.id = Unique.uniqueName();
        roleInput.type = 'text';
        roleInput.defaultValue = roleSE.elementValue;
        roleInput.value = roleSE.elementValue;
        roleInput.autocomplete = 'on';
        roleInput.style.width = "100%";

        // Swap nodes button.
        const swapBtn = document.createElement('button');
        swapBtn.classList.add('tooltip-target');
        const swapIcon = document.createElement('span');
        swapIcon.classList.add('big-btn-txt');
        swapIcon.innerText = '⇌';
        swapBtn.append(swapIcon);
        const swapTooltip = document.createElement('span');
        swapTooltip.className = "tooltip";
        swapTooltip.textContent = 'Swap Arrow and End';
        swapTooltip.style.left = '0';
        swapTooltip.style.bottom = '-4em';    // Avoid cutting off tooltip
        const swapTTCenter = document.createElement('div');
        swapTTCenter.className = 'tooltip-centerer';
        swapTTCenter.appendChild(swapTooltip);

        swapBtn.append(swapTTCenter);

        swapHandler = swapHandler.bind(this);
        swapBtn.addEventListener('click', swapHandler);

        function swapHandler(event) {
            // Close this dialog to avoid the funny.
            this.close();

            const nodes = this.node.association.nodes;
            nodes.swapEnds();

            // Open another dialog.
            const tNodeDlg = new TerminationNodeDlg(this.node);
            tNodeDlg.open();
            MainSingleton.singleton.currentView.selection.selected = [this.node];
            MainSingleton.singleton.redraw();
        }

        roleLbl.htmlFor = roleInput.id;
        roleDiv.append(roleLbl, roleInput, swapBtn);
        //endregion

        this.tagInputID = roleInput.id;
        this.multiInputID = multiInput.id;

        containerDiv.append(roleDiv, multiDiv);

        const endType = this.node.isTail ? 'Arrow' : 'End';
        super.contents(
            containerDiv,
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
