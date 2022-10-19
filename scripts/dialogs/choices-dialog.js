import Helper from "../gnomish-helpers/helper.js";

export default class ChoicesDialog extends Application {
    constructor({
        header = "Choices Dialog",
        entity,
        entityTargetPath = "",
        choicesList = [],
        choicesNumber = 0
    }) {
        super({
            title: game.i18n.localize("manageChoices"),
            template: "systems/lex-occultum/templates/dialogs/choices-dialog.hbs",
            classes: [
                "lexoccultum", "dialog", "choices"
            ],
            width: "auto",
            height: "auto"
        });

        // config
        const entityChoiceTarget = Helper.getEntityPathArrayValue(entity, entityTargetPath);
        let choicesFields = choicesList.fields;
        let choices = [];
        for (let [key, item] of Object.entries(choicesList)) {
            if (item && key != "fields") {
                // create item
                const choice = {};
                // add fields 
                const selected = (entityChoiceTarget == item.value || entityChoiceTarget.includes(item.value));
                const disabled = false;
                for (const field of choicesFields) {
                    // if the field includes description
                    if (field == "description") {
                        const description = game.i18n.localize(`DESCRIPTIONS.${key}`)
                        choice["description"] = description
                    }
                    else {
                        choice[field] = item[field];
                    }
                }
                
                choice["selected"] = selected;
                choice["disabled"] = disabled;

                choices.push(choice);
            }
        }
        // check for the selected count
        const choicesSelectedCount = choices.filter(x => x.selected).length;
        if (choicesNumber > 1) {
            if (choicesSelectedCount >= choicesNumber) {
                choices.filter(x => !x.selected).map(x => { x.disabled = true });
            }
        }
        // set the parameters
        this.header = header;
        this.entity = entity;
        this.entityChoiceTarget = entityChoiceTarget
        this.entityTargetPath = entityTargetPath;
        this.choicesNumber = choicesNumber;
        this.choicesFields = choicesFields;
        this.choices = choices;

        this.render(true);
    }

    /** @override */
    getData() {
        const superData = super.getData();
        superData.header = this.header;
        superData.entityLabel = this.entity.name;
        superData.choicesFields = this.choicesFields;
        superData.choices = this.choices;

        return superData;
    }

    // ===================================================================================
    //                              Listeners
    // ===================================================================================
    // activateListeners
    async activateListeners(html) {
        super.activateListeners(html);
        html.find('.choice-selected').change(ev => {
            this.onChoiceSelected(ev);
        });
        await html.find('.save').click(ev => {
            this.onSave();
        });
    }
    // onChoiceSelected
    onChoiceSelected(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const choiceValue = jTag.dataset.choiceValue;
            if (choiceValue) {
                const choices = this.choices;
                const choicesNumber = this.choicesNumber;
                const choice = choices.find(x => x.value == choiceValue);
                if (choice) {
                    choice.selected = !choice.selected;
                    // check for the limit number of activition
                    if (choicesNumber > 0) {
                        // force the single activation
                        if (choicesNumber == 1) {
                            choices.filter(x => x.value != choiceValue).forEach(x => { x.selected = false; });
                        }
                        // disabled all other choices if the limit id over
                        if (choicesNumber > 1) {
                            const choicesSelectedCount = choices.filter(x => x.selected).length;
                            choices.filter(x => !x.selected).forEach(x => { x.disabled = false; });

                            if (choicesSelectedCount >= choicesNumber) {
                                choices.filter(x => !x.selected).forEach(x => { x.disabled = true; });
                            }
                        }
                    }
                    this.render();
                }
            }
        }
    }
    // onSave
    async onSave() {
        const choicesNumber = this.choicesNumber;
        let choices = this.choices.filter(x => x.selected).map(x => x.value);
        choices = (choicesNumber == 1 ? choices.join() : choices);
        let entity = this.entity;
        let entityTargetPath = this.entityTargetPath;
        // let entityChoiceTarget = this.entityChoiceTarget;
        // update the property's value
        choices = parseInt(choices) || (choices == "0" ? 0 : choices);

        await entity.update({ [`${entityTargetPath}`]: choices });

        this.close();
    }


}
