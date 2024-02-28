export class ChallengeData extends foundry.abstract.DataModel {
	static defineSchema() {
		const fields = foundry.data.fields;
		const data = game.os.data;
		return {
			note: new fields.HTMLField(),
			backpack: new fields.ArrayField(
				new fields.EmbeddedDataField(data.TagData),
			),
		};
	}
}
