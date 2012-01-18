enyo.kind({
	name: "Flickr",
	kind: "Control",
	published: {
		src: ""
	},
	components: [
		{name: "image", tag: "img", classes: "enyo-fit center", style: "max-height: 100%;", onload: "imageLoaded", onerror: "imageLoaded"},
		{name: "spinner", tag: "img", src: "images/spinner.gif", classes: "enyo-fit center", showing: false}
	],
	create: function() {
		this.inherited(arguments);
		this.$.image.attributes.onload = enyo.bubbler;
		this.$.image.attributes.onerror = enyo.bubbler;
		this.srcChanged();
	},
	srcChanged: function() {
		this.$.spinner.setShowing(true);
		this.$.image.setSrc(this.src);
	},
	imageLoaded: function() {
		this.$.spinner.setShowing(false);
	}
})
