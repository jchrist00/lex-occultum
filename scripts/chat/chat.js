// import { CHECK_TYPES } from "../config.js";
// import TaskDialog from "../dialogs/task-dialog.js";

import { ConfigRoll } from "../dice.js";

// chatResultMessage
export async function chatResultMessage({
    actorImg = "",
    item,
    taskHeader = "",
    taskLabel = "",
    rollResult = null,
    renderedRoll = null,
    rollModifiers = [],
    actionResult = ""
} = {}) {
    let messageTemplate = "systems/lex-occultum/templates/chat/task-check-result.hbs";
    const gameEffect = game.i18n.localize(actionResult.gameEffect);
    const resultGrade = actionResult.grade;

    // templateContext
    let templateContext = {
        actorImg: actorImg,
        item: item,
        taskCheckHeader: taskHeader,
        taskCheckName: taskLabel,
        gameEffect: gameEffect,
        resultGrade: resultGrade,
        rollModifiers: rollModifiers,
        roll: renderedRoll
    };
    // chatData
    let chatData = {
        user: game.user.id,
        speaker: ChatMessage.getSpeaker(),
        roll: rollResult,
        content: await renderTemplate(messageTemplate, templateContext),
        sound: CONFIG.sounds.dice,
        type: CONST.CHAT_MESSAGE_TYPES.ROLL
    };
    // ChatMessage
    ChatMessage.create(chatData);
}

// addChatListeners
export function addChatListeners(html) {
    html.on('click', 'a.damage-roll', onDamageRoll);
    html.on('click', 'a.misfire-roll', onMisfireRoll);
}
// onDamageRoll
async function onDamageRoll(event) {
    const jTag = $(event.currentTarget)[0];
    if (jTag) {
        const actorImg = jTag.dataset.actorImg;
        const weaponImg = jTag.dataset.weaponImg;
        const damageFormula = jTag.dataset.damageFormula;
        const openRollValue = jTag.dataset.openRollValue;
        const weaponLabel = jTag.dataset.weaponLabel;
        const formula = damageFormula + (openRollValue > 0 ? "x>=" + openRollValue : "");

        // go to the config roll
        ConfigRoll({
            type: "damage",
            formula: formula,
            actorImg: actorImg,
            item: {
                img: weaponImg
            },
            label: weaponLabel
        });
    }
}
// onMisfireRoll
async function onMisfireRoll(event) {
    const jTag = $(event.currentTarget)[0];
    if (jTag) {
        const actorImg = jTag.dataset.actorImg;
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
            label: weaponLabel
        });
    }
}

