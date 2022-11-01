import ChoicesDialog from "../dialogs/choices-dialog.js";
import Helper from "../gnomish-helpers/helper.js";

export default class CustomActor extends Actor {
    prepareData() {
        super.prepareData();

        this.computeSkillsDisciplinesSpecialities();
        this.computeSecondaryAttributes();
        this.computeItems();
        this.computeCombatPoints();
        this.computeWeaponsCombatPoints();
        this.computeVogue();
        this.computeMoney();
        this.calculateAdventurePointsUsed();
    }

    // ===================================================================================
    //                              Functions
    // ===================================================================================
    // calculateAdventurePointsUsed
    calculateAdventurePointsUsed() {
        const data = this.system;
        // archetype
        const actorArchetype = data.registry.archetype;
        const skillKey = CONFIG.lexoccultum.choices.archetypes[actorArchetype]?.skillKey;
        data.registry.skillKey = skillKey || "";
        data.registry.skillKeyAdventurePointsAvailable = (skillKey ? 50 : 0);
        data.registry.skillKeyAdventurePointsUsed = 0;
        // traits
        let adventurePointsTraitsUsed = 0;
        for (const [key, item] of Object.entries(data.traits)) {
            adventurePointsTraitsUsed -= Object.values(CONFIG.lexoccultum.choices.traitsModifiers[key]).find(x => x.value == item.value)?.cost || 0;
            item.description = `DESCRIPTIONS.${key}${item.value}`;
            item.description = item.description.replace("-", "_");
        }
        // check for actor type
        if (this.type == "Character") {
            // social class
            const socialClass = data.registry.socialClass;
            const adventurePointsSocialClassUsed = -(CONFIG.lexoccultum.choices.socialClasses[socialClass]?.cost) || 0;
            // spheres
            let adventurePointsSpheresUsed = 0;
            for (const item of Object.values(data.spheres)) {
                adventurePointsTraitsUsed += (item.value * 5);
            }
            // skills
            let adventurePointsSkillsUsed = 0;
            let skillKeyAdventurePointsUsed = 0;
            // skill sums
            for (const item of Object.values(data.skills)) {
                let adventurePointsUsed = 0;
                adventurePointsUsed += item.cost;
                for (const item1 of Object.values(item.disciplines)) {
                    adventurePointsUsed += item1.cost;
                    item1.description = `DESCRIPTIONS.${item1.label}`;
                    for (const item2 of Object.values(item1.specialities)) {
                        // let cost = (item2.label == "nativeLanguage" ? 0 : item2.cost)
                        // adventurePointsSkillsUsed += cost;
                        adventurePointsUsed += item2.cost;
                        item2.description = `DESCRIPTIONS.${item2.label}`;
                    }
                }
                // check for advetures points used distribuition
                if (item.label == skillKey) {
                    skillKeyAdventurePointsUsed += adventurePointsUsed;
                    const remainder = skillKeyAdventurePointsUsed - 50;
                    if (remainder > 0) {
                        skillKeyAdventurePointsUsed = 50;
                        adventurePointsSkillsUsed += remainder;
                    }
                }
                else {
                    adventurePointsSkillsUsed += adventurePointsUsed;
                }
            }

            let adventurePointsUsedTotal = adventurePointsSocialClassUsed + adventurePointsTraitsUsed + adventurePointsSpheresUsed + adventurePointsSkillsUsed;

            data.registry.adventurePointsUsed = adventurePointsUsedTotal;
            data.registry.skillKeyAdventurePointsUsed = skillKeyAdventurePointsUsed;
        }
    }
    // computeSkillsDisciplinesSpecialities
    computeSkillsDisciplinesSpecialities() {
        const data = this.system;
        let tabIndex = 0;
        const maxSkillsNumber = 3;
        let counterSkillsNumber = maxSkillsNumber;
        data.skillsTabs = [];
        // const actorSkills = Object.fromEntries(Object.entries(data.skills).sort());
        const actorSkills = Helper.sortSkillsByLabelLocalization(data.skills);
        const skillsKeysLength = Object.keys(actorSkills).length;
        let tabsNumber = (skillsKeysLength / maxSkillsNumber) + (skillsKeysLength % maxSkillsNumber != 0 ? 1 : 0);
        for (let i = 0; i < tabsNumber; i++) {
            data.skillsTabs[i] = {};
        }
        // abilities
        for (const [key, item] of Object.entries(actorSkills)) {
            item.cost = Helper.getSummationFromXtoY(2, item.value);
            const itemNextValue = ((data.editMode && item.value < 10) ? ` [${(item.value + 1)}]` : "");
            item.nextValue = itemNextValue;
            item.abilityValue = item.value;
            let itemMinValue = 1;
            item.minValue = itemMinValue;
            item.description = `DESCRIPTIONS.${item.label}`;
            // disciplines
            for (const item1 of Object.values(item.disciplines)) {
                let multiplier = 7;
                let traitModifier = 0
                if (item1.trait) {
                    traitModifier = data.traits[item1.trait].value;
                }
                item1.cost = (Helper.getSummationFromXtoY(0, item1.value) * multiplier) - (item1.value * traitModifier);
                const item1NextValue = ((data.editMode && item1.value < 5) ? ` [${((item1.value + 1) * multiplier) - traitModifier}]` : "");
                item1.nextValue = item1NextValue;
                item1.abilityValue = item.abilityValue + item1.value;
                item1.maxValue = ((item.value == 10) ? 5 : (item.value >= 7 ? 3 : (item.value >= 4 ? 1 : 0)));
                item1.minValue = 0;
                // check the minimum value for the ability
                itemMinValue = (item1.value >= 4 ? 10 : (item1.value >= 2 ? 7 : (item1.value >= 1 ? 4 : 1)));
                item.minValue = (itemMinValue > item.minValue ? itemMinValue : item.minValue);
                // specialities
                for (const item2 of Object.values(item1.specialities)) {
                    // check for native language
                    if (item2.label != "nativeLanguage") {
                        traitModifier = 0;
                        if (item2.trait) {
                            traitModifier = data.traits[item2.trait].value;
                        }
                        item2.cost = (Helper.getSummationFromXtoY(0, item2.value) * multiplier) - (item2.value * traitModifier);
                        const item2NextValue = ((data.editMode && item2.value < 5) ? ` [${((item2.value + 1) * multiplier) - traitModifier}]` : "");
                        item2.nextValue = item2NextValue;
                        item2.abilityValue = item1.abilityValue + (item2.value * 2);
                        item2.maxValue = (item1.value > 0 ? ((item.value == 10) ? 5 : (item.value >= 7 ? 3 : (item.value >= 4 ? 1 : 0))) : 0);
                        // set the minimum value for the discipline
                        const item1MinValue = (item2.value >= 1 ? 1 : 0);
                        item1.minValue = (item1MinValue > item1.minValue ? item1MinValue : item1.minValue);
                        // check the minimum value for the ability
                        itemMinValue = (item2.value >= 4 ? 10 : (item2.value >= 2 ? 7 : (item2.value >= 1 ? 4 : 1)));
                        item.minValue = (itemMinValue > item.minValue ? itemMinValue : item.minValue);
                    }
                    else {
                        item2.cost = 0;
                        const item2NextValue = ((data.editMode && item2.value < 5) ? "[0]" : "");
                        item2.nextValue = item2NextValue;
                        item2.abilityValue = item1.abilityValue + (item2.value * 2);
                        item2.maxValue = 5;
                    }
                }
            }

            data.skillsTabs[tabIndex][key] = item;
            counterSkillsNumber--;
            if (counterSkillsNumber == 0) {
                tabIndex++;
                counterSkillsNumber = maxSkillsNumber;
            }
        }
    }
    // computeSecondaryAttributes
    computeSecondaryAttributes() {
        const data = this.system;
        // health
        let traitsModifiers = 0;
        let description = "";
        let recoverValue = 0;
        const day = game.i18n.localize("d");
        for (const item of data.health.traits) {
            const trait = data.traits[item];
            traitsModifiers += (trait ? trait.value : 0);
            if (trait?.value != 0) {
                const itemLabel = game.i18n.localize(trait.label);
                const itemValue = (trait.value > 0 ? `+${trait.value}` : trait.value);
                description += `${itemValue}: ${itemLabel}<br>`
            }
        }
        data.health.max = 32 + traitsModifiers;
        data.health.value = data.health.max + data.health.damage
        data.health.penalty = this.getHealthOrSanityPenalty(data.health.value);
        let healthValue = data.traits["health"]?.value;
        // check for actor type
        if (this.type == "Character") {
            recoverValue = 1 + Math.abs(healthValue);
            recoverValue = (recoverValue > 4 ? 4 : recoverValue);
            data.health.naturalHealing.value = (healthValue != 0 ? (healthValue > 0 ? `${recoverValue} / ${day}` : `1 / ${recoverValue} ${day}`) : `1 / ${day}`);
        }
        data.health.description = description;
        // sanity
        traitsModifiers = 0;
        description = "";
        for (const item of data.sanity.traits) {
            const trait = data.traits[item];
            traitsModifiers += (trait ? trait.value : 0);
            if (trait?.value != 0) {
                const itemLabel = game.i18n.localize(trait.label);
                const itemValue = (trait.value > 0 ? `+${trait.value}` : trait.value);
                description += `${itemValue}: ${itemLabel}<br>`
            }
        }
        data.sanity.max = 32 + traitsModifiers;
        data.sanity.value = data.sanity.max + data.sanity.damage
        data.sanity.penalty = this.getHealthOrSanityPenalty(data.sanity.value);
        let psycheValue = data.traits["psyche"]?.value;
        // check for actor type
        if (this.type == "Character") {
            recoverValue = 1 + Math.abs(psycheValue);
            recoverValue = (recoverValue > 4 ? 4 : recoverValue);
            data.sanity.naturalHealing.value = (psycheValue != 0 ? (psycheValue > 0 ? `${recoverValue} / ${day}` : `1 / ${recoverValue} ${day}`) : `1 / ${day}`);
        }
        data.sanity.description = description;
        // spheres level
        for (const item of Object.values(data.spheres)) {
            const spheresLevelsAP = [0, 1, 31, 51, 71, 91];
            for (let i = 0; i < spheresLevelsAP.length; i++) {
                item.level = ((item.value - spheresLevelsAP[i]) >= 0 ? i : (item.level || 0));
                item.description = `DESCRIPTIONS.powerSphere${item.level}`;
                item.description = item.description.replace("-", "_");
            }
        }
        // survival in the wild
        // ✦✦ NORMAL: 10 days during favourable conditions and with the proper equipment
        // ✦✦ DISCIPLINE: +1 day for every level of Survival
        // ✦✦ SPECIALTY: +2 days for every level of Travelling
        let persistenceInTheWild = 10;
        const survival = this.getDiscipline("wellTravelled", "survival");
        persistenceInTheWild += (survival ? survival.value : 0);
        const travelling = this.getSpecialty("wellTravelled", "survival", "travelling");
        persistenceInTheWild += (travelling ? (travelling.value * 2) : 0);
        data.registry.persistenceInTheWild = persistenceInTheWild;
        // movement
        // ✦✦ NORMAL: 10 meters
        // ✦✦ TRAIT: +Dexterity trait value in meters
        // ✦✦ DISCIPLINE: +1 meter For every level of Body Control (from the Agility Skill)
        // ✦✦ ARMOR: -1 meter for every 2 points of protection
        let movement = 10;
        const dexterity = this.getTrait("dexterity");
        movement += (dexterity ? dexterity.value : 0);
        const bodyControl = this.getDiscipline("agility", "bodyControl");
        movement += (bodyControl ? bodyControl.value : 0);
        // ARMOR ??
        data.registry.movement = movement;
    }
    // computeItems
    computeItems() {
        const data = this.system;
        const actorItems = this.items;
        data.armors = actorItems.filter(x => x.type == "Armor");
        data.weapons = actorItems.filter(x => x.type == "Weapon");
        data.equipments = actorItems.filter(x => x.type == "Equipment");
        data.apparels = actorItems.filter(x => x.type == "Apparel");
        data.kits = actorItems.filter(x => x.type == "Kit");
    }
    // computeCombatPoints
    computeCombatPoints() {
        const data = this.system;
        // labels
        const fightingLabel = "fighting";
        const agilityLabel = "agility";
        const battleExprienceLabel = "battleExprience";
        const combatReactionLabel = "combatReaction";
        const bodyControlLabel = "bodyControl";
        const closeCombatWeaponsLabel = "closeCombatWeapons";
        const rangedWeaponsLabel = "rangedWeapons";
        const unarmedFightLabel = "unarmedFight";
        const ambidexterityLabel = "ambidexterity";
        let value = 0;
        // initiative
        // ✦✦ NORMAL: 0
        // ✦✦ TRAIT: +Dexterity trait value
        // ✦✦ DISCIPLINE: +1 per level in Battle Exprience
        // ✦✦ SPECIALTY: +2 per level in Combat Reaction
        const dexterity = this.getTrait("dexterity")?.value;
        const battleExprience = this.getDiscipline(fightingLabel, battleExprienceLabel)?.value;
        const combatReaction = this.getSpecialty(fightingLabel, battleExprienceLabel, combatReactionLabel)?.value;
        let modifiers = {
            dexterity: dexterity,
            battleExprience: battleExprience,
            combatReaction: combatReaction
        };
        let description = "";
        for (const [key, modifier] of Object.entries(modifiers)) {
            if (modifier) {
                value += modifier;
                const itemLabel = game.i18n.localize(key);
                const itemValue = (modifier > 0 ? `+${modifier}` : modifier);;
                description += `${itemValue}: ${itemLabel}<br>`
            }
        }
        data.combat.stats.initiative.value = value;
        data.combat.stats.initiative.description = description;
        // combat free points
        // ✦✦ NORMAL: 0
        // ✦✦ DISCIPLINE: +1 per level in Battle Exprience
        value = 0;
        const fighting = this.getSkill(fightingLabel)?.value;
        modifiers = {
            fighting: fighting,
            battleExprience: battleExprience
        };
        description = "";
        for (const [key, modifier] of Object.entries(modifiers)) {
            if (modifier) {
                value += modifier;
                const itemLabel = game.i18n.localize(key);
                const itemValue = (modifier > 0 ? `+${modifier}` : modifier);;
                description += `${itemValue}: ${itemLabel}<br>`
            }
        }
        data.combat.stats.freePoints.value = value;
        data.combat.stats.freePoints.description = description;
        // melee weapons combat points
        // ✦✦ NORMAL: 0
        // ✦✦ DISCIPLINE: +1 per level in Melee Weapons
        const actorCloseCombatWeapons = this.getDiscipline(fightingLabel, closeCombatWeaponsLabel)?.value;
        value = actorCloseCombatWeapons ?? 0;
        data.combat.stats.closeCombatWeapons.value = value;
        // ranged weapons combat points
        // ✦✦ NORMAL: 0
        // ✦✦ DISCIPLINE: +1 per level in Ranged Weapons
        const actorRangedWeapons = this.getDiscipline(fightingLabel, rangedWeaponsLabel)?.value;
        value = actorRangedWeapons ?? 0;
        data.combat.stats.rangedWeapons.value = value;
        // unarmed combat points
        // ✦✦ NORMAL: 0
        // ✦✦ DISCIPLINE: +1 per level in Unarmed Fight
        const actorUnarmedFight = this.getDiscipline(fightingLabel, unarmedFightLabel)?.value;
        value = actorUnarmedFight ?? 0;
        data.combat.stats.unarmed.value = value;
        // non-dominant hand penalty
        // ✦✦ NORMAL: -15
        // ✦✦ DISCIPLINE: +1 meter Body Control (from the Agility Skill)
        // ✦✦ SPECIALTY: +2 for every level in Ambidexterity
        value = 0;
        const bodyControl = this.getDiscipline(agilityLabel, bodyControlLabel)?.value;
        const ambidexterity = this.getSpecialty(agilityLabel, bodyControlLabel, ambidexterityLabel)?.value;
        modifiers = {
            nonDominantHand: -15,
            bodyControl: bodyControl,
            ambidexterity: ambidexterity
        };
        description = "";
        for (const [key, modifier] of Object.entries(modifiers)) {
            if (modifier) {
                value += modifier;
                const itemLabel = game.i18n.localize(key);
                const itemValue = (modifier > 0 ? `+${modifier}` : modifier);;
                description += `${itemValue}: ${itemLabel}<br>`
            }
        }
        data.combat.stats.nonDominantHand.value = value;
        data.combat.stats.nonDominantHand.description = description;
    }
    // computeWeaponsCombatPoints
    computeWeaponsCombatPoints() {
        const data = this.system;
        const actorWeapons = data.weapons;
        for (const item of Object.values(actorWeapons)) {
            const weaponGroup = item.system.group;
            // let twoHands = 0;
            const fightingLabel = "fighting";
            // const closeCombatWeapons = "closeCombatWeapons";
            // labels
            const rangedWeaponsLabel = "rangedWeapons";
            const fireArmsLabel = "fireArms";
            const riflesLabel = "rifles";
            const closeCombatWeaponsLabel = "closeCombatWeapons";
            const lightMeleeWeaponsLabel = "lightMeleeWeapons";
            const heavyMeleeWeaponsLabel = "heavyMeleeWeapons";
            const bowsLabel = "bows";
            const pistolsLeftLabel = "pistolsLeft";
            const pistolsRightLabel = "pistolsRight";
            const oneHandWeaponsLeftLabel = "oneHandWeaponsLeft";
            const oneHandWeaponsRightLabel = "oneHandWeaponsRight";
            const twoHandsWeaponsLabel = "twoHandsWeapons";
            let description = "";
            const itemCombatPoints = {
                leftHand: { value: 0, modifiers: {} },
                rightHand: { value: 0, modifiers: {} },
                twoHands: { value: 0, modifiers: {} }
            };
            const modifiers = {
                leftHand: {},
                rightHand: {},
                twoHands: {}
            };
            // actor penalty fot non dominant hand
            const actorNonDominantHandPenalty = data.combat.stats.nonDominantHand.value;
            if (actorNonDominantHandPenalty < 0) {
                const actorDominantHand = data.registry.dominantHand;
                switch (actorDominantHand) {
                    case "left":
                        itemCombatPoints.rightHand.value = actorNonDominantHandPenalty;
                        // modifiers
                        itemCombatPoints.rightHand.modifiers.nonDominantHand = actorNonDominantHandPenalty;
                        break;
                    case "right":
                        itemCombatPoints.leftHand.value = actorNonDominantHandPenalty;
                        // modifiers
                        itemCombatPoints.leftHand.modifiers.nonDominantHand = actorNonDominantHandPenalty;
                        break;
                }
            }
            // actor combat free points
            const actorFreePoints = (data.combat.stats.freePoints.value || 0);
            itemCombatPoints.leftHand.value += actorFreePoints;
            itemCombatPoints.rightHand.value += actorFreePoints;
            itemCombatPoints.twoHands.value += actorFreePoints;
            itemCombatPoints.leftHand.modifiers.freePoints = actorFreePoints;
            itemCombatPoints.rightHand.modifiers.freePoints = actorFreePoints;
            itemCombatPoints.twoHands.modifiers.freePoints = actorFreePoints;
            // check weapon group
            // firemars or ranged weapons
            if ((weaponGroup == fireArmsLabel) || (weaponGroup == rangedWeaponsLabel)) {
                const actorRangedWeaponsPoints = (data.combat.stats.rangedWeapons.value || 0);
                itemCombatPoints.leftHand.value += actorRangedWeaponsPoints;
                itemCombatPoints.rightHand.value += actorRangedWeaponsPoints;
                itemCombatPoints.twoHands.value += actorRangedWeaponsPoints;
                // modifiers
                itemCombatPoints.leftHand.modifiers.rangedWeapons = actorRangedWeaponsPoints;
                itemCombatPoints.rightHand.modifiers.rangedWeapons = actorRangedWeaponsPoints;
                itemCombatPoints.twoHands.modifiers.rangedWeapons = actorRangedWeaponsPoints;
                switch (weaponGroup) {
                    // firearms
                    case (fireArmsLabel):
                        // check weapons hands
                        switch (item.system.hands) {
                            case 1:
                                // left
                                const actorPistolsLeft = this.getSpecialty(fightingLabel, rangedWeaponsLabel, pistolsLeftLabel);
                                itemCombatPoints.leftHand.value += (actorPistolsLeft?.value * 2);
                                // modifiers
                                itemCombatPoints.leftHand.modifiers.pistolsLeft = (actorPistolsLeft?.value * 2);
                                // right
                                const actorPistolsRight = this.getSpecialty(fightingLabel, rangedWeaponsLabel, pistolsRightLabel);
                                itemCombatPoints.rightHand.value += (actorPistolsRight?.value * 2);
                                // modifiers
                                itemCombatPoints.rightHand.modifiers.pistolsRight = (actorPistolsRight?.value * 2);
                                break;
                            case 2:
                                const actorRifles = this.getSpecialty(fightingLabel, rangedWeaponsLabel, riflesLabel);
                                itemCombatPoints.twoHands.value += (actorRifles?.value * 2);
                                // modifiers
                                itemCombatPoints.twoHands.modifiers.rifles = (actorRifles?.value * 2);
                                break;
                        }
                        break;
                    // ranged weapons
                    case (rangedWeaponsLabel):
                        const actorBows = this.getSpecialty(fightingLabel, rangedWeaponsLabel, bowsLabel);
                        itemCombatPoints.twoHands.value += (actorBows?.value * 2);
                        // modifiers
                        itemCombatPoints.twoHands.modifiers.bows = (actorBows?.value * 2);
                        break;
                }
            } else if ((weaponGroup == lightMeleeWeaponsLabel) || (weaponGroup == heavyMeleeWeaponsLabel)) {
                const actorCloseCombatWeapons = (data.combat.stats.closeCombatWeapons.value || 0);
                itemCombatPoints.leftHand.value += actorCloseCombatWeapons;
                itemCombatPoints.rightHand.value += actorCloseCombatWeapons;
                itemCombatPoints.twoHands.value += actorCloseCombatWeapons;
                // modifiers
                itemCombatPoints.leftHand.modifiers.closeCombatWeapons = actorCloseCombatWeapons;
                itemCombatPoints.rightHand.modifiers.closeCombatWeapons = actorCloseCombatWeapons;
                itemCombatPoints.twoHands.modifiers.closeCombatWeapons = actorCloseCombatWeapons;
                // check weapons hands
                switch (item.system.hands) {
                    case 1:
                        // left
                        const actorOneHandWeaponsLeft = this.getSpecialty(fightingLabel, closeCombatWeaponsLabel, oneHandWeaponsLeftLabel);
                        itemCombatPoints.leftHand.value += (actorOneHandWeaponsLeft?.value * 2);
                        // modifiers
                        itemCombatPoints.leftHand.modifiers.oneHandWeaponsLeft = (actorOneHandWeaponsLeft?.value * 2);
                        // right
                        const actorOneHandWeaponsRight = this.getSpecialty(fightingLabel, closeCombatWeaponsLabel, oneHandWeaponsRightLabel);
                        itemCombatPoints.rightHand.value += (actorOneHandWeaponsRight?.value * 2);
                        // modifiers
                        itemCombatPoints.rightHand.modifiers.oneHandWeaponsRight = (actorOneHandWeaponsRight?.value * 2);
                        break;
                    case 2:
                        const actorTwoHandsWeapons = this.getSpecialty(fightingLabel, closeCombatWeaponsLabel, twoHandsWeaponsLabel);
                        itemCombatPoints.twoHands.value += (actorTwoHandsWeapons?.value * 2);
                        // modifiers
                        itemCombatPoints.twoHands.modifiers.twoHandsWeapons = (actorTwoHandsWeapons?.value * 2);
                        break;
                }
            }
            // compute description from modifiers
            for (const [key1, item1] of Object.entries(itemCombatPoints)) {
                description = "";
                for (const [key2, item2] of Object.entries(item1.modifiers)) {
                    if (item2 != 0) {
                        const itemLabel = game.i18n.localize(key2);
                        const itemValue = (item2 > 0 ? `+${item2}` : item2);;
                        description += `${itemValue}: ${itemLabel}<br>`
                    }
                    itemCombatPoints[key1].description = description;
                }
            }
            item.system["combatPoints"] = itemCombatPoints;
        }
    }
    // computeVogue
    async computeVogue() {
        const data = this.system;
        const fashion = data.registry.vogue.fashion;
        const quality = data.registry.vogue.quality;
        const vogue = fashion + quality;
        await this.update({
            "system.registry.vogue.value": vogue
        });
    }
    // computeMoney
    async computeMoney() {
        const data = this.system;
        if (data.registry.money.marks == 100) {
            const ducats = data.registry.money.ducats + 1;
            await this.update({
                "system.registry.money.ducats": ducats,
                "system.registry.money.marks": 0,
            })
        }
        else if (data.registry.money.marks == -1) {
            const ducats = data.registry.money.ducats - 1;
            await this.update({
                "system.registry.money.ducats": ducats,
                "system.registry.money.marks": 99,
            })
        }
    }
    // onPropertyEdit
    onPropertyEdit(jTag, editValue) {
        if (jTag) {
            const actorEditMode = this.system.editMode;
            if (actorEditMode || jTag.hasClass("edit-always")) {
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
                        if (newBaseValue < minPropertyrValue) {
                            ui.notifications.info(game.i18n.localize("notificationMinValueExceeded"));
                            return
                        } else if (newBaseValue > maxPropertyValue) {
                            ui.notifications.info(game.i18n.localize("notificationMaxValueExceeded"));
                            return
                        }
                        else {
                            // updates
                            const updates = {
                                [`${propertyString}`]: newBaseValue
                            };
                            this.update(updates);
                        }
                    }
                }
            }
        }
    }
    // onPropertyChoicesEdit
    onPropertyChoicesEdit(jTag) {
        if (jTag[0]) {
            const actorEditMode = this.system.editMode;
            if (actorEditMode || jTag.hasClass("edit-always")) {
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
    // getHealthOrSanityPenalty
    getHealthOrSanityPenalty(value) {
        const penaltiesTiers = [2, 4, 6, 8];
        let tiersSum = 0;
        let penalty = 0;
        for (let i = 0; i < penaltiesTiers.length && (tiersSum < value); i++) {
            tiersSum += penaltiesTiers[i];
            penalty = -7 + (2 * i);
            penalty = tiersSum >= value ? penalty : 0;
        }

        return penalty;
    }
    //getTrait
    getTrait(traitLabel) {
        return this.system.traits[traitLabel];
    }

    // getSkill
    getSkill(skillLabel) {
        const actorSkill = this.system.skills[skillLabel]

        return actorSkill;
    }
    // getDiscipline
    getDiscipline(skillLabel, disciplineLabel) {
        const actorSkill = this.getSkill(skillLabel);
        const actorDiscipline = actorSkill.disciplines[disciplineLabel];

        return actorDiscipline;
    }
    // getSpecialty
    getSpecialty(skillLabel, disciplineLabel, specialtyLabel) {
        const actorDiscipline = this.getDiscipline(skillLabel, disciplineLabel);
        const actorSpecialty = actorDiscipline.specialities[specialtyLabel];

        return actorSpecialty;
    }


}