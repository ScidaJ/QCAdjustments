using System.Text.Json.Serialization;

namespace QCAdjustments;

public record Constants
{
    public enum ConditionTypes
    {
        CounterCreator,
        FindItem,
        HandoverItem,
        LeaveItemAtLocation,
        SellItemToTrader
    }
    
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum Targets
    {
        Any,
        AnyPmc,
        Bear,
        Savage,
        Usec
    }
    
    public record Config
    {
        [JsonPropertyName("kill_targets")]
        public required TargetsConfig KillTargets { get; set; }
    
        [JsonPropertyName("multipliers")]
        public required MultipliersConfig Multipliers { get; set; }
    
        [JsonPropertyName("gunsmith")]
        public required GunsmithConfig Gunsmith { get; set; }

        [JsonPropertyName("quest_blacklist")]
        public IReadOnlyList<string> QuestBlacklist { get; set; } = new List<string>();
    }

    public record TargetsConfig
    {
        [JsonPropertyName("any")]
        public Targets Any { get; set; } = Targets.Any;
    
        [JsonPropertyName("any_pmc")]
        public Targets AnyPmc { get; set; } = Targets.AnyPmc;
    
        [JsonPropertyName("bear")]
        public Targets Bear { get; set; } = Targets.Bear;
    
        [JsonPropertyName("scav")]
        public Targets Scavs { get; set; } = Targets.Savage;
    
        [JsonPropertyName("usec")]
        public Targets Usec { get; set; } = Targets.Usec;
    }

    public record MultipliersConfig
    {
        [JsonPropertyName("counter")]
        public double Counter { get; set; } = 0.5;
    
        [JsonPropertyName("find_handover")]
        public double FindHandover { get; set; } = 0.5;
    
        [JsonPropertyName("leave_at")]
        public double LeaveAt { get; set; } = 0.5;
    
        [JsonPropertyName("sell")]
        public double Sell { get; set; } = 0.5;
    
        [JsonPropertyName("timer")]
        public double Timer { get; set; } = 0.5;
    
        [JsonPropertyName("xp")]
        public double Xp { get; set; } = 1.0;
    }

    public record GunsmithConfig
    {
        [JsonPropertyName("enabled")]
        public bool Enabled { get; set; } = false;
    
        [JsonPropertyName("replace_tasks")]
        public bool ReplaceTask { get; set; } = false;
    
        [JsonPropertyName("kills")]
        public int Kills { get; set; } = 10;
    }
}