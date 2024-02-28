import { importCharacter } from "./scripts/apps/import-character.js";
import { TagData } from "./scripts/data/abstract.js";
import { CharacterData } from "./scripts/actor/character/character-data.js";
import { CharacterSheet } from "./scripts/actor/character/character-sheet.js";
import { ChallengeSheet } from "./scripts/actor/challenge/challenge-sheet.js";
import { ThemeData } from "./scripts/item/theme-data.js";
import { ThemeSheet } from "./scripts/item/theme-sheet.js";
import {
	HandlebarsHelpers,
	HandlebarsPartials,
} from "./scripts/system/handlebars.js";
import { info, success } from "./scripts/logger.js";
import { Fonts } from "./scripts/system/fonts.js";
import { OsHooks } from "./scripts/system/hooks.js";
import { OsRoll } from "./scripts/apps/roll.js";
import { OsRollDialog } from "./scripts/apps/roll-dialog.js";
import { OsConfig } from "./scripts/system/config.js";

// Set the logo to the OS logo
$("#logo")[0].src = "systems/os/assets/media/logo.webp";

Hooks.once("init", () => {
	info("Initializing Otherscape...");
	game.os = {
		config: OsConfig.createConfig(),
		data: {
			TagData,
		},
		importCharacter,
		OsRollDialog,
		OsRoll,
	};

	info("Initializing Config...");
	CONFIG.Actor.dataModels.character = CharacterData;
	CONFIG.Dice.rolls.push(OsRoll);
	CONFIG.Item.dataModels.theme = ThemeData;
	CONFIG.os = game.os.config;

	info("Registering Sheets...");
	Actors.unregisterSheet("core", ActorSheet);
	Actors.registerSheet("os", CharacterSheet, {
		types: ["character"],
		makeDefault: true,
	});
	Actors.registerSheet("os", ChallengeSheet, {
		types: ["challenge"],
		makeDefault: true,
	});
	Items.unregisterSheet("core", ItemSheet);
	Items.registerSheet("os", ThemeSheet, {
		types: ["theme"],
		makeDefault: true,
	});

	HandlebarsHelpers.register();
	HandlebarsPartials.register();
	Fonts.register();
	OsHooks.register();

	success("Successfully initialized Otherscape!");
});
