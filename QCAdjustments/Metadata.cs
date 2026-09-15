using SPTarkov.Server.Core.Models.Spt.Mod;
using Range = SemanticVersioning.Range;
using Version = SemanticVersioning.Version;

namespace QCAdjustments;

public record ModMetadata : IModMetadata
{
    public string ModGuid { get; init; } = "com.rootsnine.qcadjustments";
    public string Name { get; init; } = "QCAdjustments";
    public string Author { get; init; } = "RootsNine";
    public List<string>? Contributors { get; init; }
    public Version Version { get; init; } = new("5.0.0");
    public Range SptVersion { get; init; } = new("~4.1.0");
    public List<string>? Incompatibilities { get; init; }
    public Dictionary<string, Range>? ModDependencies { get; init; }
    public string? Url { get; init; }
    public bool HasPrepatcher { get; init; }
    public string License { get; init; } = "Creative Commons BY-NC-SA 4.0";
}
