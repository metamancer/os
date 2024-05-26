export class OsSettings {
	static register() {
		game.settings.register("os", "storytags", {
			name: "Story Tags",
			hint: "Tags that are shared between all users.",
			scope: "world",
			config: false,
			type: Object,
			default: {
				tags: [],
				actors: [],
			},
		});
		game.settings.register("os", "show_tag_window_on_load", {
			name: "Os.ui.show-tag-window-on-load",
			hint: "Os.ui.show-tag-window-on-load-hint",
			scope: "client",
			config: true,
			type: Boolean,
			default: true,
		});
		game.settings.register("os", "skip_roll_moderation", {
			name: "Os.settings.skip-roll-moderation",
			hint: "Os.settings.skip-roll-moderation-hint",
			scope: "client",
			config: true,
			type: Boolean,
			default: false,
		});
	}
}
