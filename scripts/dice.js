import { chatResultMessage } from "./chat/chat.js";

export async function ConfigRoll({
    type = "",
    formula = "1d20",
    targetValue = 0,
    actorImg = "",
    item,
    label = "",
    choices = [],
    modifiers = []
} = {}) {
    // ===================================================================================
    //                              ROLL
    // ===================================================================================
    let rollResult = await RollCheck({
        name: label,
        formula: formula
    });
    // Rendered Roll
    let renderedRoll = await rollResult.render();
    // ===================================================================================
    //                              CHECKS
    // ===================================================================================

    let actionResult = {
        gameEffect: "",
        grade: ""
    };

    const rollResultTotal = rollResult.total;

    switch (type) {
        case "trait":
        case "skill":
            actionResult.gameEffect = (rollResultTotal == 20 ? "failure" : (rollResultTotal == 1 || rollResultTotal <= targetValue ? "success" : "failure"));
            actionResult.grade = actionResult.gameEffect;
            actionResult.gameEffect = `${game.i18n.localize(actionResult.gameEffect)}! [${rollResultTotal} / ${targetValue}]`;
            break;
        case "weapon":
            if (item) {
                if (rollResultTotal < item.misfire || item.misfire == 0) {
                    actionResult.gameEffect = (rollResultTotal == 20 ? "miss" : (rollResultTotal == 1 || rollResultTotal <= targetValue ? "hit" : "miss"));
                    // set the chat button
                    item.damageButton = (actionResult.gameEffect == "hit");
                    actionResult.grade = actionResult.gameEffect;
                    actionResult.gameEffect = `${game.i18n.localize(actionResult.gameEffect)}! [${rollResultTotal} / ${targetValue}]`;
                }
                else {
                    actionResult.grade = "misfire";
                    actionResult.gameEffect = `${game.i18n.localize("misfire")}! [${rollResultTotal} / ${targetValue}]`;
                    // set the chat button
                    item.misfireButton = true;
                }
            }
            break;
        case "misfire":
            if (rollResultTotal <= 4) {
                actionResult.gameEffect = game.i18n.localize("DESCRIPTIONS.misfire4");
            }
            else if (rollResultTotal <= 6) {
                actionResult.gameEffect = game.i18n.localize("DESCRIPTIONS.misfire6");
            }
            else if (rollResultTotal <= 8) {
                actionResult.gameEffect = game.i18n.localize("DESCRIPTIONS.misfire8");
            }
            else if (rollResultTotal == 9) {
                actionResult.gameEffect = game.i18n.localize("DESCRIPTIONS.misfire9");
            }
            else if (rollResultTotal == 10) {
                actionResult.gameEffect = game.i18n.localize("DESCRIPTIONS.misfire10");
            }
            actionResult.grade = "misfire";
            break;
        case "damage":
            actionResult.gameEffect = "<div class='damage-dice'><div class='equal'>" + game.i18n.localize("damages") + ": </div>"
            for (const item of Object.values(rollResult.terms[0].results)) {
                actionResult.gameEffect += "<div class='damage-die'>" + item.result + "</div>";
            }
            actionResult.gameEffect += "<div class='equal'>=</div><div class='damage-total'>" + rollResultTotal + "</div></div>";
            actionResult.grade = "damage";
            break;
    }

    // send to the chat
    chatResultMessage({
        actorImg: actorImg,
        item: item,
        taskHeader: "skill",
        taskLabel: label,
        rollResult: rollResult,
        renderedRoll: renderedRoll,
        rollModifiers: modifiers,
        actionResult: actionResult
    });

}

// ===================================================================================
//                              ROLL CHECK
// ===================================================================================
// rollCheck
async function RollCheck({
    name = "",
    formula
} = {}) {

    let rollFormula = formula;
    let rollData = {
        taskName: name
    };

    // new roll
    const dice = new Roll(rollFormula, rollData);
    // roll dice
    let rollResult = dice.evaluate({async: false});

    return rollResult;
}
