enyo.kind({
	name: "enyo.CollapsingBoxLayout",
	kind: "BasicBoxLayout",
	_reflow: function(measure, mAttr, nAttr, pAttr, qAttr) {
		this.index = this.index || 0;
		var pb = this.container.getBounds();
		var c$ = this.container.children;
		var t = this.container.collapse || 0;
		var collapse = t > pb[measure];
		var p = ("pad" in this.container) ? Number(this.container.pad) : 0;
		var b = {};
		b[pAttr] = b[qAttr] = b[mAttr] = b[nAttr] = p;
		for (var i=0, o=0, a, c; c=c$[i]; i++) {
			a = this.index == i;
			c.setShowing(!collapse || a);
			if (collapse && a) {
				b[measure] = pb[measure] - p * 2;
				c.setBounds(b, this.unit);
			}
		}
		if (!collapse) {
			this.inherited(arguments);
		}
	}
});
