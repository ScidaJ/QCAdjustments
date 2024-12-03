# QCAdjustments

I was getting a little annoyed at how grindy some of the quests in Tarkov were so decided to adjust the target amounts of some of them. This mod affects all quests with conditions of `CounterCreator`, `FindItem`, `HandoverItem`, `LeaveItemAtLocation`, and `SellItemToTrader`, as well as including the ability to adjust the Gunsmith quest conditions. The lowest value that this mod will go is 1, so it will not remove quest conditions, simply make them easier(or harder) to complete.

## Installing

Pick up the latest release and extract it into your SPT directory.

## CONFIG

A breakdown of the config values.

### Task Weights

This section adjusts the total amounts of the quest conditions. Most are self-explanatory but descriptions are left in for clarity. Lower is easier.

`counter` Default: 0.5 - Any quest condition that count your progress towards something with an action(i.e. shot, shot on body location, kill at location, etc., etc.,).  
`find_handover` Default: 0.5 - Any quest condition that involves finding items in raid and handing them over.  
`leave_at` Default: 0.5 - Any quest condition that involves you "stashing" an item at a location.  
`sell` Default: 0.5 - Any quest condition that involves you selling an item to a trader.  

### Gunsmith

This section has to do with the Gunsmith quests, adjusting them to also require kills with that weapon. Also offers replacing the `Hand In` quest condition with the kill requirement. Kill task is attachment agnostic.

`enabled` Default: false - Enables the gunsmith adjustments.  
`replace_task` Default: false - Replaces the `handover` quest condition with kill counter.  
`kills` Default: 10 - The number of kills the Gunsmith quest condition will have. Not affected by the above weights.  
