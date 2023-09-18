import {AboutDialog} from '../Dlg/AboutDialog';
import {HelpDialog} from '../Dlg/HelpDialog';
import {SanityCheckDlg} from "../Dlg/SanityCheckDlg";
import {Tools} from "../DOM/Tools";

/**
 * The help menu
 * @param menu
 * @param main
 * @constructor
 */
export const HelpMenu = function(menu, main) {

    this.html = function() {
        return '<li><a>Help</a>' +
            '<ul class="help-menu">' +
            '<li><a class="help-help">Help</a></li>' +
            '<li><a class="help-docked-help">Docked Help<img alt="Docked Help"/></a></li>' +
            '<li><a class="help-sanity-check">Sanity Check</a></li>' +
            '<li><a class="help-about">About...</a></li>' +
            '</ul>' +
            '</li>';
    }

    this.componentHelp = function(helper) {
        helper = 'cluml/help/' + helper + '.html';
        if(!main.isHelpDocked()) {
            const dlg = new HelpDialog(main);
            dlg.open(helper);
        } else {
            main.help.url(helper);
        }
    }


    this.activate = function() {
	    menu.click('.help-about', (event) => {
            const dlg = new AboutDialog(main);
            dlg.open();
	    });

	    menu.click('.help-help', (event) => {
		    if(!main.isHelpDocked()) {
                const dlg = new HelpDialog(main);
                dlg.open('');
		    } else {
			    main.help.home();
		    }
	    });

	    menu.click('.help-docked-help', (event) => {
		    main.dockedHelp(!main.isHelpDocked());
	    });

        menu.click('.help-sanity-check', (event) => {
            const dlg = new SanityCheckDlg(main);
            dlg.open();
        });
    }

    this.opening = function() {
        if(main.isHelpDocked()) {
	        Tools.addClass(menu.find('.help-docked-help img'), 'check');
        } else {
	        Tools.removeClass(menu.find('.help-docked-help img'), 'check');
        }
    }
}
