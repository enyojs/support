enyo.kind({
	name: "SimpleScroller",
	kind: "Control",
	preventDragPropagation: true,
	create: function() {
		this.inherited(arguments);
		this.addClass("simple-scroller");
	},
	dragstartHandler: function() {
		this.stop();
		this.x0 = this.hasNode().scrollLeft;
		this.y0 = this.hasNode().scrollTop;
		return this.preventDragPropagation;
	},
	dragHandler: function(inSender, inEvent) {
		this.hasNode().scrollLeft = this.x0 - inEvent.dx;
		this.hasNode().scrollTop = this.y0 - inEvent.dy;
	},
	dragfinishHandler: function(inSender, inEvent) {
		inEvent.preventTap();
	},
	// prevent IE selection while dragging
	mousedownHandler: function(inSender, inEvent) {
		inEvent.preventDefault();
	},
	kFriction: 0.95,
	kMin: 1,
	kScalar: 5,
	flickHandler: function(inSender, inEvent) {
		this.vx = inEvent.xVelocity * this.kScalar;
		this.vy = inEvent.yVelocity * this.kScalar;
		this.job = enyo.requestAnimationFrame(enyo.bind(this, "animate"));
	},
	animate: function() {
		this.move(this.vx, this.vy);
		this.vx = this.vx * this.kFriction;
		this.vy = this.vy * this.kFriction;
		this.job = enyo.requestAnimationFrame(enyo.bind(this, "animate"));
		if (Math.abs(this.vx) < this.kMin && Math.abs(this.vy) < this.kMin) {
			this.stop();
		}
	},
	stop: function() {
		enyo.cancelRequestAnimationFrame(this.job);
	},
	move: function(inDx, inDy) {
		this.hasNode().scrollLeft -= Math.round(inDx);
		this.hasNode().scrollTop -= Math.round(inDy);
	}
});