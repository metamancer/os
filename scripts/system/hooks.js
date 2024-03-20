import { info } from "../logger.js";
import { sleep, localize as t } from "../utils.js";

export class OsHooks {
	static register() {
		info("Registering Hooks...");
		OsHooks.#addImportToActorSidebar();
		OsHooks.#iconOnlyHeaderButtons();
		OsHooks.#safeUpdateItemSheet();
		OsHooks.#replaceLoadSpinner();
		OsHooks.#attachContextMenuToRollMessage();
		OsHooks.#prepareCharacterOnCreate();
		OsHooks.#prepareThemeOnCreate();
		OsHooks.#listenToContentLinks();
		OsHooks.#customizeDiceSoNice();
		OsHooks.#renderStoryTagApp();
		OsHooks.#repositionStoryTagApp();
		OsHooks.#popOutCompatiblity();
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
					html.find(".window-title>.document-id-link").prependTo(html.find(".window-header"));
				}
			});
		}
	}

	static #safeUpdateItemSheet() {
		Hooks.on("preUpdateItem", (_, data) => {
			const { schema: tagSchema } = game.os.data.TagData;
			const { system = {} } = data;

			const { powerTags = [], weaknessTags = [], contents = [] } = system;
			const toValidate = [...powerTags, ...weaknessTags, ...contents];
			if (!toValidate.length) return;

			const validationErrors = toValidate
				.map((item) => tagSchema.validate(item, { strict: true, partial: false }))
				.filter(Boolean);

			if (validationErrors.length) {
				ui.notifications.error("Os.ui.error-validating-item", {
					localize: true,
				});
				return false;
			}
		});
	}

	static #addImportToActorSidebar() {
		Hooks.on("renderSidebarTab", (app, html) => {
			if (app.id !== "actors") return;
			const button = $(
				`<button class="os--import-actor" data-tooltip="${t(
					"Os.ui.import-actor"
				)}" aria-label="${t("Os.ui.import-actor")}"><i class="fas fa-file-import"></i></button>`
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
			html
				.find("img")
				.attr("src", "systems/os/assets/media/loading.webp")
				.removeAttr("class");
		});
	}

	static #attachContextMenuToRollMessage() {
		Hooks.on("getChatLogEntryContext", (_, options) => {
			const { discover, extra_feat } = CONFIG.os.additionalEffects;
			const isEffectRoll = (li) => li.find(".dice-effect").length;
			options.unshift(
				{
					name: `${t("Os.effects.category-other")}: ${t("Os.additionalEffects.discover.key")}`,
					icon: '<i class="fas fa-magnifying-glass"></i>',
					condition: isEffectRoll,
					callback: () => {
						ChatMessage.create({
							content: `<div class="os dice-roll">
							<div class="dice-flavor">${t("Os.additionalEffects.discover.key")}</div>
							<div class="dice-effect">
								<p><em>${t(discover.description)}</em></p>
								<p>${t(discover.action)}</p>
								<p><strong>${t("Os.other.cost")}:</strong> ${t(discover.cost)}</p>
							</div>
					</div>
						`,
						});
					},
				},
				{
					name: `${t("Os.effects.category-other")}: ${t(
						"Os.additionalEffects.extra_feat.key"
					)}`,
					icon: '<i class="fas fa-plus"></i>',
					condition: isEffectRoll,
					callback: () => {
						ChatMessage.create({
							content: `
						<div class="os dice-roll">
							<div class="dice-flavor">${t("Os.additionalEffects.extra_feat.key")}</div>
							<div class="dice-effect">
								<p><em>${t(extra_feat.description)}</em></p>
								<p><strong>${t("Os.other.cost")}:</strong> ${t(extra_feat.cost)}</p>
							</div>
						</div>
						`,
						});
					},
				}
			);
		});
	}

	static #prepareCharacterOnCreate() {
		Hooks.on("preCreateActor", (actor, data) => {
			const isCharacter = data.type === "character";
			const hasImage = actor.img !== "icons/svg/mystery-man.svg";

			const base = "icons/svg/";
			let img = base;
			switch (true) {
				case hasImage:
					img = actor.img;
					break;
				case !hasImage && isCharacter:
					img += "target.svg";
					break;
				case !hasImage && data.type === "challenge":
					img += "skull.svg";
					break;
				default:
					img = "icons/svg/mystery-man.svg";
			}

			const prototypeToken = isCharacter
				? {
					sight: { enabled: true },
					actorLink: true,
					disposition: CONST.TOKEN_DISPOSITIONS.FRIENDLY,
					texture: { src: img },
				}
				: null;
			actor.updateSource({ prototypeToken, img });
		});

		Hooks.on("createActor", async (actor) => {
			if (actor.type !== "character") return;

			const missingThemes = 4 - actor.items.filter((it) => it.type === "theme").length;

			await Promise.all(
				Array(missingThemes)
					.fill()
					.map(async (_, i) => {
						await actor.createEmbeddedDocuments("Item", [
							{
								name: `${t("TYPES.Item.theme")} ${i + 1}`,
								type: "theme",
							},
						]);
					})
			);
			const backpack = actor.items.find((it) => it.type === "backpack");
			if (!backpack) {
				await actor.createEmbeddedDocuments("Item", [
					{
						name: t("TYPES.Item.backpack"),
						type: "backpack",
					},
				]);
			}
		});
	}

	static #prepareThemeOnCreate() {
		Hooks.on("preCreateItem", (item, data) => {
			if (item.img !== "icons/svg/item-bag.svg") return;

			const base = "systems/os/assets/media/icons/";
			let img = base;
			switch (data.type) {
				case "theme":
					img += "unfurled-scroll.svg";
					break;
				case "threat":
					img += "cracked-skull.svg";
					break;
				case "backpack":
					img += "backpack.svg";
					break;
				default:
					img = "icons/svg/item-bag.svg";
			}
			item.updateSource({ img });
		});
	}

	static #renderStoryTagApp() {
		const app = new game.os.StoryTagApp();
		game.os.storyTags = app;

		Hooks.once("renderSidebar", async (_app, html) => {
			const container = $(`<div class="os--sidebar-buttons-container"></div>`);

			const rollButton = $(`
		<button aria-label="${t("Os.ui.roll-title")}" data-tooltip="${t("Os.ui.roll-title")}">
			<i class="fas fa-dice"></i>
		</button>`).on("click", () => {
				if (!game.user.character) return ui.notifications.warn(t("Os.ui.warn-no-character"));
				const actor = game.user.character;
				game.os.OsRollDialog.create(
					actor._id,
					actor.system.availablePowerTags,
					actor.system.weaknessTags
				);
			});

			const storyTagsButton = $(`
			<button type="button" data-tooltip="${t("Os.tags.story", "Os.other.tags")}" aria-label="${t(
				"Os.tags.story",
				"Os.other.tags"
			)}">
			<i class="fas fa-tags"></i>
			</button>`).on("click", () => {
				if (!app.rendered) {
					app.render(true);
					setTimeout(() => container.addClass("active"));
				}
				app.element.toggle(130, () => container.toggleClass("active", app.element.is(":visible")));
			});

			app.render(true);
			setTimeout(() => container.addClass("active"));

			container.append(storyTagsButton, rollButton);
			html.before(container);
		});
	}

	static #repositionStoryTagApp() {
		Hooks.on("collapseSidebar", (_app, collapsed) => {
			if (collapsed) game.os.storyTags.setPosition({ left: window.innerWidth - 337 });
			else game.os.storyTags.setPosition({ left: window.innerWidth - 605 });
		});
	}

	static #listenToContentLinks() {
		Hooks.on("renderJournalSheet", (_app, html) => {
			html.on("click", ".content-link", (event) => {
				const { id, type } = event.currentTarget.dataset;
				if (type !== "ActivateScene") return;

				event.preventDefault();
				event.stopPropagation();

				const scene = game.scenes.get(id);
				if (!scene) return;
				scene.view();
			});
		});
	}

	static #customizeDiceSoNice() {
		Hooks.on("diceSoNiceReady", (dice3d) => {
			dice3d.addSystem({ id: "os", name: ":Otherscape" }, "preferred");
			dice3d.addDicePreset(
				{
					type: "d6",
					labels: ["1", "2", "3", "4", "5", "F", "1", "2", "3", "4", "5", "F"],
					font: "OS Dice",
					system: "os",
				},
				"d12"
			);

			/* RED/PURPLE/GREEN/BLUE */
			dice3d.addColorset(
				{
					name: "os",
					description: ":Otherscape Default",
					category: ":Otherscape",
					foreground: ["#ffffff", "#ffffff", "#000000", "#000000"],
					background: ["#C61749", "#7c37d2", "#C6FF00", "#04b7d3"],
					outline: ["#FF1446", "#9742FF", "#EEFFB2", "#00F9FF"], 
					texture: "",
					material: "chrome",
					font: "Saira",
					visibility: "visible",
				},
				"preferred"
			);
		});
	}

	static #popOutCompatiblity() {
		Hooks.on("PopOut:loaded", (app) => {
			app._element.addClass("os--popout");
		});

		Hooks.on("PopOut:popin", (app) => {
			app._element.removeClass("os--popout");
		});
	}

	static #rendeWelcomeScreen() {
		Hooks.once("ready", async () => {
			let scene = game.scenes.getName(":Otherscape");
			if (scene) return;

			ui.sidebar.activateTab("actors");

			scene = await Scene.create({
				name: ":Otherscape",
				permission: { default: 2 },
				navigation: true,
				background: {
					src: "systems/os/assets/media/splash.webp",
				},
				width: 1920,
				height: 1080,
				initial: {
					x: 1669,
					y: 853,
					scale: 0.7,
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
				name: ":Otherscape",
				permission: { default: 2 },
				content: /*html */ `
					<h1 style="text-align:center"><span style="font-family: Bebas Neue">Well, hello there…</span></h1>
					<p>Thank you for testing this system in Alpha!</p>
					<blockquote style="padding:0.5em 10px;color:var(--os-color-self)">
						<p><em>Be aware that both the system—and game—are under heavy development. There will be frequent changes and updates that can result in game breaking bugs.</em></p>
						<p><em><strong><br>PLEASE MAKE FREQUENT BACKUPS!</strong></em></p>
					</blockquote>
					<p></p>
					<h2><span style="font-family: Bebas Neue">What to expect</span></h2>
					<p>This version is still feature limited.</p>
					<p>There may be bugs and unexpected behaviors.</p>
					<p>Things may change once the official rulebook is published.</p>
					<p></p>
					<h2><span style="font-family: Bebas Neue">upcoming features/improvements</span></h2>
					<p>The system is under active development. The following is a list of planned features/improvements, in no particular order:</p>
					<ul>
						<li>
							<p><span style="font-family: Bebas Neue">Story Tags & Statuses:</span> Improved handling and interactions. <span style="font-family: 'Saira Semi', 'Saira Condensed', sans-serif">Many small improvements to the tag/status systems, like dragging an actor onto the canvas, or hiding select actors/tags/statuses until relevant, or allowing players greater freedom in creating, editing and removing tags.</span></p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue">Crew Themes & Relationships: </span>Space for the Crew Themebook and Crew Relationship Tags.</p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue">Character & Crew Evolution:</span> Place for Essence, Upgrades, Transformations, Evolution and Improvement tracking.</p>
						</li>
						<li style="box-sizing:border-box;user-select:text">
							<p><span style="font-family: Bebas Neue">Improved Dice Rolling Experience: </span>The idea is to allow the players to select tags they want to roll with directly from the character sheet. The roll dialog will also be improved.</p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue">Loadouts: </span>Currently the Loadout is hardcoded into the actor data. In the future it will become independent with its own items, able to be moved between players, and added from pre-made loadouts in the Item sidebar.</p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue">UI Upgrades and refinement:</span> Some UI elements are not yet considered final and will see improvements overall.</p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue">Compendiums:</span> Eventually all book entries for Character Creation, Themebooks, Street Catalogs, Settings, and</p>
						</li>
					</ul>
					<p><em>*some content subject to approval by Son of Oak</em></p>
					<p></p>
					<h2><span style="font-family: Bebas Neue">How play</span></h2>
					<p>There are few ins-and-outs of the system and some interactions to be aware of:</p>
					<ul>
						<li>
							<p><span style="font-family: Bebas Neue"><strong>Right-clicking</strong></span> in general will prompt you to delete whatever you are right clicking. This includes (<strong>Themes</strong>, <strong>Consequences</strong>, <strong>Threats</strong>, <strong>Tags</strong> in <strong>Backpack</strong>).</p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue"><strong>Double-clicking</strong></span><span style="font-family: Modesto Condensed"><strong> </strong></span>in general means you will open the item sheet, there are currently two item types that support this (<strong>Themes</strong> and <strong>Threats</strong>), in the future the <strong>Backpack</strong> will also become an item.</p>
						</li>
						<li>
							<p><strong>Tags</strong> can be written as <code>[tag]</code> <code>[status-4]</code> and <code>[-limit:4]</code>, and are recognized and highlighted in <strong>Journal Entries</strong>, and <strong>Textareas</strong> on <strong>Sheets</strong>.</p>
						</li>
						<li>
							<p>If your <strong>Character</strong><em><strong> </strong></em>is missing <strong>Themes</strong> you can create an empty one in the <em>Item Sidebar</em> <em>(or ask the one with GM permissions to do it)</em>, and <span style="font-family: Bebas Neue"><strong>drag</strong></span> it onto the sheet.</p>
						</li>
						<li>
							<p><strong>Themes</strong> can also be <span style="font-family: Bebas Neue"><strong>rearranged</strong></span> on a sheet. <strong>Tags</strong> in the <strong>Backpack</strong> and on <strong>Themes</strong> cannot.</p>
						</li>
						<li>
							<p>If you see a title, it may be <span style="font-family: Bebas Neue"><strong>editable</strong></span>. This goes for the title on the <strong>Character</strong>-sheet<strong>, Theme</strong>-sheet, and <strong>Roll</strong>-dialog.</p>
						</li>
						<li>
							<p><span style="font-family: Bebas Neue"><strong>Right-clicking</strong></span> the <em>Chat Card</em> of an <strong>Effect roll</strong> opens a context menu that lets you post extra effects to chat for reference.</p>
						</li>
					</ul>
				`,
			});

			// Create a "welcome" chat message
			ChatMessage.create({
				title: "Welcome to :Otherscape!",
				content: /* html */ `
				<p><strong>Welcome to :Otherscape</strong></p>
				<p>Before you start playing, you should want to read the <a class="content-link" draggable="true" data-uuid="${entry.uuid
					}" data-id="${entry._id
					}" data-type="JournalEntryPage" data-tooltip="Text Page"><i class="fas fa-file-lines"></i>:Otherscape</a> journal entry. It contains some important information about the system, and what to expect.</p>
				<p>Once you've read the journal entry, you can click the button below to import all the rules and content required to play the Tinderbox Demo.</p>
				<button type="button" id="os--import-adventure" style="background: var(--os-color-status-bg);"><strong>${t(
						"Os.ui.import-adventure"
					)}</strong></button>
				<p style="text-align:center;">Good luck, and have fun!</p>
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

		Hooks.on("renderChatMessage", (_app, html) => {
			html.find("#os--import-adventure").on("click", async () => {
				const adventure = await game.packs.get("os.tinderbox-demo").getDocuments();
				adventure?.[0]?.sheet.render(true);
			});
		});

		Hooks.on("importAdventure", async () => {
			const updates = await Promise.all(
				game.scenes
					.filter((s) => /os\/assets/.test(s.thumb))
					.map(async (s) => {
						const { thumb } = await s.createThumbnail();
						return { _id: s.id, thumb };
					})
			);
			await Scene.updateDocuments(updates);
			game.journal.getName("Tinderbox Demo Rules").sheet.render(true);
		});
	}
}
