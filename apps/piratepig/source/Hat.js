enyo.kind({
	name:"Hat",
	kind:enyo.canvas.Control,
	published: {
		image: null,
		type: 0,
		i: 0,
		j: 0,
		size: 48,
		margin: 8,
		steps: 10
	},
	create: function() {
		this.inherited(arguments);
		this.sizeChanged();
		this.iChanged();
		this.jChanged();
	},
	renderSelf: function(ctx) {
		if (this.image) {
			ctx.drawImage(this.image, this.bounds.l, this.bounds.t, this.bounds.w, this.bounds.h);
		}
	},
	iChanged: function() {
		this.bounds.l = this.box * this.i;
	},
	jChanged: function() {
		this.bounds.t = this.box * this.j;
	},
	sizeChanged: function() {
		this.bounds.w = this.size;
		this.bounds.h = this.size;
		this.box = (this.size + this.margin);
	},
	marginChanged: function() {
		this.box = (this.size + this.margin);
	},

	distance: function(inOtherHat) {
		return {di: inOtherHat.i - this.i, dj: inOtherHat.j - this.j};
	},
	moveX: function(inDx) {
		this.animating = true;
		var i = this.i;
		this.i += inDx;
		return {
			hat: this,
			box: this.box,
			l: i * this.box + this.box * inDx,
			dx: this.steps,
			steps: this.steps,
			move: function() {
				this.dx--;
				var lerp = enyo.easing.cubicIn(this.dx/this.steps) * this.steps;
				this.hat.bounds.l = this.l - lerp*inDx*4;
				return (this.hat.animating = Boolean(this.dx >= 0));
			}
		};
	},
	moveY: function(inDy) {
		this.animating = true;
		var j = this.j;
		this.j += inDy;
		return {
			hat: this,
			box: this.box,
			t: j * this.box + inDy * this.box,
			dy: this.steps,
			steps: this.steps,
			move: function() {
				this.dy--;
				var lerp = enyo.easing.cubicIn(this.dy/this.steps) * this.steps;
				this.hat.bounds.t = this.t - lerp*inDy*4;
				return (this.hat.animating = Boolean(this.dy >= 0));
			}
		};
	},
	moveUp: function() {
		return this.moveY(-1);
	},
	moveDown: function() {
		return this.moveY(1);
	},
	splat: function() {
		this.animating = true;
		return {
			hat: this,
			size: this.size,
			box: this.box,
			dy: this.steps,
			steps: this.steps,
			l: this.bounds.l,
			t: this.bounds.t,
			move: function() {
				this.dy--;
				var lerp = enyo.easing.cubicOut(this.dy/this.steps);
				var off = this.size * (1-lerp);
				this.hat.bounds.w = Math.floor(this.size - off);
				this.hat.bounds.h = Math.floor(this.size - off);
				this.hat.bounds.l = Math.floor(this.l + off / 2);
				this.hat.bounds.t = Math.floor(this.t + off / 2);
				if (this.dy >= 0) {
					return true;
				}
				this.hat.destroy();
			}
		};
	}
});
