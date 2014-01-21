/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Cryptogram",
	allowHtml: true,
	classes: "cryptogram",
	components: [
		{ name: "cells", kind: enyo.Repeater, onSetupItem: "setupCell",
			components: [ { kind: Cell } ] },
		{ tag: "br", attributes: { clear: "all" } },
		{ kind: Distribution }
	],
	published: {
		text: ""
	},
	handlers: {
		onHoverCell: "broadcastHover"
	},
	// private properties
	// hash mapping clear text letters to guessed letter
	guesses: null,
	resetCypher: function(text) {
		this.cypher = new Cypher();
		this.$.distribution.setCypher(this.cypher);
	},
	setGuess: function(clearLetter, guessLetter) {
		// clear out any old guess with the same letter
		forEachLetter(this, function(ch) {
			if (this.guesses[ch] === guessLetter) {
				this.guesses[ch] = null;
			}
		});
		// set the new guess
		this.guesses[clearLetter] = guessLetter;
	},
	create: function() {
		this.inherited(arguments);
		this.resetCypher();
		this.textChanged();
	},
	markUnencrypted: function(regex) {
		var result;
		regex.lastIndex = 0;
		while (result = regex.exec(this.text)) {
			for (var i = result.index; i < regex.lastIndex; ++i) {
				this.isEncrypted[i] = false;
			}
		}
	},
	findUnencryptedRuns: function() {
		// put all characters into cells with default isEncrypted value
		this.isEncrypted = [];
		for (var i = 0; i < this.text.length; ++i) {
			this.isEncrypted[i] = (this.text[i] >= 'A') && (this.text[i] <= 'Z');
		}
		// find specific strings to "unencrypt" - URLs, RT, hashtags, @names
		this.markUnencrypted(/^RT\s/g);
		this.markUnencrypted(/HTTPS?:\/\/\S*/g);
		this.markUnencrypted(/@\w+/g);
		this.markUnencrypted(/#\w+/g);
	},
	generateDistribution: function() {
		var distribution = {};
		forEachLetter(this, function(ch) {
			distribution[ch] = 0;
		});
		for (var i = this.text.length - 1; i >= 0; --i) {
			var ch = this.text[i];
			if (this.isEncrypted[i]) {
				distribution[ch]++;
			}
		}
		this.$.distribution.setDistribution(distribution);
	},
	textChanged: function() {
		// start by forcing uppercase and trimming white space
		this.text = this.text.toUpperCase();
		this.text = this.text.replace(/^\s+|\s+$/g,'');
		this.text = this.text.replace(/\s+/g, Unicode.nbsp);
		this.findUnencryptedRuns();
		this.generateDistribution();
		this.guesses = {};
		this.$.cells.setCount(this.text.length);
	},
	setupCell: function(inSender, inEvent) {
		var ch = this.text[inEvent.index];
		var isEncrypted = this.isEncrypted[inEvent.index];
		var cell = inEvent.item.$.cell;
		cell.setEncrypted(isEncrypted);
		cell.setMutable(isEncrypted);
		if (isEncrypted) {
			cell.setTop(Unicode.nbsp);
			cell.setBottom(this.cypher.clearToCypher(ch));
		}
		else {
			cell.setTop(ch);
			cell.setBottom(ch);
		}
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
				if (!this.guesses[ch] && this.$.distribution.getCount(ch) > 0) {
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
		this.setGuess(clear, guess);
		this.waterfall("onGuess", {
			cypher: cypher,
			guess: guess,
			hint: hint
		});
	},
	restart: function() {
		this.guesses = {};
		this.waterfall("onResetGuess");
	},
	broadcastHover: function(inSender, inEvent) {
		// turn onHoverCell into state update message for all the cells
		this.waterfallDown("onUpdateHoverState", { cypher: inEvent.cypher });
	}
});