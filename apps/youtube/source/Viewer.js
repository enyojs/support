enyo.kind({
	name: "Viewer",
	kind: "Control",
	events: {
		onSearch: "",
		onSelect: ""
	},
	components: [
		// left panel
		{classes: "enyo-fit", style: "width: 300px;", components: [
			// search
			{classes: "enyo-fit", style: "height: 39px;", components: [
				{classes: "enyo-fit", style: "right: 39px;", components: [
					{name: "input", classes: "search-input", tag: "input", attributes: {value: "waterfall"}},
					{name: "spinner", tag: "img", src: "images/spinner.gif", showing: false, classes: "search-spinner"}
				]},
				{classes: "enyo-fit search-button", style: "left: auto; width: 39px;", tag: "img", src: "images/search-button.png", ontap: "search"}
			]},
			// list
			{name: "results", style: "top: 39px;", classes: "enyo-fit simple-scroller list"}
		]},
		// main panel
		{classes: "enyo-fit", style: "left: 300px;", components: [
			// content
			{name: "client", classes: "enyo-fit", style: "bottom: 118px;"},
			// related results
			{name: "related", style: "top: auto; height: 118px;", classes: "enyo-fit simple-scroller related-list"}
		]}
	],
	search: function() {
		this.$.spinner.setShowing(true);
		this.doSearch(this.$.input.hasNode().value);
	},
	showResults: function(inResults) {
		this.$.spinner.setShowing(false);
		this.$.results.destroyClientControls();
		this.results = inResults;
		for (var i=0,r; r=inResults[i]; i++) {
			this.$.results.createComponent({content: r.title || "(no labels)", classes: "item", 
				ontap: "select", data: r, owner: this, attributes: {draggable: false}});
		}
		this.$.results.render();
	},
	select: function(inSender) {
		this.doSelect(inSender.data);
	},
	showRelatedResults: function(inResults) {
		this.$.related.destroyClientControls();
		for (var i=0, results=inResults, r; r=results[i]; i++) {
			this.$.related.createComponent({tag: "img", src: r.thumbnail, classes: "related-item", 
				ontap: "select", data: r, owner: this, attributes: {draggable: false}});
		}
		this.$.related.render();
	}
});