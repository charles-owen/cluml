import { MainSingleton } from "../MainSingleton";
import Unique from "../Utility/Unique";
import { Dialog } from "./Dialog";

export class TerminationNodeDlg extends Dialog {

    /**
     * ID for the tag text input.
     * @type {string}
     */
    roleInputID;

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

        const tbl = document.createElement('table');

        //region Inputs
        //region Multiplicity
        const multiDiv = document.createElement('div');

        const multiInput = document.createElement('input');
        multiInput.id = Unique.uniqueName();
        this.multiInputID = multiInput.id;
        multiInput.type = 'text';
        multiInput.tabIndex = 5;
        multiInput.defaultValue = multiSE.elementValue;
        multiInput.value = multiSE.elementValue;
        multiInput.autocomplete = 'on';
        multiInput.style.width = "100%";

        const multiLbl = document.createElement('label');
        multiLbl.innerText = "Multiplicity";
        multiLbl.htmlFor = multiInput.id;
        multiDiv.append(multiLbl, multiInput);
        //endregion


        //region Role
        const roleDiv = document.createElement('div');

        const roleInput = document.createElement('input');
        roleInput.id = Unique.uniqueName();
        this.roleInputID = roleInput.id;
        roleInput.type = 'text';
        roleInput.tabIndex = 5;
        roleInput.defaultValue = roleSE.elementValue;
        roleInput.value = roleSE.elementValue;
        roleInput.autocomplete = 'on';
        roleInput.style.width = "100%";

        const roleLbl = document.createElement('label');
        roleLbl.innerText = "Role";
        roleLbl.htmlFor = roleInput.id;
        roleDiv.append(roleLbl, roleInput);
        //endregion


        //region Add everything to row
        const inputRow = document.createElement('tr');
        const multiCell = document.createElement('td');
        multiCell.append(multiDiv);
        const roleCell = document.createElement('td');
        roleCell.append(roleDiv);
        inputRow.append(multiCell, roleCell);
        tbl.append(inputRow);
        //endregion
        //endregion


        //region Buttons
        //region Goto Other Node
        const gotoBtn = document.createElement('button');
        gotoBtn.classList.add('tooltip-target', 'association-btn');
        gotoBtn.type = 'button';
        gotoBtn.tabIndex = 10;
        const gotoIcon = document.createElement('span');
        gotoIcon.classList.add('big-btn-txt');
        gotoIcon.innerText = `↵`;
        gotoBtn.append(gotoIcon);
        const gotoTooltip = document.createElement('span');
        gotoTooltip.className = "tooltip";
        gotoTooltip.textContent = 'Go To Other';
        gotoTooltip.style.bottom = '1em';    // Avoid cutting off tooltip
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
        //endregion

        //region Swap Nodes
        const swapBtn = document.createElement('button');
        swapBtn.classList.add('tooltip-target', 'association-btn');
        swapBtn.type = 'button';
        swapBtn.tabIndex = 10;
        const swapIcon = document.createElement('span');
        swapIcon.classList.add('big-btn-txt');
        swapIcon.innerText = '⇌';
        swapBtn.append(swapIcon);
        const swapTooltip = document.createElement('span');
        swapTooltip.className = "tooltip";
        swapTooltip.textContent = 'Swap Arrow and End';
        swapTooltip.style.bottom = '-1em';    // Avoid cutting off tooltip
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
        //endregion


        //region Add everything to buttons row
        const btnRow = document.createElement('tr');
        const gotoCell = document.createElement('td');
        gotoCell.append(gotoBtn);
        const swapCell = document.createElement('td');
        swapCell.append(swapBtn);
        btnRow.append(gotoCell, swapCell);
        tbl.append(btnRow);
        //endregion
        //endregion

        const endType = this.node.isTail ? 'Arrow' : 'End';
        super.contents(
            tbl,
            `Edit ${this.node.association.paletteLbl} ${endType}`
        );
        Dialog.prototype.open.call(this);

        // Focus on first input.
        multiInput.focus();

        // Set tab index for the OK and Cancel buttons.
        /**
         * @type {HTMLDivElement}
         */
        const btns = document.querySelectorAll('.cs-ok, .cs-cancel');

        for (const btn of btns) {
            btn.tabIndex = 15;
        }

        //region Handle enter press for inputs.
        multiInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                roleLbl.focus();
            }
        });

        roleInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const okBtns = document.getElementsByClassName('cs-ok');

                if (okBtns) {
                    okBtns[0].focus();
                }
            }
        })
        //endregion
    }

    ok() {
        const multiSE = this.node.multiplicityValue;
        const roleSE = this.node.roleValue;

        const mInput = document.getElementById(this.multiInputID);
        const tInput = document.getElementById(this.roleInputID);

        multiSE.elementValue = mInput.value;
        roleSE.elementValue = tInput.value;

        Dialog.prototype.ok.call(this);

        console.log('ok');

        // Force a redraw and backup.
        MainSingleton.singleton.currentView.draw();
        MainSingleton.singleton.backup();
    }
}
