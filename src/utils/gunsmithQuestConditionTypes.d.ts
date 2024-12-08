interface Condition {
	id: string;
}

interface Counter {
	id: string;
	conditions: Condition[]
}

export interface GunsmithQuestCondition {
	id: string;
	counter: Counter
}