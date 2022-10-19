import BaseActorSheet from "./base-actor-sheet.js";

export default class CharacterSheet extends BaseActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/lex-occultum/templates/sheets/actors/characters/character-sheet.hbs",
            classes: [
                "lexoccultum", "sheet", "character"
            ]
            // ,
            // width: "auto",
            // height: "auto",
            // resizable: true,
            // tabs: [
            //     {
            //         navSelector: ".sheet-tabs",
            //         contentSelector: ".sheet-body",
            //         initial: "stats"
            //     }
            // ],
            // scrollY: [".notes"],
        });
    }
}