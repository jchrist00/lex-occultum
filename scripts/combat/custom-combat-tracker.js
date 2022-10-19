export default class CustomCombatTracker extends CombatTracker {
  get template() {
    return "systems/lex-occultum/templates/combat/combat-tracker.hbs";
  }

  // getData
  async getData(options) {
    const data = await super.getData(options);
    data.config = CONFIG.lexoccultum;

    if (!data.hasCombat) {
      return data;
    }

    // // ======================== Compute Initiative ================================
    const combatTurns = data.combat.turns;

    for (let [i, turn] of data.turns.entries()) {
      // settings
      if (turn.initiative) {
        const combatant = combatTurns.find((x) => x.id == turn.id);
        if (combatant) {
          const actor = game.actors.find((x) => x.id == combatant.actorId);
          if (actor) {
            combatant.lexoccultumInitiative = {};
            const weaponInitiativeModifier = actor.system.weapons.find((x) => x.system.handUse != "")?.system.initiativeModifier || 0;
            turn.initiativeDie = combatant.initiative;
            turn.weaponInitiativeModifier = weaponInitiativeModifier;
            turn.initiative = combatant.initiative + weaponInitiativeModifier
          }
        }
      }
    }

    return data;
  }

  // // ===================================================================================
  // //                              Listeners
  // // ===================================================================================
  // activateListeners(html) {
  //   super.activateListeners(html);

  //   html.find(".phase-action-selected").change(this.onPhaseActionSelected.bind(this));
  //   html.find(".reset-combatant-actions").click(this.onResetCombatantActions.bind(this));
  // }
  // // onResetCombatantActions
  // async onResetCombatantActions() {
  //   const jTag = $(event.currentTarget)[0];
  //   if (jTag) {
  //     const li = jTag.closest(".combatant");
  //     const combatant = this.viewed.combatants.get(li.dataset.combatantId);
  //     await combatant.resetActions();
  //   }
  // }
  // // onPhaseActionSelected
  // async onPhaseActionSelected(event) {
  //   const jTag = $(event.currentTarget)[0];
  //   if (jTag) {
  //     const li = jTag.closest(".combatant");
  //     const combatant = this.viewed.combatants.get(li.dataset.combatantId);
  //     const actionType = jTag.options[jTag.selectedIndex].dataset.actionType;
  //     // check 
  //     if (actionType) {
  //       const actions = combatant.getFlag("vsdarkmaster", "actions");
  //       switch (actionType) {
  //         case "fullAction":
  //           actions.fullAction.action = jTag.value;
  //           actions.halfActionB.action = "";
  //           break;
  //         case "halfAction":
  //           if (actions.fullAction.action != "" || actions.halfActionA.action == "" || actions.halfActionB.action != "") {
  //             actions.halfActionA.action = jTag.value;
  //             actions.halfActionB.action = "";
  //           }
  //           else {
  //             actions.halfActionB.action = jTag.value;
  //           }
  //           break;
  //         case "freeAction":
  //           actions.freeAction.action = jTag.value;
  //           break;
  //       }

  //       await combatant.setFlag("vsdarkmaster", "actions", actions);
  //     }

  //     this.render();
  //   }
  // }

}
