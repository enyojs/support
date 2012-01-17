enyo.kind({
	name: "Formatter",
	kind: "Formatlets",
	processKind: function(c) {
		var props = [];
		// merge properties from the 'published' declaration into a master list of properties
		if (c.published && c.published.value.properties) {
			var p$ = c.published.value.properties.map;
			for(var p in p$) {
				// put these properties in 'published' group
				p$[p].group = "published";
				props.push(p$[p]);
			}
		}
		// copy standard properties
		p$ = c.properties.map;
		for(var p in p$) {
			props.push(p$[p]);
		}
		// return processed kind data
		return {
			name: c.name.value,
			props: props,
			comment: this.formatComment(c.comment),
			kindLink: c.kind && this.formatLinkName(c.kind.value)
		};
	},
	filterProps: function(inProps, inGroups) {
		var list = [];
		for (var i=0, p, v; p=inProps[i]; i++) {
			if (p && (!inGroups || (inGroups[p.group]))) {
				list.push(p);
			}
		}
		return list;
	},
	dumpPropList: function(inTitle, inList, inHtml) {
		if (inList) {
			inHtml.push('<h2>' + inTitle + '</h2>');
			for (var i=0, p; p=inList[i]; i++) {
				inHtml.push(enyo.macroize("{$name} ({$group})<br/>", p));
			}
		}
	},
	formatKind: function(c, html) {
		var kind = this.processKind(c);
		html.push(enyo.macroize('<h1><a name="{$name}">{$name}</a></h1>', kind));
		html.push(kind.comment);
		//
		if (c.kind) {
			html.push('<h2>Extends</h2>');
			html.push('<h4>' + kind.kindLink + '</h4>');
		}
		//
		var alphaCompare = function(inA, inB) {
			if (inA.name < inB.name) {
				return -1;
			} else if (inA.name > inB.name) {
				return 1;
			}
			return 0;
		};
		var groupCompare = function(inA, inB) {
			var values = {published: 0, public: 1, protected: 2};
			return -(values[inA.group] - values[inB.group]);
		};
		//
		kind.props.sort(groupCompare);
		//
		//this.dumpPropList("Props", this.getPropList(c.published.value.properties), html);
		this.dumpPropList("Props", kind.props, html);
		//
		this.addProperties(c.published, "Published Properties", html);
		this.addProperties(c.events, "Published Events", html);
		this.addMethods(c.methods, "Methods", html);
		this.addInherited(c, "Inheritance", html);
	}
});
