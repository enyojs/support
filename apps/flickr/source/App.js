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
	select: function(inSender, inData) {
		this.$.flickr.setShowing(true);
		this.$.flickr.setSrc(inData.original);
		this.$.viewer.showRelatedResults(this.results);
	}
});