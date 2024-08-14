import { localize as t } from "../utils.js";

export class OsRoll extends Roll {
	static CHAT_TEMPLATE = "systems/os/templates/chat/message.html";
	static TOOLTIP_TEMPLATE = "systems/os/templates/chat/message-tooltip.html";

	get os() {
		return this.options;
	}

	get actor() {
		return game.actors.get(this.os.actorId);
	}

	get speaker() {
		return { alias: this.actor.name };
	}

	get flavor() {
		switch (this.os.type) {
			case "mitigate":
				return t("Os.ui.roll-mitigate", "Os.other.outcome");
			case "tracked":
				return t("Os.ui.roll-tracked", "Os.other.outcome");
			default:
				return t("Os.ui.roll-quick", "Os.other.outcome");
		}
	}

	get effect() {
		if (this.os.type !== "mitigate") return null;
		return {
			action: "Os.effects.mitigate.action",
			description: "Os.effects.mitigate.description",
			cost: "Os.effects.mitigate.cost",
		};
	}

	get power() {
		const { label: outcome } = this.outcome;

		// Quick outcomes don't need to track power
		if (this.os.type === "quick") return null;
		if (outcome === 'failure') return 0;

		// Minimum of 1 power
		let totalPower = Math.max(this.os.totalPower, 1);

		// If it's not a strong success, return the total power
		if (outcome === "consequence") return totalPower;

		// Mitigate outcomes add 1 power on a strong success
		if (this.os.type === "mitigate") totalPower += 1;
		return totalPower;
	}

	get outcome() {
		const { resolver } = CONFIG.os.roll;

		if (typeof resolver === "function")
			return resolver(this);

		// If snake eyes, it's a failure
		if (this.dice[0].results.each((r) => r.result === 1))
			return { label: "failure", description: "Os.ui.roll-failure" };

		// If boxcars or 10 or more, it's a success
		if (this.total > 9 || this.dice[0].results.each((r) => r.result === 6))
			return { label: "success", description: "Os.ui.roll-success" };

		// If 7 or more, it's a consequence
		if (this.total > 6)
			return { label: "consequence", description: "Os.ui.roll-consequence" };

		// Otherwise, it's a failure
		return { label: "failure", description: "Os.ui.roll-failure" };
	}

	async render({
		template = this.constructor.CHAT_TEMPLATE,
		isPrivate = false,
	} = {}) {

		if (!this._evaluated) await this.evaluate({ async: true });

		const chatData = {
			actor: this.actor,
			formula: isPrivate ? "???" : this._formula.replace(/\s\+0/, ""),
			flavor: isPrivate ? null : this.flavor,
			outcome: isPrivate ? "???" : this.outcome,
			power: isPrivate ? "???" : this.power,
			result: isPrivate ? "???" : this.result,
			title: this.os.title,
			tooltip: isPrivate ? "" : await this.getTooltip(),
			total: isPrivate ? "" : Math.round(this.total * 100) / 100,
			type: this.os.type,
			effect: this.effect,
			user: game.user.id,
			isOwner: game.user.isGM || this.actor.isOwner,
			hasBurnedTags: !this.os.isBurnt && this.os.burnedTags.length > 0,
			hasWeaknessTags:
				!this.os.gainedExp &&
				this.os.weaknessTags.filter((t) => t.type === "weaknessTag").length >
				0,
		};

		return renderTemplate(template, chatData);
	}

	async getTooltip() {
		const parts = this.dice.map((d) => d.getTooltipData());
		const data = this.getTooltipData();
		return renderTemplate(OsRoll.TOOLTIP_TEMPLATE, { data, parts });
	}

	getTooltipData() {
		const { label: outcome } = this.outcome
		return {
			mitigate: this.os.type === "mitigate" && outcome === 'success',
			burnedTags: this.os.burnedTags,
			powerTags: this.os.powerTags,
			weaknessTags: this.os.weaknessTags,
			positiveStatuses: this.os.positiveStatuses,
			negativeStatuses: this.os.negativeStatuses,
		};
	}
}
