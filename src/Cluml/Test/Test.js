
// import {Value} from '../Value';
import {MessageDialog} from '../Dlg/MessageDialog';
import {TestException} from './TestException';
import {Ajax} from "../Utility/Ajax";
import {JsonAPI} from "../Utility/JsonAPI";

/**
 * Constructor
 * @param main The Test object
 */
export const Test = function(main) {
    /// The main object
    this.main = main;

    /// Array of installed tests
    this.tests = [];

    this.addTest = function (test) {
        if (test === Object(test)) {
            this.tests.push(test);
        }
        else if (test.substr(0, 1) === '{') {
            this.tests.push(JSON.parse(test));
        } else {
            // Not JSON, must be base64 encoded
            test = atob(test);
            this.tests.push(JSON.parse(test));
        }
    }

    // /**
    //  * Find a test by its tag.
    //  * @param tag Tag to search for
    //  */
    // this.findTest = function(tag) {
    //     for(let i=0; i<this.tests.length; i++) {
    //         if(this.tests[i].tag === tag) {
    //             return this.tests[i];
    //         }
    //     }
    //
    //     return null;
    // }
    //
    //
    // function isString(str) {
    //     return (typeof str === 'string' || str instanceof String);
    // }
    //
    //
    //
    // /**
    //  * Run a single test and bring up result dialog boxes
    //  * @param test A test from the array of tests.
    //  */
    // this.runTestDlg = function(test) {
    //     // Save before we test
    //     main.save(true, true);
    //
    //     // Set the overlay so the tests are modal
    //     main.modal(true);
    //
    //     const promise = this.runTest(test);
    //     promise.then((test) => {
    //         // Success
    //         main.modal(false);
    //
    //         var html = '<h1>Diagram Success</h1>' +
    //             '<p>The test has passed.</p>'
    //         var dlg = new MessageDialog("Success", html);
    //         dlg.open();
    //
	//         setResult(test, test.success !== undefined ? test.success : 'success', main.model.toJSON());
    //
    //     }, (msg) => {
    //         // Failure
    //         main.modal(false);
    //
    //         var html = '<h1>Diagram Failure</h1>' + msg;
    //         var dlg = new MessageDialog("Test Failure", html, 450);
    //         dlg.open();
    //
    //         setResult(test, 'fail', main.model.toJSON());
    //     });
    // }

    // function setResult(test, result, diagram) {
	//     if(test.result !== undefined) {
	// 	    const elements = document.querySelectorAll(test.result);
	// 	    for(const element of elements) {
	// 		    element.value = result;
	// 	    }
	//     }
    //
    //     if(test.diagram !== undefined) {
    //         const elements = document.querySelectorAll(test.diagram);
    //         for(const element of elements) {
    //             element.value = diagram;
    //         }
    //     }
    //
    //     const api = main.options.getAPI('test');
    //
    //     if(api === null) {
    //         // Test API is not supported
    //         return;
    //     }
    //
    //     let data = Object.assign({cmd: "test",
    //         name: api.name,
    //         result: result,
    //         data: diagram,
    //         type: 'application/json'
    //     }, api.extra);
    //
    //     Ajax.do({
    //         url: api.url,
    //         data: data,
    //         method: "POST",
    //         dataType: 'json',
    //         contentType: api.contentType,
    //         success: (data) => {
    //             var json = new JsonAPI(data);
    //             if(!main.toast.jsonErrors(json)) {
    //                 main.toast.message('Test result successfully saved to server');
    //             }
    //         },
    //         error: (xhr, status, error) => {
    //            // console.log(xhr.responseText);
    //             main.toast.message('Unable to communicate with server: ' + error);
    //         }
    //     });
    // }


//     this.runTest = function(test) {
//         return new Promise((success, failure) => {
//             const model = main.model;
//
//             // Backup the model to support Undo of what the test changes
//             model.backup();
//
//             // The current test number
//             let testNum = -1;
//
//             let inputs, outputs;
//
//             try {
//                 //
//                 // Find the inputs
//                 //
//                 inputs = findInputs(test);
//
//                 //
//                 // Find the outputs
//                 //
//                 outputs = findOutputs(test);
//             } catch(exception) {
//                 if(exception instanceof TestException) {
//                     failure(exception.msg);
//                     return;
//                 } else {
//                     throw exception;
//                 }
//             }
//
//             function testOne() {
//                 if(testNum >= 0) {
//                     const t = test.test[testNum];
//
//                     // Ensure the last test passed
//                     for(let i=0; i<outputs.length && (i + inputs.length)<t.length; i++) {
//                         // What is expected?
//                         let expected = t[i + inputs.length];
//
//                         // Handle don't care, either a null or '?'
//                         if(expected === undefined || expected === null || expected === '?') {
//                             continue;
//                         }
//
//                         //
//                         // Handle any prefixes
//                         //
//
//                         // bitslop: is the bitslop option prefix.
//                         // Bitslop means we expect the result to be
//                         // within one bit of the expected value.
//                         //
//                         // test: is a string-based test.
//                         let bitSlop = false;
//                         let stringTest = false;
//
//                         if(isString(expected)) {
//                             let any = false;
//
//                             do {
//                                 any = false;
//
//
//                                 if(expected.substr(0, 8) === "bitslop:") {
//                                     bitSlop = true;
//                                     expected = expected.substr(8);
//                                     any = true;
//                                 } else if(expected.substr(0, 5) === "test:") {
//                                     stringTest = true;
//                                     expected = expected.substr(5);
//                                     any = true;
//                                 }
//                             } while(any);
//                         }
//
//                         if(stringTest) {
//                             //
//                             // String-based tests are like this:
//                             //
//                             // test:red=1;yel=0;grn=0
//                             // After the test: there is a series of one or more
//                             // tests separated by semicolons. Those tests are
//                             // passed to the function testAsString on the input,
//                             // which, in turn, passes the test on to testAsString
//                             // on the component. Test failures are indicated by a
//                             // throw.
//                             //
//                             const stringTests = expected.split(';');
// //                             for(const test of stringTests) {
// //                                 // Send the test to the component
// //                                 try {
// //                                     outputs[i].testAsString(test);
// //                                 } catch(msg) {
// //                                     if(test.quiet === true) {
// //                                         failure('<div class="cluml-test-result"><p>This test is failing. Some output is ' +
// //                                             'not what is currently expected by the test. The diagram is left in the state it was' +
// //                                             ' in when the test failed. No additional detail will be provided about why ' +
// //                                             'the test is failed. It is your responsibility to create a ' +
// //                                             'diagram that works as expected.</p></div>');
// //                                     } else {
// //                                         failure(`<div class="cluml-test-result"><p>This test is failing. ${msg}</p>
// // <p class="cs-info">Test ${testNum}</p></div>`);
// //                                     }
// //
// //                                     // We are done when there is an error
// //                                     return;
// //                                 }
// //                             }
//
//                         } else {
//                             //
//                             // // Tests based on an expected value
//                             // // What is expected? Use a Value component to
//                             // // allow things like hex and floating point values
//                             // const value = new Value();
//                             // value.type = Value.BINARY;
//                             // value.setAsString(expected);
//                             //
//                             // // Get the result
//                             // let actual = outputs[i].getAsString();
//                             // let good = true;        // Until we know otherwise
//                             //
//                             // if (bitSlop) {
//                             //     expected = value.getAsInteger();
//                             //
//                             //     value.setAsBinary(actual);
//                             //     actual = value.getAsInteger();
//                             //     if (actual === '?') {
//                             //         good = false;
//                             //     } else if (actual < (expected - 1) || (actual > expected + 1)) {
//                             //         good = false;
//                             //     }
//                             // } else {
//                             //     // The normal (binary) comparison case
//                             //     expected = value.getAsBinary();
//                             //     if (isString(expected)) {
//                             //         // j and k index the last letters in actual and expected
//                             //         let j = actual.length - 1;
//                             //         let k = expected.length - 1;
//                             //
//                             //         // Test from the right end of both results so we
//                             //         // ensure we are testing the same bits.
//                             //         for (; k >= 0 && good; j--, k--) {
//                             //             if (expected.substr(k, 1) === '?') {
//                             //                 continue;
//                             //             }
//                             //
//                             //             if (j < 0) {
//                             //                 good = false;
//                             //                 break;
//                             //             }
//                             //
//                             //             if (actual.substr(j, 1) != expected.substr(k, 1)) {
//                             //                 good = false;
//                             //             }
//                             //         }
//                             //
//                             //         // If we exhausted expected, but still have actual bits
//                             //         // we have an error
//                             //         if (j > 0) {
//                             //             good = false;
//                             //         }
//                             //     } else {
//                             //         if (expected !== null && expected !== '?') {
//                             //             good = expected == actual;
//                             //         }
//                             //     }
//                             }
//
// //                             if (good) {
// //                                 // Success
// //                             } else {
// //                                 // Failure
// //                                 console.log("Test: " + testNum + " Output " + outputs[i].component.naming + " Actual: " + actual + " Expected: "
// //                                     + expected);
// //                                 if (test.quiet === true) {
// //                                     failure('<div class="cluml-test-result"><p>This test is failing. Some output is not what is currently' +
// //                                         ' expected by the test. The diagram is left in the state it was' +
// //                                         ' in when the test failed. No additional detail will be provided about why ' +
// //                                         'the test is failed. It is your responsibility to create a ' +
// //                                         'diagram that works as expected.</p></div>');
// //                                 } else {
// //
// //                                     failure(`<div class="cluml-test-result"><p>This test is failing. An output value is
// // not what is currently expected by the test. The diagram is left in the state it was
// // in when the test failed.<p>
// // <p class="cs-result">Output ${outputs[i].component.naming} expected: ${expected} actual: ${actual}</p>
// // <p class="cs-info">Test ${testNum}</p></div>
// // `);
// //                                 }
// //
// //                                 return;
// //                             }
// //
// //                         }
// //
// //                     }
// //                 }
//
//                 testNum++;
//
//                 if(testNum < test.test.length) {
//                     const t = test.test[testNum];
//
//                     for(let i=0; i<inputs.length && i<t.length; i++) {
//                         if(t[i] !== null) {
//                             const result = inputs[i].command(t[i]);
//                             if(result !== null) {
//                                 if(!result.ok) {
//                                     failure('<p>This test is failing. ' + result.msg + '</p>');
//                                     return;
//                                 }
//                             } else {
//                                 try {
//                                     inputs[i].setAsString(t[i]);
//                                 } catch(msg) {
//                                     failure(`<div class="cluml-test-result"><p>This test is failing. ${msg}</p>
// <p class="cs-info">Test ${testNum}</p></div>`);
//                                     return;
//                                 }
//                             }
//                         }
//                     }
//
//                     // Churn one second worth
//                     // const simulation = model.getSimulation();
//                     // for(let i=0; i<100;  i++) {
//                     //     if(!simulation.advance(0.010 * simulation.speed)) {
//                     //         break;
//                     //     }
//                     }
//
//                     setTimeout(testOne, main.options.testTime);
//
//                     if(simulation.view !== null) {
//                         simulation.view.draw();
//                     }
//                 } else {
//                     success(test);
//                 }
//             }
//
//             setTimeout(testOne, main.options.testTime);
//         });
//     }

    // /**
    //  * Find all of the specified diagram inputs
    //  * @param test The test we are running
    //  * @returns {Array} Array of input objects
    //  */
    // function findInputs(test) {
    //     var model = main.model;
    //
    //     //
    //     // Find the inputs
    //     //
    //     var inputs = [];
    //     for(let i=0; i<test.input.length; i++) {
    //         let input = test.input[i];
    //         let items = input.split(':');
    //         let search = model;
    //         let tabmsg = '';
    //
    //         // Test for tab specification. That's a prefix
    //         // like this: tab:tabname:
    //         if(items[0] === "tab") {
    //             if(items.length < 3) {
    //                 throw new TestException('<p>Invalid input tab definition: ' + input + '</p>');
    //             }
    //
    //             const tabname = items[1];
    //
    //             search = model.getDiagram(tabname);
    //             if(search === null) {
    //                 throw new TestException('<p>Invalid input tab: ' + tabname + '</p>');
    //             }
    //
    //             tabmsg = ' in tab <em>' + tabname + '</em>';
    //             items.splice(0, 2);
    //         }
    //
    //         if(items[0] === "type") {
    //             if(items.length < 2) {
    //                 throw new TestException('<p>Invalid input type specification: ' + input + '</p>');
    //             }
    //
    //             const type = items[1];
    //             const diagrams = search.getComponentsByType(type);
    //             if(items.length > 2) {
    //                 // We have specified a component name after the type
    //                 // Example: type:InPin:CLK
    //                 let desired = null;
    //                 for(let component of diagrams) {
    //                     if(component.naming === items[2]) {
    //                         desired = component;
    //                         break;
    //                     }
    //                 }
    //
    //                 if(desired === null) {
    //                     throw new TestException('<p>The test is not able to pass because you do not have a' +
    //                         ' component named ' + items[2] + ' of type ' + type + tabmsg + '.</p>');
    //                 }
    //
    //                 inputs.push(desired);
    //             } else {
    //                 if(diagrams.length === 0) {
    //                     throw new TestException('<p>The test is not able to pass because you do not have a' +
    //                         ' component of type ' + type + tabmsg + '.</p>');
    //                 } else if(diagrams.length > 1) {
    //                     throw new TestException('<p>The test is not able to pass because you have more than' +
    //                         ' one  component of type ' + type + tabmsg + '.</p>' +
    //                         '<p>You are only allowed one component of that type ' +
    //                         'in this diagram.</p>');
    //                 }
    //                 inputs.push(diagrams[0]);
    //             }
    //
    //         } else {
    //             // Finding component by naming
    //             const component = search.getComponentByNaming(items[0]);
    //             if(component !== null) {
    //                 inputs.push(component);
    //             } else {
    //                 throw new TestException('<p>The test is not able to pass because you do not' +
    //                     ' have a component named ' + items[0] + tabmsg + '.</p>' +
    //                     '<p>Typically, the tests are looking for an input' +
    //                     ' pin or a bus input pin. Input pins are labeled IN in the palette. Double-click' +
    //                     ' on an input pin to set the name. Names in Cluml are case sensitive.</p>');
    //             }
    //         }
    //     }
    //
    //     return inputs;
    // }
    //
    // function findOutputs(test) {
    //     var model = main.model;
    //
    //     var outputs = [];
    //     for(var i=0; i<test.output.length; i++) {
    //         var search = model;
    //         var tabmsg = '';
    //
    //         var split = test.output[i].split("-");
    //         var output = split[0];
    //         let items = output.split(':');
    //
    //         // Test for tab specification. That's a prefix
    //         // like this: tab:tabname:
    //         if(output.substr(0, 4) === "tab:") {
    //             const tab = output.substr(4);
    //             const colon = tab.indexOf(":");
    //             if(colon === -1) {
    //                 throw new TestException('<p>Invalid output tab definition: ' + output + '</p>');
    //                 break;
    //             }
    //
    //             const tabname = tab.substr(0, colon);
    //
    //             // search = model.getDiagram(tabname);
    //             // if(search === null) {
    //             //     throw new TestException('<p>Invalid out tab: ' + tabname + '</p>');
    //             //     break;
    //             // }
    //
    //             tabmsg = ' in tab <em>' + tabname + '</em>';
    //             output = tab.substr(colon+1);
    //             items.splice(0, 2);
    //         }
    //
    //         const pin = split.length > 1 ? split[1] : 0;
    //
    //         if(items[0] === 'type') {
    //             if(items.length < 2) {
    //                 throw new TestException('<p>Invalid output type specification: ' + output + '</p>');
    //             }
    //
    //             const type = items[1];
    //             const diagrams = search.getComponentsByType(type);
    //             if(items.length > 2) {
    //                 // We have specified a component name after the type
    //                 // Example: type:OutPin:CLK
    //                 let desired = null;
    //                 for(let component of diagrams) {
    //                     if(component.naming === items[2]) {
    //                         desired = component;
    //                         break;
    //                     }
    //                 }
    //
    //                 if(desired === null) {
    //                     throw new TestException('<p>The test is not able to pass because you do not have a' +
    //                         ' component named ' + items[2] + ' of type ' + type + tabmsg + '.</p>');
    //                 }
    //
    //                 outputs.push(desired.ins[pin]);
    //             } else {
    //                 if(diagrams.length === 0) {
    //                     throw new TestException('<p>The test is not able to pass because you do not have a' +
    //                         ' component of type ' + type + tabmsg + '.</p>');
    //                 } else if(diagrams.length > 1) {
    //                     throw new TestException('<p>The test is not able to pass because you have more than' +
    //                         ' one  component of type ' + type + tabmsg + '.</p>' +
    //                         '<p>You are only allowed one component of that type ' +
    //                         'in this diagram.</p>');
    //                 }
    //                 outputs.push(diagrams[0].ins[pin]);
    //             }
    //
    //         } else {
    //             // const component = search.getComponentByNaming(output);
    //             // if(component !== null && component.ins.length > pin) {
    //             //     outputs.push(component.ins[pin]);
    //             // } else {
    //             //     throw new TestException('<p>The test is not able to pass because you do not' +
    //             //         ' have a component named ' + output + tabmsg + '.</p>' +
    //             //         '<p>Output pins are labeled OUT in the palette. Double-click' +
    //             //         ' on an output pin to set the name. Pin names are case sensitive.</p>');
    //             // }
    //         }
    //
    //
    //     }
    //
    //     return outputs;
    // }

}

