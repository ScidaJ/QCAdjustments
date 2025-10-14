using System.Reflection;
using SPTarkov.DI.Annotations;
using SPTarkov.Server.Core.DI;
using SPTarkov.Server.Core.Helpers;
using SPTarkov.Server.Core.Models.Common;
using SPTarkov.Server.Core.Models.Eft.Common.Tables;
using SPTarkov.Server.Core.Models.Spt.Mod;
using SPTarkov.Server.Core.Models.Utils;
using SPTarkov.Server.Core.Servers;
using SPTarkov.Server.Core.Utils.Json;
using Range = SemanticVersioning.Range;
using Version = SemanticVersioning.Version;

namespace QCAdjustments;

public record ModMetadata : AbstractModMetadata
{
    public override string ModGuid { get; init; } = "com.rootsnine.QCAdjustments";
    public override string Name { get; init; } = "QCAdjustments";
    public override string Author { get; init; } = "RootsNine";
    public override List<string>? Contributors { get; init; }
    public override Version Version { get; init; } = new("4.0.0");
    public override Range SptVersion { get; init; } = new("~4.0.0");


    public override List<string>? Incompatibilities { get; init; }
    public override Dictionary<string, Range>? ModDependencies { get; init; }
    public override string? Url { get; init; }
    public override bool? IsBundleMod { get; init; }
    public override string License { get; init; } = "MIT";
}

[Injectable(TypePriority = OnLoadOrder.PostSptModLoader + 1)]
public class QCAdjustments(
    DatabaseServer databaseServer,
    ISptLogger<QCAdjustments> logger,
    ModHelper modHelper) : IOnLoad
{
    private Constants.Config? _config;
    private Dictionary<MongoId, Quest>? _questsDb;

    public Task OnLoad()
    {
        var pathToMod = modHelper.GetAbsolutePathToModFolder(Assembly.GetExecutingAssembly());
        try
        {
            _config = modHelper.GetJsonDataFromFile<Constants.Config>(pathToMod, "Config.json");
        }
        catch (Exception e)
        {
            logger.Error(e.Message);
            return Task.CompletedTask;
        }

        _questsDb = databaseServer.GetTables().Templates.Quests;

        logger.Info("Beginning quest adjustments");
        if (_config.Gunsmith.Enabled)
        {
            logger.Info("Beginning Gunsmith adjustments");
        }

        foreach (var questObject in _questsDb)
        {
            string questId = questObject.Key.ToString();
            Quest quest = questObject.Value;
            
            if (_config.QuestBlacklist.Contains(quest.QuestName))
            {
                logger.Info("Skipping quest adjustment for " + quest.QuestName);
                continue;
            }

            if (quest.Conditions.AvailableForFinish is not null)
            {
                foreach (var questCondition in quest.Conditions.AvailableForFinish)
                {
                    MultipliersAdjustments(questCondition, _config.Multipliers, logger);
                    KillTargetAdjustments(questCondition, _config.KillTargets, logger);
                }
                if 
                    (_config.Gunsmith.Enabled)
                {
                    if (GunsmithQuestUtils.GunsmithQuests.ContainsKey(questId))
                    {
                        GunsmithAdjustments(quest, questId, _config.Gunsmith.ReplaceTask, _config.Gunsmith.Kills, logger);
                    }
                }
            }
        }

        logger.Success("Finished quest adjustments");
        if (_config.Gunsmith.Enabled)
        {
            logger.Success("Finished Gunsmith adjustments");
        }

        return Task.CompletedTask;
    }

    private static void GunsmithAdjustments(Quest quest, string questId, bool replaceTask, int kills,
        ISptLogger<QCAdjustments> logger)
    {
        var conditions = quest.Conditions.AvailableForFinish;

        if (conditions is null)
        {
            return;
        }

        var questConditions = new List<QuestCondition>();
        var conditionCounter = 0;
        foreach (var condition in conditions)
        {
            var currCondition = GunsmithQuestUtils.GunsmithQuests[questId][conditionCounter];
            var taskWeapon = new HashSet<string>();
            
            if (condition.Target is { List: not null, IsList: true })
            {
                taskWeapon.Add(condition.Target.List[0]);
            }
            else if (condition.Target is { Item: not null, IsItem: true })
            {
                taskWeapon.Add(condition.Target.Item);
            }

            questConditions.Add(new QuestCondition
            {
                Id = currCondition.Id,
                ConditionType = "CounterCreator",
                Counter = new QuestConditionCounter
                {
                    Id = currCondition.Counter.Id,
                    Conditions =
                    [
                        new QuestConditionCounterCondition
                        {
                            Id = currCondition.Counter.Conditions[0].Id,
                            CompareMethod = ">=",
                            ConditionType = "Kills",
                            DynamicLocale = true,
                            ResetOnSessionEnd = false,
                            Target = new ListOrT<string>(null, "Any"),
                            Value = 1,
                            Weapon = taskWeapon
                        }
                    ]
                },
                DynamicLocale = true,
                Type = "Elimination",
                Value = kills
            });
            conditionCounter++;
        }

        if (replaceTask)
        {
            conditions.Clear();
        }
        
        conditions.AddRange(questConditions);
        quest.Conditions.AvailableForFinish = conditions;
    }

    private static void KillTargetAdjustments(QuestCondition quest, Constants.TargetsConfig targets, ISptLogger<QCAdjustments> logger)
    {
        // Quest type check
        if (quest.ConditionType != nameof(Constants.ConditionTypes.CounterCreator))
        {
            return;
        }

        // Null check
        if (quest.Counter?.Conditions is null)
        {
            return;
        }

        foreach (var condition in quest.Counter.Conditions)
        {
            // Matching target to enum.
            if (Enum.TryParse<Constants.Targets>(condition.Target?.Item, true, out var killTargets))
            {
                // Finding target
                var t = killTargets switch
                {
                    Constants.Targets.Any => targets.Any.ToString(),
                    Constants.Targets.AnyPmc => targets.AnyPmc.ToString(),
                    Constants.Targets.Bear => targets.Bear.ToString(),
                    Constants.Targets.Savage => targets.Scavs.ToString(),
                    Constants.Targets.Usec => targets.Usec.ToString(),
                    _ => "Any"
                };

                // Changing Target
                condition.Target = new ListOrT<string>(null, t);
            }
        }
    }

    private static void MultipliersAdjustments(QuestCondition condition, Constants.MultipliersConfig multipliers,
        ISptLogger<QCAdjustments> logger)
    {
        // Matching condition type to enum.
        if (Enum.TryParse<Constants.ConditionTypes>(condition.ConditionType, true, out var conditionType))
        {
            // Finding multiplier
            var multiplier = conditionType switch
            {
                Constants.ConditionTypes.CounterCreator => multipliers.Counter,
                Constants.ConditionTypes.FindItem => multipliers.FindHandover,
                Constants.ConditionTypes.HandoverItem => multipliers.FindHandover,
                Constants.ConditionTypes.LeaveItemAtLocation => multipliers.LeaveAt,
                Constants.ConditionTypes.SellItemToTrader => multipliers.Sell,
                _ => 1.0
            };
                
            // Applying multiplier
            if (condition.Value is double d and > 1.0)
            {
                d *= multiplier;
                condition.Value = Math.Ceiling(d);
            }
        }
    }
}
