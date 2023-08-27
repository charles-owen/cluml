// import {Main} from './Main';
import {Options} from './Options';
import {Ready} from './Utility/Ready';

/**
 * Create an instance of Cluml
 *
 * This creates a single Instance that manages the
 * components and starts actual Cluml windows.
 *
 * Construct and start running like this:
 *
 * Given an HTML div:
 *     <div id="cluml"></div>
 *
 * The following script starts Cluml in that div:
 *
 *     var cluml = new Cluml('#cluml');
 *     cluml.start();
 *
 * @param sel Selector to create Cluml in (can be many)
 * @param options An object containing Cluml options.
 * @constructor
 */
export const Cluml = function(sel, options) {
    //
    // Master set of the version
    //
    let PACKAGE = require('../../package.json');
    this.version = PACKAGE.version;

    //
    // Determine the root directory for Cluml
    // This is the directory containing cluml.dev.js or
    // cluml.min.js
    //
    this.root = __webpack_public_path__;

    // Record the selector
    this.sel = sel;

    // The Options object that manages user options
    this.options = new Options(options);

    // A collection of Main objects.
    var mains = [];

    /**
     * Start Cluml running, creating the user interface.
     * This does wait for document ready before calling
     * this.startNow() unless we are running in no-window
     * mode. In that case it returns a started instance.
     */
    this.start = () => {
        if(sel === null) {
            return this.startNow();
        }

        Ready.go(() => {
            this.startNow();
        });
    }

    /**
     * Start Cluml running now. Does not wait for document ready.
     */
    this.startNow = () => {
        if(sel !== null) {
            if(sel instanceof Element) {
	            const main = new Main(this, sel, tests);
	            mains.push(main);
            } else {
                const elements = document.querySelectorAll(sel);
                for(let i=0; i<elements.length; i++) {
                    const element = elements[i];
	                const main = new Main(this, element, tests);
	                mains.push(main);
                }
            }

            if(mains.length === 1) {
	            if(this.options.global !== null) {
		            global[this.options.global] = mains[0];
	            }

                return mains[0];
            }
        } else {
            this.options.display = 'none';
            let main = new Main(this, null, tests);
            mains.push(main);
            return main;
        }

        return null;
    }


    /**
     * Get all active instances of Cluml that are running.
     * @returns {Array} Array of objects of type Main.
     * @deprecated This is going away
     */
    this.getInstances = function() {
        return mains;
    }

    /**
     * Add a test that is available to run
     *
     * The underlying test is a JavaScript object with these tags:
     *
     * tag: A tag to identify the test
     * name: Name of the test, what will appear in menus
     * input: Array of input labels
     * output: Array of output labels
     * test: Array of tests, each an array of input/expected
     * staff: true if this is staff testing (no saving)
     *
     * @param test Test to add. Can be Javascript object, JSON or base64
     * encoded JSON.
     */
    this.addTest = function(test) {
        tests.push(test);
    }

    /**
     * Run a test by name
     * @param test
     */
    this.runTest = function(test) {
        mains.forEach(function(main) {
            main.runTest(test);
        })
    }

}
