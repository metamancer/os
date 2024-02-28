export class ChallengeSheet extends ActorSheet {
	static defaultOptions = mergeObject(ActorSheet.defaultOptions, {
		classes: ["os", "os--challenge"],
		width: 250,
		height: 700,
		resizable: false,
	});

	get template() {
		return "systems/os/templates/actor/challenge.html";
	}
}
