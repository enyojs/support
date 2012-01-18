enyo.kind({
	name: "enyo.ControlWithLayout",
	kind: enyo.Control,
	reflow: function() {
		enyo.call(this.layout, "reflow");
	},
	rendered: function() {
		this.reflow();
		this.inherited(arguments);
	},
	resizeHandler: function() {
		this.reflow();
		this.inherited(arguments);
	}
});