export const lexoccultum = {};

lexoccultum.skills = {
    agility: {
        skill: "agility"
    }
}

lexoccultum.disciplines = {
    survival: {
        skill: "wellTravelled",
        discipline: "survival"
    }
}

lexoccultum.specialties = {

}

lexoccultum.choices = {
    creationPointsAndExperience: {
        // fields: ["value", "description"],
        fields: ["value"],
        beginner: {
            value: 500
        },
        practiced: {
            value: 800
        },
        experienced: {
            value: 1000
        }
    },
    archetypes: {
        fields: ["value", "skillKey"],
        artisan: {
            value: "artisan",
            skillKey: "professions"
        },
        occultist: {
            value: "occultist",
            skillKey: "esotericism"
        },
        official: {
            value: "official",
            skillKey: "culture"
        },
        tradesman: {
            value: "tradesman",
            skillKey: "communication"
        },
        scientist: {
            value: "scientist",
            skillKey: "science"
        },
        explorer: {
            value: "explorer",
            skillKey: "wellTravelled"
        },
        entertainer: {
            value: "entertainer",
            skillKey: "entertainment"
        },
        priest: {
            value: "priest",
            skillKey: "theology"
        },
        rogue: {
            value: "rogue",
            skillKey: "stealth"
        },
        combatant: {
            value: "combatant",
            skillKey: "fighting"
        },
    },
    traitsModifiers: {
        charisma: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            charisma4: {
                value: 4,
                cost: -60
            },
            charisma2: {
                value: 2,
                cost: -30
            },
            charisma1: {
                value: 1,
                cost: -15
            },
            charisma0: {
                value: 0,
                cost: 0
            },
            charisma_1: {
                value: -1,
                cost: 15
            },
            charisma_2: {
                value: -2,
                cost: 30
            },
            charisma_4: {
                value: -4,
                cost: 60
            }
        },
        constitution: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            constitution4: {
                value: 4,
                cost: -60
            },
            constitution2: {
                value: 2,
                cost: -30
            },
            constitution1: {
                value: 1,
                cost: -15
            },
            constitution0: {
                value: 0,
                cost: 0
            },
            constitution_1: {
                value: -1,
                cost: 15
            },
            constitution_2: {
                value: -2,
                cost: 30
            },
            constitution_4: {
                value: -4,
                cost: 60
            }
        },
        dexterity: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            dexterity4: {
                value: 4,
                cost: -60
            },
            dexterity2: {
                value: 2,
                cost: -30
            },
            dexterity1: {
                value: 1,
                cost: -15
            },
            dexterity0: {
                value: 0,
                cost: 0
            },
            dexterity_1: {
                value: -1,
                cost: 15
            },
            dexterity_2: {
                value: -2,
                cost: 30
            },
            dexterity_4: {
                value: -4,
                cost: 60
            }
        },
        intelligence: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            intelligence4: {
                value: 4,
                cost: -60
            },
            intelligence2: {
                value: 2,
                cost: -30
            },
            intelligence1: {
                value: 1,
                cost: -15
            },
            intelligence0: {
                value: 0,
                cost: 0
            },
            intelligence_1: {
                value: -1,
                cost: 15
            },
            intelligence_2: {
                value: -2,
                cost: 30
            },
            intelligence_4: {
                value: -4,
                cost: 60
            }
        },
        perception: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            perception4: {
                value: 4,
                cost: -60
            },
            perception2: {
                value: 2,
                cost: -30
            },
            perception1: {
                value: 1,
                cost: -15
            },
            perception0: {
                value: 0,
                cost: 0
            },
            perception_1: {
                value: -1,
                cost: 15
            },
            perception_2: {
                value: -2,
                cost: 30
            },
            perception_4: {
                value: -4,
                cost: 60
            }
        },
        psyche: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            psyche4: {
                value: 4,
                cost: -60
            },
            psyche2: {
                value: 2,
                cost: -30
            },
            psyche1: {
                value: 1,
                cost: -15
            },
            psyche0: {
                value: 0,
                cost: 0
            },
            psyche_1: {
                value: -1,
                cost: 15
            },
            psyche_2: {
                value: -2,
                cost: 30
            },
            psyche_4: {
                value: -4,
                cost: 60
            }
        },
        health: {
            // fields: ["cost", "value", "description"],
            fields: ["cost", "value"],
            health4: {
                value: 4,
                cost: -60
            },
            health2: {
                value: 2,
                cost: -30
            },
            health1: {
                value: 1,
                cost: -15
            },
            health0: {
                value: 0,
                cost: 0
            },
            health_1: {
                value: -1,
                cost: 15
            },
            health_2: {
                value: -2,
                cost: 30
            },
            health_4: {
                value: -4,
                cost: 60
            }
        }
    },
    socialClasses: {
        // fields: ["cost", "value", "description"],
        fields: ["cost", "value"],
        highNobility: {
            // label: "highNobility",
            value: "highNobility",
            cost: -400,
        },
        nobility: {
            // label: "nobility",
            value: "nobility",
            cost: -200,
        },
        lowNobility: {
            // label: "lowNobility",
            value: "lowNobility",
            cost: -100,
        },
        middleClass: {
            // label: "middleClass",
            value: "middleClass",
            cost: 0,
        },
        lowerClass: {
            // label: "lowerClass",
            value: "lowerClass",
            cost: 20,
        },
        pauper: {
            // label: "pauper",
            value: "pauper",
            cost: 30,
        },
        drifters: {
            // label: "drifters",
            value: "drifters",
            cost: 60,
        }
    },
    items: {
        qualities: {
            fields: ["value"],
            mediocre: {
                // label: "mediocre",
                value: "mediocre"
            },
            decent: {
                // label: "decent",
                value: "decent"
            },
            excellent: {
                // label: "excellent",
                value: "excellent"
            }
        },
        genders: {
            fields: ["value"],
            man: {
                value: "man"
            },
            woman: {
                value: "woman"
            }
        },
        parts: {
            fields: ["value"],
            complete: {
                value: "complete"
            },
            upper: {
                value: "upper"
            },
            lower: {
                value: "lower"
            },
            accessories: {
                value: "accessories"
            }
        },
        groups: {
            fields: ["value"],
            animals: {
                // label: "animals",
                value: "animals"
            },
            animalAccessories: {
                // label: "animalAccessories",
                value: "animalAccessories"
            },
            research: {
                // label: "research",
                value: "research"
            },
            thievesTools: {
                // label: "thievesTools",
                value: "thievesTools"
            },
            weaponAccessories: {
                // label: "weaponAccessories",
                value: "weaponAccessories"
            },
            wildernessGear: {
                // label: "wildernessGear",
                value: "wildernessGear"
            },
            toolsAndEquipment: {
                // label: "toolsAndEquipment",
                value: "toolsAndEquipment"
            }
        },
        sizes: {
            fields: ["value"],
            small: {
                value: "small"
            },
            common: {
                value: "common"
            },
            large: {
                value: "large"
            }
        }
    },
    weapons: {
        hands: {
            fields: ["value"],
            left: {
                value: "left"
            },
            right: {
                value: "right"
            }
        },
        groups: {
            fields: ["value"],
            fireArms: {
                // label: "fireArms",
                value: "fireArms"
            },
            rangedWeapons: {
                // label: "rangedWeapons",
                value: "rangedWeapons"
            },
            lightMeleeWeapons: {
                // label: "lightMeleeWeapons",
                value: "lightMeleeWeapons"
            },
            heavyMeleeWeapons: {
                // label: "heavyMeleeWeapons",
                value: "heavyMeleeWeapons"
            }
        }
    }
}

lexoccultum.rolls = {
    types: {
        skill: {
            label: "skill",
            formula: "1d20",
        },
        damage: {
            label: "damage",
            formula: "1d10"
        }
    },
    modifierTypes: {
        boolean: "boolean",
        checkable: "checkable",
        choiceable: "choiceable",
        editable: "editable",
        selectable: "selectable"
    },
    basicSituationValues:
    {
        veryEasy: {
            label: "veryEasy",
            value: 15
        },
        normal: {
            label: "normal",
            value: 10
        },
        veryHard: {
            label: "veryHard",
            value: 5
        }
    },
    difficulty: {
        extremelySimple:
        {
            label: "extremelySimple",
            value: 10
        },
        verySimple: {
            label: "verySimple",
            value: 5
        },
        simple:
        {
            label: "simple",
            value: 3
        },
        normal: {
            label: "normal",
            value: 0
        },
        difficult: {
            label: "difficult",
            value: -3
        },
        veryDifficult: {
            label: "veryDifficult",
            value: -5
        },
        extremelyDifficult: {
            label: "extremelyDifficult",
            value: -10
        },
        vergingOnImpossible: {
            label: "vergingOnImpossible",
            value: -15
        }
    },
    measuringSuccess: {
        mediocreSuccess:
        {
            min: 1,
            max: 2,
            outCome: "mediocreSuccess"
        },
        normalSuccess:
        {
            min: 1,
            max: 2,
            outCome: "normalSuccess"
        },
        adequateSuccess:
        {
            min: 1,
            max: 2,
            outCome: "adequateSuccess"
        },
        greatSuccess:
        {
            min: 1,
            max: 2,
            outCome: "greatSuccess"
        },
        fantasticSuccess:
        {
            min: 1,
            max: 2,
            outCome: "fantasticSuccess"
        },
    }
}