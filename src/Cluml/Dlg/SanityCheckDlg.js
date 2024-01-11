import {Dialog} from './Dialog';
import {SanityElement} from "../SanityElement/SanityElement";
import {SanityErrorInfo} from "../SanityElement/SanityErrorInfo";

/**
 * Sanity Check dialog box.
 * @constructor
 */
export const SanityCheckDlg = function(main) {
    Dialog.call(this);

    this.open = function() {
        this.buttonCancel = null;

        const h1 = document.createElement('h1');
        h1.textContent = 'Sanity Check';
        const html = document.createElement('div');
        html.appendChild(h1);

        let errorCount = 0;
        const errorList = document.createElement('ul');
        const errorTbl = document.createElement('table');
        errorTbl.className = 'cluml-sanity-check-tbl';

        // error check the diagram in view
        for (const element of SanityElement.getAllSanityElements()) {
            const sanityElemErrors = element.processSanityCheck();

            for (const error of sanityElemErrors) {
                if (typeof error === "string") {
                    const li = document.createElement('li');
                    li.textContent = error;
                    errorList.appendChild(li);
                } else {
                    // Use new format.
                    errorTbl.appendChild(error.HTMLRepresentation);
                }

                errorCount += 1;
            }
        }

        // Check for composition cycles
        const classes = main.currentView().diagram.getComponentsByType("Class");
        const interfaces = main.currentView().diagram.getComponentsByType("InterfaceClass");
        const visited = new Set();
        let recursiveVisited = new Set();
        let hasCycle = false;
        for (const classObj of classes) {
            if (visited.has(classObj)) {
                continue;
            }
            recursiveVisited.clear();
            hasCycle = hasCycle || isCyclic(classObj, visited, recursiveVisited);
            if (hasCycle)
                break;
        }
        if (hasCycle) {
            errorTbl.appendChild(new SanityErrorInfo("9999", "Diagram",
                "", "Composition cycle detected").HTMLRepresentation);
            errorCount += 1;
        }

        // Check for multiple classes with the same name
        const map = new Map();
        const allClasses = classes.concat(interfaces)
        for (const classObj of allClasses) {
            if (!map.has(classObj.naming)) {
                map.set(classObj.naming, 1);
            }
            else {
                let count = map.get(classObj.naming);

                if (count === 1) {
                    // add error message
                    errorTbl.appendChild(new SanityErrorInfo("9998", "Class",
                        classObj.naming, "Multiple classes with the same name").HTMLRepresentation);
                    errorCount += 1;
                }
                map.set(classObj.naming, count + 1);
            }
        }

        const h2 = document.createElement('h2');
        h2.textContent = `(${errorCount}) errors have been detected`;
        html.appendChild(h2);
        html.appendChild(errorList);
        html.appendChild(errorTbl);

        this.contents(html, "Cluml Sanity Check");
        Dialog.prototype.open.call(this);

        // This is how to change the width.
        this.dialog.div.style.width = '48em';
    }


    /**
     * Function to find composition cycles
     * @param node Class node from the current diagram
     * @param visited set of classes already visited
     * @param recursiveVisited set to keep track of recursive visits. If an element is already in this set, then
     * there is a cycle
     * @returns {boolean}
     */
    const isCyclic = function(node, visited, recursiveVisited)
    {
        if (node === undefined || node === null)
        {
            return false;
        }
        if (recursiveVisited.has(node)) {
            return true;
        }
        let hasCycle = false;
        if (!visited.has(node))
        {
            visited.add(node);
            recursiveVisited.add(node);

            for (const tNode of node.attachedTNodes) {
                if (tNode.association.fileLbl === "Composition" && !tNode.isTail) {
                    const nodes = tNode.association.nodes;
                    const tail = nodes.start.isTail ? nodes.start : nodes.end;
                    hasCycle = hasCycle || isCyclic(tail.attachedTo, visited, recursiveVisited);
                }
            }
            recursiveVisited.delete(node);
        }
        return hasCycle;
    }

    const isAlphaNumeric = function(s) {
        let array = s.match(/\w/g);
        return array !== null && array.length === s.length;
    }
}

SanityCheckDlg.prototype = Object.create(Dialog.prototype);
SanityCheckDlg.prototype.constructor = SanityCheckDlg;
