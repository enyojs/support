enyo.kind({
	name: "enyo.Panels",
	kind: "ControlWithLayout",
	published: {
		index: 0
	},
	create: function() {
		this.inherited(arguments);
		this.indexChanged();
	},
	indexChanged: function() {
		if (this.layout) {
			this.layout.index = this.index;
			this.resized();
		}
	}
});