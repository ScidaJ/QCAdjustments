import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { IQuestCondition } from "@spt/models/eft/common/tables/IQuest";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILogger } from "@spt/models/spt/utils/ILogger";

import CONFIG from "../config/config.json";
import GSQuests from "../database/Gunsmith_quests.json";
import GSQuestsKills from "../database/Gunsmith_replace_conditions_quests.json"

enum conditionType {
    Counter = "CounterCreator",
    Find = "FindItem",
    Handover = "HandoverItem",
    LeaveAt = "LeaveItemAtLocation",
    Sell = "SellItemToTrader",

}
class Mod implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void {
        // Log init
        const logger = container.resolve<ILogger>("WinstonLogger");
        const log = (msg: string) => logger.info(`[QCAdjustments] ${msg}`);

        // Db init
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        const tables = databaseService.getTables()
        const quests = tables.templates.quests;

        // Config init
        const counter = (CONFIG.task_weight.counter > 0) ? CONFIG.task_weight.counter : 0.5
        const findHandover = (CONFIG.task_weight.find_handover > 0) ? CONFIG.task_weight.find_handover : 0.5
        const leaveAt = (CONFIG.task_weight.leave_at > 0) ? CONFIG.task_weight.leave_at : 0.5
        const sell = (CONFIG.task_weight.sell > 0) ? CONFIG.task_weight.sell : 0.5

        log("Adjusting quest conditions for kills, handover/FIR, leaveAt, and sell.");
        for (const quest of Object.values(quests)) {
            for (const condition of Object.values<IQuestCondition>(quest.conditions.AvailableForFinish)) {
                switch (condition.conditionType) {
                    case conditionType.Counter:
                        condition.value = Math.ceil(<number>condition.value * counter);
                        break;
                    case conditionType.Find:
                    case conditionType.Handover:
                        condition.value = Math.ceil(<number>condition.value * findHandover);
                        break;
                    case conditionType.LeaveAt:
                        condition.value = Math.ceil(<number>condition.value * leaveAt);
                        break;
                    case conditionType.Sell:
                        condition.value = Math.ceil(<number>condition.value * sell);
                        break;
                }
            }
        }

        if (CONFIG.gunsmith_kills.enabled) {
            log("Adjusting coniditions for Gunsmith.")

            const gunsmithQuests = (CONFIG.gunsmith_kills.replace_task) ? GSQuestsKills : GSQuests;
            const gunsmithKillCount = (CONFIG.gunsmith_kills.kills > 0) ? CONFIG.gunsmith_kills.kills : 10;

            for (const questId in gunsmithQuests) {
                let quest = <IQuest>gunsmithQuests[questId]
                for (const condition of Object.values(quest.conditions.AvailableForFinish)) {
                    if (condition.conditionType && condition.value) {
                        switch (condition.conditionType) {
                            case conditionType.Counter:
                                condition.value = gunsmithKillCount;
                                break;
                        }
                    }

                }
                quests[questId] = quest;
            }
        }

        log("Adjusted quest conditions.")

    }
}

export const mod = new Mod();
