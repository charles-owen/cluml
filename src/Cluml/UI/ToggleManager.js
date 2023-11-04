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
        //console.log(paletteItem.proto.fileLbl, "Was just clicked");
        if(paletteItem.proto.isAssociation){
            this.toggledAssociation = paletteItem;
            main.selectionToggle = false;
            //console.log(main.selectionToggle);
            //call to main or wherever else that its currently in 'association mode'
        } else {
            this.toggledAssociation = null;
            main.selectionToggle = true;
            //console.log(main.selectionToggle)
            //call to main or wherever else that its currently in class mode.
        }
        //console.log('Just clicked on');
        //console.log(paletteItem.proto.paletteLbl);
        setColor(paletteItem);
    }

    //Exit association mode and clear last selected if escape is pressed
    document.addEventListener('keydown', (event) =>{
        if(event.key === "Escape"){
            main.selectionToggle = true;
            main.toggleManager.toggledAssociation = null;
            //console.log(main.selectionToggle);
            setColor(undefined);
        }
    });

    //set the background color of selected item
    const setColor = (paletteItem) =>{
        //loop through each manged item
        for(let i = 0; i < this.managedItems.length; i++){
            //set their backgrounds to white
            this.managedItems[i].element.style.background = 'white'
        }
        //set the selected items background to light grey
        if(paletteItem !== undefined){
            paletteItem.element.style.background = '#cccccc'
        }
    }
}