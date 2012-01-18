enyo.kind({
	name: "Viewer",
	kind: "Control",
	layoutKind: "VBoxLayout",
	events: {
		onSearch: "",
		onSelect: ""
	},
	components: [
		{height: 30, classes: "header"},
		{flex: 1, layoutKind: "HBoxLayout", components: [
			{width: 300, components: [
				{classes: "enyo-fit", layoutKind: "VBoxLayout", components: [
					{height: 39, layoutKind: "HBoxLayout", components: [
						{flex: 1, components: [
							{name: "input", classes: "search-input", tag: "input", attributes: {value: "waterfall"}},
							{name: "spinner", tag: "img", src: "images/spinner.gif", showing: false, classes: "search-spinner"}
						]},
						{width: 39, tag: "img", src: "images/search-button.png", classes: "search-button", ontap: "search"}
					]},
					{flex: 1, layoutKind: "VBoxLayout", components: [
						{name: "results", kind: "SimpleScroller", flex: 1, classes: "list"}
					]}
				]}
			]},
			{flex: 1, components: [
				{classes: "enyo-fit", layoutKind: "VBoxLayout", components: [
					{name: "client", flex: 1},
					{height: 100, layoutKind: "VBoxLayout", components: [
						{name: "related", kind: "SimpleScroller", classes: "related-list", flex: 1}
					]}
				]}
			]}
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
			this.$.results.createComponent({content: r.title, classes: "item", 
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