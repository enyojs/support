examples = [
	{
		description: "Use <code>setValue</code> to set the value property.",
		code: 'this.$.input.setValue("fruits");'
	},
	{
		description: "To set HTML content, use <code>setContent</code>.",
		code: 'this.$.button.setContent("hello");'
	},
	{
		description: "Use <code>applyStyle</code> to affect DOM styles.",
		code: 'this.$.button.applyStyle("color", "red");'
	},
	{
		description: "To add a class value, use <code>addClass</code>.",
		code: 'this.$.button.addClass("pretty-button");'
	},
	{
		description: "To hide/show a control, use show() or hide().",
		code: 'this.$.button.hide();'
	},
	{
		description: "To create new control, use <code>createComponent</code>.",
		code: 'this.createComponent({tag: "button", content: "submit"});\nthis.render();'
	}
]

samples = "{name: \"input\", tag: \"input\"},\n" +
	"{tag: \"br\"},\n" + 
	"{name: \"button\", tag: \"button\", content: \"submit\"}";

enyo.kind({
	name: "App",
	kind: enyo.Control,
	components: [
		{classes: "enyo-fit", style: "right: 520px;", components: [
			{classes: "enyo-fit panel sampler-code-panel", style: "height: 280px;", components: [
				{classes: "sampler-title", content: "Component block to create:"},
				{name: "samplesCode", tag: "textarea", attributes: {rows: 10}, classes: "sampler-code"},
				{tag: "button", content: "Make It", classes: "pretty-button", ontap: "createSamples"},
				{tag: "button", content: "Reset", classes: "pretty-button", ontap: "reset"}
			]},
			{classes: "enyo-fit", style: "top: 280px; height: 20px;"},
			{kind: "Sampler", classes: "enyo-fit panel sampler-panel", style: "top: 300px;"}
		]},
		{classes: "enyo-fit", style: "left: auto; right: 500px; width: 20px;"},
		{name: "examples", classes: "enyo-fit panel examples-panel", style: "left: auto; width: 500px;", defaultKind: "Example"}
	],
	create: function() {
		this.inherited(arguments);
		this.$.examples.createComponents(examples, {owner: this});
	},
	rendered: function() {
		this.inherited(arguments);
		this.reset();
	},
	createSamples: function() {
		this.$.sampler.createSamples(this.$.samplesCode.hasNode().value);
	},
	reset: function() {
		this.$.samplesCode.hasNode().value = samples;
		this.createSamples();
	},
	tryIt: function(inSender) {
		this.$.sampler.evalCode(inSender.code);
	}
});

enyo.kind({
	name: "Sampler",
	kind: enyo.Control,
	evalCode: function(inCode) {
		eval(inCode);
	},
	evalObject: function(inCode) {
		return eval('(' + inCode + ')')
	},
	createSamples: function(inSamplesCode) {
		this.destroyClientControls();
		var s = this.evalObject(inSamplesCode);
		s = enyo.isArray(s) ? s : this.evalObject("[" + inSamplesCode + "]");
		this.createComponents(s);
		if (this.hasNode()) {
			this.render();
		}
	}
});

enyo.kind({
	name: "Example",
	kind: enyo.Control,
	published: {
		description: "",
		code: ""
	},
	events: {
		onTryIt: "tryIt"
	},
	components: [
		{name: "description"},
		{name: "code", tag: "textarea", classes: "code"},
		{tag: "button", content: "Try It", classes: "pretty-button", ontap: "tryItClick"}
	],
	create: function() {
		this.inherited(arguments);
		this.addClass("example")
		this.descriptionChanged();
		this.codeChanged();
	},
	descriptionChanged: function() {
		this.$.description.setContent(this.description);
	},
	codeChanged: function() {
		this.$.code.setContent(this.code);
	},
	tryItClick: function() {
		this.code = this.$.code.getValue();
		this.doTryIt();
	}
});
