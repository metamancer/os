export class OsSettings {
	static register() {
		game.settings.register("os", "storytags", {
			name: "Story Tags",
			hint: "Tags that are shared between all users.",
			scope: "world",
			config: false,
			type: Object,
			default: {},
		});
	}
}
