import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { IQuest } from "@spt/models/eft/common/tables/IQuest";
import { IReward } from "@spt/models/eft/common/tables/IReward";
import { IQuestCondition } from "@spt/models/eft/common/tables/IQuest";
import { DatabaseService } from "@spt/services/DatabaseService";
import { ILogger } from "@spt/models/spt/utils/ILogger";

import config from "../config/config.json";
import GSConditionIds from "../data/Gunsmith_condition_ids.json";
import { CreateGunsmithCondition } from "./utils/gunsmithQuestConditionFactory";
import { RewardType } from "@spt/models/enums/RewardType";
import { log } from "winston";

enum ConditionType {
  COUNTER = "CounterCreator",
  FIND = "FindItem",
  HANDOVER = "HandoverItem",
  LEAVEAT = "LeaveItemAtLocation",
  SELL = "SellItemToTrader",
}

enum KillTargets {
  ANY = "Any",
  ANYPMC = "AnyPmc",
  BEAR = "Bear",
  SAVAGE = "Savage",
  USEC = "Usec",
}

class QuestConditionAdjuster implements IPostDBLoadMod {
  private readonly defaultTaskMultiplier = 0.5;
  private readonly defaultGunsmithKills = 10;

  public postDBLoad(container: DependencyContainer): void {
    // Log init
    const logger = container.resolve<ILogger>("WinstonLogger");
    const log = (msg: string) => logger.info(`[QCAdjustments] ${msg}`);

    // Db init
    const databaseService =
      container.resolve<DatabaseService>("DatabaseService");
    const quests = databaseService.getTables().templates.quests;

    // Config init
    const targets = {
      [KillTargets.ANY]: Object.values<string>(KillTargets).includes(
        config.kill_targets.any,
      )
        ? config.kill_targets.any
        : KillTargets.ANY,
      [KillTargets.ANYPMC]: Object.values<string>(KillTargets).includes(
        config.kill_targets.any_pmc,
      )
        ? config.kill_targets.any_pmc
        : KillTargets.ANYPMC,
      [KillTargets.BEAR]: Object.values<string>(KillTargets).includes(
        config.kill_targets.bear,
      )
        ? config.kill_targets.bear
        : KillTargets.BEAR,
      [KillTargets.SAVAGE]: Object.values<string>(KillTargets).includes(
        config.kill_targets.scavs,
      )
        ? config.kill_targets.scavs
        : KillTargets.SAVAGE,
      [KillTargets.USEC]: Object.values<string>(KillTargets).includes(
        config.kill_targets.usec,
      )
        ? config.kill_targets.usec
        : KillTargets.USEC,
    };
    const multipliers = {
      [ConditionType.COUNTER]:
        config.task_multipliers.counter > 0
          ? config.task_multipliers.counter
          : this.defaultTaskMultiplier,
      [ConditionType.FIND]:
        config.task_multipliers.find_handover > 0
          ? config.task_multipliers.find_handover
          : this.defaultTaskMultiplier,
      [ConditionType.HANDOVER]:
        config.task_multipliers.find_handover > 0
          ? config.task_multipliers.find_handover
          : this.defaultTaskMultiplier,
      [ConditionType.LEAVEAT]:
        config.task_multipliers.leave_at > 0
          ? config.task_multipliers.leave_at
          : this.defaultTaskMultiplier,
      [ConditionType.SELL]:
        config.task_multipliers.sell > 0
          ? config.task_multipliers.sell
          : this.defaultTaskMultiplier,
    };
    const gunsmithKillCount =
      config.gunsmith_kills.kills > 0
        ? config.gunsmith_kills.kills
        : this.defaultGunsmithKills;
    const replaceTask = config.gunsmith_kills.replace_task ?? false;
    const questBlacklist = config.quest_blacklist ?? [];
    const timer = config.task_multipliers.timer ?? 0.5;
    const xpMultiplier = config.task_multipliers.xp ?? 1.0;

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
        this.adjustQuestKillTarget(condition, targets);
        this.adjustQuestPlacementTimer(condition, timer);
      }

      for (const reward of Object.values<IReward>(quest.rewards.Success)) {
        this.adjustQuestXPReward(reward, xpMultiplier);
      }
    }

    // Gunsmith changes
    if (config.gunsmith_kills.enabled) {
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
    if (
      typeof condition.value === "number" &&
      multiplier &&
      condition.value !== 1
    ) {
      condition.value = Math.ceil(condition.value * multiplier);
    }
  }

  private adjustQuestKillTarget(
    condition: IQuestCondition,
    targets: { [key in KillTargets]?: string },
  ): void {
    if (condition.conditionType === ConditionType.COUNTER) {
      condition.counter.conditions.forEach((condition) => {
        if (
          condition.savageRole !== undefined &&
          condition.savageRole.length === 0 &&
          typeof condition.target === "string"
        ) {
          const target = targets[condition.target];
          condition.target = target;
        }
      });
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

  private adjustQuestXPReward(reward: IReward, multiplier: number): void {
    if (
      reward.type === RewardType.EXPERIENCE &&
      reward.value &&
      typeof reward.value === "number"
    ) {
      reward.value = Math.ceil(reward.value * multiplier);
    }
  }
}

export const mod = new QuestConditionAdjuster();
