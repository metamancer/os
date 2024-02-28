import { info } from "../logger.js";
import { sleep, localize as t } from "../utils.js";

export class OsHooks {
	static register() {
		info("Registering Hooks...");
		OsHooks.#addRollButtonAbovePlayerConfig();
		OsHooks.#addImportToActorSidebar();
		OsHooks.#iconOnlyHeaderButtons();
		OsHooks.#safeUpdateActorSheet();
		OsHooks.#safeUpdateItemSheet();
		OsHooks.#replaceLoadSpinner();
		OsHooks.#renderChallengeCardFixes();
		OsHooks.#prepareCharacterOnCreate();
		OsHooks.#prepareThemeOnCreate();
		OsHooks.#rendeWelcomeScreen();
	}

	static #iconOnlyHeaderButtons() {
		// Abstracted function to replace header buttons
		const replaceHeaderButton = (html, action, icon, label) =>
			html.find(`.${action}`)?.replaceWith(`
				<a class="header-button control ${action}" aria-label="${label}" data-tooltip="${label}">
				<i class="${icon}"></i></a>
				`);

		const buttons = [
			{ action: "configure-sheet", icon: "fas fa-cog", label: t("Configure") },
			{
				action: "configure-token",
				icon: "fas fa-user-circle",
				label: t("TOKEN.Title"),
			},
			{
				action: "share-image",
				icon: "fas fa-eye",
				label: t("JOURNAL.ActionShow"),
			},
			{ action: "close", icon: "fas fa-times", label: t("Close") },
		];

		for (const hook of [
			"renderItemSheet",
			"renderActorSheet",
			"renderJournalSheet",
			"renderApplication",
		]) {
			Hooks.on(hook, (_app, html) => {
				for (const { action, icon, label } of buttons)
					replaceHeaderButton(html, action, icon, label);

				// Add the document ID link to the header if it's not already there
				if (hook === "renderActorSheet" || hook === "renderItemSheet") {
					html
						.find(".window-title>.document-id-link")
						.prependTo(html.find(".window-header"));
				}
			});
		}
	}

	static #safeUpdateActorSheet() {
		Hooks.on("preUpdateActor", (_, data) => {
			const { schema: tagSchema } = game.os.data.TagData;
			const { system = {} } = data;
			if (!("Loadout" in system) || !system.Loadout.length) return;

			const { Loadout } = system;
			const validationErrors = Loadout
				.map((item) =>
					tagSchema.validate(item, { strict: true, partial: false }),
				)
				.filter(Boolean);

			if (validationErrors.length) {
				ui.notifications.error("Os.ui.error-validating-actor", {
					localize: true,
				});
				return false;
			}
		});
	}

	static #safeUpdateItemSheet() {
		Hooks.on("preUpdateItem", (_, data) => {
			const { schema: tagSchema } = game.os.data.TagData;
			const { system = {} } = data;
			if (!("powerTags" in system) || !("weaknessTags" in system)) return;

			const { powerTags = [], weaknessTags = [] } = system;
			const validationErrors = [...powerTags, ...weaknessTags]
				.map((item) =>
					tagSchema.validate(item, { strict: true, partial: false }),
				)
				.filter(Boolean);

			if (validationErrors.length) {
				ui.notifications.error("Os.ui.error-validating-item", {
					localize: true,
				});
				return false;
			}
		});
	}

	static #addRollButtonAbovePlayerConfig() {
		const app = $(`
		<button id="os--roll-button" aria-label="${t(
			"Os.ui.roll-title",
		)}" data-tooltip="${t("Os.ui.roll-title")}">
			<img src="systems/os/assets/media/dice.webp" alt="Two Acorns" />
		</button>`).click(() => {
			if (!game.user.character)
				return ui.notifications.warn(t("Os.ui.warn-no-character"));
			const actor = game.user.character;
			game.os.OsRollDialog.create(
				actor._id,
				actor.system.availablePowerTags,
				actor.system.weaknessTags,
			);
		});
		$("#players").before(app);
	}

	static #addImportToActorSidebar() {
		Hooks.on("renderSidebarTab", (app, html) => {
			if (app.id !== "actors") return;
			const button = $(
				`<button class="os--import-actor" data-tooltip="${t(
					"Os.ui.import-actor",
				)}" aria-label="${t(
					"Os.ui.import-actor",
				)}"><i class="fas fa-file-import"></i></button>`,
			);
			button.on("click", () => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = ".json";
				input.onchange = async (event) => {
					const file = event.target.files[0];
					const data = await file.text();
					const actorData = JSON.parse(data);
					await game.os.importCharacter(actorData);
				};
				input.click();
			});
			html.find(".directory-footer").append(button);
		});
	}

	static #replaceLoadSpinner() {
		Hooks.on("renderPause", (_, html) => {
			html.find("img").attr("src", "systems/os/assets/media/disk.webp").css({
				opacity: 0.3,
			});
		});
	}

	static #renderChallengeCardFixes() {
		Hooks.on("renderActorSheet", (app, html) => {
			if (!app.actor || app.actor.type !== "challenge") return;

			// Fix the height of the challenge sheet
			app._element[0].style.height = "auto";

			// Replace default image
			const img = html.find("img");
			if (img.attr("src") === "icons/svg/mystery-man.svg")
				img.attr("src", "systems/os/assets/media/challenge-placeholder.webp");

			// Add a context menu to the avatar
			html.find("form").contextmenu(async (event) => {
				event.preventDefault();
				const name = await Dialog.prompt({
					title: t("Os.ui.rename-challenge"),
					content: `
						<div class="os--rename-dialog">
							<label for="name">${t("Name")}</label>
							<input type="text" id="name" value="${app.actor.name}" required>
						</div>
					`,
					label: t("Os.ui.rename"),
					callback: (html) => html.find("input").val(),
					options: { width: 200 },
				});
				if (!name) return;
				app.actor.update({ name });
			});
		});
	}

	static #prepareCharacterOnCreate() {
		Hooks.on("preCreateActor", (actor, data) => {
			if (data.type !== "character") return;

			const prototypeToken = {
				sight: { enabled: true },
				actorLink: true,
				disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
				texture: { src: "/icons/svg/target.svg" },
			};
			const img = "icons/svg/target.svg";
			actor.updateSource({ prototypeToken, img });
		});

		Hooks.on("createActor", async (actor) => {
			if (actor.type !== "character") return;

			for (const item of Array(4).fill()) {
				console.log("Creating theme", item)
				await actor.createEmbeddedDocuments("Item", [
					{
						name: "New Theme",
						type: "theme",
					},
				]);
			}
		});
	}

	static #prepareThemeOnCreate() {
		Hooks.on("preCreateItem", (item, data) => {
			if (data.type !== "theme") return;

			const img = "systems/os/assets/media/note.webp";
			const powerTags = Array(5)
				.fill()
				.map((_, i) => ({
					name: "Name your tag",
					type: "powerTag",
					isActive: i < 2,
					isBurnt: false,
					id: randomID(),
				}));
			const weaknessTags = [
				{
					name: "Name your Weakness",
					type: "weaknessTag",
					isActive: true,
					isBurnt: false,
					id: randomID(),
				}
			];
			item.updateSource({ img, system: { powerTags, weaknessTags } });
		});
	}

	static #rendeWelcomeScreen() {
		Hooks.once("ready", async () => {
			let scene = game.scenes.getName("Otherscape");
			if (scene) return;

			ui.sidebar.activateTab("actors");

			scene = await Scene.create({
				name: "Otherscape",
				permission: { default: 2 },
				navigation: true,
				background: {
					src: "systems/os/assets/media/os_splash.webp",
				},
				width: 1920,
				height: 1080,
				initial: {
					x: 1660,
					y: 840,
					scale: 0.6,
				},
				backgroundColor: "#000000",
				grid: {
					type: 0,
				},
				tokenVision: false,
				fogExploration: false,
				globalLight: false,
			});

			const { thumb } = await scene.createThumbnail();
			await scene.update({ thumb });

			const entry = await JournalEntry.create({
				name: "Otherscape",
				permission: { default: 2 },
				content: `
					<h1 style="text-align:center"><span style="font-family: Brownland">Welcome!</span></h1>
					<p></p>
					<p style="text-align: center"><span style="font-family: Isotonic"><em><strong>I am thrilled to have you try out
													this system!</strong></em></span></p>
					<blockquote style="padding:0.5em 10px;background:var(--os-color-primary-bg);color:var(--os-color-weakness)">
							<p><span style="font-family: Isotonic"><strong>Please be aware that both the system is still undergoing development by the publisher, Son of Oak —and— the supported Foundry implementation is still under heavy development. As such, there might be breaking bugs or major changes down the road.</strong></span></p>
							<p><br><span style="font-family: Brownland">PLEASE MAKE FREQUENT BACKUPS</span></p>
					</blockquote>
					<p></p>
					<h3>Bugs & Features</h3>
					<p>The system is under active development. Please report any bugs and make feature requests on <a href="https://github.com/metamancer/os/issues/new/choose">Github</a></p>
				`,
			});

			ChatMessage.create({
				title: "Welcome to Otherscape",
				content: `
				<p><strong>Welcome to Otherscape</strong></p>
				<p>Before you start playing, you might want to read the <a class="content-link" draggable="true" data-uuid="JournalEntry.QVA4cPjUWlDPMR8F.JournalEntryPage.5AWCygW0BCFdk4sd" data-id="5AWCygW0BCFdk4sd" data-type="JournalEntryPage" data-tooltip="Text Page"><i class="fas fa-file-lines"></i>Otherscape</a> journal entry. It contains some important information about the system and what to expect.</p>
				<p>Good luck and have fun!</p>
			`,
			});

			await sleep(300);
			await scene.activate();
			await sleep(300);
			entry.sheet.render(true, {
				collapsed: true,
				width: 600,
				height: 600,
			});
		});
	}
}
