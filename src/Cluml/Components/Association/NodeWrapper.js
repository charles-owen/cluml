import {wrap} from "@babel/runtime/regenerator";

export class NodeWrapper {
    /**
     * The internal node.
     * @type {LineNode}
     */
    #node = undefined;

    /**
     * ID for the node.
     * @type {string}
     */
    #id = undefined;

    /**
     *
     * @param node {LineNode} The node.
     * @param diagram {Diagram} The diagram.
     */
    constructor(node, diagram) {
        this.node = node;
        this.diagram = diagram;
    }

    /**
     *
     * @return {LineNode}
     */
    get node() {
        if (this.diagram !== undefined && this.diagram !== null) {
            this.#node = this.diagram.getComponentByID(this.#id);
        }

        return this.#node;
    }

    /**
     *
     * @param value {LineNode}
     */
    set node(value) {
        this.#node = value;
        this.#id = value.id;
    }

    get id() {
        if (!this.valid && this.#node !== undefined) {
            this.#id = this.#node.id;
        } else {
            this.#id = undefined;
        }

        return this.#id;
    }

    /**
     *
     * @param value {string}
     */
    set id(value) {
        this.#id = value;
    }

    /**
     * True if the node is valid (has a valid value). False otherwise.
     * @return {boolean}
     */
    get valid() {
        return this.#id !== undefined && this.#id !== '';
    }

    /**
     * Returns the value of wrapper.node. Also handles case where the wrapper is
     * undefined or null.
     * @param wrapper {NodeWrapper}
     * @param diagram {Diagram}
     * @return {LineNode|null}
     */
    static getNodeValue(wrapper, diagram) {
        if (wrapper === undefined || wrapper === null) {
            return null;
        }

        wrapper.diagram = diagram;
        return wrapper.node;
    }

    /**
     * Sets the value of wrapper.node. Also handles case where the wrapper is
     * undefined or null.
     * @param wrapper {NodeWrapper}
     * @param diagram {Diagram}
     * @param nodeValue {LineNode}
     */
    static setNodeValue(wrapper, diagram, nodeValue) {
        if (wrapper === undefined || wrapper === null) {
            wrapper = new NodeWrapper(nodeValue, diagram);
        } else {
            wrapper.node = nodeValue;
        }

        return wrapper;
    }

    /**
     * Sets the value of wrapper.node. Also handles case where the wrapper is
     * undefined or null.
     * @param wrapper {NodeWrapper}
     * @param diagram {Diagram}
     * @param nodeID {string}
     */
    static setNodeID(wrapper, diagram, nodeID) {
        if (wrapper === undefined || wrapper === null) {
            wrapper = new NodeWrapper(diagram.getComponentByID(nodeID), diagram);
        } else {
            wrapper.id = nodeID;
        }

        return wrapper;
    }
}