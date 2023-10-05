import { SanityElement } from "./SanityElement";

export class TNodeTag extends SanityElement {

    constructor(stringValue) {
        super(stringValue);
    }

    processSanityCheck() {
        // Checks go here.
        return super.processSanityCheck();
    }
}
