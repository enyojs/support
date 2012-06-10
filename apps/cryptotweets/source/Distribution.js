/* CryptoTweets, a game built using Enyo 2.0 */

enyo.kind({
	name: "Distribution",
	classes: "distribution",
	allowHtml: true,
	published: {
		cypher: null,
		distribution: null
	},
	distributionChanged: function() {
		// short circuit the case where no distribution has been set
		var distribution = this.distribution;
		if (!distribution) {
			this.setContent("");
			return;
		}
		// save a sorted list of letters in highest-first order
		this.sortedDistribtionKeys = enyo.keys(distribution);
		this.sortedDistribtionKeys.sort(function(a, b) {
			return distribution[b] - distribution[a];
		});
		// regenerate content
		var content = "";
		enyo.forEach(this.sortedDistribtionKeys, function(ch) {
			if (distribution[ch] > 0) {
				content += "<span class=distroLetter>" + this.cypher.clearToCypher(ch) +
					": " + distribution[ch] + "</span>";
			}
		}, this);
		this.setContent(content);
	},
	getCount: function(ch) {
		return this.distribution[ch];
	},
	create: function() {
		this.inherited(arguments);
		this.distributionChanged();
	}
});
