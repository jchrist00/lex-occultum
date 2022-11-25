export default class Helper {
    // getEntityPathValue
    static getEntityPathArrayValue(entity, entityPath) {
        const entityPathNodes = entityPath.split('.');
        let value = entity;
        for (let i = 0; i < entityPathNodes.length; i++) {
            const entityPathNode = entityPathNodes[i];
            value = value[entityPathNode];
        }

        return [value];
    }
    // getSummationFromXtoY
    static getSummationFromXtoY(x, y) {
        let summation = 0;
        if (y >= x) {
            for (let i = x; i <= y; i++) {
                summation += i;
            }
        }

        return summation;
    }
    // copyPropertiesItem
    static copyPropertiesItem(sourceItem) {
        const destinationItem = {};
        for (var key in sourceItem) {
            const rawData = sourceItem[key]
            destinationItem[key] = rawData;
        }

        return destinationItem;
    }
    // getCompendiumItems
    static async getCompendiumItems(compendiumName) {
        // const compendiumName = `${systemname}.${itemType}`;
        const pack = game.packs.get(compendiumName);
        let packItems;
        if (pack) {
            await pack.getIndex();
            packItems = await pack.getDocuments();
            return packItems;
        }

        return;
    }

    // sortSkillsByLabelLocalization
    static sortSkillsByLabelLocalization(skillsList) {
        // application of label localized
        // skills
        for (const skill of Object.values(skillsList)) {
            skill.labelLocalized = game.i18n.localize(skill.label);
            //disciplines
            for (const discipline of Object.values(skill.disciplines)) {
                discipline.labelLocalized = game.i18n.localize(discipline.label);
                // specialities
                for (const speciality of Object.values(discipline.specialities)) {
                    speciality.labelLocalized = game.i18n.localize(speciality.label);
                }
                // sort skill specialities
                discipline.specialities = Object.fromEntries(
                    Object.entries(discipline.specialities).sort(([, a], [, b]) => a.labelLocalized.localeCompare(b.labelLocalized))
                );
            }
            // sort skill disciplines
            skill.disciplines = Object.fromEntries(
                Object.entries(skill.disciplines).sort(([, a], [, b]) => a.labelLocalized.localeCompare(b.labelLocalized))
            );
        }
        // sort skills
        skillsList = Object.fromEntries(
            Object.entries(skillsList).sort(([, a], [, b]) => a.labelLocalized.localeCompare(b.labelLocalized))
        );

        return skillsList;
    }

    // sortItemsByLabelLocalization
    static sortItemsByLabelLocalization(itemsList) {
        itemsList.forEach(function (x) {
            x.system.labelLocalized = game.i18n.localize(x.system.label);
        });

        itemsList = itemsList.sort((a, b) => {
            return a.system.labelLocalized.localeCompare(b.system.labelLocalized);
        })

        return itemsList;
    }
}

