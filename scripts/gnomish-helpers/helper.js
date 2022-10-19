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

    // sortByLocalization
    static sortSkillsByLabelLocalization(skillsList) {

        let skillsArray = [];
        let skillsSortedList = {};
        for(const skill of Object.values(skillsList))
        {
            skill.labelLocalized = game.i18n.localize(skill.label);
            skillsArray.push(skill);
        }

        skillsArray.sort((a, b) => {
            return a.labelLocalized.localeCompare(b.labelLocalized);
        })

        for(let i = 0; i < skillsArray.length; i++)
        {
            let skill = skillsArray[i];
            skillsSortedList[skill.label] = skill;
        }

        return skillsSortedList;
    }

    // sortByLocalization
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

