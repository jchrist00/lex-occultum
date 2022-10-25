export default class CustomItemSheet extends ItemSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/lex-occultum/templates/sheets/items/item-sheet.hbs",
            classes: [
                "lexoccultum", "sheet", "item"
            ],
            width: "auto",
            height: "auto",
            resizable: true
        });
    }

    getData() {

        const data = super.getData();
        let sheetData = {
            userIsGM: game.user.isGM,
            owner: this.item.isOwner,
            editable: this.isEditable,
            cssClass: (data.item.system.editMode ? "edit-mode" : ""),
            item: data.item,
            system: data.item.system
        };


        return sheetData;
    }

        // ===================================================================================
    //                              Listeners
    // ===================================================================================
    // activateListeners
    activateListeners(html) {
        super.activateListeners(html);
        // EDIT MODE
        html.find('.toggle-edit-mode').mouseup(ev => this.onToggleEditMode(ev));
        // PROPERTIES
        html.find('.property-edit').mouseup(ev => this.onItemPropertyEdit(ev));
        html.find('.property-edit').bind('mousewheel', ev => this.onItemPropertyEdit(ev, true));
        html.find('.property-choices-edit').mouseup(ev => this.onItemPropertyChoicesEdit(ev));
    }
    //onToggleEditMode
    async onToggleEditMode() {
        const itemEditMode = this.item.system.editMode;
        await this.item.update({ "system.editMode": !itemEditMode });
    }
    // onItemPropertyEdit
    async onItemPropertyEdit(event, withWheel = false) {
        event.preventDefault();
        const jTag = $(event.currentTarget);
        if (jTag[0]) {
            // CTRL key  and ALT key check
            const multiplier = (event.ctrlKey ? 10 : (event.altKey ? 100 : 1));
            let editValue = 0;
            // mouse wheel check
            if (withWheel) {
                // SHIFT key check
                if (event.shiftKey) {
                    editValue = ((event.originalEvent.wheelDelta / 120 > 0) ? 1 : -1);
                }
            }
            else {
                editValue = -(event.button - 1);
            }
            // apply the multiplier
            editValue = editValue * multiplier;

            await this.item.onPropertyEdit(jTag, editValue);
        }
    }
    // onItemPropertyChoicesEdit
    onItemPropertyChoicesEdit(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget);
        if (jTag[0]) {
            this.item.onPropertyChoicesEdit(jTag);
        }
    }
    // ===================================================================================


}