import { localize as t } from "../../utils.js";

export class ThreatData extends foundry.abstract.DataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		return {
			consequences: new fields.ArrayField(new fields.StringField({ required: true, nullable: false }), {
				initial: () => [t("Os.ui.name-consequence")],
			}),
			category: new fields.StringField(),
		}
	}
}
