import {Selectable} from "../../Selectable";
import {Component} from "../../Component";

export class LineNode extends Component {
    //region Fields
    /**
     * Determines whether this node has been touched.
     * Untouched nodes may reposition themselves automatically.
     * Touched nodes will not.
     * @type {boolean}
     */
    touched = false;

    /**
     * The next LineNode.
     * @type {LineNode}
     */
    next = null;

    /**
     * The previous LineNode.
     * @type {LineNode}
     */
    previous = null;
    //endregion


    //region Constructors
    constructor() {
        super();
        Component.call(this);

    }

    //endregion

    //region Methods
    /**
     * Links this node with another node.
     * @param next {LineNode} The next line node.
     */
    linkTo(next) {
        this.next = next;
        next.previous = this;
    }

    /**
     * Tries to unlink from the next node.
     * @return {boolean} True if next exists and is removed, false otherwise.
     */
    tryUnlinkFromNext() {
        if (this.next === null)
            return false;
        else {
            this.next.previous = null;
            this.next = null;
            return true;
        }
    }

    //endregion
}

LineNode.prototype.grab = function () {
    Selectable.prototype.grab();
    this.touched = true;
}