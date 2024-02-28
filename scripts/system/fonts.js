import { info } from "../logger.js";

export class Fonts {
	static register() {
		info("Registering Fonts...");
		FontConfig.loadFont("Isotonic", {
			editor: true,
			fonts: [
				{
					name: "Isotonic",
					urls: ["systems/os/assets/fonts/isotonic.otf"],
				},
				{
					name: "Isotonic",
					urls: ["systems/os/assets/fonts/isotonic-s-b.otf"],
					weight: "bold",
				},
				{
					name: "Isotonic",
					urls: ["systems/os/assets/fonts/isotonic-i.otf"],
					style: "italic",
				},
			],
		});
		FontConfig.loadFont("IsotonicMedI", {
			editor: true,
			fonts: [
				{
					name: "IsotonicMedI",
					urls: ["systems/os/assets/fonts/isontonic-m-i.otf"],
				},
			],
		});
		FontConfig.loadFont("Brownland", {
			editor: true,
			fonts: [
				{
					name: "Brownland",
					urls: ["systems/os/assets/fonts/brownland.otf"],
				},
				{
					name: "Brownland",
					urls: ["systems/os/assets/fonts/brownland.otf"],
					weight: "bold",
				},
			],
		});
	}
}
