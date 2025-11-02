using SPTarkov.Server.Core.Models.Common;

namespace QCAdjustments;

public record GunsmithQuestUtils
{
    public record QuestReference
    {
        public required MongoId Id { get; init; }
        public required Counter Counter { get; init; }
    }

    public record Counter
    {
        public required string Id { get; init; }
        public required List<Condition> Conditions { get; init; }
    }

    public record Condition
    {
        public required MongoId Id { get; init; }
    }

    public static readonly Dictionary<MongoId, List<QuestReference>> GunsmithQuests = new()
    {
        [QuestTpl.GUNSMITH_PART_1] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda814bb8b0f1e436d52"),
                Counter = new Counter
                {
                    Id = "674edda8462f104170c6eb2b",
                    Conditions = [
                        new Condition { Id = new MongoId("674edda842247bd34cc3877f")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_2] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda8ee8909ad6d03cc19"),
                Counter = new Counter
                {
                    Id = "674edda88720bbc76e1ae4f7",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda8bf68483db837adee")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_3] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda8a09bb652ac3b3ec1"),
                Counter = new Counter
                {
                    Id = "674edda8e6564ec6ba3a16e3",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda84569f9246072dc89")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_16] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda8ba3c68e59dc27c3e"),
                Counter = new Counter
                {
                    Id = "674edda866dc96b9ab6a48ea",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda8eb9313d02c17d1d0")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_13] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda828869673473c457c"),
                Counter = new Counter
                {
                    Id = "674edda81398f2798ef45225",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda80f6d7944386a556d")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_7] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda8621c9952477ea762"),
                Counter = new Counter
                {
                    Id = "674edda8b0fb2e1a45c30708",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda869d5978899670c88")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_5] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda834f997088d34a854"),
                Counter = new Counter
                {
                    Id = "674edda8e4d789a497cd6d54",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda8b04ef4ed74993156")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_6] =
        {
            new QuestReference
            {
                Id = new MongoId("674edda8bf84e021f94b8294"),
                Counter = new Counter
                {
                    Id = "674edda8f353614b2447b8d8",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674edda85a1ab41cd28a97d6")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_8] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb3e91e188c7bae652a"),
                Counter = new Counter
                {
                    Id = "674eebb39521e620e345ca20",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb30b9d9c02fb7041a2")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_10] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb3d121170265945033"),
                Counter = new Counter
                {
                    Id = "674eebb3378e90be789d51e8",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb3ebac9fd681f84ebf")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_15] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb31a49f1417d4df589"),
                Counter = new Counter
                {
                    Id = "674eebb390f0ac0d66b7582b",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb30b7b6adfe8d59e87")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_17] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb3f97fe8f63b1f0f24"),
                Counter = new Counter
                {
                    Id = "674eebb380b8464dd9ba8df9",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb305908de2b284a754")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_12] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb38b387995daf4855d"),
                Counter = new Counter
                {
                    Id = "674eebb36280b3b6682e68ce",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb3b913345150864de7")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_18] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb3013712612a9cdb32"),
                Counter = new Counter
                {
                    Id = "674eebb36543389d2d10f295",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb39158b03972890a29")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_20] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb3cf57009996305583"),
                Counter = new Counter
                {
                    Id = "674eebb336f29c40bb2a7f1e",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb3f2c0156a0587350b")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_22] =
        {
            new QuestReference
            {
                Id = new MongoId("674eebb30f35249a89b96da2"),
                Counter = new Counter
                {
                    Id = "674eebb32d05f176ba0c0b67",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eebb3dbe70589c28d2cca")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_4] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6cd6aad7371ad660eb"),
                Counter = new Counter
                {
                    Id = "674eed6c1177061160da10c8",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6cdf3f817bf25299b7")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_9] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6c79fe953320837f01"),
                Counter = new Counter
                {
                    Id = "674eed6c0500584525eff8c3",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6cc9d65be1c49d66fe")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_11] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6c1db9059a22fb936d"),
                Counter = new Counter
                {
                    Id = "674eed6c1a074a1c38626899",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6c7ca0dc2b2772de1b")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_14] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6cfaa234e1ae8c2088"),
                Counter = new Counter
                {
                    Id = "674eed6c81dfa59c5e43ac42",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6c4b3b11c20effd9e9")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_19] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6caddee2696a6bde01"),
                Counter = new Counter
                {
                    Id = "674eed6c0cceebb465ae8d74",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6ce756c92aa0f3818d")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_21] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6cd3e8b1235145ca2d"),
                Counter = new Counter
                {
                    Id = "674eed6cb02480beb198494e",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6cd08fe1be1e4d0cd8")}
                    ]
                }
            },
            new QuestReference
            {
                Id = new MongoId("674eed6c867c452a3d47b41a"),
                Counter = new Counter
                {
                    Id = "674eed6cfdd19eee60612c54",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6c9d7afe12ec86519c")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_23] =
        {
            new QuestReference
            {
                Id = new MongoId("674eed6cf2e9e899610f3a4b"),
                Counter = new Counter
                {
                    Id = "674eed6cff2445cb1b9b7742",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eed6ce391735ad888f355")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_24] =
        {
            new QuestReference
            {
                Id = new MongoId("674eeef58cebccbb9c6fe341"),
                Counter = new Counter
                {
                    Id = "674eeef51ec88dbb316bc9e0",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eeef5e60b536338cbcf4a")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_PART_25] =
        {
            new QuestReference
            {
                Id = new MongoId("674eeef5a27dc7a83712e432"),
                Counter = new Counter
                {
                    Id = "674eeef594912506fb5fd36a",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eeef5a834d0f29f66a4ed")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_SPECIAL_ORDER] =
        {
            new QuestReference
            {
                Id = new MongoId("674eeef57518cfe511ff6cfe"),
                Counter = new Counter
                {
                    Id = "674eeef55e9266f510e75a5c",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("674eeef5450a1e0c45e3df0e")}
                    ]
                }
            }
        },
        [QuestTpl.GUNSMITH_OLD_FRIENDS_REQUEST] =
        {
            new QuestReference
            {
                Id = new MongoId("67e3fe48cdc07470b520d2da"),
                Counter = new Counter
                {
                    Id = "67e3fe56d2934e0ede9644a3",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("67e3fe5d13242276bf916a2f")}
                    ]
                }
            },
            new QuestReference
            {
                Id = new MongoId("67e3fe6c65a9e5289df541a1"),
                Counter = new Counter
                {
                    Id = "67e3fe7faef36f956a63babe",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("67e3fe85bec5d5840676f5a6")}
                    ]
                }
            },
            new QuestReference
            {
                Id = new MongoId("67e3fe7af305e7f303957cf2"),
                Counter = new Counter
                {
                    Id = "67e3fe8a6000a9e5aa463935",
                    Conditions =
                    [
                        new Condition { Id = new MongoId("67e3fe9006d8676c24947796")}
                    ]
                }
            }
        }
    };
}
