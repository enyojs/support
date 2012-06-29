/* CryptoTweets, a game built using Enyo 2.0 */

/* custom events:
 *
 * /onGuess/
 * sent from app down into cells when a guess is made,
 * either by the user or by the hint button. There are three
 *   cypher: the encrypted letter
 *   guess: what letter was guessed
 *   hint: if true, this was a hint given by the system
 *
 * /onStartGuess/
 * sent from a cell or from the keyboard handler, it signals
 * that the app should popup the guess UI.
 *   cypher: what letter was picked to start the guess
 *
 * /onFinishGuess/
 * sent from popup when second key is hit.
 *   cypher: what letter was picked to start the guess
 *   guess: what letter was picked to start the guess
 *
 * /resetGuess/
 * sent to cells to have them revert to their original form
 */

enyo.kind({
	name: "PickLetterPopup",
	kind: onyx.Popup,
	centered: true,
	modal: true,
	floating: true,
	style: "padding: 10px; font-size: 30px;",
	handlers: {
		onkeypress: "keypress"
	},
	show: function(cypherLetter) {
		this.cypherLetter = cypherLetter;
		this.setContent(this.cypherLetter + " " + Unicode.rightwardArrow + " ?");
		this.guessed = false;
		this.inherited(arguments);
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
			this.setContent(this.cypherLetter + " " + Unicode.rightwardArrow +
				" " + Unicode.nbsp);
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
			this.setContent(this.cypherLetter + " " + Unicode.rightwardArrow +
				" " + key);
			this.guessed = true;
			enyo.job("clearGuessPopup", enyo.bind(this, this.hide), 1000);
			this.bubble("onFinishGuess", {
				cypher: this.cypherLetter,
				guess: key
			});
			return true;
		}
	}
});

enyo.kind({
	name: "FetchPopup",
	kind: onyx.Popup,
	autoDismiss: false,
	centered: true,
	modal: true,
	floating: true,
	scrim: true,
	style: "padding: 10px; background: #444F70;",
	events: {
		onFetchTweets: "", 
		onFetchNews: ""
	},
	components: [
		{ content: "Choose Game Type", 
			style: "text-align: center; margin-bottom: 10px;" },
		{ kind: onyx.Button, style: "margin-right: 10px", content: "Twitter",
			ontap: "handleFetchTweets" },
		{ kind: onyx.Button, content: "USA Today", ontap: "handleFetchNews" }
	],
	handleFetchTweets: function() {
		this.doFetchTweets();
		this.hide();
	},
	handleFetchNews: function() {
		this.doFetchNews();
		this.hide();
	}
});

enyo.kind({
	name: "App",
	kind: enyo.FittableRows,
	classes: "onyx",
	handlers: {
		onStartGuess: "startGuess",
		onFinishGuess: "finishGuess"
	},
	components: [
		{ kind: enyo.Signals,
			onkeypress: "handleKeyPress",
			onkeydown: "handleKeyDown" },
		{ kind: onyx.Toolbar, style: "background: #444F70;", components: [
			{ content: "CryptoTweets", style: "padding-right: 10px" },
			{ kind: enyo.Group, highlander: false, components: [
				{kind: onyx.Button, content: "Hint", onclick: "giveHint"},
				{kind: onyx.Button, content: "Reset", onclick: "restart"},
				{kind: onyx.Button, content: "Next", onclick: "nextTweet"}
			]}
		]},
		// these all use the automatic name feature since they're unique kinds
		{ kind: enyo.Scroller, fit: true, components: [
			{ kind: Cryptogram }
		]},
		{ kind: FetchPopup, onFetchTweets: "fetchTweets", onFetchNews: "fetchNews"},
		{ kind: PickLetterPopup }
	],
	create: function() {
		this.inherited(arguments);
		this.tweets = [];
		this.nextTweetIndex = 0;
	},
	rendered: function() {
		this.inherited(arguments);
		// show selection popup
		this.$.fetchPopup.show();
	},
	fetchTweets: function(inSender) {
		var request = new enyo.JsonpRequest({
			url: "http://search.twitter.com/search.json",
			callbackName: "callback"
		});
		request.response(enyo.bind(this, "handleTwitterResults"));
		request.go({
			q: "from:TopTweets -filter:links"
		});
	},
	fetchNews: function(inSender) {
		var request = new enyo.JsonpRequest({
			url: "http://api.usatoday.com/open/articles/topnews",
			callbackName: "jsoncallbackmethod"
		});
		request.response(enyo.bind(this, "handleUSATodayResults"));
		request.go({
			encoding: "json",
			api_key: "wcucm5mftznpwrembw824np3",
			count: 15
		});
	},
	handleTwitterResults: function(inRequest, inResponse) {
		this.tweets = [];
		enyo.forEach(inResponse.results, function(t) {
			this.tweets.push(t.text);
		}, this);
		this.nextTweetIndex = 0;
		this.nextTweet();
	},
	handleUSATodayResults: function(inRequest, inResponse) {
		this.tweets = [];
		enyo.forEach(inResponse.stories, function(t) {
			this.tweets.push(t.title);
		}, this);
		this.nextTweetIndex = 0;
		this.nextTweet();
	},
	giveHint: function() {
		this.$.cryptogram.giveHint();
	},
	restart: function() {
		this.$.cryptogram.restart();
	},
	nextTweet: function() {
		this.$.cryptogram.resetCypher();
		this.$.cryptogram.setText(this.tweets[this.nextTweetIndex++]);
		if (this.nextTweetIndex >= this.tweets.length) {
			this.nextTweetIndex = 0;
		}
	},
	handleKeyDown: function(inSender, inEvent) {
		// prevent backspace from changing page
		if (inEvent.keyCode === 8) return true;
	},
	handleKeyPress: function(inSender, inEvent) {
		var key = String.fromCharCode(inEvent.charCode).toUpperCase();
		if (key >= "A" && key <= "Z") {
			this.waterfall("onStartGuess", { cypher: key });
		}
		else if (key === "?") {
			this.giveHint();
		}
	},
	startGuess: function(inSender, inEvent) {
		// clear hover before showing popup
		this.waterfallDown("onHoverCell", { cypher: null });
		this.$.pickLetterPopup.show(inEvent.cypher);
		return true;
	},
	finishGuess: function(inSender, inEvent) {
		this.$.cryptogram.guessLetter(inEvent.cypher, inEvent.guess, false);
	}
});
