// The public-path module must be imported first!
import './src/public-path';

import './src/polyfills/all';
import {Cluml} from './src/Cluml/Cluml';
import './src/_cluml.scss';
import {Ready} from './src/Cluml/Utility/Ready';


// This allows Cluml to be used as Cluml or Cluml.Cluml
// since the version in cl/cluml is Cluml.Cluml.
Cluml.Cluml = Cluml;

// Automatically install into div.cluml-install, where the text
// contents of the tag are JSON to configure Cluml
Ready.go(() => {
    const elements = document.querySelectorAll('div.cluml-install');
    for(let i=0; i<elements.length; i++) {
        let element = elements[i];
        element.classList.remove('cluml-install');
        const json = JSON.parse(element.textContent);
        element.innerHTML = '';
        const cluml = new Cluml(element, json);
        cluml.startNow();
        element.style.display = 'block';
    }
});

export {Cluml};
export {Cluml as default};
global.Cluml = Cluml;
