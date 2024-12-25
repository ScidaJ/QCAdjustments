import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { IQuestCondition } from "@spt/models/eft/common/tables/IQuest";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILogger } from "@spt/models/spt/utils/ILogger";

import CONFIG from "../config/config.json";
import GSConditionIds from "../data/Gunsmith_condition_ids.json";
import { CreateGunsmithCondition } from "./utils/gunsmithQuestConditionFactory";

enum ConditionType {
  Counter = "CounterCreator",
  Find = "FindItem",
  Handover = "HandoverItem",
  LeaveAt = "LeaveItemAtLocation",
  Sell = "SellItemToTrader",
}
class QuestConditionAdjuster implements IPostDBLoadMod {
  private readonly DEFAULT_TASK_MULTIPLIER = 0.5;
  private readonly DEFAULT_GUNSMITH_KILLS = 10;

  public postDBLoad(container: DependencyContainer): void {
    // Log init
    const logger = container.resolve<ILogger>("WinstonLogger");
    const log = (msg: string) => logger.info(`[QCAdjustments] ${msg}`);

    // Db init
    const databaseService =
      container.resolve<DatabaseService>("DatabaseService");
    const quests = databaseService.getTables().templates.quests;

    // Config init
    const multipliers = {
      [ConditionType.Counter]:
        CONFIG.task_multipliers.counter > 0
          ? CONFIG.task_multipliers.counter
          : this.DEFAULT_TASK_MULTIPLIER,
      [ConditionType.Find]:
        CONFIG.task_multipliers.find_handover > 0
          ? CONFIG.task_multipliers.find_handover
          : this.DEFAULT_TASK_MULTIPLIER,
      [ConditionType.Handover]:
        CONFIG.task_multipliers.find_handover > 0
          ? CONFIG.task_multipliers.find_handover
          : this.DEFAULT_TASK_MULTIPLIER,
      [ConditionType.LeaveAt]:
        CONFIG.task_multipliers.leave_at > 0
          ? CONFIG.task_multipliers.leave_at
          : this.DEFAULT_TASK_MULTIPLIER,
      [ConditionType.Sell]:
        CONFIG.task_multipliers.sell > 0
          ? CONFIG.task_multipliers.sell
          : this.DEFAULT_TASK_MULTIPLIER,
    };
    const gunsmithKillCount =
      CONFIG.gunsmith_kills.kills > 0
        ? CONFIG.gunsmith_kills.kills
        : this.DEFAULT_GUNSMITH_KILLS;
    const replaceTask = CONFIG.gunsmith_kills.replace_task ?? false;
    const questBlacklist = CONFIG.quest_blacklist ?? [];
    const timer = CONFIG.task_multipliers.timer ?? 0.5;

    // Quest condition loop
    log(
      "Adjusting quest conditions for kills, handover/FIR, leaveAt, and sell.",
    );
    for (const quest of Object.values(quests)) {
      if (questBlacklist.includes(quest.QuestName)) {
        log("Skipping " + quest.QuestName);
        continue;
      }
      for (const condition of Object.values<IQuestCondition>(
        quest.conditions.AvailableForFinish,
      )) {
        this.adjustQuestCondition(condition, multipliers);
        this.adjustQuestPlacementTimer(condition, timer);
      }
    }

    // Gunsmith changes
    if (CONFIG.gunsmith_kills.enabled) {
      log("Adjusting Gunsmith conditions.");
      for (const questId in GSConditionIds) {
        const quest = <IQuest>quests[questId];
        let newConditions: IQuestCondition[] = [];
        if (questBlacklist.includes(quest.QuestName)) {
          log("Skipping " + quest.QuestName);
          continue;
        }
        for (const [
          index,
          condition,
        ] of quest.conditions.AvailableForFinish.entries()) {
          const weapon =
            typeof condition.target === "string"
              ? condition.target
              : condition.target[0];
          newConditions.push(
            CreateGunsmithCondition(
              GSConditionIds[quest._id][index],
              weapon,
              gunsmithKillCount,
            ),
          );
        }
        if (!replaceTask)
          newConditions = [
            ...quest.conditions.AvailableForFinish,
            ...newConditions,
          ];
        quest.conditions.AvailableForFinish = newConditions;
      }
      log(`${replaceTask ? "Replaced" : "Added"} Gunsmith conditions.`);
    }
    log("Adjusted quest conditions.");
  }

  private adjustQuestCondition(
    condition: IQuestCondition,
    multipliers: { [key in ConditionType]?: number },
  ): void {
    const multiplier = multipliers[condition.conditionType];
    if (typeof condition.value === "number" && multiplier) {
      condition.value = Math.ceil(condition.value * multiplier);
    }
  }

  private adjustQuestPlacementTimer(
    condition: IQuestCondition,
    multiplier: number,
  ): void {
    if (condition.plantTime && typeof condition.plantTime === "number") {
      condition.plantTime = Math.ceil(condition.plantTime * multiplier);
    }
  }
}

export const mod = new QuestConditionAdjuster();
