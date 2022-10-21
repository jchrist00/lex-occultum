import ChoicesDialog from "../dialogs/choices-dialog.js";

export default class CustomItem extends Item {
    prepareData() {
        super.prepareData();

        const itemData = this.system;
        // const itemDataData = itemData.system;
        this.system.label = this.system.label || this.name;

    }

    // onPropertyEdit
    async onPropertyEdit(jTag, editValue) {
        if (jTag) {
            const parameters = jTag[0].dataset.parameters.split(';');
            if (parameters.length > 0) {
                // config values
                editValue = parseInt(editValue);
                const propertyString = parameters[0]
                if (propertyString) {
                    const actualValue = parseInt(isNaN(parameters[1]) ? 0 : parameters[1]);
                    const minPropertyrValue = parseInt(parameters[2]);
                    const maxPropertyValue = parseInt(parameters[3]);
                    const multiplier = parameters[4] ?? 1;
                    const deltaValue = (editValue * multiplier);
                    const newBaseValue = (actualValue + deltaValue);
                    // check and update
                    if ((newBaseValue >= minPropertyrValue) && (newBaseValue <= maxPropertyValue)) { // updates
                        const updates = {
                            [`${propertyString}`]: newBaseValue
                        };
                        await this.update(updates);
                    }
                }
            }
        }
    }
    // onPropertyChoicesEdit
    onPropertyChoicesEdit(jTag) {
        if (jTag[0]) {
            const parameters = jTag[0].dataset.parameters.split(';');
            if (parameters.length > 0) {
                const header = parameters[0];
                const propertyString = parameters[1];
                const sourceValues = parameters[2];
                const maxChoices = parameters[3];
                // get the values
                var pathPaces = sourceValues.split('.');
                let values = CONFIG.lexoccultum;
                for (const pathPace of pathPaces) {
                    values = values[pathPace];
                }

                new ChoicesDialog({
                    header: header,
                    entity: this,
                    entityTargetPath: propertyString,
                    choicesList: values,
                    choicesNumber: maxChoices
                });

            }
        }
    }
}