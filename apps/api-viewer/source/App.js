enyo.kind({
	name: "App",
	kind: "Control",
	layoutKind: "VBoxLayout",
	target: "../../enyo/source",
	components: [
		{kind: "Doc", onFinish: "info", onReport: "report"},
		{name: "db", kind: "InfoDb"},
		{kind: "Formatter"},
		{kind: "Formatter2"},
		{name: "header", height: 50, content: "Enyo API Viewer"},
		{kind: "HBox", height: "fill", components: [
			// indices
			{width: 350, kind: "VBox", components: [
				{height: 40, kind: "SimpleScroller", classes: "tabbar", style: "overflow: hidden; padding-bottom: 10px; background-color: #fff;", components: [
					{classes: "active tab", content: "Objects", ontap: "indexSelectorTap"},
					{classes: "tab", content: "Modules", ontap: "indexSelectorTap"},
					{classes: "tab", content: "Full Index", ontap: "indexSelectorTap"},
					{classes: "tab", content: "Search", ontap: "indexSelectorTap"}
				]},
				{xkind: "SimpleScroller", height: "fill", style: "overflow: auto;", components: [
					{name: "index", allowHtml: true, style: "padding: 10px; white-space: nowrap"},
					{name: "search", style: "font-size: 8pt; padding: 8px; background-color: white;", showing: false, components: [
						{name: "input", kind: "input"}, 
						{kind: "Button", content: "Search", ontap: "searchTap"},
						{name: "searchIndex", allowHtml: true}
					]}
				]}
			]},
			// main
			{kind: "VBox", width: "fill", components: [
				// tabs'n'stuff
				{height: 92, style: "border-bottom: 1px solid red; box-sizing: border-box;", components: [
					{name: "group", kind: "SimpleScroller", classes: "tabbar", style: "overflow: hidden; padding-bottom: 10px; background-color: #fff;"},
					{name: "status", content: "Status", style: "background-color: black; color: yellow;", showing: false},
					{style: "padding: 4px", onchange: "refresh", components: [
						{tag: "label", style: "margin-right: 16px;", components: [
							{tag: "span", content: "inherited"},
							{name: "inheritedOption", tag: "input", attributes: {type: "checkbox"}}
						]},
						{tag: "label", components: [
							{tag: "span", content: "protected"},
							{name: "protectedOption", tag: "input", attributes: {type: "checkbox"}}
						]}
					]}
				]},
				/*
				{kind: "VBox", height: 0, showing: false, components: [
					{name: "search", height: 100, style: "font-size: 8pt; overflow: auto; border-bottom: 2px solid silver; padding: 8px; box-sizing: border-box;", components: [
						{name: "input", kind: "input"}, {kind: "Button", content: "Search", ontap: "searchTap"},
						{name: "stuff3"}
					]},
					{name: "stuff", height: 200, style: "font-size: 8pt; overflow: auto; border-bottom: 2px solid silver; padding: 8px; box-sizing: border-box;"},
					{name: "stuff2", height: 300, style: "font-size: 8pt; overflow: auto; border-bottom: 2px solid silver; padding: 8px; box-sizing: border-box;"}
				]},
				*/
				// main docs
				{xkind: "SimpleScroller", style: "padding: 10px; overflow: auto;", height: "fill", components: [
					{name: "docs2", content: "<b>Loading...</b>", onclick: "docClick", allowHtml: true}
				]},
				{xkind: "SimpleScroller", style: "padding: 10px; overflow: auto;", height: 1, showing: false, components: [
					{name: "docs", content: "<b>Loading...</b>", onclick: "docClick", allowHtml: true}
				]}
				//{width: "fill", name: "docs2", style: "Xfont-size: 8pt; overflow: auto; border-bottom: 2px solid silver; padding: 8px; box-sizing: border-box;"}
			]}
		]}
	],
	create: function() {
		this.inherited(arguments);
		this.addClass("enyo-fit enyo-unselectable");
		this.selectViewByIndex(0);
		window.onhashchange = enyo.bind(this, 'hashChange');
		//enyo.asyncMethod(this.$.doc, "walkEnyo", enyo.path.rewrite(this.target));
		//this.$.doc.walkEnyo(enyo.path.rewrite("$enyo/source"));
		this.$.doc.walkEnyo(enyo.path.rewrite(this.target));
	},
	report: function(inSender, inAction, inName) {
		this.$.docs.setContent("<b>" + inAction + (inName ? "</b>: <span style='color: green;'>" + inName + "</span>" : ""));
	},
	info: function() {
		this.$.db.dbify(this.$.doc.$.walker.modules);
		this.propIndex = this.$.db.listAllProperties();
		/*
		//
		this.$.stuff.setContent(""
			+ "<h2>Kinds:</h2>"
			+ this.$.db.dumpKinds()
			+ "<h2>Other:</h2>"
			+ this.$.db.dumpObjects(this.$.db.objects)
			+ "<h2>Packages:</h2>"
			+ this.$.db.dumpPackages()
			+ "<h2>ALL Properties:</h2>"
			+ this.$.db.dumpProperties(this.propIndex)
		);
		//
		var k = this.$.db.kinds[3];
		this.$.stuff2.setContent(""
			+ "<h1>" + k.name + "</h1>"
			+ this.$.db.formatKindTree(k)
			+ this.$.db.dumpProperties(this.$.db.listInheritedProperties(k))
		);
		*/
		//
		this.renderKindDocs(this.$.db.kinds[3]);
		/*
		var p = this.$.db.listInheritedProperties(k);
		p = this.$.db.filterProperties(p, ["method", "public"]);
		this.$.stuff4.setContent(""
			+ "<h1>" + k.name + "</h1>"
			+ (k.kind ? '<span style="background-color: lightgreen; font-size: small; italic; border-radius: 14px; padding: 3px 6px;">kind</span>' : '<span style="background-color: lightblue; font-size: small; italic; border-radius: 9px; padding: 3px 5px;">object</span>')
			+ "<h2>Extends</h2>"
			+ this.$.db.formatKindTree(k)
			+ "<h2>Properties</h2>"
			+ this.$.db.dumpProperties(p)
		);
		*/
		//
		//this.$.toc.setContent(this.$.doc.buildToc());
		this.$.index.setContent(this.$.doc.buildIndex());
		this.selectTopic(window.location.hash.slice(1) || "enyo.Component");
	},
	renderKindDocs: function(inKind) {
		this.showInherited = this.$.inheritedOption.hasNode().checked;
		this.showProtected = this.$.protectedOption.hasNode().checked;
		this.$.docs2.setContent(this.$.formatter2.formatKind(inKind, this.$.db, this.showInherited, this.showProtected));
	},
	refresh: function() {
		this.selectTopic(this.topic);
		//this.showInherited = this.$.inheritedOption.hasNode().checked;
	},
	indexSelectorTap: function(inSender) {
		enyo.forEach(inSender.container.getClientControls(), function(inTab) {
			inTab.addRemoveClass("active", inTab == inSender);
		});
		var i = inSender.container.indexOfClientControl(inSender);
		switch(i) {
			case 0: 
				this.$.index.setContent(this.$.doc.buildIndex());
				break;
			case 1:
				this.$.index.setContent(this.$.db.dumpPackages());
				break;
			case 2:
				this.$.index.setContent(this.$.formatter2.formatIndex(this.$.formatter2.filterProperties(this.propIndex, ["public"])));
				break;
			case 3:
				this.$.index.setContent(this.$.db.dumpPackages());
				break;
		}
		this.$.index.setShowing(i!=3);
		this.$.search.setShowing(i==3);
	},
	searchTap: function() {
		var value = '';
		if (this.$.input.hasNode()) {
			value = this.$.input.node.value.toLowerCase();
		}
		var results = [];
		for (var i=0, p; p=this.propIndex[i]; i++) {
			if (p.name.toLowerCase().indexOf(value) >= 0) {
				results.push(p);
			}
		}
		this.$.searchIndex.setContent(results.length ? this.$.db.dumpProperties(results) : "no results");
	},
	hashChange: function(inEvent) {
		var topic = window.location.hash.slice(1);
		if (topic != this.topic) {
			this.selectTopic(topic);
		}
	},
	selectViewByIndex: function(inIndex) {
		this.$.docs.setShowing(false);
		//this.$.index.setShowing(false);
		//this.$.toc.setShowing(false);
		[this.$.docs, this.$.index, this.$.toc][inIndex].setShowing(true);
	},
	backClick: function() {
		window.history.back();
	},
	topicSelect: function(inSender) {
		var item = inSender;
		if (item.topic) {
			window.location.href = "#" + item.topic;
		}
	},
	closeTopicClick: function(inSender) {
		inSender.destroy();
	},
	tocClick: function(inSender, inEvent) {
		try {
			this.selectTopic(inEvent.target.hash.slice(1));
		} catch(x) {
		}
	},
	docClick: function(inSender, inEvent) {
		try {
			this.selectTopic(inEvent.target.parentNode.hash.slice(1));
		} catch(x) {
		}
	},
	selectTopic: function(inTopic) {
		this.topic = inTopic;
		//
		// find the topic object
		var c = Module.topicMap2[inTopic];
		var n = c.name && c.name.value;
		var kind = this.$.db.kindByName(n);
		if (kind) {
			this.renderKindDocs(kind);
		}
		//
		if (inTopic == "toc") {
			this.selectViewByIndex(0);
			this.$.docs.setContent(this.$.doc.buildToc());
		} else if (inTopic == "index") {
			// go to index view
			this.selectViewByIndex(1);
		} else {
			// go to content view
			this.selectViewByIndex(0);
			// find the topic object
			var c = Module.topicMap2[inTopic];
			//var c = Module.topicMap[inTopic];
			// locate the dom node in the index for this topic
			//var a = enyo.dom.byId("idx_" + inTopic);
			// text in-case-of-fail
			var h = "(no topic)";
			if (c) {
				h = this.$.formatter.format(c);
				//h = this.$.formatter.formatModule(c.path, c.module);
			}
			this.$.docs.setContent(h);
			// scroll the topic into view, if it's part of a larger document
			a = document.anchors[inTopic];
			if (a) {
				//a.scrollIntoView();
			}
		}
		// activate the correct tabs, create a new one
		var tab = null;
		enyo.forEach(this.$.group.getClientControls(), function(inC) {
			if (inC.topic == inTopic) {
				tab = inC;
			}
			inC.addRemoveClass("active", inC.topic == inTopic);
		});
		if (!tab) {
			tab = this.$.group.createComponent({kind: "TopicTab", classes: "active", topic: inTopic, ondown: "topicSelect", onClose: "closeTopicClick", owner: this}).render();
		}
		tab.hasNode().scrollIntoView();
	}
});

enyo.kind({
	name: "SimpleScroller",
	kind: "Control",
	dragstartHandler: function() {
		this.x0 = this.hasNode().scrollLeft;
		this.y0 = this.hasNode().scrollTop;
	},
	dragHandler: function(inSender, inEvent) {
		this.hasNode().scrollLeft = this.x0 - inEvent.dx;
		this.hasNode().scrollTop = this.y0 - inEvent.dy;
	}
});

/*
enyo.kind({
	name: "Tabbar",
	kind: "Control",
	create: function() {
		this.inherited(arguments);
		this.addClass("tabbar");
	},
	removeControl: function() {
		this.inherited(arguments);
		if (this.hasNode() && this.overflowAmount() <= 0) {
			this.node.style.left = "0";
		}
	},
	overflowAmount: function() {
		var n = this.hasNode();
		return n.clientWidth - n.scrollWidth;
	},
	dragstartHandler: function() {
		this.x0 = this.hasNode().offsetLeft;
	},
	dragoverHandler: function(inSender, inEvent) {
		if (this.hasNode()) {
			var l = this.x0 + inEvent.dx;
			var d = this.overflowed();
			this.node.style.left = Math.min(0, Math.max(l, d)) + "px";
		}
	},
	dragfinishHandler: function(inSender, inEvent) {
		//inEvent.preventClick();
	}
});
*/

enyo.kind({
	name: "TopicTab",
	kind: "Control",
	events: {
		onClose: ""
	},
	components: [
		{tag: "span", name: "caption"},
		{tag: "img", style: "margin: 0; padding: 0 0 2px 6px; vertical-align: middle;", src: "images/close.png", onmousedown: "closeDown", onclick: "doClose"}
	],
	create: function() {
		this.inherited(arguments);
		this.addClass("tab");
		this.$.caption.setContent(this.topic);
	},
	closeDown: function(inSender, inEvent) {
		inEvent.stopPropagation();
	}
});
