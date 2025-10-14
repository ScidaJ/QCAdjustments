import {IQuestCondition} from "@spt/models/eft/common/tables/IQuest";
import {GunsmithQuestCondition} from "./gunsmithQuestConditionTypes";

export function CreateGunsmithCondition(
    conditionIds: GunsmithQuestCondition,
    weapon: string,
    kills: number,
): IQuestCondition {
    return {
        id: conditionIds.id,
        conditionType: "CounterCreator",
        counter: {
            id: conditionIds.counter.id,
            conditions: [
                {
                    id: conditionIds.counter.conditions[0].id,
                    compareMethod: ">=",
                    conditionType: "Kills",
                    dynamicLocale: true,
                    resetOnSessionEnd: false,
                    target: "Any",
                    value: 1,
                    weapon: [weapon],
                },
            ],
        },
        dynamicLocale: true,
        type: "Elimination",
        value: kills,
    };
}
