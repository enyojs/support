enyo.kind({
	name: "App",
	kind: "Control",
	components: [
		{kind: "Viewer", classes: "enyo-fit", onSearch: "search", onSelect: "select", components: [
			{kind: "YouTube", classes: "enyo-fit", showing: false}
		]}
	],
	search: function(inSender, inSearch) {
		enyo.YouTube.search(inSearch).response(this, "receiveResults");
	},
	receiveResults: function(inSender, inResults) {
		this.$.viewer.showResults(inResults);
	},
	select: function(inSender, inEvent) {
		var id = inEvent.data.id;
		this.$.youTube.setShowing(true);
		this.$.youTube.setVideoId(id);
		if (!inEvent.related) {
			enyo.YouTube.search(id, true).response(this, "receiveRelatedResults");
		}
	},
	receiveRelatedResults: function(inSender, inResults) {
		this.$.viewer.showRelatedResults(inResults);
	}
});