/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Cell",
	classes: "cell",
	published: {
		top: "",
		bottom: "",
		mutable: true,
		isLetter: false
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
		onHoverCell: "hoverCell"
	},
	create: function () {
		this.inherited(arguments);
		this.addRemoveClass("letter", this.isLetter);
		this.originalGuess = this.top;
		this.topChanged();
		this.mutableChanged();
		this.bottomChanged();
	},
	reset: function () {
		// go back to "unguessed" state
		if (this.isLetter) {
			this.setMutable(true);
		}
		this.setTop(this.originalGuess);
	},
	topChanged: function() {
		this.$.top.setContent(this.top || Unicode.nbsp);
	},
	bottomChanged: function() {
		this.$.bottom.setContent(this.bottom || Unicode.nbsp);
	},
	mutableChanged: function() {
		if (this.isLetter && this.mutable) {
			this.$.middle.setContent(Unicode.mdash);
		}
		else {
			this.$.middle.setContent(Unicode.nbsp);
		}
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
	hoverStart: function() {
		if (this.mutable) {
			this.parent.waterfallDown("onHoverCell", { cypher: this.bottom });
		}
	},
	hoverEnd: function() {
		this.parent.waterfallDown("onHoverCell", { cypher: null });
	},
	hoverCell: function(inSender, inEvent) {
		this.addRemoveClass("selectedCell", this.bottom === inEvent.cypher);
	}
});