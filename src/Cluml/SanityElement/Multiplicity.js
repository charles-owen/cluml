import {SanityElement} from "./SanityElement";

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

        // Run the sanity check to update the multiplicity types.
        this.processSanityCheck();
    }

    //endregion

    processSanityCheck() {
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
            return `Multiplicity "${this.elementValue}" formatted incorrectly.`;
        }

        return '';
    }

    /**
     * Draws this multiplicity.
     * @param context
     * @param view
     */
    draw(context, view) {

    }
}