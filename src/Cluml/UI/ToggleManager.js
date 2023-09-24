/**
 * Toggle support for the Palette Association items
 */
export const ToggleManager = function(main){
    this.managedItems = [];
    this.toggledAssociation = null;

    this.toggleable = (paletteItem) => {
        this.managedItems.push(paletteItem);
        paletteItem.element.addEventListener('mousedown', (event) => {
            event.preventDefault();
            click(paletteItem);
        });

        paletteItem.element.addEventListener('touchstart', (event) => {
            event.preventDefault();
            click(paletteItem);
        });
    }

    const click = (paletteItem) =>{

        console.log(paletteItem.template.fileLbl, "Was just clicked");
        if(paletteItem.template.fileLbl === 'Association'){
            this.toggledAssociation = paletteItem.template;
            //call to main or wherever else that its currently in 'association mode'
        } else {
            this.toggledAssociation = null;
            //call to main or wherever else that its currently in class mode.
        }
    }
}