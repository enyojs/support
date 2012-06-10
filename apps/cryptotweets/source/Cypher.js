/* CryptoTweets, a game built using Enyo 2.0 */

/** This kind encapsulates the substitution cypher needed for the game,
	but doesn't include cyphertext management. */
enyo.kind({
	name: "Cypher",
	kind: enyo.Object,
	shuffleAlphabet: function() {
		// take the shuffled alphabet and assign it to our hashes
		var alpha = generateCypherAlphabet();
		this.cypher = {};
		this.reverseCypher = {};
		enyo.forEach(alpha, function(val,idx,arr) {
			var key = String.fromCharCode(idx + 65);
			this.cypher[key] = val;
			this.reverseCypher[val] = key;
		}, this);
	},
	constructor: function() {
		this.inherited(arguments);
		this.shuffleAlphabet();
	},
	clearToCypher: function(clearLetter) {
		return this.cypher[clearLetter];
	},
	cypherToClear: function(cypherLetter) {
		return this.reverseCypher[cypherLetter];
	}
});