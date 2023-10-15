import {SanityElement} from "./SanityElement";
import { SanityErrorInfo } from "./SanityErrorInfo";

const numberToNumber = /^[0-9]+\.\.[0-9]+$/
const numberToAny = /^[0-9]+\.\.\*$/
const numberOnlyRX = /^[0-9]+$/;
const anyOnlyRX = /^\*$/;

export class Multiplicity extends SanityElement {
    //region Enums
    static MultiplicityType = {
        Invalid: 'Invalid',
        NumberOnly: 'NumberOnly',           // Like 1
        AnyOnly: 'AnyOnly',                 // *
        NumberToNumber: 'NumberToNumber',   // Like 1..9
        NumberToAny: 'NumberToAny',         // Like 1..*
    };
    //endregion

    //region Fields
    /**
     * The type of multiplicity.
     * @type {string}
     */
    multiplicityType = Multiplicity.MultiplicityType.Invalid;

    /**
     * Font of the label.
     * @type {string}
     */
    font = '14px Times';
    //endregion

    //region Constructors
    /**
     * Creates a new multiplicity from the provided string.
     * @param stringValue {string} The string value.
     */
    constructor(stringValue) {
        super(stringValue);
        this.processSanityCheck();
    }

    //endregion

    processSanityCheck() {
        const errors = super.processSanityCheck();

        if (numberToNumber.test(this.elementValue)) {
            this.multiplicityType = Multiplicity.MultiplicityType.NumberToNumber;
        } else if (numberToAny.test(this.elementValue)) {
            this.multiplicityType = Multiplicity.MultiplicityType.NumberToAny;
        } else if (numberOnlyRX.test(this.elementValue)) {
            this.multiplicityType = Multiplicity.MultiplicityType.NumberOnly;
        } else if (anyOnlyRX.test(this.elementValue)) {
            this.multiplicityType = Multiplicity.MultiplicityType.AnyOnly;
        } else {
            this.multiplicityType = Multiplicity.MultiplicityType.Invalid;
            errors.push(new SanityErrorInfo(
                '0010',
                'Multiplicity',
                this.elementValue,
                'Incorrect formatting.'
            ))
        }

        return errors;
    }
}
