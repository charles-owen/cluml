import {PaletteImage} from './Graphics/PaletteImage';
import {Tools} from './DOM/Tools';

/**
 * Items that appear in the palette
 *
 * jQuery free
 *
 * @param palette {Palette} The Palette that owns this item
 * @param template {function} The Component template
 * @param diagram {Diagram} The Diagram
 * @constructor
 */
export const PaletteItem = function (palette, template, diagram) {
    /**
     * The palette
     * @type {Palette}
     */
    this.palette = palette;
    /**
     * The component template.
     * @type {function}
     */
    this.template = template;

    Object.defineProperty(this, 'proto', {
        get: function () {
            return this.template.prototype;
        }
    });

    /**
     * The name of the diagram.
     * @type {string|null}
     */
    this.diagram = diagram !== undefined ? diagram.name : null;

    // Create an image component DOM element (canvas or img)
    const image = this.paletteImage();

    const element = Tools.createClassedDiv('cs-item');
    const box = Tools.createClassedDiv('cs-box');
    element.appendChild(box);

    const img = Tools.createClassedDiv('cs-img');
    box.appendChild(img);

    const desc = Tools.createClassedDiv('cs-desc');
    if (this.proto.paletteLbl.length > 7) {
        Tools.addClass(desc, 'long');
    }
    desc.innerText = diagram !== undefined ? diagram.name : this.proto.paletteLbl;
    box.appendChild(desc);
    img.appendChild(image);

    this.element = element;

    if(this.proto.isAssociation === false){
        palette.main.dragAndDrop.draggable(this);
    }
    palette.main.toggleManager.toggleable(this);
};

/**
 * Create the image for the palette, either using an existing
 * image file or creating one using PaletteImage.
 * @returns {HTMLImageElement|HTMLCanvasElement} element for either canvas or img
 */
PaletteItem.prototype.paletteImage = function () {
    const proto = this.proto;

    if (proto.img !== null && proto.img !== undefined) {
        let root = this.palette.cluml.root;

        const element = document.createElement('img');
        element.setAttribute('src', root + 'cluml/img/' + proto.img);
        element.setAttribute('alt', proto.paletteDesc);
        element.setAttribute('title', proto.paletteDesc);
        element.setAttribute('draggable', 'false');

        return element;

    } else if (proto.paletteImage() !== null) {
        return proto.paletteImage().element;
    } else {
        let pi = new PaletteImage(60, 60);

        // try {
        //     const ctx = pi.element.getContext("2d");
        //     obj.draw(ctx, this.palette.main.currentView());
        // } catch (e) {
        //     pi.box(30, 40);
        //     pi.io(15, 20, 'w', 2, 20);
        //     pi.io(45, 20, 'e', 2, 20);
        //     pi.drawText(obj.paletteLbl, 0, 0, "6px Times");
        // }

        pi.box(30, 40);
        pi.io(15, 20, 'w', 2, 20);
        pi.io(45, 20, 'e', 2, 20);
        pi.drawText(proto.paletteLbl, 0, 0, "6px Times");

        return pi.element;
    }
}
