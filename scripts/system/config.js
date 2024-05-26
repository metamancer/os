export class OsConfig {
	challenge_types = [
		"asset",
		"attacker",
		"barrier-hazard",
		"countdown",
		"mystery",
		"pursuer",
		"target",
		"temptation",
		"watcher",
	];

	effects = {
		"Os.effects.category-target": {
			attack: {
				description: "Os.effects.attack.description",
				action: "Os.effects.attack.action",
				cost: "Os.effects.attack.cost",
				icon: "fas fa-swords",
			},
			disrupt: {
				description: "Os.effects.disrupt.description",
				action: "Os.effects.disrupt.action",
				cost: "Os.effects.disrupt.cost",
				icon: "fas fa-ban",
			},
			influence: {
				description: "Os.effects.influence.description",
				action: "Os.effects.influence.action",
				cost: "Os.effects.influence.cost",
				icon: "fas fa-hand-paper",
			},
			weaken: {
				description: "Os.effects.weaken.description",
				action: "Os.effects.weaken.action",
				cost: "Os.effects.weaken.cost",
				icon: "fas fa-dizzy",
			},
		},
		"Os.effects.category-ally": {
			bestow: {
				description: "Os.effects.bestow.description",
				action: "Os.effects.bestow.action",
				cost: "Os.effects.bestow.cost",
				icon: "fas fa-gift",
			},
			enhance: {
				description: "Os.effects.enhance.description",
				action: "Os.effects.enhance.action",
				cost: "Os.effects.enhance.cost",
				icon: "fas fa-bolt",
			},
			create: {
				description: "Os.effects.create.description",
				action: "Os.effects.create.action",
				cost: "Os.effects.create.cost",
				icon: "fas fa-tags",
			},
			restore: {
				description: "Os.effects.restore.description",
				action: "Os.effects.restore.action",
				cost: "Os.effects.restore.cost",
				icon: "fas fa-heart",
			},
		},
		"Os.effects.category-process": {
			advance: {
				description: "Os.effects.advance.description",
				action: "Os.effects.advance.action",
				cost: "Os.effects.advance.cost",
				icon: "fas fa-arrow-right",
			},
			set_back: {
				description: "Os.effects.set_back.description",
				action: "Os.effects.set_back.action",
				cost: "Os.effects.set_back.cost",
				icon: "fas fa-arrow-left",
			},
		},
		"Os.effects.category-other": {
			discover: {
				description: "Os.effects.discover.description",
				action: "Os.effects.discover.action",
				cost: "Os.effects.discover.cost",
				icon: "fas fa-search",
			},
			extra_feat: {
				description: "Os.effects.extra_feat.description",
				action: "Os.effects.extra_feat.action",
				cost: "Os.effects.extra_feat.cost",
				icon: "fas fa-plus",
			},
		},
	};

	theme_levels = {
		self: [
			"affiliation",
			"assets",
			"expertise",
			"horizon",
			"personality",
			"troubled-past",
		],
		noise: [
			"augmentation",
			"cutting-edge",
			"cyberspace",
			"drones",
		],
		mythos: [
			"artifact",
			"companion",
			"esoterica",
			"exposure",
		],
		crew: [
			"crew",
		],
		loadout: [
			"loadout",
		],
	};

	/* TO DO: essence theme specials */
	theme_essence = {
		essence: [
			"nexus",
			"spirtualist",
			"cyborg",
			"transhuman",
			"punk",
			"avatar",
			"conduit",
			"singularity",
			"custom",
		],
	};

	theme_src = {
		self: "systems/os/assets/media/self",
		noise: "systems/os/assets/media/noise",
		mythos: "systems/os/assets/media/mythos",
		crew: "systems/os/assets/media/crew",
		loadout: "systems/os/assets/media/loadout",
	};

	tagStringRe = /(?!\b|\s)(?:\[|\{)([^\d\[\]{}]+)(?:[\s\-\:](\d+))?(?:\}|\])/gi;
	sceneLinkRe = /@ActivateScene\[([^\]]+)\](?:\{([^\}]+)\})?/gi;

	static createConfig() {
		return new OsConfig();
	}
}
