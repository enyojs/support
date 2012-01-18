enyo.kind({
	name: "CustomFormatter",
	kind: enyo.Component,
	statics: {
		showdown: new Showdown.converter()
	},
	formatLink: function(inName) {
		return '<a href="#' + inName + '">' + inName + '</a>';
	},
	filterProperties: function(inProperties, inFlags) {
		var result = [];
		for (var i=0, p; p=inProperties[i]; i++) {
			for (var j=0, f; f=inFlags[j]; j++) {
				if (!p[f]) {
					break;
				}
			}
			if (!f) {
				result.push(p);
			}
		}
		return result;
	},
	formatKindProperties: function(inKind, inProperties) {
	}
});

enyo.kind({
	name: "Formatter2",
	kind: CustomFormatter,
	//
	/*
	formatFullIndex: function(inProperties) {
		var html = '';
		for (var i=0, p; p=inProperties[i]; i++) {
			html += ''
				+ p.name 
				+ " (" + this.formatLink(p.kind.name) + ")"
				+ "<br/>"
				;
		}
		return html;
	},
	*/
	formatIndex: function(inProperties) {
		// collate by first letter 
		var map = {};
		for (var i=0, p; p=inProperties[i]; i++) {
			var n = p.name;
			// ignore 'enyo.' prefix
			var words = n.split(".");
			n = (words[0] == "enyo") ? words[1] || words[0] : n;
			// collate by first letter in name
			for (var j=0, c; (c=n[j]) && (c<'a' || c>'z'); j++);
			//console.log(t, fl);
			if (!map[c]) {
				map[c] = [];
			}
			map[c].push(p);
		}
		// output index
		var html = '';
		for (var i=0; i<26; i++) {
			var alpha = String.fromCharCode(97 + i);
			var list = map[alpha];
			if (list) {
				html += "<h2>" + alpha.toUpperCase() + "</h2><ul>";
				for (var j=0, p; p=list[j]; j++) {
					html += "<li>" 
						+ '<a href="#' + p.kind.name + '">' 
							+ p.name 
						+ '</a>'
						+ ' <span style="font-size: 70%">(' + p.kind.name + ')</span>'
						//
						//+ p.name 
						//+ ' <span style="font-size: 70%">(' + this.formatLink(p.kind.name) + ')</span>'
						//
						+ '</li>'
						;
				}
				html += '</ul>';
			}
		}
		return html;
	},
	//
	formatKind: function(inKind, inDb, inShowInherited, inShowProtected) {
		var filter = inShowProtected ? [] : ["public"];
		var p = !inShowInherited ? inKind.properties : inDb.listInheritedProperties(inKind);
		var tree = this.formatKindTree(inKind);
		return ""
			+ "<h1>" + inKind.name + "</h1>"
			+ '<span style="background-color: lightgreen; font-size: small; italic; border-radius: 14px; padding: 3px 6px;">kind</span>'
			+ (tree == '' ? '' : "<h2>Extends</h2>" + tree)
			+ '<p>' + Formatlets.showdown.makeHtml(inKind.comment) + '</p>'
			+ "<h2>Properties</h2>"
			+ this.formatKindProperties(inKind, this.filterProperties(p, ["property"].concat(filter)))
			//+ this.formatKindProperties(inKind, this.filterProperties(p, ["property"]))
			+ "<h2>Methods</h2>"
			+ this.formatKindProperties(inKind, this.filterProperties(p, ["method"].concat(filter)))
		;
	},
	formatKindTree: function(inKind) {
		var suffix = "", html = "";
		for (var j=0, s; s=inKind.superkinds[j]; j++) {
			html += 
				"<ul><li>" 
				+ this.formatLink(s)
				+ "</li>";
			suffix += "</ul>";
		}
		return html + suffix;
	},
	formatKindProperties: function(inKind, inProperties) {
		var html = '';
		for (var i=0, p; p=inProperties[i]; i++) {
			html += this[p.method ? "formatKindMethod" : "formatKindProperty"](inKind, p);
		}
		return html || "(none)";
	},
	formatKindMethod: function(inKind, p) {
		return ''
			+ "<div>"
				+ (p.kind == inKind 
					? (!p.overrides ? '' : '<span style="color:#FF7060; font-size: 70%;">' + this.formatLink(p.overrides.kind.name) + '</span>::')
					: '<span style="color:#6070FF; font-size: 70%;">' + this.formatLink(p.kind.name) + "</span>::")
				+ (!p.protected ? '' : '<span style="color:#660033">')
					+ "<b>" + p.name + "</b>"
				+ (!p.protected ? '' : '</span>')
				+ enyo.macroize(": <Xem>function</Xem>(<code><literal>{$args}</literal></code>)", p)
				//+ p.name
				+ (!p.comment ? '' : '<div style="padding-left: 16px">' + CustomFormatter.showdown.makeHtml(p.comment) + '</div>')
			+ "</div>"
			//+ "<br/>"
			;
	},
	formatKindProperty: function(inKind, p) {
		return ''
			+ "<div>"
				+ (p.kind == inKind ? '' : '<span style="color:#6070FF; font-size: 70%;">' + this.formatLink(p.kind.name) + "</span>::")
				+ (!p.protected ? '' : '<span style="color:#660033">')
					+ "<b>" + p.name + "</b>"
				+ (!p.protected ? '' : '</span>')
				+ (!p.property ? '' : ": " + p.value)
				+ (!p.comment ? '' : '<div style="padding-left: 16px">' + CustomFormatter.showdown.makeHtml(p.comment) + '</div>')
			+ "</div>"
			//+ "<br/>"
			;
	}
});
