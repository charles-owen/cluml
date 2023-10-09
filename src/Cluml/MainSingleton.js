export class MainSingleton {
    //region Fields
    /**
     * @type{Main}
     */
    #main;

    /**
     * Reference to the main instance.
     * @type{MainSingleton}
     */
    static singleton;
    //endregion

    //region Constructor
    /**
     * Creates a new singleton for the Main that exposes select
     * fields and functions.
     * @param main {Main}
     */
    constructor(main) {
        if (MainSingleton.singleton !== undefined) {
            throw new Error("Only one instance of MainSingleton is allowed.");
        } else {
            this.#main = main
            MainSingleton.singleton = this;
        }
    }
    //endregion

    /* Add functions you want exposed here. */
    //region Exposed Methods/Getters
    /**
     * Returns the current view.
     * @return {View}
     */
    get currentView() {
        return this.#main.currentView();
    }

    /**
     * Returns the current diagram.
     * @return {Diagram}
     */
    get currentDiagram() {
        // More accurate than this.#main.currentView().currentDiagram()
        const i = this.#main.tabs.active;
        return this.#main.model.diagrams.getDiagrams()[i];
    }

    /**
     * Returns the current options.
     * @returns {*}
     */
    get options() {
        return this.#main.options;
    }

    /**
     * Returns the current selected tab's div.
     * @return {Element}
     */
    static get currentTabDiv() {
        return document.getElementsByClassName('tab')[0];
    }

    /**
     * Returns all components that exist
     * within the current diagram.
     * {Array<Component>}
     */
    get allCurrentComponents() {
        return this.currentDiagram.components;
    }

    /**
     * Returns all components of the specified type that exist
     * within the current diagram.
     * @param type {string}
     * @return {Component[]}
     */
    getCurrentComponentsByType(type) {
        return this.currentDiagram.getComponentsByType(type);
    }

    /**
     * Backs up the current diagram object to support undo.
     * Call this if a component experiences a change that
     * might not be picked up by the system.
     */
    backup() {
        console.log('Backup');
        this.#main.backup();
    }

    /**
     * Alias for backup.
     */
    clone() {
        this.backup();
    }

    /**
     * Redraws the current view.
     */
    redraw() {
        this.currentView.draw();
    }
    //endregion
}
