/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "PickLetterPopup",
	kind: onyx.Popup,
	centered: true,
	modal: true,
	floating: true,
	style: "padding: 10px; width: 274px;",
	handlers: {
		onkeypress: "keypress"
	},
	components: [
		{ name: "prompt", style: "font-size: 30px; padding-bottom: 6px; text-align: center;" },
		{ name: "keyboard", kind: enyo.Repeater, count: 26, onSetupItem: "setupKeys",
			components: [ { kind: onyx.Button, ontap: "tappedKeys", 
				style: "margin: 3px 3px; width: 36px; font-size: 14px; padding: 6px 10px;" } ] }
	],
	setupKeys: function(inSender, inEvent) {
		var ch = String.fromCharCode(inEvent.index + 65);
		inEvent.item.$.button.setContent(String.fromCharCode(inEvent.index + 65));
		if (ch === this.cypherLetter) {
			inEvent.item.$.button.setDisabled(true);
		}
		return true;
	},
	tappedKeys: function(inSender, inEvent) {
		this.guess(String.fromCharCode(inEvent.index + 65));
		return true;
	},
	setPrompt: function(guess) {
		this.$.prompt.setContent(this.cypherLetter + " " + 
			Unicode.rightwardArrow + " " + guess);
	},
	show: function(cypherLetter) {
		this.cypherLetter = cypherLetter;
		// rebuild keyboard to disable cypherletter button
		this.$.keyboard.build();
		this.setPrompt("?");
		this.guessed = false;
		this.inherited(arguments);
	},
	guess: function(key) {
		this.setPrompt(key);
		this.guessed = true;
		enyo.job("clearGuessPopup", enyo.bind(this, this.hide), 1000);
		this.bubble("onFinishGuess", {
			cypher: this.cypherLetter,
			guess: key
		});
	},
	keypress: function(inSender, inEvent) {
		var key = String.fromCharCode(inEvent.charCode).toUpperCase();
		// after guess, letters restart guess to allow quick entry, otherwise ignore
		if (this.guessed) {
			if (key >= "A" && key <= "Z") {
				enyo.job.stop("clearGuessPopup");
				this.bubble("onStartGuess", { cypher: key });
			}
			return true;
		}
		// allow backspace or space to clear a cell
		if (inEvent.charCode === 8 || inEvent.charCode === 32) {
			this.setPrompt(Unicode.nbsp);
			this.guessed = true;
			enyo.job("clearGuessPopup", enyo.bind(this, this.hide), 1000);
			this.bubble("onFinishGuess", {
				cypher: this.cypherLetter,
				guess: null
			});
			return true;
		}
		// otherwise, accept letter as guess
		if (key >= "A" && key <= "Z") {
			this.guess(key);
			return true;
		}
	}
});