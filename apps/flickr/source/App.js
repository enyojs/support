enyo.kind({
	name: "App",
	kind: "Control",
	components: [
		{kind: "FlickrSearch", onResults: "searchResults"},
		{kind: "Viewer", classes: "enyo-fit", onSearch: "search", onSelect: "select", components: [
			{kind: "Flickr", showing: false, classes: "enyo-fit"}
		]}
	],
	search: function(inSender, inSearch) {
		this.$.flickrSearch.search(inSearch);
	},
	searchResults: function(inSender, inResults) {
		this.results = inResults;
		this.$.viewer.showResults(inResults);
	},
	select: function(inSender, inEvent) {
		this.$.flickr.setShowing(true);
		this.$.flickr.setSrc(inEvent.data.original);
		if (!inEvent.related) {
			this.$.viewer.showRelatedResults(this.results);
		}
	}
});