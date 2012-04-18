/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Distribution",
	classes: "distribution",
	allowHtml: true,
	published: {
		cypher: null,
		text: ""
	},
	computeDistribution: function () {
		var distribution = {};
		this.distribution = distribution;
		forEachLetter(this, function(ch) {
			distribution[ch] = 0;
		});
		for (var i = this.text.length - 1; i >= 0; --i) {
			var ch = this.text[i];
			if (ch >= 'A' && ch <= 'Z') {
				distribution[ch]++;
			}
		}
		// save a sorted list of letters in highest-first order
		this.sortedDistribtionKeys = Object.keys(this.distribution);
		this.sortedDistribtionKeys.sort(function(a, b) {
			return distribution[b] - distribution[a];
		});
	},
	textChanged: function() {
		this.computeDistribution();
		var content = "";
		enyo.forEach(this.sortedDistribtionKeys, function(ch) {
			if (this.distribution[ch] > 0) {
				content += "<span class=distroLetter>" + this.cypher.clearToCypher(ch) +
					": " + this.distribution[ch] + "</span>";
			}
		}, this);
		this.setContent(content);
	},
	getCount: function(ch) {
		return this.distribution[ch];
	},
	create: function() {
		this.inherited(arguments);
		this.textChanged();
	}
});
