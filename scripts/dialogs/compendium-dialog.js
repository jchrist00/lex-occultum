/* -------------------------------------------- */
/*  Compendium tools                            */
/* -------------------------------------------- */

import Helper from "../gnomish-helpers/helper.js"
import CustomItem from "../entities/custom-item.js"

export default class CompendiumDialog extends Application {
    static get defaultOptions() {
        const options = super.defaultOptions
        options.id = 'compendium-tools'
        // options.width = 300
        // options.height = 800
        options.template = 'systems/lex-occultum/templates/dialogs/compendium-dialog.hbs'
        return options
    }

    /* -------------------------------------------- */

    /**
     * Title
     * @type {String}
     */
    get title() {
        return 'Compendium Tools'
    }

    /* -------------------------------------------- */

    /**
     * Construct and return the data object used to render the HTML template for this form application.
     * @return {Object}
     */
    getData() {
        const data = super.getData();
        data.user = game.user;
        data.itemTypes = game.system.template.Item.types;

        return data
    }

    /* -------------------------------------------- */

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.importItems').click(ev => {
            this.onUpdateObject(ev);
        });
        html.find('.importCreatures').click(ev => {
            this.onUpdateCreature(ev);
        });
        html.find('.updateItemsMoneySystem').click(ev => {
            this.updateItemsMoneySystem(ev);
        });
    }

    /**
     * This method is called upon form submission after form data is validated
     * @param event {Event}       The initial triggering submission event
     * @param formData {Object}   The object of validated form data with which to update the object
     * @private
     */
    // onUpdateObject 
    async onUpdateObject(event) {
        event.preventDefault()
        const itemType = $(event.currentTarget)[0].dataset.type;
        const systemName = "lex-occultum";

        if (itemType) {
            // set the objcet lis from the json file
            const objectList = await (await fetch(`./systems/${systemName}/COMPENDIUM-JSONs/${itemType}s.json`)).json();
            // compose the compendium name
            const compendiumName = `${systemName}.${itemType}s`;

            await this.importItems(systemName, itemType, compendiumName, objectList);
        }
    }
    // importItems
    async importItems(systemName, type, compendiumName, objectList) {
        const pack = game.packs.get(compendiumName)

        if (pack) {
            for (const object of objectList) {
                // item initialization
                const itemLabel = game.i18n.localize(object.label);
                const itemQuality = (type == "Weapon" && object.quality ? ` [${game.i18n.localize(object.quality)}]` : "")
                const itemSize = (type == "Kit" && object.size ? ` [${game.i18n.localize(object.size)}]` : "")
                let itemData = {
                    name: `${itemLabel}${itemQuality}${itemSize}`,
                    type: type,
                    img: `systems/${systemName}/ASSET/images/${type}s/${object.label}.jpg`,
                    data: {}
                }
                // copy values and create the item
                itemData.data = Helper.copyPropertiesItem(object);
                // create the founfry Item
                const item = new CustomItem(itemData);
                // import into teh pack
                pack.importDocument(item);
            }
        }
    }
    // updateItemsMoneySystem
    async updateItemsMoneySystem() {
        // update price system
        const systemName = game.system.id;
        const systemItemTypes = game.system.template.Item.types;
        for (const itemType of Object.values(systemItemTypes)) {
            const compendiumName = `${systemName}.${itemType}s`;
            const pack = await game.packs.get(compendiumName);

            if (pack) {
                for (const object of pack.index.values()) {
                    const document = await pack.getDocument(object._id);
                    // update money system from money to money(ducats,marks)
                    const price = document.system.price;
                    const marks = price % 100;
                    const ducats = (price - marks) / 100;
                    // update
                    await document.update({
                        "system.price2.ducats": ducats,
                        "system.price2.marks": marks
                    });
                    // check new price
                    const updatedDocument = await pack.getDocument(object._id);
                    const newPrice = updatedDocument.system.price2;
                    const debug = true;
                }
            }
        }
    }


}
