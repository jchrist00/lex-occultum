import { addChatListeners } from "./scripts/chat/chat.js";
import { lexoccultum } from "./scripts/config.js";
// import CompendiumTools from "./scripts/dialogs/compendium-dialog.js";
import ShopDialog from "./scripts/dialogs/shop-dialog.js";
// actor
import CustomActor from "./scripts/entities/custom-actor.js";
import CharacterSheet from "./scripts/sheets/actors/character-sheet.js"
import NonCharacterSheet from "./scripts/sheets/actors/non-character.js";
// item
import CustomItem from "./scripts/entities/custom-item.js";
import CustomItemSheet from "./scripts/sheets/items/item-sheet.js"
// combat
import CustomCombat from "./scripts/combat/custom-combat.js";
import CustomCombatTracker from "./scripts/combat/custom-combat-tracker.js";

Hooks.once("init", () => {
    CONFIG.lexoccultum = lexoccultum;
    CONFIG.anonymousSheet = {};
    CONFIG.Actor.documentClass = CustomActor;
    CONFIG.Item.documentClass = CustomItem;
    // actor sheets
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("lo", CharacterSheet, {
        types: ["Character"],
        makeDefault: true
    });
    Actors.registerSheet("lo", NonCharacterSheet, {
        types: ["Non-Character"],
        makeDefault: true
    });
    // item sheets
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("lo", CustomItemSheet, {
        makeDefault: true
    });
    // combat tracker
    CONFIG.Combat.documentClass = CustomCombat;
    CONFIG.ui.combat = CustomCombatTracker;
    // compendium tools
    // globalThis.CompendiumTools = CompendiumTools;
    globalThis.ShopDialog = ShopDialog;

    preloadHandlebarsTemplates();
});

Hooks.on("renderChatLog", (app, html, data) => addChatListeners(html));

// handlebars
Handlebars.registerHelper({
    eq: (value1, value2) => value1 === value2,
    ne: (value1, value2) => value1 !== value2,
    lt: (value1, value2) => value1 < value2,
    gt: (value1, value2) => value1 > value2,
    lte: (value1, value2) => value1 <= value2,
    gte: (value1, value2) => value1 >= value2,
    and() {
        return Array.prototype.every.call(arguments, Boolean);
    },
    or() {
        return Array.prototype.slice.call(arguments, 0, -1).some(Boolean);
    },
    in(value1, value2) {
        const index = value1.indexOf(value2);
        return (index > -1);
    },
    not(value) {
        return !value
    },
    dash(value) {
        return (value == 0 ? "-" : value);
    },
    isNumber(value) {
        const typeOfValue = typeof value,
            result = (typeOfValue === 'number');
        return result;
    },
    isBoolean(value) {
        const typeOfValue = typeof value,
            result = (typeOfValue === 'boolean');
        return result;
    },
    isEven(value) {
        return (value % 2 == 0);
    },
    sign(value) {
        let result = (value >= 0 ? "+" + value : value);
        return result;
    },
    toDash(value) {
        const result = (value ? value : "-");

        return result;
    },
    setVariable(varName, varValue, options) {
        options.data.root[varName] = varValue;
    },
    // forse da rimuovere dopo aver controllato dove agisce
    objectPropertyValue(object, property) {
        return object[property];
    },
    concat() {
        var outStr = '';
        for (var arg in arguments) {
            if (typeof arguments[arg] != 'object') {
                outStr += arguments[arg];
            }
        }
        return outStr;
    },
    pathcompose(path, variable) {
        path = path.replace("@itemType", variable.toLowerCase())

        return path;
    },
    marks(value) {
        if (value < 10) {
            return "0" + value;
        }
        return value;
    },
    weight(value) {
        const units = value % 100;
        const tens = (value - units) / 100;
        const zero = (value < 10 ? "0" : "");

        const result = (units > 0 ? `${tens},${zero}${units}` : tens)

        return result;
    },
    includes(value1, value2) {
        let result = false;
        if (value1 && value2) {
            result = value1.includes(value2);
        }
        return result;
    }
    //,
    // loadDescription(descriptionPath, entityKey) {
    //     descriptionPath += entityKey;
    //     const entityPathNodes = descriptionPath.split('.');
    //     let description = DESCRIPTIONS;
    //     if (description) {
    //         for (let i = 0; i < entityPathNodes.length; i++) {
    //             const entityPathNode = entityPathNodes[i];
    //             description = description[entityPathNode];
    //         }
    //     }
    //     else
    //     {
    //         description = "";
    //     }

    //     return description;
    // }
});

// handlebars templates
function preloadHandlebarsTemplates() {
    const templatePaths = [
        // ----------------- character-sheet tabs -------------------------------------------------
        "systems/lex-occultum/templates/sheets/actors/characters/tabs/stats-tab.hbs",
        "systems/lex-occultum/templates/sheets/actors/characters/tabs/combat-tab.hbs",
        "systems/lex-occultum/templates/sheets/actors/characters/tabs/skills-tab.hbs",
        "systems/lex-occultum/templates/sheets/actors/characters/tabs/inventory-tab.hbs",
        "systems/lex-occultum/templates/sheets/actors/characters/tabs/notes-tab.hbs",
        // "systems/lex-occultum/templates/sheets/actors/characters/tabs/items-tab.hbs",
        // ----------------- non-character-sheet tabs----------------------------------------------
        "systems/lex-occultum/templates/sheets/actors/non-characters/tabs/stats-tab.hbs",
        // -----------------item-sheet tabs -------------------------------------------------------
        "systems/lex-occultum/templates/sheets/items/parts/apparel-sheet.hbs",
        "systems/lex-occultum/templates/sheets/items/parts/weapon-sheet.hbs",
        "systems/lex-occultum/templates/sheets/items/parts/equipment-sheet.hbs",
        "systems/lex-occultum/templates/sheets/items/parts/kit-sheet.hbs",
        // -----------------shop tabs -------------------------------------------------------------
        "systems/lex-occultum/templates/dialogs/tabs/shop-apparels-tab.hbs",
        "systems/lex-occultum/templates/dialogs/tabs/shop-equipments-tab.hbs",
        "systems/lex-occultum/templates/dialogs/tabs/shop-kits-tab.hbs",
        "systems/lex-occultum/templates/dialogs/tabs/shop-weapons-tab.hbs"
    ];

    return loadTemplates(templatePaths);
}