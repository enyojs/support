// Should allow touch scrolling on all devices that do not have it natively.
enyo.Scroller.forceTouchScrolling = !enyo.Scroller.hasTouchScrolling();

/*
	A kind for displaying the ui of a simple search, list, detail app
*/
enyo.kind({
	name: "Viewer",
	kind: "Control",
	//* @public
	//* events this kind will fire
	events: {
		//* event fired when the user searches for a string
		onSearch: "",
		//* event fired when the user selects a search result
		onSelect: ""
	},
	//* @protected
	components: [
		// left panel
		{name: "left", classes: "enyo-fit", style: "width: 300px;", components: [
			// search controls
			{classes: "enyo-fit", style: "height: 39px;", components: [
				{classes: "enyo-fit", style: "right: 39px;", components: [
					{name: "input", classes: "enyo-fit search-input", tag: "input", attributes: {value: "waterfall"}},
					{name: "spinner", tag: "img", src: "images/spinner.gif", showing: false, classes: "search-spinner"}
				]},
				{classes: "enyo-fit search-button", style: "left: auto; width: 39px;", tag: "img", src: "images/search-button.png", ontap: "search"}
			]},
			// list
			{name: "results", kind: "Scroller", horizontal: false, style: "top: 39px;", classes: "enyo-fit list", ondragfinish: "preventDragTap"}
		]},
		// main panel
		{name: "main", classes: "enyo-fit", style: "left: 300px; background: black;", components: [
			// ui for navigating back to search panel when displayed in a small viewport.
			{name: "back", classes: "enyo-fit back-bar theme-fu dark", style: "height: 50px;", components: [
				{tag: "button", content: "Back", ontap: "showSearchView", ontouchstart: "preventTouchstart"}
			]},
			// space where users of this kind can insert controls.
			{name: "client", classes: "enyo-fit", style: "top: 50px; bottom: 100px;"},
			// related results list
			{name: "related", kind: "Scroller", vertical: false, style: "top: auto; height: 100px;", classes: "enyo-fit related-list", ondragfinish: "preventDragTap"}
		]}
	],
	//* called after this control is rendered
	rendered: function() {
		this.inherited(arguments);
		this.validateLayout();
	},
	//* called after this control is resized
	resizeHandler: function() {
		this.validateLayout();
	},
	//* @public
	//* a size at which to toggle between normal layout and a narrow layout, typically for small mobile devices.
	smallifyWidth: 800,
	//* @protected
	leftWidth: "300px",
	//* update layout based on size changes
	validateLayout: function() {
		var s = this.getBounds().width < this.smallifyWidth;
		if (s !== this.smallified) {
			this.smallified = s;
			this.$.left.applyStyle("width", s ? null : this.leftWidth);
			this.$.main.applyStyle("left", s ? "0" : this.leftWidth);
			this.$.client.applyStyle("top", s ? "50px" : "0");
			this.$.back.setShowing(this.smallified);
		}
		this.$.main.setShowing(!this.smallified || this.isViewingDetail);
		this.$.left.setShowing(!this.smallified || !this.isViewingDetail);
	},
	//* @public
	// in small layout mode, show the detail view
	showDetailView: function() {
		this.isViewingDetail = true;
		this.validateLayout();
	},
	// in small layout mode, show the search view
	showSearchView: function() {
		this.isViewingDetail = false;
		this.validateLayout();
	},
	//* @protected
	//* perform a searched based on user input, fires the onSearch event
	//* which is implemented to retrieve results, after which showResults should be called.
	search: function() {
		this.$.spinner.setShowing(true);
		this.doSearch(this.$.input.hasNode().value);
	},
	//* @public
	//* display the given search results
	showResults: function(inResults) {
		this.$.spinner.setShowing(false);
		this.$.results.destroyClientControls();
		this.results = inResults;
		for (var i=0,r; r=inResults[i]; i++) {
			this.$.results.createComponent({content: r.title || "Untitled", classes: "item", 
				ontap: "select", data: r, owner: this, attributes: {draggable: false}});
		}
		this.$.results.render();
	},
	//* @protected
	//* handle a user selection of a search result
	//* fire the onSelect event which is typically impelemented to display a result in the detail view.
	select: function(inSender) {
		this.showDetailView();
		this.doSelect(inSender.data);
	},
	//* @public
	//* display the given set of results in the related results view area.
	showRelatedResults: function(inResults) {
		this.$.related.destroyClientControls();
		for (var i=0, results=inResults, r; r=results[i]; i++) {
			this.$.related.createComponent({tag: "img", src: r.thumbnail, classes: "related-item", 
				ontap: "select", data: r, owner: this, attributes: {draggable: false}});
		}
		this.$.related.render();
	},
	//* @protected
	//* Prevent taps after the user drags. This is often useful in a region that is touch scrolled.
	//* In this case a tap event will be generated only when the user does not drag.
	preventDragTap: function(inSender, inEvent) {
		inEvent.preventTap();
	},
	//* prevent input from being focused when switching back to search view
	preventTouchstart: function(inSender, inEvent) {
		inEvent.preventDefault();
	}
});