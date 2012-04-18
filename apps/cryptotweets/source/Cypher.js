/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Cypher",
	kind: enyo.Object,
	// this function will provide an array where all 26 English capital
	// letters are included, but none are in their original position. The
	// distribution is probably not uniform, but it works well enough for
	// game purposes
	shuffleAlphabet: function() {
		var alpha = [
			"A","B","C","D","E","F","G","H","I",
			"J","K","L","M","N","O","P","Q","R",
			"S","T","U","V","W","X","Y","Z"];
		// we'll go through alphabet and randomly swap each letter with
		// another letter in the string, rejecting swaps that would put a
		// letter back in its original position.
		for (var i = 0; i < 26; ++i) {
			var swapPos;
			do {
				swapPos = enyo.irand(25);
				// skip over the item that we're swapping
				if (swapPos > i) ++swapPos;
				// and skip over a swap that puts the letter
				// back in its original position
			} while (alpha[swapPos] === String.fromCharCode(65 + i));
			swapElements(alpha, i, swapPos);
		}
		// take the shuffled alphabet and assign it to our hashes
		this.cypher = {};
		this.reverseCypher = {};
		enyo.forEach(alpha, function(val,idx,arr) {
			var key = String.fromCharCode(idx + 65);
			this.cypher[key] = val;
			this.reverseCypher[val] = key;
		}, this);
	},
	resetGuesses: function() {
		this.guesses = {};
	},
	constructor: function() {
		this.inherited(arguments);
		this.shuffleAlphabet();
		this.resetGuesses();
	},
	clearToCypher: function(clearLetter) {
		return this.cypher[clearLetter];
	},
	cypherToClear: function(cypherLetter) {
		return this.reverseCypher[cypherLetter];
	},
	clearToGuess: function(clearLetter) {
		return this.guesses[clearLetter];
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
	}
});