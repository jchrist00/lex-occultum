import { ConfigRoll } from "../dice.js";

export default class TaskDialog extends Application {
    constructor({
        type = "",
        label = "",
        modifiers = [],
        actorType = "",
        actorImg = "",
        formula = "1d20",
        attributes = [],
        item = {
            img: "",
            label: "",
            misfire: 0,
            damageFormula: "",
            openRollValue: 0,
            misfireButton: false,
            damageButton: false
        },
    } = {}) {
        super({
            title: game.i18n.localize("rollTask"),
            template: "systems/lex-occultum/templates/dialogs/task-dialog.hbs",
            classes: [
                "lexoccultum", "dialog"
            ],
            width: "auto",
            height: "auto"
        });

        // compute modifiers & choices
        let rulesModifiers = [];
        switch (type) {
            case "trait":
                // CHOICE: situationValues
                const situationValues = {
                    type: CONFIG.lexoccultum.rolls.modifierTypes.editable,
                    label: "situationValues",
                    value: 10,
                    paceValue: 1,
                    minValue: -50,
                    maxValue: 50
                };
                rulesModifiers.push(situationValues);
                break;
            case "skill":
                // CHOICE: difficulty
                const difficulty = {
                    type: CONFIG.lexoccultum.rolls.modifierTypes.selectable,
                    label: "difficulty",
                    list: CONFIG.lexoccultum.rolls.difficulty,
                    selectedLabel: "",
                    value: 0
                };
                rulesModifiers.push(difficulty);
                break;
        }

        // add the custom modifier to all the task types
        const customModifier = {
            type: CONFIG.lexoccultum.rolls.modifierTypes.editable,
            label: "customModifier",
            value: 0,
            paceValue: 1,
            minValue: -500,
            maxValue: 500
        };
        rulesModifiers.push(customModifier);


        // assignemnts
        this.formula = formula;
        this.actorType = actorType;
        this.actorImg = actorImg;
        this.item = item;
        this.type = type;
        this.label = label;
        // this.misfire = misfire;
        this.customModifier = 0;
        this.total = 0;

        // css assignements
        attributes.forEach(x => { x.css = "actor-attribute"; });
        rulesModifiers.forEach(x => { x.css = "rule-modifier"; });
        // taskModifiers
        this.taskModifiers = {
            actorAttributes: attributes,
            rulesModifiers: rulesModifiers
        }


        this.render(true);
    }

    /** @override */
    getData() {
        const superData = super.getData();
        superData.actorType = this.actorType;
        superData.type = this.type;
        superData.label = this.label;
        let total = 0;
        superData.taskModifiers = this.taskModifiers;
        const rulesModifiers = this.taskModifiers;
        for (const [key, modifiersGroup] of Object.entries(rulesModifiers)) {
            if (key != "rulesChoices") {
                if (modifiersGroup.length > 0) {
                    const modifiersGroupFiltered = modifiersGroup.filter(x => (x.activated || x.type != CONFIG.lexoccultum.rolls.modifierTypes.checkable));
                    if (modifiersGroupFiltered.length > 0) {
                        total += modifiersGroupFiltered.map(x => parseInt(x.value)).reduce((prev, next) => prev + next);
                    }
                }
            }
        }

        // update the total
        superData.total = total;
        this.total = total;

        return superData;
    }

    /* -------------------------------------------- */

    // ===================================================================================
    //                              Listeners
    // ===================================================================================
    // activateListeners
    activateListeners(html) {
        super.activateListeners(html);
        html.find('.modifier-edit').mouseup(ev => this.onModifierEdit(ev));
        html.find('.modifier-edit').bind('mousewheel', ev => this.onModifierWheelEdit(ev));
        html.find('.modifier-selected').change(ev => this.onModifierSelected(ev));
        html.find('.modifier-activation').change(ev => this.onModifierActivation(ev));
        html.find('.maximum-result-edit').mouseup(ev => this.onMaximumResultEdit(ev));
        html.find('.roll').click(() => { this.onRoll(); });
    }
    // onTaskModifierEdit
    async onModifierEdit(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const modifiersGroup = jTag.dataset.modifiersGroup;
            if (modifiersGroup) {
                const modifierLabel = jTag.name;
                const modifiersGroupList = this.taskModifiers[modifiersGroup];
                if (modifiersGroupList) {
                    const modifier = modifiersGroupList.find(x => x.label == modifierLabel);
                    if (modifier) {
                        const value = -(event.button - 1);
                        const paceValue = jTag.dataset.paceValue;
                        const minValue = jTag.dataset.minValue;
                        const maxValue = jTag.dataset.maxValue;
                        const newValue = modifier.value + (value * paceValue);
                        if (newValue <= maxValue && newValue >= minValue) {
                            modifier.value = newValue;
                            this.render(true);
                        }
                    }
                }
            }
        }
    }
    // onTaskOptionWheelEdit
    onModifierWheelEdit(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const modifiersGroup = jTag.dataset.modifiersGroup;
            if (modifiersGroup) {
                const modifierLabel = jTag.name;
                const modifiersGroupList = this.taskModifiers[modifiersGroup];
                if (modifiersGroupList) {
                    const modifier = modifiersGroupList.find(x => x.label == modifierLabel);
                    if (modifier) {
                        const value = ((event.originalEvent.wheelDelta / 120 > 0) ? 1 : -1);
                        const paceValue = jTag.dataset.paceValue * 5;
                        const minValue = jTag.dataset.minValue;
                        const maxValue = jTag.dataset.maxValue;
                        const newValue = modifier.value + (value * paceValue);
                        if (newValue <= maxValue && newValue >= minValue) {
                            modifier.value = newValue;
                            this.render(true);
                        }
                    }
                }
            }
        }
    }
    // onTaskChoiceSelected
    onModifierSelected(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const modifiersGroup = jTag.dataset.modifiersGroup;
            if (modifiersGroup) {
                const modifierLabel = jTag.name;
                const modifiersGroupList = this.taskModifiers[modifiersGroup];
                if (modifiersGroupList) {
                    const modifier = modifiersGroupList.find(x => x.label == modifierLabel);
                    if (modifier) {
                        const value = jTag.value;
                        modifier.value = value;
                        modifier.selectedLabel = Object.values(modifier.list).find((x) => x.value == value)?.label;

                        this.render(true);
                    }
                }
            }
        }
    }
    // onModifierActivation
    onModifierActivation(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const modifiersGroup = jTag.dataset.modifiersGroup;
            if (modifiersGroup) {
                const modifierLabel = jTag.dataset.modifierLabel;
                const modifiersGroupList = this.taskModifiers[modifiersGroup];
                if (modifiersGroupList) {
                    const modifier = modifiersGroupList.find(x => x.label == modifierLabel);
                    if (modifier) {
                        const activation = modifier.activated;
                        modifier.activated = !activation;
                        this.render();
                    }
                }
            }
        }
    }

    // onRoll
    onRoll() {
        const taskModifiers = this.taskModifiers;
        // const taskChoices = this.taskModifiers.rulesChoices;
        // const taskItemModifiers = this.taskModifiers.itemModifiers;
        // // filter the elements
        // let rollModifiers = taskModifiers.actorAttributes.concat(taskModifiers.actorModifiers).concat(taskItemModifiers).concat(taskModifiers.rulesModifiers);
        // rollModifiers = rollModifiers.filter(x => ((x.activated || x.type != CONFIG.vsdm.TASKS.types.checkable) && x.value != 0));

        // // check for max result
        // if (this.item && this.item.maxResult) {
        //     this.item.maxResult = this.item.maxResult || this.maxResult;
        // }

        let taskChoices = [];
        let rollModifiers = taskModifiers.actorAttributes.concat(taskModifiers.rulesModifiers);
        rollModifiers = rollModifiers.filter(x => ((x.activated || x.type != CONFIG.lexoccultum.rolls.modifierTypes.checkable) && x.value != 0));

        // go to the config roll
        ConfigRoll({
            type: this.type,
            formula: this.formula,
            targetValue: this.total,
            actorImg: this.actorImg,
            item: this.item,
            label: this.label,
            // choices: taskChoices,
            modifiers: rollModifiers
        });

        this.close();
    }
}
