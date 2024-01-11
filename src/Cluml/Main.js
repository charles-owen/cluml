import Resizer from 'resizer-cl';

import {Menu} from './Menu';
import {Palette} from './Palette';
import {Model} from './Model';
import {Diagram} from './Diagram';
import {Tabs} from './Tabs';
import {Test} from './Test/Test';
import {FileSaveDialog} from './Dlg/FileSaveDialog';
import {FileOpenDialog} from './Dlg/FileOpenDialog';
import {SaveDialog} from './Dlg/SaveDialog';
import {OpenDialog} from './Dlg/OpenDialog';
import {View} from './View';
import {HelpDiv} from './Graphics/HelpDiv';
import {DragAndDrop} from './UI/DragAndDrop';
import {ToggleManager} from "./UI/ToggleManager";
import {Tools} from './DOM/Tools';
import {Ajax} from './Utility/Ajax';
import {JsonAPI} from "./Utility/JsonAPI";
import {Toast} from "./Graphics/Toast";
import {ExportDlg} from "./Dlg/ExportDlg";
import {ImportDlg} from "./Dlg/ImportDlg";
import {MainSingleton} from "./MainSingleton";
import {Rect} from "./Utility/Rect";
import Vector from "./Utility/Vector";

/**
 * Actual instance of cluml for a single element.
 * @param cluml {Cluml} The main cluml object
 * @param element Element we are loading into
 * @param tests Array of tests added to cluml using addTest
 * @constructor
 */
export const Main = function (cluml, element, tests) {
    new MainSingleton(this);

    this.cluml = cluml;
    this.element = element;
    this.options = cluml.options;
    this.components = cluml.components;
    this.test = new Test(this);

    /// div.main
    /**
     *
     * @type {HTMLDivElement}
     */
    this.div = null;

    //
    // Tests can come from add_test or from options
    //
    for (const test of tests) {
        this.test.addTest(test);
    }

    for (const test of this.options.tests) {
        this.test.addTest(test);
    }

    this.filename = null;

    let options = cluml.options;

    /// The active editing model
    let model = null;

    /// References to other model diagrams

    /**
     * The menu.
     * @type {Menu}
     */
    let menu = null;
    /**
     * The palette.
     * @type {Palette}
     */
    let palette = null
    /**
     * Tabs.
     * @type {Tabs}
     */
    let tabs = null;

    /// div.overlay
    let divOverlay = null, divWork = null;

    this.initialize = function () {
        if (options.display !== 'none') {
            Tools.addClass(element, 'cluml');
            element.innerHTML = '';

            switch (options.display) {
                case 'full':
                    Tools.addClass(element, 'cluml-full');
                    break;

                case 'inline':
                    Tools.addClass(element, 'cluml-inline');
                    break;

                default:
                    Tools.addClass(element, 'cluml-window');
                    break;
            }

            if (options.display === 'window') {
                //
                // Add resizer to the window if in window mode,
                // and it has not already been added
                //
                if (!element.classList.contains("resizer")) {
                    new Resizer(element, {
                        handle: '10px solid #18453B'
                    });
                }
            }

            //instantiate DragAndDrop and Toggle support
            this.dragAndDrop = new DragAndDrop(this);
            this.toggleManager = new ToggleManager(this);

            /**
             * Toggle that determines the current selection mode.
             * True means 'class' mode.
             * False means 'association' mode.
             * @type {boolean}
             */
            let _selectionToggle = true;

            Object.defineProperty(this, 'selectionToggle', {
                get: function () {
                    return _selectionToggle;
                },
                set: function (value) {
                    _selectionToggle = value;
                }
            });

            //
            // Install a mutation observer, so we can know if the
            // element that contains cluml is removed from the
            // DOM.
            //
            const observer = new MutationObserver(() => {
                if (!document.body.contains(element)) {
                    observer.disconnect();
                    this.model.kill();
                }

            });

            observer.observe(document.body, {childList: true});
        }

        //
        // Instantiate a model object
        //
        model = new Model(this);
        this.model = model;

        for (let i in this.options.tabs) {
            this.model.diagrams.add(new Diagram(this.options.tabs[i]));
        }

        if (this.options.preloadJson !== null) {
            model.fmJSON(this.options.preloadJson);
        }

        //
        // Create and add the window diagrams
        //
        if (options.display !== 'inline' && options.display !== 'none') {
            //
            // All window-based versions other than inline get the
            // full user interface
            //

            // <div class="main"></div>
            this.div = Tools.createClassedDiv('main');
            this.element.appendChild(this.div);

            this.help = new HelpDiv(this);

            tabs = new Tabs(this);
            this.tabs = tabs;

            //
            // Add the menu
            //
            menu = new Menu(this);
            this.menu = menu;

            //
            // Working area
            // <div class="work"></div>
            //
            divWork = Tools.createClassedDiv('work');
            this.div.appendChild(divWork);


            //
            // And the palette
            //
            palette = new Palette(this, divWork);
            this.palette = palette;

            //
            // And add the tabs
            //
            tabs.create(divWork);

            //
            // And the overlay
            // <div class="cluml-overlay"></div>
            //
            divOverlay = Tools.createClassedDiv('cluml-overlay');
            this.div.appendChild(divOverlay);

            this.toast = new Toast(this);
            this.toast.create(this.div);
        }

        if (options.display === 'inline') {
            //
            // The minimal inline version
            // <div><canvas></canvas></div>
            //
            const div = document.createElement('div');
            element.appendChild(div);

            const canvas = document.createElement('canvas');
            div.appendChild(canvas);

            let diagram = model.diagrams.getDiagram('main');
            let view = new View(this, canvas, diagram, 0);
            model.getSimulation().setView(view);

            //
            // And the overlay
            // <div class="cluml-overlay"></div>
            //
            divOverlay = Tools.createClassedDiv('cluml-overlay');
            element.appendChild(divOverlay);

            this.toast = new Toast(this);
            this.toast.create(this.element);
        }

        //
        // If open is specified with a single name, we
        // automatically open the file when we start.
        //
        const open = this.options.getAPI('open');
        if (open !== null && open.url !== undefined && open.name !== undefined) {
            this.filename = open.name;
            const dlg = new OpenDialog(open.name, this.options, this.toast);
            dlg.open((name, json) => {
                model.fmJSON(json);
                this.reload();
                this.filename = name;
            });
        }

        // Intercept print event.
        window.addEventListener('beforeprint', (e) => {
            this.print();
        });
    }


    this.addTest = function (test) {
        this.test.addTest(test);
    }


    /**
     * Returns the current view.
     * @returns {View}
     */
    this.currentView = function () {
        return tabs.currentView();
    };

    /**
     * Called whenever a new tab is selected
     */
    this.newTab = function () {
        // if(palette !== null) {
        //     palette.refresh();
        // }
        model.newTab();
    }

    /**
     * Backup the current diagrams object in support of an Undo operation
     */
    this.backup = function () {
        model.backup();
    };

    /**
     * Undo operation
     */
    this.undo = function () {
        model.undo();
        tabs.undo();
        // palette.refresh();
    };

    /**
     * Set or clear interface modal state.
     * @param modal True sets interface to modal state.
     *
     */
    this.modal = function (modal) {
        if (modal) {
            divOverlay.style.display = 'block';
        } else {
            divOverlay.style.display = 'none';
        }
    }

    this.open = function () {
        const dlg = new FileOpenDialog(this.options, this.toast);
        dlg.open((name, data) => {
            model.fmJSON(data);
            this.reload();
            this.filename = name;
        });
    }

    /**
     * Save the model to the server.
     * @param singleOnly If true, we only save if the single-file save option
     * @param silent If true, do not display a toast on successful single-file save
     */
    this.save = (singleOnly, silent) => {
        const api = this.options.getAPI('save');

        if (api === null) {
            // Save is not supported
            return;
        }

        if (api.name !== undefined) {
            const json = model.toJSON();
            let data = Object.assign({
                cmd: "save",
                name: api.name,
                data: json,
                type: 'application/json'
            }, api.extra);

            Ajax.do({
                url: api.url,
                data: data,
                method: "POST",
                dataType: 'json',
                contentType: api.contentType,
                success: (data) => {
                    const json = new JsonAPI(data);
                    if (!this.toast.jsonErrors(json)) {
                        if (silent !== true) {
                            this.toast.message('Successfully saved to server');
                        }
                    }
                },
                error: (xhr, status, error) => {
                    console.log(xhr.responseText);
                    this.toast.message('Unable to communicate with server: ' + error);
                }
            });

            return;
        }

        if (singleOnly === true) {
            return;
        }

        if (this.filename === null) {
            this.saveAs();
        } else {
            const json = model.toJSON();
            const dlg = new SaveDialog(json, "application/json", this.filename, this.options, this.toast);
            dlg.open();
        }
    }

    this.saveAs = function () {
        const json = model.toJSON();
        const dlg = new FileSaveDialog(json, "application/json", this.options, this.toast);
        if (this.filename !== null) {
            dlg.filename = this.filename;
        }

        dlg.open((name) => {
            this.filename = name;
        });
    }


    this.export = function () {
        const dlg = new ExportDlg(model);
        dlg.open();
    };

    this.import = function () {
        const dlg = new ImportDlg(this, model);
        dlg.open();
    };

    this.print = function () {
        // Trying to somehow scale the canvas, but not really working.
        const canvas = document.querySelector('div.tab.selected canvas');

        // const canvas = this.currentView().element;
        //
        // // Source: https://stackoverflow.com/a/8306028
        // // Create a new canvas
        // const copy = document.createElement('canvas');
        // copy.classList.add('print');
        // const context = copy.getContext('2d');
        //
        // // Set dimensions
        // copy.width = canvas.width;
        // copy.height = canvas.height;
        //
        // // Need to scale everything. Do that.
        // // First need to get the bounding box of both canvases.
        // const bounds0 = new Rect(0, canvas.height, canvas.width, 0);
        // const bounds1 = new Rect(0, 0, 0, 0);
        // for (const component of this.currentView().diagram.components) {
        //     bounds1.expand(component.bounds());
        // }
        //
        // // Then determine the translation.
        // const translate = Vector.sub(bounds0.center(), bounds1.center())
        // context.translate(translate.x, translate.y);
        //
        // this.div.appendChild(copy);

        // // Then determine the scale.
        // const scale = new Vector(
        //     bounds0.width
        // )

        // // Apply the old canvas to the new one
        // context.drawImage(canvas, 0, 0);
        //
        // const popup = window.open('', '_blank');
        // popup.document.body.appendChild(copy);
        // popup.focus();
        // popup.print();
        // popup.close();
    }

    // this.importTab = function() {
    //     // Is the current tab in this list?
    //     for(let i=0; i<this.options.imports.length; i++) {
    //         const importer = this.options.imports[i];
    //         if(importer.into === this.currentView().diagram.name) {
    //             this.currentView().importTab(importer);
    //             return;
    //         }
    //     }
    // }

    /**
     * Complete reload after a new model is loaded
     */
    this.reload = function () {
        tabs.destroy();
        tabs.create(divWork, model);
    }

    let dockedHelp = false;


    this.isHelpDocked = function () {
        return dockedHelp;
    }

    this.dockedHelp = function (dock) {
        dockedHelp = dock;
        if (dockedHelp) {
            Tools.addClass(this.element, 'docked-help');
        } else {
            Tools.removeClass(this.element, 'docked-help');
        }
    }

    /**
     * Load a model from JSON
     * @param json JSON source
     */
    this.loadMain = function (json) {
        model.fmJSON(json);
        this.reload();
    }

    this.initialize();
}


Main.prototype.runTest = function (test) {
    return this.test.runTest(test);
}
