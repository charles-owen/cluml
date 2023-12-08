import {HelpPresenter} from './HelpPresenter';
import {Tools} from '../DOM/Tools';

/**
 * Help <div> that appears to the right of Cluml
 * @constructor
 */
export const HelpDiv = function(main) {

    const helpDiv = null;
    let presenter;

    const initialize = () => {
        // Page contents
        presenter = new HelpPresenter(main, this);

        let helpDiv = Tools.createClassedDiv('help-div');
	    this.element = helpDiv;
	    main.element.appendChild(helpDiv);

    helpDiv.innerHTML = `<div class="header"><h1>Cluml Help</h1>
<button type="button" class="help-back" title="Back">
<span class="icons-cl icons-cl-arrowthick-1-w"></span></button>
<button type="button" class="help-home" title="Home">
<span class="icons-cl icons-cl-home"></span></button>
<button type="button" class="help-close" title="Close">
<span class="icons-cl icons-cl-closethick"></span></button>
</div>
${presenter.html()}`;

        presenter.present('');

        let headerDiv = helpDiv.querySelector('.header');
        if(headerDiv !== null) {
            headerDiv.querySelector('button.help-close').addEventListener('click', (event) => {
	            event.preventDefault();
	            main.dockedHelp(false);
            });

	        headerDiv.querySelector('button.help-home').addEventListener('click', (event) => {
		        event.preventDefault();
		        presenter.home();
	        });

	        headerDiv.querySelector('button.help-back').addEventListener('click', (event) => {
		        event.preventDefault();
		        presenter.back();
	        });
        }
    }


    this.home = function() {
        presenter.home();
    }

    this.url = function(url) {
        presenter.present(url);
    }

    initialize();
}


