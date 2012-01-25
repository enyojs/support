enyo.kind({
	name: "App",
	kind: "Control",
	classes: "theme-fu",
	components: [
		{classes: "enyo-fit title", style: "height: 50px;", content: "enyo playground"},
		{classes: "enyo-fit code", style: "top: 50px; right: 50%;", components: [
			{classes: "enyo-fit code-title", style: "height: 46px;", components: [
				{tag: "span", content: "Create a kind or choose a sample:"},
				{name: "select", tag: "select", classes: "code-select", onchange: "selectChange", components: [
					{tag: "option", content: "Sample1"},
					{tag: "option", content: "Sample2"},
					{tag: "option", content: "Sample3"},
					{tag: "option", content: "Sample4"}
				]}
			]},
			{kind: "CodeEditor", classes: "enyo-fit", style: "top: 46px; bottom: 50px;", onLoad: "go"},
			{classes: "enyo-fit", style: "height: 50px; top: auto;", components: [
				{tag: "button", classes: "code-make-button", content: "Make It", ontap: "go"}
			]}
		]},
		{kind: "CodePlayer", classes: "enyo-fit player", style: "top: 50px; left: 50%;"}
	],
	create: function() {
		this.inherited(arguments);
		this.loadSample("Sample1");
	},
	selectChange: function(inSender) {
		this.loadSample(inSender.hasNode().value);
	},
	loadSample: function(inSample) {
		this.$.codeEditor.setUrl("source/samples/" + inSample + ".js");
	},
	go: function() {
		this.$.codePlayer.go(this.$.codeEditor.getValue());
	}
});