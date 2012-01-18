enyo.kind({
	name: "enyo.CollapsingPanels",
	kind: "Panels",
	layoutKind: "CollapsingBoxLayout",
	published: {
		orient: "h",
		collapse: 400
	},
	create: function() {
		this.inherited(arguments);
		this.orientChanged();
	},
	layoutKindChanged: function() {
		this.inherited(arguments);
		this.orientChanged();
	},
	orientChanged: function() {
		this.layout.orient = this.orient;
		if (this.hasNode()) {
			this.layout.reflow();
		}
	}
});