import {MainSingleton} from "../MainSingleton";

export class ContextEntry {

    /**
     * Creates a new entry in the context menu.
     * @param text {string}
     * @param callback {function}
     * @param menu {CustomContextMenu}
     */
    constructor(text, callback, menu) {
        this.text = text;
        this.callback = callback;
        this.menu = menu;

        this.button = document.createElement('input');
        this.button.type = 'button';
        this.button.style.padding = '0';
        this.button.style.margin = '0';
        this.button.style.border = 'none 0';
        this.button.style.cursor = 'pointer';
        const ce = this;
        this.button.addEventListener('click', () => {
            this.selectEntry();
        });
        this.button.value = text;
    }

    selectEntry() {
        this.callback.call(this.menu.target);
        this.menu.menuTable.remove();
    }
}

export class CustomContextMenu {
    /**
     * Entries of the context menu.
     * @type {Array<ContextEntry>}
     */
    entrees = [];

    /**
     * @type {HTMLTableSectionElement}
     */
    menuBody;

    /**
     *
     * @param target {*}
     * @param mousePos {Vector}
     */
    constructor(target, mousePos) {
        this.position = mousePos;
        this.target = target;

        this.menuTable = document.createElement('table');
        this.menuTable.style.border = "solid thin";
        this.menuTable.style.position = 'absolute';
        this.menuTable.style.top = mousePos.y + "px";
        this.menuTable.style.left = mousePos.x + "px";
        this.menuBody = this.menuTable.createTBody();

        MainSingleton.currentTabDiv.append(this.menuTable);
    }

    /**
     * Adds a new entrée to the context menu.
     * @param text {string}
     * @param callback {function}
     */
    addEntry(text, callback) {
        this.addEntryDirect(new ContextEntry(text, callback, this));
    }

    /**
     *
     * @param entree {ContextEntry}
     */
    addEntryDirect(entree) {
        this.entrees.push(entree);

        const row = this.menuBody.insertRow();
        row.style.padding = '0';
        row.style.margin = '0';
        const cell = row.insertCell();
        cell.style.padding = '0';
        cell.style.margin = '0';
        cell.append(entree.button);
    }
}