enyo.kind({
	name:"Selector",
	kind:enyo.canvas.Circle,
	published: {
		size: 48,
		margin: 8
	},
	create: function() {
		this.inherited(arguments);
		this.sizeChanged();
	},
	sizeChanged: function() {
		this.hide();
		this.bounds.w = this.size / 2;
	},
	show: function (inHatRow, inHatCol) {
		this.bounds.l = this.bounds.w + (this.size + this.margin) * inHatRow
		this.bounds.t = this.bounds.w + (this.size + this.margin) * inHatCol;
	},
	hide: function() {
		this.bounds.t = this.bounds.w * -2;
		this.bounds.l = this.bounds.w * -2;
	}
});
