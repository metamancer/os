import { info } from "../logger.js";

export class Fonts {
	static register() {
		info("Registering Fonts...");
		FontConfig.loadFont("OS Dice", {
			fonts: [
				{
					name: "OS Dice",
					urls: ["systems/os/assets/fonts/os-dice.otf"],
				},
			],
		});
		FontConfig.loadFont("Saira Semi", {
			editor: true,
			fonts: [
				{
					name: "Saira Semi",
					urls: ["systems/os/assets/fonts/saira-sc.otf"],
					weight: "300 800",
				},
				{
					name: "Saira Semi",
					urls: ["systems/os/assets/fonts/saira-sc-i.otf"],
					style: "italic",
					weight: "300 800",
				},
			],
		});
		FontConfig.loadFont("Saira Italic", {
			editor: true,
			fonts: [
				{
					name: "Saira Italic",
					urls: ["systems/os/assets/fonts/saira-i.otf"],
				},
			],
		});
		FontConfig.loadFont("Saira Condensed", {
			editor: true,
			fonts: [
				{
					name: "Saira Condensed",
					urls: ["systems/os/assets/fonts/saira-condensed.otf"],
				},
				{
					name: "Saira Condensed",
					urls: ["systems/os/assets/fonts/saira-condensed-sb.otf"],
					weight: "bold",
				},
			],
		});
		FontConfig.loadFont("Bebas Neue", {
			editor: true,
			fonts: [
				{
					name: "Bebas Neue",
					urls: ["systems/os/assets/fonts/bebasneue.ttf"],
					sizeAdjust: "110%",
				},
			],
		});
	}
}
