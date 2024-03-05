export class StoryTagApp extends FormApplication {
	static get defaultOptions() {
		return mergeObject(super.defaultOptions, {
			classes: ["os", "os--story-tags"],
			template: "systems/os/templates/apps/story-tags.html",
			width: 500,
			height: 600,
			resizable: true,

		});
	}

	async getData() {
		return {
			tags: game.settings.get("os", "storytags"),
		};
	}

	async _updateObject(event, formData) {
		await game.settings.set("os", "storytags", formData);
	}
}
