import { SanityElement } from "./SanityElement";
import { SPACES_RX, NON_ALPHANUMERIC_RX} from "../Utility/Name";

export class TNodeTag extends SanityElement {
    processSanityCheck() {
        // Checks go here.
        const errors =  super.processSanityCheck();

        if (SPACES_RX.test(this.elementValue))
        {
            errors.push(`Role <a>${this.elementValue}</a> contains spaces`);
        }
        if (NON_ALPHANUMERIC_RX.test(this.elementValue))
        {
            errors.push(`Role <a>${this.elementValue}</a> contains non-alphanumeric characters`);
        }
        return errors;
    }
}
