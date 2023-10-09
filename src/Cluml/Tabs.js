import {View} from './View';
import {Tools} from './DOM/Tools';


/**
 * Manages the tabs in the model
 * @param main {Main} Main object
 * @constructor
 */
export const Tabs = function (main) {
    class TabData {
        /**
         * Creates a new TabData.
         * @param li {HTMLLIElement} The list element.
         * @param pane {HTMLElement}
         * @param diagram {Diagram}
         * @param view {View}
         */
        constructor(li, pane, diagram, view) {
            this.li = li;
            this.pane = pane;
            this.diagram = diagram;
            this.view = view;
        }
    }

    /// The currently active view/tab
    this.active = -1;

    /**
     * The collection of tabs
     * @type {TabData[]}
     */
    let tabs = [];

    //
    // The structure: <div class="tabs"><ul></ul><div class="panes"></div></div>
    // div.tabs - Enclosure for all tabs content
    // ul - The tabs we select from
    // div.panes - The panes with the tab contents
    //

    let tabsDiv = null, ul = null, panesDiv = null;

    this.size = function () {
        return tabs.length;
    }

    /**
     * Create the tabs system
     * @param div The div we put the tabs into
     */
    this.create = (div) => {
        // Create: <div class="tabs"><ul></ul><div class="panes"></div></div>
        tabsDiv = Tools.createClassedDiv('tabs');
        ul = document.createElement('ul');
        tabsDiv.appendChild(ul);

        panesDiv = Tools.createClassedDiv('panes');
        tabsDiv.appendChild(panesDiv);

        div.appendChild(tabsDiv);

        // Clear the tabs collection
        tabs = [];

        this.sync();
    }

    /**
     * Synchronize the tabs to match the model.
     */
    this.sync = function () {
        if (!needSync()) {
            return;
        }

        // What is the current diagram?
        let current = this.active >= 0 ? tabs[this.active].diagram : null;
        let collection = main.model.diagrams.getDiagrams();

        // Div containing the panes
        panesDiv = Tools.createClassedDiv('panes');

        // The ul tag for the tabs
        ul = document.createElement('ul');

        // New collection of tabs
        let tabsNew = [];

        for (const diagram of collection) {
            let li = document.createElement('li');
            let a = document.createElement('a');
            li.appendChild(a);
            a.innerText = diagram.getName();
            li.addEventListener('click', (event) => {
                event.preventDefault();
                selectLi(li);
            });

            a.addEventListener('click', (event) => {
                event.preventDefault();
                selectLi(li);
            });

            ul.appendChild(li);

            /**
             * Does the pane already exist in tabs?
             * @type {HTMLElement}
             */
            let pane = null;
            /**
             * @type {View}
             */
            let view = null;
            for (let i in tabs) {
                if (diagram === tabs[i].diagram) {
                    // There was a previous tab for this diagram
                    pane = tabs[i].pane;
                    view = tabs[i].view;
                }
            }

            if (pane === null) {
                // <div class="tab"><canvas></canvas></div>
                pane = Tools.createClassedDiv('tab');
                let canvas = document.createElement('canvas');
                pane.appendChild(canvas);

                view = new View(main, canvas, diagram);
            }

            panesDiv.appendChild(pane);
            view.tabnum = tabsNew.length;
            tabsNew.push(new TabData(li, pane, diagram, view));
        }

        tabsDiv.innerHTML = '';

        tabsDiv.appendChild(ul);
        tabsDiv.appendChild(panesDiv);

        tabs = tabsNew;

        //
        // Find and select the current diagram.
        //
        this.selectTabByDiagram(current);
    }

    /**
     * Selects the tab that corresponds with the specified diagram.
     * @param diagram {Diagram}
     */
    this.selectTabByDiagram = function (diagram) {
        if (diagram === null) {
            // If nothing was current before, select the
            // first tab.
            this.selectTab(0, true);
        } else {
            let any = false;
            for (let i in tabs) {
                if (diagram === tabs[i].diagram) {
                    // We found that current moved, so select that
                    any = true;
                    this.selectTab(i, true);
                    break;
                }
            }

            if (!any) {
                // Current has been deleted
                if (this.active >= tabs.length) {
                    this.selectTab(this.active - 1);
                } else {
                    this.selectTab(this.active);
                }
            }
        }
    }

    /*
     * Determine if the tabs differ from the current diagram collection.
     * @returns true if we need a new sync operation.
     */
    function needSync() {
        let collection = main.model.diagrams.getDiagrams();
        if (tabs.length !== collection.length) {
            // If we have different number of diagrams than tabs
            return true;
        }

        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].diagram !== collection[i]) {
                // If a diagram has moved
                return true;
            }

            let tabName = tabs[i].li.querySelector('a').textContent;
            if (tabName !== collection[i].getName()) {
                // If a diagram has been renamed
                return true;
            }
        }

        return false;
    }

    const selectLi = (li) => {
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].li === li) {
                this.selectTab(i);
            }
        }
    }

    this.selectTab = (num, force) => {
        if (force !== true && num === this.active) {
            return;
        }

        //
        // Clear all selections
        //
        tabs.forEach((tab) => {
            Tools.removeClass(tab.li, 'selected');
            Tools.removeClass(tab.pane, 'selected');
        });

        this.active = +num;
        let tab = tabs[this.active];

        Tools.addClass(tab.li, 'selected');
        Tools.addClass(tab.pane, 'selected');

        tab.view.draw();
        main.model.getSimulation().setView(tab.view);

        main.newTab();
    }

    /**
     * Return the current View object
     * @return {View}
     */
    this.currentView = () => {
        if (this.active < 0) {
            return null;
        }

        return tabs[this.active].view;
    };

    // Return the current diagram object
    this.currentDiagram = () => {
        if (this.active < 0) {
            return null;
        }

        return tabs[this.active].diagram;
    }

    // Implement undo for the tabs
    this.undo = function () {
        // What is the current tab before we undo?
        let current = this.active >= 0 ? tabs[this.active].diagram : null;
        if (current !== null) {
            // We need to know the undo version...
            current = current.prev;

            if (current !== null) {
                for (const component of current.components) {
                    component.onUndo();
                }
            }
        }

        // Clear any 'active' any selections
        this.active = -1;

        for (let tab of tabs) {
            tab.view.selection.clear();
        }

        this.sync();

        for (let tab of tabs) {
            tab.view.draw();
        }

        // Reselect the previously selected tab if it still exists
        this.selectTabByDiagram(current);
    }

    this.destroy = function () {
        this.active = -1;
        tabsDiv.parentNode.removeChild(tabsDiv);
        tabsDiv = null;
        tabs = [];
    };

    this.validateName = function (name, skip) {
        const collection = main.model.diagrams.getDiagrams();
        for (let i = 0; i < collection.length; i++) {
            const diagram = collection[i];
            if (diagram === skip) {
                continue;
            }

            if (name.toLowerCase() === diagram.getName().toLowerCase()) {
                return 'Name ' + name + ' already in use by another tab';
            }
        }

        return null;
    }

    /**
     * Add a new tab with a new diagram in it.
     * @param name
     */
    this.add = function (name) {
        main.model.addDiagram(name);
        this.sync();
        this.selectTab(tabs.length - 1, true);
    }

    /**
     * Delete the active tab
     * @param index
     */
    this.delActive = (index) => {
        if (this.active < 0) {
            return;
        }

        main.model.deleteDiagramByIndex(this.active);
        this.sync();
    }

    this.rename = function (name) {
        main.model.diagrams.rename(this.active, name);
        this.sync();
    }
};
