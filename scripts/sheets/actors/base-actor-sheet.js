import ShopDialog from "../../dialogs/shop-dialog.js";
import TaskDialog from "../../dialogs/task-dialog.js";
import { ConfigRoll } from "../../dice.js";

export default class BaseActorSheet extends ActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            // template: "systems/lex-occultum/templates/sheets/actors/characters/character-sheet.hbs",
            // classes: [
            //     "lexoccultum", "sheet", "character"
            // ],
            width: "auto",
            height: "auto",
            resizable: true,
            tabs: [
                {
                    navSelector: ".sheet-tabs",
                    contentSelector: ".sheet-body",
                    initial: "stats"
                }
            ],
            scrollY: [".notes"],
        });
    }

    _getHeaderButtons() {
        let buttons = super._getHeaderButtons();
        if (this.actor.isOwner) {
            buttons = [{
                label: game.i18n.localize("shop"),
                class: "shop",
                icon: "fa fa-shopping-basket",
                icon: "fa fa-shopping-bag",
                onclick: () => this.openShopDialog()
            }].concat(buttons);
        }

        return buttons;
    }

    async getData() {
        // update money system from money to money(ducats,marks)
        // if(this.actor.system.registry.money > 0)
        // {
        //     const money = this.actor.system.registry.money;
        //     const marks = money % 100;
        //     const ducats = (money - marks) / 100;
    
        //     await this.actor.update({
        //         "system.registry.money.ducats": {},
        //         "system.registry.money.ducats": ducats,
        //         "system.registry.money.marks": marks
        //     })
        // }

        const data = super.getData();
        let sheetData = {
            userIsGM: game.user.isGM,
            owner: this.actor.isOwner,
            editable: this.isEditable,
            cssClass: (data.actor.system.editMode ? "edit-mode" : ""),
            actor: data.actor,
            system: data.actor.system,
            notesHTML: await TextEditor.enrichHTML(this.actor.system.notes, {
                secrets: this.actor.isOwner,
                async: true,
                relativeTo: this.actor
            })
        };

        return sheetData;
    }

    // ===================================================================================
    //                              Buttons
    // ===================================================================================
    // openShopDialog
    openShopDialog() {
        new ShopDialog({
            entity: this.actor
        });
    }
    // ===================================================================================

    // ===================================================================================
    //                              Listeners
    // ===================================================================================
    // activateListeners
    activateListeners(html) {
        super.activateListeners(html);
        // EDIT MODE
        html.find('.toggle-edit-mode').mouseup(ev => this.onToggleEditMode(ev));
        // PROPERTIES
        html.find('.property-edit').mouseup(ev => this.onActorPropertyEdit(ev));
        html.find('.property-edit').bind('mousewheel', ev => this.onActorPropertyEdit(ev, true));
        html.find('.property-choices-edit').mouseup(ev => this.onActorPropertyChoicesEdit(ev));
        // TASKS
        // SITUATION TASK
        html.find('.situation-task').click(ev => {
            this.onSituationTask(ev)
        });
        // SKILL TASK
        html.find('.skill-task').click(ev => {
            this.onSkillTask(ev)
        });
        // WEAPON TASK
        html.find('.weapon-task').click(ev => {
            this.onWeaponTask(ev)
        });
        // MISFIRE ROLL
        html.find('.misfire-roll').click(ev => {
            this.onMisfireRoll(ev)
        });
        // DAMAGE ROLL
        html.find('.damage-roll').click(ev => {
            this.onDamageRoll(ev)
        });
        // COMBAT
        html.find('.hand-use').click(ev => {
            this.onHandUse(ev)
        });
        // ITEMS
        html.find('.item-equip').click(ev => {
            this.onItemEquip(ev);
        });
        html.find('.item-edit').click(ev => {
            this.onItemUpdate(ev);
        });
        html.find('.item-delete').click(ev => {
            this.onItemDelete(ev);
        });
        html.find('.item-refund').click(ev => {
            this.onItemRefund(ev);
        });
        // DESCRIPTIONS BOX
        html.find('.description-pop-up').bind("mouseenter", ev => {
            const jTag = $(ev.currentTarget);
            let description = "";
            if (jTag[0]) {
                description = jTag[0].dataset.itemDescription;
                if (description) {
                    var x = ev.pageX + 10;
                    var y = ev.pageY - 15;

                    var hoverBox = $('<div>').attr('id', 'hoverbox');
                    hoverBox[0].innerHTML = description;
                    hoverBox[0].style.left = x + 'px';
                    hoverBox[0].style.top = y + 'px';

                    jTag.append(hoverBox);
                }
            }

        }).bind("mouseleave", function () {
            $('#hoverbox').remove();
        });
    }
    //onToggleEditMode
    async onToggleEditMode() {
        const actorEditMode = this.actor.system.editMode;
        await this.actor.update({ "system.editMode": !actorEditMode });
    }
    // onActorPropertyEdit
    onActorPropertyEdit(event, withWheel = false) {
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

            this.actor.onPropertyEdit(jTag, editValue, withWheel);
        }
    }
    // onActorPropertyChoicesEdit
    onActorPropertyChoicesEdit(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget);
        if (jTag[0]) {
            this.actor.onPropertyChoicesEdit(jTag);
        }
    }
    // onSituationTask
    onSituationTask(event) {
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            let taskAttributes = [];
            let taskLabel = "";
            // TRAIT
            const traitKey = jTag.dataset.traitKey;
            if (traitKey) {
                const trait = this.actor.getTrait(traitKey);
                if (trait) {
                    taskAttributes.push(
                        {
                            type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                            label: trait.label,
                            value: trait.value,
                            activated: true
                        }
                    );
                    taskLabel = trait.label;
                    // // task modifiers
                    // const taskModifiers = [];
                    new TaskDialog({
                        type: "trait",
                        label: game.i18n.localize(taskLabel),
                        attributes: taskAttributes,
                        actorType: this.actor.type,
                        actorImg: this.actor.img
                    })

                }
            }
        }
    }
    // onSkillTask
    onSkillTask(event) {
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            let taskAttributes = [];
            let taskLabel = "";
            // SKILL
            const skillkey = jTag.dataset.skillKey;
            if (skillkey) {
                const skill = this.actor.getSkill(skillkey);
                if (skill) {
                    taskAttributes.push(
                        {
                            type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                            label: skill.label,
                            value: skill.value,
                            activated: true
                        }
                    );
                    taskLabel = skill.label;
                    // DISCIPLINE
                    const disciplineKey = jTag.dataset.disciplineKey;
                    if (disciplineKey) {
                        const discipline = this.actor.getDiscipline(skillkey, disciplineKey);
                        if (discipline) {
                            taskAttributes.push(
                                {
                                    type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                                    label: discipline.label,
                                    value: discipline.value,
                                    activated: true
                                }
                            );
                            taskLabel = discipline.label;
                            // SPECIALTY
                            const specialtyKey = jTag.dataset.specialtyKey;
                            if (specialtyKey) {
                                const specialty = this.actor.getSpecialty(skillkey, disciplineKey, specialtyKey);
                                if (specialty) {
                                    taskAttributes.push(
                                        {
                                            type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                                            label: specialty.label,
                                            value: specialty.value * 2,
                                            activated: true
                                        }
                                    );
                                    taskLabel = specialty.label;
                                }
                            }
                        }
                    }
                }
            }
            // check for wounds penalty
            const actorHealthValue = this.actor.system.health.value;
            const healthWoundsPenalty = this.actor.getHealthOrSanityPenalty(actorHealthValue);
            if (healthWoundsPenalty < 0) {
                taskAttributes.push({
                    type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                    label: "healthWounds",
                    value: healthWoundsPenalty,
                    css: "base",
                    activated: true
                })
            }
            const actorSanityValue = this.actor.system.sanity.value;
            const sanityWoundsPenalty = this.actor.getHealthOrSanityPenalty(actorSanityValue);
            if (sanityWoundsPenalty < 0) {
                taskAttributes.push({
                    type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                    label: "sanityWounds",
                    value: sanityWoundsPenalty,
                    css: "base",
                    activated: true
                })
            }
            // // task modifiers
            // const taskModifiers = [];
            new TaskDialog({
                type: "skill",
                label: game.i18n.localize(taskLabel),
                attributes: taskAttributes,
                actorType: this.actor.type,
                actorImg: this.actor.img
            })
        }
    }
    // onWeaponTask
    onWeaponTask(event) {
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            let taskAttributes = [];
            let taskLabel = "";
            const weaponId = jTag.dataset.weaponId;
            if (weaponId) {
                const weapon = this.actor.items.get(weaponId);
                if (weapon) {
                    const weaponDataData = weapon.system;
                    const rollHandUse = jTag.dataset.rollHandUse;
                    for (const [key, item] of Object.entries(weaponDataData.combatPoints)) {
                        if (key == rollHandUse) {
                            taskAttributes.push(
                                {
                                    type: CONFIG.lexoccultum.rolls.modifierTypes.editable,
                                    label: key,
                                    value: item.value,
                                    paceValue: 1,
                                    minValue: 0,
                                    maxValue: item.value
                                }
                            );
                            // check for non dominant hand
                            if (weapon.system.hands == 1) {
                                const weaponUse = weapon.system.handUse;
                                const actorDominantHand = this.actor.system.registry.dominantHand;
                                if (!rollHandUse.includes(actorDominantHand)) {
                                    const actorNonDominantHandPenalty = this.actor.system.combat.stats.nonDominantHand.value;
                                    if (actorNonDominantHandPenalty < 0) {
                                        taskAttributes.push(
                                            {
                                                type: CONFIG.lexoccultum.rolls.modifierTypes.checkable,
                                                label: "nonDominantHand",
                                                value: actorNonDominantHandPenalty,
                                                activated: true
                                            }
                                        );
                                    }
                                }
                            }
                        }
                    }

                    taskLabel = weaponDataData.label;
                    new TaskDialog({
                        type: "weapon",
                        label: game.i18n.localize(taskLabel),
                        // misfire: weaponDataData.misfire,
                        attributes: taskAttributes,
                        actorType: this.actor.type,
                        actorImg: this.actor.img,
                        item: {
                            img: weapon.img,
                            label: weaponDataData.label,
                            misfire: weaponDataData.misfire,
                            damageFormula: weaponDataData.damage,
                            openRollValue: weaponDataData.openRollValue
                        }
                    })

                }
            }

        }
    }
    // onMisfireRoll
    onMisfireRoll(event) {
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const actorImg = this.actor.img;
            const weaponLabel = jTag.dataset.weaponLabel;
            const weaponImg = jTag.dataset.weaponImg;
            const formula = "1d10";

            // go to the config roll
            ConfigRoll({
                type: "misfire",
                formula: formula,
                actorImg: actorImg,
                item: {
                    img: weaponImg
                },
                label: weaponLabel,
                // choices: taskChoices,
                // modifiers: rollModifiers
            });
        }
    }
    // onDamageRoll
    onDamageRoll(event) {
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const actorImg = this.actor.img;
            const weaponLabel = jTag.dataset.weaponLabel;
            const weaponImg = jTag.dataset.weaponImg;
            const damageFormula = jTag.dataset.damageFormula;
            const openRollValue = jTag.dataset.openRollValue;
            const formula = damageFormula + (openRollValue > 0 ? "x>=" + openRollValue : "");

            // go to the config roll
            ConfigRoll({
                type: "damage",
                formula: formula,
                actorImg: actorImg,
                item: {
                    img: weaponImg
                },
                label: weaponLabel,
                // choices: taskChoices,
                // modifiers: rollModifiers
            });
        }
    }
    // onHandUse
    async onHandUse(event) {
        const jTag = $(event.currentTarget)[0];
        if (jTag) {
            const itemId = jTag.dataset.itemId;
            const item = this.actor.items.get(itemId);
            if (item) {
                const handUse = jTag.dataset.itemHand;
                // item hands status
                const itemHands = item.system.hands;
                let itemHandUse = (item.system.handUse || "");
                // HANDS CHECK
                switch (itemHands) {
                    // ONE HAND WEAPONS
                    case 1:
                        itemHandUse = (handUse != itemHandUse ? handUse : "");
                        break;
                    // TWO HANDS WEAPONS
                    case 2:
                        itemHandUse = (itemHandUse == "" ? "left&right" : "");
                        break;
                }
                // update hand use
                await item.update(
                    {
                        "system.handUse": itemHandUse
                    }
                );

                const actorWeapons = this.actor.system.weapons.filter(x => x.id != itemId);
                for (const actorWeapon of actorWeapons.values()) {
                    if (itemHandUse != "" && (actorWeapon.system.handUse == itemHandUse || itemHands == 2 || actorWeapon.system.hands == 2)) {
                        // update hand use
                        await actorWeapon.update(
                            {
                                "system.handUse": ""
                            }
                        );
                    }
                }
            }
        }
    }
    // onItemEquip
    async onItemEquip(event) {
        const itemId = event.target.dataset["itemId"];
        const item = this.actor.items.get(itemId);
        await item.update({
            "system.equipped": !item.system.equipped
        });
    }
    // onItemUpdate
    onItemUpdate(event) {
        const itemId = event.target.dataset["itemId"];
        let item = this.actor.items.get(itemId);

        return item.sheet.render(true);
    }
    // onItemDelete
    async onItemDelete(event) {
        // event.preventDefault();
        const itemId = event.target.dataset["itemId"];
        if (itemId) {
            const itemToDelete = this.actor.items.get(itemId);
            // item delete
            await itemToDelete.delete();
        }
    }
    // onItemRefund
    async onItemRefund(event) {
        if (game.user.isGM) {
            // event.preventDefault();
            const itemId = event.target.dataset["itemId"];
            if (itemId) {
                const itemToDelete = this.actor.items.get(itemId);
                const itemDucats = itemToDelete.system.price2.ducats;
                const itemMarks = itemToDelete.system.price2.marks;
                if (itemDucats > 0 || itemMarks > 0) {
                    // item delete
                    let actorDucats = this.actor.system.registry.money.ducats + itemDucats;
                    let actorMarks = this.actor.system.registry.money.marks + itemMarks;
                    // check marks exceeding
                    if (actorMarks > 99) {
                        actorDucats++;
                        actorMarks = actorMarks - 100;
                    }
                    // update actor
                    await this.actor.update({
                        "system.registry.money.ducats": actorDucats,
                        "system.registry.money.marks": actorMarks
                    });
                }
                // delete item
                await itemToDelete.delete();
            }
        }
        else {
            const restrictedGMAction = game.i18n.localize("restrictedGMAction");
            ui.notifications.error(`${restrictedGMAction}`);
        }
    }
}