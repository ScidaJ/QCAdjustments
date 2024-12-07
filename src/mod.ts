import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { IQuestCondition } from "@spt/models/eft/common/tables/IQuest";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILogger } from "@spt/models/spt/utils/ILogger";

import CONFIG from "../config/config.json";
import GSConditionIds from "../data/Gunsmith_condition_ids.json"
import { CreateGunsmithCondition } from "./utils/gunsmithQuestConditionFactory";

enum ConditionType {
  Counter = "CounterCreator",
  Find = "FindItem",
  Handover = "HandoverItem",
  LeaveAt = "LeaveItemAtLocation",
  Sell = "SellItemToTrader",

}
class QuestConditionAdjuster implements IPostDBLoadMod {
  private readonly DEFAULT_TASK_WEIGHT = 0.5;
  private readonly DEFAULT_GUNSMITH_KILLS = 10;

  public postDBLoad(container: DependencyContainer): void {
    // Log init
    const logger = container.resolve<ILogger>("WinstonLogger");
    const log = (msg: string) => logger.info(`[QCAdjustments] ${msg}`);

    // Db init
    const databaseService = container.resolve<DatabaseService>("DatabaseService");
    const quests = databaseService.getTables().templates.quests;

    // Config init
    const weights = {
      [ConditionType.Counter]: (CONFIG.task_weight.counter > 0) ? CONFIG.task_weight.counter : this.DEFAULT_TASK_WEIGHT,
      [ConditionType.Find]: (CONFIG.task_weight.find_handover > 0) ? CONFIG.task_weight.find_handover : this.DEFAULT_TASK_WEIGHT,
      [ConditionType.Handover]: (CONFIG.task_weight.find_handover > 0) ? CONFIG.task_weight.find_handover : this.DEFAULT_TASK_WEIGHT,
      [ConditionType.LeaveAt]: (CONFIG.task_weight.leave_at > 0) ? CONFIG.task_weight.leave_at : this.DEFAULT_TASK_WEIGHT,
      [ConditionType.Sell]: (CONFIG.task_weight.sell > 0) ? CONFIG.task_weight.sell : this.DEFAULT_TASK_WEIGHT
    }
    const replaceTask = CONFIG.gunsmith_kills.replace_task ?? false;

    log("Adjusting quest conditions for kills, handover/FIR, leaveAt, and sell.");
    for (const quest of Object.values(quests)) {
      for (const condition of Object.values<IQuestCondition>(quest.conditions.AvailableForFinish)) {
        this.adjustQuestCondition(condition, weights);
      }
    }

    if (CONFIG.gunsmith_kills.enabled) {
      log("Adjusting Gunsmith conditions.");
      const gunsmithKillCount = (CONFIG.gunsmith_kills.kills > 0) ? CONFIG.gunsmith_kills.kills : this.DEFAULT_GUNSMITH_KILLS;

      for (const questId in GSConditionIds) {
        let quest = <IQuest>quests[questId];
        let newConditions: IQuestCondition[] = [];
        for (const [index, condition] of quest.conditions.AvailableForFinish.entries()) {
          let target = (typeof condition.target === 'string') ? condition.target : condition.target[0];
          newConditions.push(CreateGunsmithCondition(GSConditionIds[quest._id][index], target, gunsmithKillCount));
        }
        if (replaceTask) {
          quest.conditions.AvailableForFinish = newConditions;
        } else {
          quest.conditions.AvailableForFinish = [...quest.conditions.AvailableForFinish, ...newConditions];
        }
      }
      if (replaceTask) {
        log("Replaced Gunsmith conditions.")
      } else {
        log("Added Gunsmith conditions.")
      }
    }

    log("Adjusted quest conditions.")

  }

  private adjustQuestCondition(condition: IQuestCondition, weights: { [key in ConditionType]?: number }): void {
    const weight = weights[condition.conditionType];
    if (typeof condition.value === "number" && weight) {
      condition.value = Math.ceil(condition.value * weight);
    }
  }
}

export const mod = new QuestConditionAdjuster();
