enyo.kind({
	name: "App",
	kind: "Control",
	components: [
		{kind: "FlickrSearch", onResults: "searchResults"},
		{kind: "Viewer", classes: "enyo-fit", onSearch: "search", onSelect: "select", components: [
			{kind: "Flickr", showing: false, classes: "enyo-fit"}
		]}
	],
	search: function(inSender, inEvent) {
		this.$.flickrSearch.search(inEvent.query);
	},
	searchResults: function(inSender, inEvent) {
		this.results = inEvent;
		this.$.viewer.showResults(inEvent);
	},
	select: function(inSender, inEvent) {
		this.$.flickr.setShowing(true);
		this.$.flickr.setSrc(inEvent.data.original);
		if (!inEvent.related) {
			this.$.viewer.showRelatedResults(this.results);
		}
	}
});