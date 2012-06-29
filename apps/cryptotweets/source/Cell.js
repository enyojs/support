/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Cell",
	classes: "cell",
	published: {
		top: "",
		bottom: "",
		mutable: true,
		encrypted: false
	},
	events: {
		onHoverCell: ""
	},
	components: [
		{ name: "top", classes: "top" },
		{ name: "middle", classes: "middle", content: Unicode.nbsp },
		{ name: "bottom", classes: "bottom" }
	],
	handlers: {
		onGuess: "guess",
		onResetGuess: "reset",
		onmouseover: "hoverStart",
		onmouseout: "hoverEnd",
		onUpdateHoverState: "updateHoverState"
	},
	create: function () {
		this.inherited(arguments);
		this.encryptedChanged();
		this.topChanged();
		this.mutableChanged();
		this.bottomChanged();
	},
	reset: function () {
		// go back to "unguessed" state
		if (this.encrypted) {
			this.setMutable(true);
			this.setTop("");
		}
	},
	updateMiddle: function() {
		if (this.encrypted && this.mutable) {
			this.$.middle.setContent(Unicode.mdash);
		}
		else {
			this.$.middle.setContent(Unicode.nbsp);
		}
	},
	encryptedChanged: function() {
		this.addRemoveClass("letter", this.encrypted);
		this.updateMiddle();
	},
	mutableChanged: function() {
		this.updateMiddle();
	},
	topChanged: function() {
		this.$.top.setContent(this.top || Unicode.nbsp);
	},
	bottomChanged: function() {
		this.$.bottom.setContent(this.bottom || Unicode.nbsp);
	},
	guess: function(inSender, inEvent) {
		if (this.mutable) {
			if (inEvent.cypher === this.bottom) {
				this.setTop(inEvent.guess);
				// hints change letters to be unchangable
				if (inEvent.hint) {
					this.setMutable(false);
				}
			} else if (inEvent.guess == this.top) {
				// clear any cells that had that guess
				this.setTop(Unicode.nbsp);
			}
		}
	},
	tap: function() {
		// when tapping on a mutable cell, start a guess dialog
		if (this.mutable) {
			this.bubble("onStartGuess", { cypher: this.bottom });
		}
	},
	// notify owner about mouse enter/leaves
	hoverStart: function() {
		if (this.encrypted && this.mutable) {
			this.doHoverCell({ cypher: this.bottom });
		}
	},
	hoverEnd: function() {
		this.doHoverCell({ cypher: null });
	},
	// handle event sent down the tree to change my visible hover state
	updateHoverState: function(inSender, inEvent) {
		if (this.encrypted && this.mutable) {
			this.addRemoveClass("selectedCell", this.bottom === inEvent.cypher);
		}
	}
});