import { localize as t } from "../utils.js";

export class KeyBindings {
	static register() {
		game.keybindings.register("os", "openDiceRoller", {
			name: t("Os.ui.dice-roller"),
			hint: t("Os.ui.dice-roller-hint"),
			editable: [
				{
					key: "KeyR",
				},
			],
			onDown: () => {
				const sheet = game.user.character?.sheet;
				if (!sheet)
					return ui.notifications.warn("Os.ui.warn-no-character", {
						localize: true,
					});
				return sheet.renderRollDialog({ toggle: true });
			},
			onUp: () => { },
			restricted: false,
			precedence: CONST.KEYBINDING_PRECEDENCE.PRIORITY,
		});
	}
}
