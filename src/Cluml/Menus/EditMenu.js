

import {Component} from '../Component';

/**
 * The Edit menu
 * @param menu Menu object
 * @param main Main object
 * @constructor
 */
export const EditMenu = function(menu, main) {

    this.html = function() {
        return '<li><a>Edit</a>' +
            '<ul class="edit-menu">' +
            '<li><a class="edit-undo"><span class="icons-cl icons-cl-arrowreturnthick-1-w"></span>Undo</a></li>' +
            '<li><a class="edit-delete"><span class="icons-cl icons-cl-trash"></span>Delete</a></li>' +
            '<li class="menu-divider">&nbsp;</li>' +
            '<li><a class="edit-properties">Properties</a></li>' +
            '</ul>' +
        '</li>';
    }

    this.activate = function() {
	    menu.click('.edit-delete', (event) => {
	        console.log('delete');
		    main.backup();
		    main.currentView().delete();
	    });

	    menu.click('.edit-undo', (event) => {
		    main.undo();
	    });

	    menu.click('.edit-properties', (event) => {
		    if (main.currentView().selection.selected.length === 1 &&
			    (main.currentView().selection.selected[0] instanceof Component)) {
				const component = main.currentView().selection.selected[0];
				component.properties(main);
		    }
	    });

	    document.addEventListener('keydown', (event) => {
			if (document.getElementsByClassName('dialog-cl').length === 0) {
				if (event.key === 'Delete') {
					menu.closeAll();
					main.backup();
					main.currentView().delete();
				} else if (event.key === 'z' && event.ctrlKey && !event.altKey && !event.shiftKey) {
					menu.closeAll();
					main.undo();
				}
			}
        });
    }
}
