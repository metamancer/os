export class CharacterData extends foundry.abstract.DataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const data = game.os.data;
		return {
			note: new fields.HTMLField(),
			Loadout: new fields.ArrayField(
				new fields.EmbeddedDataField(data.TagData),
			),
		};
	}

	get allTags() {
		const Loadout = this.Loadout;
		const themeTags = this.parent.items
			.filter((item) => item.type === "theme")
			.flatMap((item) => item.system.allTags);
		return [...Loadout, ...themeTags];
	}

	get powerTags() {
		return this.allTags.filter(
			(tag) => tag.type === "powerTag" || tag.type === "themeTag" || tag.type === "Loadout",
		);
	}

	get weaknessTags() {
		return this.parent.items
			.filter((item) => item.type === "theme")
			.flatMap((item) => item.system.weakness);
	}

	get availablePowerTags() {
		const Loadout = this.Loadout.filter(
			(tag) => tag.isActive && !tag.isBurnt,
		);
		const themeTags = this.parent.items
			.filter((item) => item.type === "theme")
			.flatMap((item) => item.system.availablePowerTags);
		return [...Loadout, ...themeTags];
	}
}
