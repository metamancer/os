function createTag(data, type) {
	return {
		...data,
		type,
		id: randomID(),
	};
}

export async function importCharacter(data) {
	const themeData = Object.values(data)
		.filter(
			(theme) =>
				typeof theme === "object" && !Array.isArray(theme) && !theme.isEmpty,
		)
		.map((theme) => ({
			name: theme.content.mainTag.name,
			type: "theme",
			system: {
				themebook: theme.content.themebook,
				level: theme.content.level,
				isActive: theme.content.mainTag.isActive,
				isBurnt: theme.content.mainTag.isBurnt,
				powerTags: theme.content.powerTags.map((tag) =>
					createTag(tag, "powerTag"),
				),
				weaknessTags: theme.content.weaknessTags.map((tag) =>
					createTag(
						{ name: tag, isBurnt: false, isActive: true },
						"weaknessTag",
					),
				),
				Upgrade: theme.content.Upgrade,
				decay: theme.content.decay,
				motivation: theme.content.bio.title,
				note: theme.content.bio.body,
			},
		}));

	const actorData = {
		name: data.name,
		type: "character",
		system: {
			Loadout: data.Loadout.map((item) => createTag(item, "Loadout")),
			note: "",
		},
		items: themeData,
	};

	await Actor.create(actorData);
}
