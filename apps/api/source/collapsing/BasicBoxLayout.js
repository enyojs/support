enyo.kind({
	name: "enyo.BasicBoxLayout",
	kind: "Layout",
	layoutClass: "enyo-box",
	unit: "px",
	//* @protected
	calcMetrics: function(inMeasure) {
		var m = {flex: 0, fixed: 0};
		for (var i=0, c$ = this.container.children, c; c=c$[i]; i++) {
			m.flex += c.flex || 0;
			m.fixed += c[inMeasure] || 0;
		}
		return m;
	},
	flow: function() {
		var c$ = this.container.children;
		for (var i=0, c; c=c$[i]; i++) {
			c.applyStyle("position", "absolute");
		}
	},
	_reflow: function(measure, mAttr, nAttr, pAttr, qAttr) {
		var pb = this.container.getBounds();
		var c$ = this.container.children;
		var m = this.calcMetrics(measure);
		var b = {};
		var p = ("pad" in this.container) ? Number(this.container.pad) : 0;
		b[pAttr] = p;
		b[qAttr] = p;
		var free = pb[measure] - m.fixed - (p * (c$.length + 1));
		//
		for (var i=0, o=0, ex, c; c=c$[i]; i++) {
			o += p;
			ex = Math.round(c.flex ? (c.flex / m.flex) * free : Number(c[measure]) || 96);
			b[measure] = ex;
			b[mAttr] = o;
			c.setBounds(b, this.unit);
			o += ex;
		}
	},
	reflow: function() {
		if (this.orient == "h") {
			this._reflow("width", "left", "right", "top", "bottom");
		} else {
			this._reflow("height", "top", "bottom", "left", "right");
		}
	}
});

enyo.kind({
	name: "enyo.HBasicBoxLayout",
	kind: enyo.BasicBoxLayout,
	orient: "h"
});

enyo.kind({
	name: "enyo.VBasicBoxLayout",
	kind: enyo.BasicBoxLayout,
	orient: "v"
});

enyo.kind({
	name: "enyo.HBasicBox",
	kind: enyo.ControlWithLayout,
	layoutKind: "enyo.HBasicBoxLayout"
});

enyo.kind({
	name: "enyo.VBasicBox",
	kind: enyo.ControlWithLayout,
	layoutKind: "enyo.VBasicBoxLayout"
});
