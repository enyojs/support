/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Cypher",
	kind: enyo.Object,
	shuffleAlphabet: function() {
		var alpha = generateCypherAlphabet();

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