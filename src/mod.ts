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

const questIds = ["5ac23c6186f7741247042bad",
    "5ac2426c86f774138762edfe",
    "5ac2428686f77412450b42bf",
    "5ac242ab86f77412464f68b4",
    "5ac244c486f77413e12cf945",
    "5ac244eb86f7741356335af1",
    "5ae3267986f7742a413592fe",
    "5ae3270f86f77445ba41d4dd",
    "5ae3277186f7745973054106",
    "5ae327c886f7745c7b3f2f3f",
    "5ae3280386f7742a41359364",
    "5b47749f86f7746c5d6a5fd4",
    "5b47799d86f7746c5d6a5fd8",
    "5b477b6f86f7747290681823",
    "5b477f7686f7744d1b23c4d2",
    "5b47825886f77468074618d3",
    "639872f9decada40426d3447",
    "639872fa9b4fb827b200d8e5",
    "639872fc93ae507d5858c3a6",
    "639872fe8871e1272b10ccf6",
    "639873003693c63d86328f25",
    "63987301e11ec11ff5504036",
    "64f83bb69878a0569d6ecfbe",
    "64f83bcdde58fc437700d8fa",
    "64f83bd983cfca080a362c82",
    "66a74c628410476dd65543be"]

const conditionIds = [
    "674edda814bb8b0f1e436d52",
    "674edda8ee8909ad6d03cc19",
    "674edda8a09bb652ac3b3ec1",
    "674edda8ba3c68e59dc27c3e",
    "674edda828869673473c457c",
    "674edda8621c9952477ea762",
    "674edda834f997088d34a854",
    "674edda8bf84e021f94b8294",
    "674eebb3e91e188c7bae652a",
    "674eebb3d121170265945033",
    "674eebb31a49f1417d4df589",
    "674eebb3f97fe8f63b1f0f24",
    "674eebb38b387995daf4855d",
    "674eebb3013712612a9cdb32",
    "674eebb3cf57009996305583",
    "674eebb30f35249a89b96da2",
    "674eed6cd6aad7371ad660eb",
    "674eed6c79fe953320837f01",
    "674eed6c1db9059a22fb936d",
    "674eed6cfaa234e1ae8c2088",
    "674eed6caddee2696a6bde01",
    "674eed6cd3e8b1235145ca2d",
    "674eed6c867c452a3d47b41a",
    "674eed6cf2e9e899610f3a4b",
    "674eeef58cebccbb9c6fe341",
    "674eeef5a27dc7a83712e432",
    "674eeef57518cfe511ff6cfe"
]

class Mod implements IPostDBLoadMod {

    public postDBLoad(container: DependencyContainer): void {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const log = (msg: string) => logger.info(`[QuestAdjustments] ${msg}`);

        // get database from server
        const databaseService = container.resolve<DatabaseService>("DatabaseService");
        const tables = databaseService.getTables()
        const locales = tables.locales.global;
        const quests = tables.templates.quests;

        log("Adjusting quest conditions for kills, handover/FIR, leaveAt, and sell.");
        for (const quest of Object.values(quests)) {
            for (const condition of Object.values<IQuestCondition>(quest.conditions.AvailableForFinish)) {
                switch (condition.conditionType) {
                    case conditionType.Counter:
                        condition.value = Math.ceil(<number>condition.value * CONFIG.task_weight.counter);
                        break;
                    case conditionType.Find:
                    case conditionType.Handover:
                        condition.value = Math.ceil(<number>condition.value * CONFIG.task_weight.find_handover);
                        break;
                    case conditionType.LeaveAt:
                        condition.value = Math.ceil(<number>condition.value * CONFIG.task_weight.leave_at);
                        break;
                    case conditionType.Sell:
                        condition.value = Math.ceil(<number>condition.value * CONFIG.task_weight.sell);
                        break;
                }
            }
        }

        if (CONFIG.gunsmith_kills.enabled) {
            log("Adjusting coniditions for Gunsmith.")

            const gunsmithQuests = (CONFIG.gunsmith_kills.replace_task) ? GSQuestsKills : GSQuests;
            const gunsmithKillCount = CONFIG.gunsmith_kills.kills

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
