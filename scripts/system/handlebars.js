import { info } from "../logger.js";

export class HandlebarsHelpers {
	static register() {
		info("Registering Handlebars Helpers...");

		Handlebars.registerHelper(
			"progress-buttons",
			function (current, max, block) {
				let acc = "";
				for (let i = 0; i < max; ++i) {
					block.data.index = i;
					block.data.checked = i < current;
					acc += block.fn(this);
				}
				return acc;
			},
		);

		Handlebars.registerHelper(
			"titlecase",
			(string) => string.charAt(0).toUpperCase() + string.slice(1),
		);

		Handlebars.registerHelper("tagActiveString", (tag, readonly) =>
			tag.isActive
				? "Os.tags.isActive"
				: readonly
					? "Os.tags.isInactive"
					: "Os.tags.activate",
		);
	}
}

export class HandlebarsPartials {
	static partials = [
		"systems/os/templates/apps/roll-dialog.html",
		"systems/os/templates/apps/story-tags.html",
		"systems/os/templates/chat/message.html",
		"systems/os/templates/chat/message-tooltip.html",
		"systems/os/templates/item/theme-ro.html",
		"systems/os/templates/partials/tag.html",
	];

	static register() {
		info("Registering Handlebars Partials...");
		loadTemplates(HandlebarsPartials.partials);
	}
}
