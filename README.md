# QCAdjustments

I was getting a little annoyed at how grindy some of the quests in Tarkov were so decided to adjust the target amounts of some of them. This mod affects all quests with conditions of `CounterCreator`, `FindItem`, `HandoverItem`, `LeaveItemAtLocation`, and `SellItemToTrader`, as well as including the ability to adjust the Gunsmith quest conditions. The lowest value that this mod will go is 1, so it will not remove quest conditions, simply make them easier(or harder) to complete.

## Installing

Pick up the latest release and extract it into your SPT directory.

## CONFIG

A breakdown of the config values.

### Kill Targets

This section allows you to change the targets for kill quests. It will not target any quests involving Rogues, Raiders, or Scav Bosses. The default values will retain vanilla kill targets on quests. Note: This will **NOT** change the task text. If you change all Bear quests to Any, the task will still say Bear PMCs, but any kill will count. As an aside that has made testing this very difficult, so please let me know of any issues you find and I will do my best to solve them as quickly as possible.

`any` Default: Any
`any_pmc` Default: AnyPmc
`bear` Default: Bear
`scavs` Default: Savage
`usec` Default: Usec

### Task Multipliers

This section adjusts the total amounts of the quest conditions. Most are self-explanatory but descriptions are left in for clarity. Lower is easier.

`counter` Default: 0.5 - Any quest condition that count your progress towards something with an action(i.e. shot, shot on body location, kill at location, etc., etc.,).  
`find_handover` Default: 0.5 - Any quest condition that involves finding items in raid and handing them over.  
`leave_at` Default: 0.5 - Any quest condition that involves you "stashing" an item at a location.  
`sell` Default: 0.5 - Any quest condition that involves you selling an item to a trader.  
`timer` Default: 0.5 - Reduces the "stash" timer for `leave_at` quests.  
`xp` Default: 1.0 - XP Reward multiplier from quests

### Gunsmith

This section has to do with the Gunsmith quests, adjusting them to also require kills with that weapon. Also offers replacing the `Hand In` quest condition with the kill requirement. Kill task is attachment agnostic.

`enabled` Default: false - Enables the gunsmith adjustments.  
`replace_task` Default: false - Replaces the `handover` quest condition with kill counter.  
`kills` Default: 10 - The number of kills the Gunsmith quest condition will have. Not affected by the above weights.

### Quest Blacklist(Optional)

`quest_blacklist` Default: [] - A list of quest names to skip when making changes to the quest conditions.

Example

```json
"quest_blacklist": [
    "Regulated Materials",
    "Gunsmith - Part 3"
]
```
