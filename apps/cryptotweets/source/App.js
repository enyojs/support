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
	name: "App",
	kind: enyo.Application,
	view: "MainView"
});

enyo.kind({
	name: "MainView",
	kind: enyo.FittableRows,
	classes: "onyx",
	handlers: {
		onStartGuess: "startGuess",
		onFinishGuess: "finishGuess",
		onkeypress: "handleKeyPress",
		onkeydown: "handleKeyDown"
	},
	components: [
		{ kind: onyx.MoreToolbar, style: "background: #444F70;",
			movedClass: "toolbar-fixed-width",
			components: [
				{ content: "CryptoNews (powered by USA Today)", style: "padding-right: 10px" },
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
		{ kind: PickLetterPopup },
		{ kind: "onyx.Popup", name: "loadingPopup", centered: true, modal: true, floating: true, components: [
			{ content: "Loading headlines..." }
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.tweets = [];
		this.nextTweetIndex = 0;
	},
	rendered: function() {
		this.inherited(arguments);
		this.fetchNews();
	},
	fetchNews: function(inSender) {
		this.$.loadingPopup.show();
		var request = new enyo.JsonpRequest({
			url: "http://api.usatoday.com/open/articles/topnews/home",
			callbackName: "jsoncallbackmethod"
		});
		request.response(enyo.bind(this, "handleUSATodayResults"));
		request.go({
			encoding: "json",
			api_key: "wcucm5mftznpwrembw824np3",
			count: 15
		});
	},
	handleUSATodayResults: function(inRequest, inResponse) {
		this.$.loadingPopup.hide();
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

enyo.ready(function() {
	new App();
});