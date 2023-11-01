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
        console.log('Just clicked on');
        console.log(paletteItem.proto.paletteLbl);
        setColor(paletteItem);
    }

    //set the background color of selected item
    const setColor = (paletteItem) =>{
        //loop through each manged item
        for(let i = 0; i < this.managedItems.length; i++){
            //set their backgrounds to white
            this.managedItems[i].element.style.background = 'white'
        }
        //set the selected items background to light grey
        paletteItem.element.style.background = '#cccccc'
    }

    //const paletteDiv = document.getElementsByClassName('cs-palette')[0];
    //paletteDiv.style.background = '#cccccc';
    //its so free
    //loop through ManagedItems.
    //for each item set its background to white
    //except for the clicked item, set that to gray

}