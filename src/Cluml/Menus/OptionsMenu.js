import {Tools} from '../DOM/Tools';
import {MainSingleton} from "../MainSingleton";

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
</ul></li>`;
    }

    /**
     * Activate the menu, installing all handlers
     */
    this.activate = function() {
	    menu.click('.option-showvisibility', (event) => {
            MainSingleton.singleton.options.showVisibility = !main.options.showVisibility;
            //main.options.showVisibility = !main.options.showVisibility;
            MainSingleton.singleton.redraw();
            //main.currentView().draw();
	    });
    }

    /**
     * Called when menus are opening.
     * Set the state of the menu, so it will be valid when shown.
     */
    this.opening = function() {
        if(main.options.showVisibility) {
            Tools.addClass(menu.find('.option-showvisibility img'), 'check');
        } else {
	        Tools.removeClass(menu.find('.option-showvisibility img'), 'check');
        }
    }
}
