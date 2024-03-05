import { info } from "../logger.js";

export class Fonts {
	static register() {
		info("Registering Fonts...");
		FontConfig.loadFont("Saira", {
			editor: true,
			fonts: [
				{
					name: "Saira",
					urls: ["systems/os/assets/fonts/saira.otf"],
					sizeAdjust: "110%"
				},
				{
					name: "Saira",
					urls: ["systems/os/assets/fonts/saira-b.otf"],
					weight: "bold",
					sizeAdjust: "110%"
				},
				{
					name: "Saira",
					urls: ["systems/os/assets/fonts/saira-i.otf"],
					style: "italic",
					sizeAdjust: "110%"
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
