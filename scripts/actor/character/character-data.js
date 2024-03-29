import { error } from "../../logger.js";
export class CharacterData extends foundry.abstract.DataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const data = game.os.data;
		return {
			note: new fields.HTMLField(),
			backpack: new fields.ArrayField(
				new fields.EmbeddedDataField(data.TagData),
			),
		};
	}

	get allTags() {
		const backpack = this.backpack;
		const themeTags = this.parent.items
			.filter((item) => item.type === "theme")
			.flatMap((item) => item.system.allTags);
		return [...backpack, ...themeTags];
	}

	get powerTags() {
		return this.allTags.filter(
			(tag) => tag.type === "powerTag" || tag.type === "themeTag" || tag.type === "backpack",
		);
	}

	get weaknessTags() {
		return this.parent.items
			.filter((item) => item.type === "theme")
			.flatMap((item) => item.system.weakness);
	}

	get availablePowerTags() {
		const backpack = this.backpack.filter(
			(tag) => tag.isActive && !tag.isBurnt,
		);
		const themeTags = this.parent.items
			.filter((item) => item.type === "theme")
			.flatMap((item) => item.system.availablePowerTags);
		return [...backpack, ...themeTags];
	}
	async prepareDerivedData() {
		// Make sure only four themes are present
		const themes = this.parent.items.filter((item) => item.type === "theme");
		if (themes.length > 4) {
			error("Too many themes found, attempting to resolve...");
			console.error(`Too many themes found for: ${this.parent._id}`, themes);
			const toDelete = themes.slice(4);
			await this.parent.deleteEmbeddedDocuments("Item", toDelete.map((item) => item._id));
		}

		// Validate unique data ids
		// Get duplicates
		const duplicates = this.allTags
			.map((tag) => tag.id)
			.filter((id, index, arr) => arr.indexOf(id) !== index);
		if (!duplicates.length) return;
		error("Duplicate tag IDs found, attempting to resolve...");
		console.error(`Duplicate tag IDs found for: ${this.parent._id}`, duplicates)

		// try to fix duplicates
		const tags = this.allTags;
		for (const tag of tags) {
			if (duplicates.includes(tag.id)) {
				tag.id = randomID();
			}
		}
	}
}
