import {Selection} from './Selection';
import {Component} from './Component';
import {Tools} from './DOM/Tools';
import {ImportTabDialog} from "./Dlg/ImportTabDialog";
import {Model} from "./Model";
import {ExportPNGDlg} from "./Dlg/ExportPNGDlg";
import Vector from "./Utility/Vector";
import Selectable from "./Selectable";
import {Class} from "./Components/Class";
import {Attribute} from "./SanityElement/Attribute";
import {MainSingleton} from "./MainSingleton";

/**
 * View of a diagram
 * @param main {Main} Main object for interface
 * @param canvas {HTMLCanvasElement} Canvas element in the view
 * @param diagram {Diagram} Diagram we draw on that canvas
 * @constructor
 */
export const View = function(main, canvas, diagram) {
    //
    // Object properties
    //
    Object.defineProperties(this, {
        main: {
            get: function() {
                return main;
            }
        },
        diagram: {
            get: function() {
                return diagram;
            },
            set: function(value) {
                diagram = value;
            }
        },
        element: {
            get: function() {
                return canvas;
            }
        },
        model: {
            get: function() {
                return diagram.diagrams.model;
            }
        }
    });

    // The selected object
    this.selection = new Selection(this);

    /// The tab number for this view
    this.tabnum = -1;

    canvas.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    canvas.addEventListener('drop', (event) => {
        event.preventDefault();
    });

    this.initialize = () => {
        this.setSize();

        main.dragAndDrop.droppable(this, (paletteItem, x, y) => {
            //whenever a component is dragged from the palette and dropped on the canvas,
            //this function is called
            const componentTemplate = paletteItem.template;
            if(componentTemplate === undefined) {
                return;
            }

            const component = new componentTemplate(paletteItem);
            this.initializeComponent(component, x, y);
        });

        //
        // Mouse management
        //
        let lastMouse = new Vector(0, 0);
        let mouse = new Vector(0, 0);
        let lastPage = new Vector(0, 0);

        let mouseDownListener = (event) => {
            event.preventDefault();

            //Determine if the user left-clicked or right-clicked
            if(event.button === 0){
                downListener(event.pageX, event.pageY, false, event);
            }
        }

        let contextMenuListener = (event) => {
            event.preventDefault();
            closeContextMenus();
            this.selection.rightClick(mouse.x, mouse.y, event);
            this.draw();
        }

        let closeContextMenus = () => {
            let classes = MainSingleton.singleton.getCurrentComponentsByType("Class");
            classes = classes.concat(MainSingleton.singleton.getCurrentComponentsByType("InterfaceClass"));
            for (const cl of classes) {
                cl.enableContextMenu(false);
            }
        }

        let longTouchTimer = null;
        let longTouchDuration = 500;
        let doubleTapTimer = null;
        let doubleTapDuration = 500;
        let touchStartListener = (event) => {
            //Check for double tap
            if (doubleTapTimer == null) {
                doubleTapTimer = setTimeout(function () {
                    //single tap, continue
                    doubleTapTimer = null;
                }, doubleTapDuration)
            } else {
                //double tap
                if (this.selection.selected.length === 1 &&
                    (this.selection.selected[0] instanceof Selectable)) {
                    this.selection.doubleTap(mouse.x, mouse.y, event, main);
                }
                doubleTapTimer = null;
                return;
            }

            event.preventDefault();

            longTouchTimer = setTimeout(function() {
                onLongTouchListener(event);
            }, longTouchDuration);

            let touch = event.changedTouches[0];
            downListener(touch.pageX, touch.pageY, true, event);
        }

        let onLongTouchListener = (event) => {
            this.selection.onLongTouch(mouse.x, mouse.y, event);
            this.draw();
        }

        let lastTap;

        /**
         * Sets the mouse position
         * @param pageX {number}
         * @param pageY {number}
         * @return {Vector} How far the cursor was moved.
         */
        function setMousePos(pageX, pageY) {
            let offset = Tools.offset(canvas);
            lastPage = {x: pageX, y: pageY};
            mouse.x = pageX - offset.left;
            mouse.y = pageY - offset.top;

            const dx = mouse.x - lastMouse.x;
            const dy = mouse.y - lastMouse.y;

            lastMouse.x = mouse.x;
            lastMouse.y = mouse.y;

            return new Vector(dx, dy);
        }

        let downListener = (pageX, pageY, touch, event) => {

            setMousePos(pageX, pageY);


            // if (lastTap === undefined) { lastTap = new Date().getTime(); }
            // let now = new Date().getTime();
            // let timeBetween = now - lastTap;
            // if((timeBetween < 700) && (timeBetween > 0)){
            //     // double tap
            //     this.selection.doubleTap(mouse.x, mouse.y, event);
            //     return;
            // }
            //
            // lastTap = new Date().getTime();

            // If we are in inline mode, we don't allow selecting
            // or dragging at all.
            if(main.options.display === 'inline') {
                this.diagram.touch(mouse.x, mouse.y);
                return;
            }

            let tempComp = this.diagram.touch(mouse.x, mouse.y);

            //if user is in association selection mode, and the user has touched a class
            if(main.selectionToggle === false &&
                tempComp !== null && (tempComp.fileLbl === 'Class' || tempComp.fileLbl === "InterfaceClass")){
                //create an association
                const componentTemplate = main.toggleManager.toggledAssociation.template;

                const newAssociation = new componentTemplate(main.toggleManager.toggledAssociation);
                this.initializeComponent(newAssociation, mouse.x, mouse.y);

                //Set the end node of association as selected
                this.selection.selectEndNode(newAssociation, mouse.x, mouse.y);
                //return;
            }

            this.selection.mouseDown(mouse.x, mouse.y, event);
            this.draw();

            // Only install mouse or touch movement
            // handler while we are moving
            if(touch) {
                canvas.addEventListener('touchmove', touchMoveListener);
            } else {
	            canvas.addEventListener('mousemove', mouseMoveListener);
            }

            canvas.parentNode.addEventListener('scroll', scrollListener);
        };

        let scrollListener = () => {
	        const offset = Tools.offset(canvas); // canvasJ.offset();
	        mouse.x = lastPage.x - offset.left;
	        mouse.y = lastPage.y - offset.top;

            //if user is in association selection mode
            if(main.selectionToggle === false){
                this.diagram.touch(mouse.x, mouse.y);
                return;
            }

	        this.selection.mouseMove(mouse.x, mouse.y, mouse.x - lastMouse.x, mouse.y - lastMouse.y);
	        lastMouse.x = mouse.x;
	        lastMouse.y = mouse.y;
	        this.draw();
        }

        let mouseMoveListener = (event) => {
            event.preventDefault();
            moveListener(event.pageX, event.pageY, false);
        }

        let touchMoveListener = (event) => {
            event.preventDefault();

            if (longTouchTimer)
                clearTimeout(longTouchTimer);

            let touch = event.changedTouches[0];
            moveListener(touch.pageX, touch.pageY, true);
        }

        let moveListener = (pageX, pageY, touch) => {
            // Ignore if we did not actually move
            if(pageX === lastPage.x && pageY === lastPage.y) {
                return;
            }

            const dv = setMousePos(pageX, pageY);

            this.selection.mouseMove(mouse.x, mouse.y, dv.x, dv.y);

            this.ensureSize();
            this.draw();
        }

        /**
         * Listener for double clicks.
         * @param event {MouseEvent}
         */
        let dblClickListener = (event) => {
            event.preventDefault();

            setMousePos(event.pageX, event.pageY);

            //if user is in association selection mode
            if(main.selectionToggle === false){
                this.diagram.touch(mouse.x, mouse.y);
                return;
            }

            if (this.selection.selected.length === 1 &&
                (this.selection.selected[0] instanceof Selectable)) {
                this.selection.doubleTap(mouse.x, mouse.y, event, main);
            }
        }

        let keysDown = {};
        let keyDownListener = (e) => {
            if (this.selection.selected[0] instanceof Class) {
                keysDown[e.keyCode] = e.type == 'keydown';
                // Ctrl + A for Add
                // 17 - Ctrl
                // 91 - Left Cmd
                // 93 - Right Cmd
                if (keysDown[17] && keysDown[65] || keysDown[91] && keysDown[65] ||
                    keysDown[93] && keysDown[65])
                {
                    this.selection.selected[0].addAttribute(new Attribute('+attribute: string'));
                    this.draw();
                    keysDown = {};
                }
                // Ctrl + P for Properties
                else if (keysDown[17] && keysDown[80] || keysDown[91] && keysDown[80] ||
                         keysDown[93] && keysDown[80])
                {
                    e.preventDefault();
                    this.selection.selected[0].openProperties();
                    this.draw();
                    keysDown = {};
                }
                // Enter should count as a mouseDown/mouseUp (confirms changes)
                else if(keysDown[13])
                {
                    e.preventDefault();
                    this.selection.mouseDown(0, 0, e);
                    this.selection.mouseUp(0, 0);
                    this.draw();
                    keysDown = {};
                }
            }
        }

        let keyUpListener = (e) => {
            keysDown = {};
        }

        let touchEndListener = (event) => {
            event.preventDefault();

            if (longTouchTimer)
                clearTimeout(longTouchTimer);

            let touch = event.changedTouches[0];
            upListener(touch.pageX, touch.pageY, true);
        }

        let touchCancelListener = (event) => {
            let touch = event.changedTouches[0];
            upListener(touch.pageX, touch.pageY, true);
        }

        let mouseUpListener = (event) => {
            canvas.removeEventListener('mousemove', mouseMoveListener);
            upListener(event.pageX, event.pageY, false);
        }

        let upListener = (pageX, pageY, touch) => {
            canvas.parentNode.removeEventListener('scroll', scrollListener);
            // canvasJ.parent().off("scroll");
            const dv = setMousePos(pageX, pageY);
            this.selection.mouseUp(dv.x, dv.y);
            this.draw();
        }

        // Install mouse handlers
        canvas.addEventListener('contextmenu', contextMenuListener);
        canvas.addEventListener('mousedown', mouseDownListener);
        canvas.addEventListener('dblclick', dblClickListener);
        canvas.addEventListener('mouseleave', mouseUpListener);
        document.addEventListener('keyup', keyUpListener);
        document.addEventListener('keydown', keyDownListener);

        const body = document.querySelector('body');
        body.addEventListener('mouseup', mouseUpListener);

        // body.addEventListener('mouseleave', mouseUpListener);
        // Uncomment the above line and comment out
        //      canvas.addEventListener('mouseleave', mouseUpListener);
        // to instead target the body (so mouseUp isn't called when we
        // mouse over the palette).

        // Install touch handlers
        canvas.addEventListener('touchstart', touchStartListener);
        canvas.addEventListener('touchend', touchEndListener);
        canvas.addEventListener('touchcancel', touchCancelListener);
    }

    this.draw = function() {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.diagram.draw(ctx, this);
        this.selection.draw(ctx);
    };

    this.delete = function() {
        this.model.backup();
        this.selection.delete();
        this.draw();
    };

    /**
     * Advance the animation for this view by a given amount of time...
     * @param delta
     */
    this.advance = function(delta) {
        return this.diagram.diagrams.advance(delta);
    };

    this.ensureSize = function() {
        let bounds = this.diagram.bounds();
        let wid = bounds.right + 1;
        let hit = bounds.bottom + 1;

        if(wid > canvas.offsetWidth) {
            //canvasJ.width(max.x);
            canvas.style.width = wid + 'px';
            canvas.setAttribute("width", wid);
            diagram.width = wid;
        }

        if(hit > canvas.offsetHeight) {
            canvas.style.height = bounds.bottom + 'px';
            canvas.setAttribute("height", bounds.bottom);
            diagram.height = bounds.bottom;
        }
    }

    this.setSize = function() {
        if(canvas.offsetWidth !== this.diagram.width ||
            canvas.offsetHeight !== this.diagram.height) {

            // Size setting
            canvas.style.width = this.diagram.width + 'px';
            canvas.style.height = this.diagram.height + 'px';
            canvas.width = this.diagram.width;
            canvas.height = this.diagram.height;
        }
    };

    this.initialize();
    this.draw();
};


/**
 * Import a tab from another file that we load via AJAX.
 * @param importer Object from the list of imports
 *
 * Keys in the importer object:
 *
 * from - Tab in source we import from
 * into - Tab we import into
 * name - Filename for source
 * extra - Object with extra key/value pairs to send to server when importing
 */
View.prototype.importTab = function(importer) {
    this.selection.clear();

    const dlg = new ImportTabDialog(importer, this.main.options, this.main.toast);
    dlg.open((data) => {
        this.model.backup();

        const model = new Model(this.main);
        model.fmJSON(data);

        // Find the tab
        const diagram = model.getDiagram(importer.from);
        if(diagram !== null) {
            diagram.name = importer.into;
	        this.main.model.replaceDiagram(diagram);
	        this.diagram = diagram;
	        this.draw();
        }
    });
}

/**
 * Initializes the component within the view.
 * @param component {Component}
 * @param x {number}
 * @param y {number}
 */
View.prototype.initializeComponent = function (component, x, y) {
    //console.log('View called model.backup');
    this.model.backup();

    component.brand();

    component.x = x;
    component.y = y;
    component.main = this.main;

    this.diagram.add(component);
    this.diagram.snapIt(component);
    component.drop();
    component.placedOnCanvas = true;
    this.ensureSize();
    this.draw();
}

/**
 * Export this view as a PNG file
 */
View.prototype.exportPNG = function() {
    const dlg = new ExportPNGDlg(this);
    dlg.open();
}

