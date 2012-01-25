enyo.kind({
	name:"Audio",
	kind:"Control",
	published: {
		src: ""
	},
	events: {
		onEnded: ""
	},
	//* @protected
	create: function() {
		this.inherited(arguments);
		this.srcChanged();
	},
	srcChanged: function() {
		this.destroyClientControls();
		var a = this.createComponent({tag:"audio", name:"client", style:"display:none;", owner:this});
		var srcs = this.src;
		if (srcs && !enyo.isArray(srcs)) {
			srcs = [srcs];
		}
		for (var i = 0, s; s = srcs[i]; i++) {
			var type = "audio/" + s.replace(/[^.]*./,"");
			a.createComponent({tag:"source", src:s, attributes:{type:type}, owner:this});
		}
		a.render();
		if (a = a.hasNode()) {
			a.onended = enyo.bind(this, "doEnded");
		}
	},
	//* @public
	play: function() {
		var a = this.$.client.hasNode();
		if (a && a.play) {
			a.play();
		}
	}
});
