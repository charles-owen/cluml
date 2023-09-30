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

        console.log(paletteItem.proto.fileLbl, "Was just clicked");
        if(paletteItem.proto.fileLbl === 'Association'){
            this.toggledAssociation = paletteItem;
            main.selectionToggle = false;
            console.log(main.selectionToggle)
            //call to main or wherever else that its currently in 'association mode'
        } else {
            this.toggledAssociation = null;
            main.selectionToggle = true;
            console.log(main.selectionToggle)
            //call to main or wherever else that its currently in class mode.
        }
    }
}