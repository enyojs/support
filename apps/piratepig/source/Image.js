enyo.kind({
	name:"Image",
	kind:"Control",
	published: {
		src: ""
	},
	events: {
		onLoad: ""
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
	},
	srcChanged: function() {
		this.destroyClientControls();
		var image = this.createComponent({tag:"image", name:"image", src:this.src, owner:this});
		image.render();
		image = image.hasNode();
		image.onload = enyo.bind(this, "doLoad");
	},
	//* @public
	//* return the actual image node
	getNode: function() {
		return this.$.image.hasNode();
	}
});
