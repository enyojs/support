/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Cryptogram",
	allowHtml: true,
	classes: "cryptogram",
	components: [
		{ name: "lines" },
		{ tag: "br", attributes: { clear: "all" } },
		{ kind: "Distribution", name: "distribution" }
	],
	handlers: {
		onHoverCell: "broadcastHover"
	},
	published: {
		//* required, should be capital letter in range "A" to "Z"
		text: ""
	},
	resetCypher: function(text) {
		this.cypher = new Cypher();
		this.$.distribution.setCypher(this.cypher);
	},
	create: function() {
		this.inherited(arguments);
		this.resetCypher();
		this.textChanged();
	},
	textChanged: function() {
		this.text = this.text.toUpperCase();
		this.$.distribution.setText(this.text);

		var words = this.text.split(/ +/);
		this.$.lines.destroyClientControls();
		enyo.forEach(words, this.outputWord, this);
		this.render();
	},
	addLetter: function(ch) {
		this.createComponent({
			kind: "Cell",
			container: this.$.lines,
			top: this.cypher.clearToGuess(ch),
			bottom: this.cypher.clearToCypher(ch),
			mutable: true,
			isLetter: true
		});
	},
	addNonLetter: function(ch) {
		this.createComponent({
			kind: "Cell",
			container: this.$.lines,
			top: ch,
			bottom: ch,
			mutable: false,
			isLetter: false
		});
	},
	outputWord: function(word) {
		enyo.forEach(word, function(ch) {
			if (ch >= "A" && ch <= "Z") {
				this.addLetter(ch);
			}
			else {
				this.addNonLetter(ch);
			}
		}, this);

		// FIXME: need better after-word separator or wordwrap method
		this.addNonLetter(Unicode.nbsp);
	},
	// give a hint using the given encrypted letter
	giveHint: function(pick) {
		if (pick) {
			pick = this.cypher.cypherToClear(pick);
		}
		else if (!pick) {
			// if no argument, pick a unguessed letter to reveal
			var unguessed = [];
			forEachLetter(this, function(ch) {
				if (!this.cypher.clearToGuess(ch) && this.$.distribution.getCount(ch) > 0) {
					unguessed.push(ch);
				}
			});
			if (unguessed.length > 0) {
				pick = unguessed[enyo.irand(unguessed.length)];
			}
		}
		if (pick) {
			this.guessLetter(this.cypher.clearToCypher(pick), pick, true);
		}
	},
	guessLetter: function(cypher, guess, hint) {
		var clear = this.cypher.cypherToClear(cypher);
		this.cypher.setGuess(clear, guess);
		this.waterfall("onGuess", {
			cypher: cypher,
			guess: guess,
			hint: hint
		});
	},
	restart: function() {
		this.cypher.resetGuesses();
		this.waterfall("onResetGuess");
	},
	broadcastHover: function(inSender, inEvent) {
		// turn onHoverCell into state update message for all the cells
		this.waterfallDown("onUpdateHoverState", { cypher: inEvent.cypher });
	}
});