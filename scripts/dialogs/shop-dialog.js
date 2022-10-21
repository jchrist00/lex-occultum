import Helper from "../gnomish-helpers/helper.js";

export default class ShopDialog extends Application {
    constructor({
        header = "shop",
        entity,
        item
    }) {
        let data = {};
        if (item) {
            // set the price modified
            item.system.priceModified2.ducats = item.system.price2.ducats;
            item.system.priceModified2.marks = item.system.price2.marks;
            data = {
                title: game.i18n.localize("shop"),
                template: "systems/lex-occultum/templates/dialogs/shop-quality-choice-dialog.hbs",
                classes: [
                    "lexoccultum", "dialog", "shop"
                ],
                width: 260,
                height: "auto",
            };
        }
        else {
            data = {
                title: game.i18n.localize("shop"),
                template: "systems/lex-occultum/templates/dialogs/shop-dialog.hbs",
                classes: [
                    "lexoccultum", "dialog", "shop"
                ],
                width: 950,
                height: 800,
                resizable: true,
                tabs: [
                    {
                        navSelector: ".sheet-tabs",
                        contentSelector: ".sheet-body",
                        initial: "pag1"
                    }
                ]
            };
        }
        super(data);

        this.header = header;
        this.entity = entity;
        this.shop = {};
        this.item = item || undefined;

        this.render(true);
    }

    /** @override */
    async getData() {
        const superData = super.getData();

        if (this.item) {
            superData.item = this.item;
        }
        else {
            const systemName = "lex-occultum";
            const apparelsCompendium = `${systemName}.Apparels`;
            const weaponsCompendium = `${systemName}.Weapons`;
            const equipmentsCompendium = `${systemName}.Equipments`;
            const kitsCompendium = `${systemName}.Kits`;
            superData.header = this.header;
            // superData.qualities = CONFIG.lexoccultum.choices.items.qualities;
            superData.shop = {};
            // apparels
            const apparels = await Helper.getCompendiumItems(apparelsCompendium);
            if (apparels) {
                superData.shop.apparels = {};
                superData.shop.apparels.man = {};
                superData.shop.apparels.woman = {};
                const menApparels = apparels.filter(x => x.system.gender == "man")
                const womenApparels = apparels.filter(x => x.system.gender == "woman")
                for (const part of ["upper", "lower", "accessories"]) {
                    // MAN
                    let manItems = menApparels.filter(x => x.system.part == part);
                    // sort for localization language
                    Helper.sortItemsByLabelLocalization(manItems);
                    superData.shop.apparels.man[part] = manItems;
                    // WOMAN
                    let womanItems = womenApparels.filter(x => x.system.part == part);
                    // sort for localization language
                    Helper.sortItemsByLabelLocalization(womanItems);
                    superData.shop.apparels.woman[part] = womanItems;
                }
                this.shop.apparels = apparels;
            }
            // weapons
            const weapons = await Helper.getCompendiumItems(weaponsCompendium);
            if (weapons) {
                // fire arms
                let fireArms = weapons.filter(x => x.system.group == "fireArms");
                // sort for localization language
                Helper.sortItemsByLabelLocalization(fireArms);
                fireArms.sort((a, b) => {
                    if (a.system.label === b.system.label) {
                        return (a.system.price < b.system.price ? -1 : 1)
                    }
                })
                superData.shop.fireArms = fireArms;
                this.shop.fireArms = fireArms;
                // ranged weapons
                let rangedWeapons = weapons.filter(x => x.system.group == "rangedWeapons");
                // sort for localization language
                Helper.sortItemsByLabelLocalization(rangedWeapons);
                rangedWeapons.sort(function (a, b) {
                    if (a.system.label === b.system.label) {
                        return (a.system.price < b.system.price ? -1 : 1)
                    }
                });
                superData.shop.rangedWeapons = rangedWeapons;
                this.shop.rangedWeapons = rangedWeapons;
                // light melee weapons
                let lightMeleeWeapons = weapons.filter(x => x.system.group == "lightMeleeWeapons");
                // sort for localization language
                Helper.sortItemsByLabelLocalization(lightMeleeWeapons);
                lightMeleeWeapons.sort(function (a, b) {
                    if (a.system.label === b.system.label) {
                        return (a.system.price < b.system.price ? -1 : 1)
                    }
                });
                superData.shop.lightMeleeWeapons = lightMeleeWeapons;
                this.shop.lightMeleeWeapons = lightMeleeWeapons;
                // heavy melee weapons
                let heavyMeleeWeapons = weapons.filter(x => x.system.group == "heavyMeleeWeapons");
                // sort for localization language
                Helper.sortItemsByLabelLocalization(heavyMeleeWeapons);
                heavyMeleeWeapons.sort(function (a, b) {
                    if (a.system.label === b.system.label) {
                        return (a.system.price < b.system.price ? -1 : 1)
                    }
                });
                superData.shop.heavyMeleeWeapons = heavyMeleeWeapons;
                this.shop.heavyMeleeWeapons = heavyMeleeWeapons;
            }
            // kits
            let kits = await Helper.getCompendiumItems(kitsCompendium);
            if (kits) {
                // sort for localization language
                Helper.sortItemsByLabelLocalization(kits);
                kits = kits.sort(function (a, b) {
                    if (a.system.label === b.system.label) {
                        return (a.system.price < b.system.price ? -1 : 1)
                    }
                });
                superData.shop.kits = kits;
                this.shop.kits = kits;
            }
            // equipments
            const equipments = await Helper.getCompendiumItems(equipmentsCompendium);
            if (equipments) {
                const equipmentsGroups = Object.keys(CONFIG.lexoccultum.choices.items.groups)?.filter(x => x != "fields");
                const equipmentsHalfCount = (equipments.length / 2) + 1;
                const equipmentsGroupsHalfCount = (equipmentsGroups.length / 2) + 1;
                if (equipmentsGroups) {
                    // superData.shop.equipmentsGroups = equipmentsGroups;
                    superData.shop.equipments = {};
                    superData.shop.equipments.column1 = {};
                    superData.shop.equipments.column2 = {};
                    let groupsCount = 0;
                    let itemsCount = 0;
                    for (const key of equipmentsGroups) {
                        let items = equipments.filter(x => x.system.group == key);
                        // sort for localization language
                        Helper.sortItemsByLabelLocalization(items);
                        if (groupsCount <= equipmentsGroupsHalfCount && itemsCount <= equipmentsHalfCount) {
                            superData.shop.equipments.column1[key] = items;
                        }
                        else {
                            superData.shop.equipments.column2[key] = items;
                        }
                        this.shop[key] = items;
                        groupsCount++;
                        itemsCount += items.length;
                    }
                }
            }
        }



        return superData;
    }

    // ===================================================================================
    //                              Listeners
    // ===================================================================================
    // activateListeners
    activateListeners(html) {
        super.activateListeners(html);
        // SKILL TASK
        html.find('.purchase-item').click(ev => { this.onPurchaseItem(ev) });
        html.find('.quality-choice-item').click(ev => { this.onQualityChoiceItem(ev) });
        html.find('.property-edit').mouseup(ev => { this.onPropertyEdit(ev) });
    }

    // onQualityChoiceItem
    async onQualityChoiceItem(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget);
        if (jTag[0]) {
            const itemId = jTag[0].dataset.itemId;
            const itemGroup = jTag[0].dataset.group;
            const groupItems = this.shop[itemGroup];
            if (groupItems) {
                const itemPurchased = groupItems.find(x => x.id == itemId);
                if (itemPurchased) {
                    const actorItem = duplicate(itemPurchased);
                    new ShopDialog(
                        {
                            header: game.i18n.localize("quality"),
                            entity: this.entity,
                            item: actorItem
                        }
                    )
                }
            }
        }
    }

    // onPropertyEdit
    onPropertyEdit(event) {
        event.preventDefault();
        const jTag = $(event.currentTarget);
        const parameters = jTag[0].dataset.parameters.split(';');
        if (parameters.length > 0) {
            // config values
            const editValue = -(event.button - 1);
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
                    this.item.system[propertyString] = newBaseValue;
                    // check for quality and vogue 
                    const quality = this.item.system.quality;
                    const vogue = this.item.system.vogue;
                    const qualityVogue = quality + vogue;
                    // compute the impression
                    this.item.system.impression = (qualityVogue >= 0 ? Math.floor(qualityVogue / 2) : Math.round(qualityVogue / 2));
                    // compute the price
                    let priceDucats = this.item.system.price2.ducats;
                    let priceMarks = this.item.system.price2.marks;
                    let price = (priceDucats * 100) + priceMarks;
                    const qualityPriceMultiplier = (quality > 0 ? (quality == 1 ? 1.5 : quality) : (quality == -5 ? 0.1 : (1 + (quality * 0.2))));
                    const voguePriceMultiplier = (vogue > 0 ? (vogue == 1 ? 1.5 : vogue) : (vogue == -5 ? 0.1 : (1 + (vogue * 0.2))));
                    price *= (qualityPriceMultiplier * voguePriceMultiplier);
                    this.item.system.priceModified2.ducats = Math.floor(price / 100);
                    this.item.system.priceModified2.marks = (price % 100);

                    this.render();
                }
            }
        }

    }

    // onPurchaseItem
    async onPurchaseItem(event) {
        event.preventDefault();
        const actor = this.entity;
        if (actor) {
            const jTag = $(event.currentTarget);
            if (jTag[0]) {
                let itemPurchased = undefined;
                if (this.item) {
                    itemPurchased = this.item;
                    itemPurchased.system.price2.ducats = itemPurchased.system.priceModified2.ducats;
                    itemPurchased.system.price2.marks = itemPurchased.system.priceModified2.marks;
                }
                else {
                    const itemId = jTag[0].dataset.itemId;
                    // const itemQuality = jTag[0].dataset.quality;
                    const itemGroup = jTag[0].dataset.group;
                    const groupItems = this.shop[itemGroup];
                    if (groupItems) {
                        itemPurchased = groupItems.find(x => x.id == itemId);
                    }
                }
                if (itemPurchased) {
                    // setting
                    const shopItem = duplicate(itemPurchased);
                    let actorDucats = actor.system.registry.money.ducats;
                    let actorMarks = actor.system.registry.money.marks;
                    const priceDucats = shopItem.system.price2.ducats;
                    const priceMarks = shopItem.system.price2.marks;
                    // check for enough money
                    actorMarks -= priceMarks;
                    if (actorMarks < 0) {
                        actorMarks = 100 + actorMarks;
                        actorDucats--;
                    }
                    if (actorDucats > 0) {
                        actorDucats -= priceDucats;
                    }
                    if (actorDucats >= 0 && actorMarks >= 0) {
                        await actor.update({
                            "system.registry.money.ducats": actorDucats,
                            "system.registry.money.marks": actorMarks
                        });
                        // add the item to the actor
                        // shopItem.system.quality = itemQuality;
                        shopItem.system.shopPurchased = true;
                        await actor.createEmbeddedDocuments("Item", [shopItem]);
                        // game message
                        const actorName = actor.name;
                        const itemLabel = game.i18n.localize(shopItem.system.label);
                        const action = game.i18n.localize("purchased").replace("@item", itemLabel);
                        const result = (priceMarks > 0 ? `${priceDucats},${priceMarks}` : priceDucats);
                        const ducats = game.i18n.localize("ducats");

                        ui.notifications.info(`${actorName} ${action} ${result} ${ducats}`);
                        if (this.item) {
                            this.close();
                        }
                    }
                    else {
                        // game message
                        const actorName = actor.name;
                        const purchaseNotExecuted = game.i18n.localize("purchaseNotExecuted");
                        const notEnoughMoney = game.i18n.localize("notEnoughMoney");
                        ui.notifications.error(`${purchaseNotExecuted}: ${actorName} ${notEnoughMoney}`);
                        if (this.item) {
                            this.close();
                        }
                    }
                }
            }
        }
    }

}