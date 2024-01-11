import {Tools} from '../DOM/Tools';
import {PropertyLimitDlg} from "../Dlg/PropertyLimitDlg";
import {Class} from "../Components/Class";

/**
 * The Options menu
 * @param menu
 * @param main
 * @constructor
 */
export const OptionsMenu = function(menu, main) {

    this.html = function() {
        return `<li><a>Options</a>
<ul class="option-menu">
<li><a class="option-showvisibility">Visibility<img></a></li>
<li><a class="option-propertylimit">Property Limit</a></li>
</ul></li>`;
    }

    /**
     * Activate the menu, installing all handlers
     */
    this.activate = function() {
	    menu.click('.option-showvisibility', (event) => {
            Class.prototype.showVisibility = !Class.prototype.showVisibility;
            main.currentView().draw();
	    });
        menu.click('.option-propertylimit', (event) => {
            let dlg = new PropertyLimitDlg();
            dlg.open();
        })
    }

    /**
     * Called when menus are opening.
     * Set the state of the menu, so it will be valid when shown.
     */
    this.opening = function() {
        if(Class.prototype.showVisibility) {
            Tools.addClass(menu.find('.option-showvisibility img'), 'check');
        } else {
	        Tools.removeClass(menu.find('.option-showvisibility img'), 'check');
        }
    }
}
