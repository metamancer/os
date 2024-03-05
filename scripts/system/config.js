export class OsConfig {
	effects = {
		"Os.effects.category-target": {
			attack: {
				description: "Os.effects.attack.description",
				action: "Os.effects.attack.action",
				cost: "Os.effects.attack.cost",
			},
			disrupt: {
				description: "Os.effects.disrupt.description",
				action: "Os.effects.disrupt.action",
				cost: "Os.effects.disrupt.cost",
			},
			influence: {
				description: "Os.effects.influence.description",
				action: "Os.effects.influence.action",
				cost: "Os.effects.influence.cost",
			},
			weaken: {
				description: "Os.effects.weaken.description",
				action: "Os.effects.weaken.action",
				cost: "Os.effects.weaken.cost",
			},
		},
		"Os.effects.category-ally": {
			bestow: {
				description: "Os.effects.bestow.description",
				action: "Os.effects.bestow.action",
				cost: "Os.effects.bestow.cost",
			},
			enhance: {
				description: "Os.effects.enhance.description",
				action: "Os.effects.enhance.action",
				cost: "Os.effects.enhance.cost",
			},
			create: {
				description: "Os.effects.create.description",
				action: "Os.effects.create.action",
				cost: "Os.effects.create.cost",
			},
			restore: {
				description: "Os.effects.restore.description",
				action: "Os.effects.restore.action",
				cost: "Os.effects.restore.cost",
			},
		},
		"Os.effects.category-process": {
			advance: {
				description: "Os.effects.advance.description",
				action: "Os.effects.advance.action",
				cost: "Os.effects.advance.cost",
			},
			set_back: {
				description: "Os.effects.set_back.description",
				action: "Os.effects.set_back.action",
				cost: "Os.effects.set_back.cost",
			},
		},
		"Os.effects.category-consequence": {
			mitigate: {
				description: "Os.effects.mitigate.description",
				action: "Os.effects.mitigate.action",
				cost: "Os.effects.mitigate.cost",
			},
		},
	};

	additionalEffects = {
		discover: {
			description: "Os.additionalEffects.discover.description",
			action: "Os.additionalEffects.discover.action",
			cost: "Os.additionalEffects.discover.cost",
		},
		extra_feat: {
			description: "Os.additionalEffects.extra_feat.description",
			action: "Os.additionalEffects.extra_feat.action",
			cost: "Os.additionalEffects.extra_feat.cost",
		},
	}

	tagStringRe = /\[([^\d\]]+)(?:[\s-\:](\d+))?\]/gi;
	sceneLinkRe = /@ActivateScene\[([^\]]+)\](?:\{([^\}]+)\})?/gi;

	static createConfig() {
		return new OsConfig();
	}
}
