import BaseActorSheet from "./base-actor-sheet.js";

export default class NonCharacterSheet extends BaseActorSheet {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: "systems/lex-occultum/templates/sheets/actors/non-characters/non-character-sheet.hbs",
            classes: [
                "lexoccultum", "sheet", "non-character"
            ]
            // ,
            // width: "auto",
            // height: "auto",
            // resizable: true,
            // // scale: 0.9,
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