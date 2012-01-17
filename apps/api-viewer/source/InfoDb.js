enyo.kind({
	name: "InfoDb",
	kind: "Component",
	dbify: function(inReaderModules) {
		this.kinds = [];
		this.objects = [];
		this.modules = this.buildModuleList(inReaderModules);
		this.packages = this.buildPackageList(this.modules);
		this.indexModules();
		this.processKinds();
		this.processInheritance();
	},
	hashToArray: function(inHash) {
		var results = [];
		for (var key in inHash) {
			var elt = inHash[key];
			elt.key = key;
			results.push(elt);
		}
		return results;
	},
	buildModuleList: function(inModuleHash) {
		//for (var key in inModuleHash) console.log(inModuleHash[key]);
		// FIXME: should lower level code produce an array directly?
		return this.hashToArray(inModuleHash);
	},
	buildPackageList: function(inModules) {
		var pkgs = {};
		for (var i=0, m, n, lc, p; m=inModules[i]; i++) {
			n = (m.package || "unknown");
			lc = n.toLowerCase();
			if (!pkgs[lc]) {
				pkgs[lc] = {
					package: n,
					modules: []
				}
			}
			p = pkgs[lc];
			p.modules.push(m);
		}
		return this.hashToArray(pkgs);
	},
	indexModules: function() {
		for (var i=0, m; m=this.modules[i]; i++) {
			this.indexObjects(m.module.objects);
		}
	},
	indexObjects: function(inObjects) {
		for (var i=0, o; o=inObjects[i]; i++) {
			if (o.name && o.type) {
				var n = o.type + 's';
				if (!this[n]) {
					this[n] = [];
				}
				this[n].push(o);
			}
		}
	},
	processKinds: function() {
		for (var i=0, k; k=this.kinds[i]; i++) {
			this.kinds[i] = this.processKind(k);
		}
	},
	processKind: function(k) {
		// transmute raw data into kind-specific info
		var info = {
			name: k.name.value,
			comment: k.comment,
			kind: true,
			superkinds: this.listSuperkinds(k)
		};
		info.properties = this.listKindProperties(k, info);
		return info;
	},
	findByName: function(inList, inName) {
		for (var i=0, k; k=inList[i]; i++) {
			if (k.name == inName) {
				return k;
			}
		}
	},
	kindByName: function(inName) {
		return this.findByName(this.kinds, inName);
	},
	listSuperkinds: function(inKind) {
		var supers = [], kind = inKind;
		while (kind && kind.kind) {
			var superName = kind.kind.value;
			if (!superName) {
				break;
			}
			supers.push(superName);
			var module = Module.topicMap[superName];
			kind = module && module.kindByName(superName);
		}
		return supers;
	},
	listKindProperties: function(inKind, inInfo) {
		var unmap = function(inMap, inFlag) {
			var result = [];
			for (var n in inMap) {
				var e = inMap[n];
				e[inFlag] = true;
				result.push(e);
			}
			return result;
		};
		//
		// copy methods
		var props = unmap(inKind.methods.map, "method");
		// copy non-method properties
		props = props.concat(unmap(inKind.properties.map, "property"));
		// copy published properties
		if (inKind.published && inKind.published.value.properties) {
			props = props.concat(unmap(inKind.published.value.properties.map, "published"));
		}
		for (var i=0, p; p=props[i]; i++) {
			// convert group id to flag
			p[p.group] = true;
			// refer each property record back to the kind info it came from (for tracking overrides)
			p.kind = inInfo;
		}
		return props;
	},
	processInheritance: function() {
		/*
		for (var i=0, k; k=this.kinds[i]; i++) {
			this.mergeInheritedProperties(k);
		}
		*/
	},
	nameCompare: function(inA, inB) {
		if (inA.name < inB.name) {
			return -1;
		}
		if (inA.name > inB.name) {
			return 1;
		} 
		return 0;
	},
	//
	// public methods
	//
	listInheritedProperties: function(inKind) {
		var all = [], map = {};
		//
		mergeProperties = function(inProperties) {
			for (var j=0, p; p=inProperties[j]; j++) {
				// look for overridden property
				var old = map.hasOwnProperty(p.name) && map[p.name];
				if (old) {
					// note the override, reference the previous instance
					p.overrides = old;
					// update array (only store latest property)
					var oldi = enyo.indexOf(old, all);
					all[oldi] = p;
					//console.log(inKind.name, ": found", p.name, "from", p.kind.name, "at index", oldi);
				} else {
					// new property
					all.push(p);
				}
				//console.log(inKind.name + ":", p.name, "(" + (all.length + 1) + ")");
				// update temporary property map
				map[p.name] = p;
			}
		}
		//
		for (var i=inKind.superkinds.length - 1, n; n=inKind.superkinds[i]; i--) {
			var sk = this.kindByName(n);
			if (sk) {
				mergeProperties(sk.properties);
			}
		}
		mergeProperties(inKind.properties);
		//
		all.sort(this.nameCompare);
		inKind.allProperties = all;
		//
		return all;
	},
	listAllProperties: function() {
		var all = [];
		var indexProperties = function(inProperties) {
			for (var i=0, p; p=inProperties[i]; i++) {
				all.push(p);
			}
		}
		for (var i=0, k; k=this.kinds[i]; i++) {
			indexProperties(k.properties);
		}
		all.sort(this.nameCompare);
		return all;
	},
	//
	dumpPackages: function() {
		var html = '';
		for (var i=0, p; p=this.packages[i]; i++) {
			html += p.package + "<br/>";
			for (var j=0, m; m=p.modules[j]; j++) {
				html += "&nbsp;&nbsp;&nbsp;&nbsp;" + m.rawPath + "<br/>";
			}
		}
		return html;
	},
	dumpProperties: function(inProperties) {
		var html = '';
		for (var i=0, p; p=inProperties[i]; i++) {
			html += "&nbsp;&nbsp;&nbsp;&nbsp;" + p.name 
				+ " (" + this.formatLink(p.kind.name) + ")"
				+ (p.method ? ' [<span style="color:blue">method</span>]' : '')
				+ (p.overrides ? ' [<span style="color:red">overrides ' + this.formatLink(p.overrides.kind.name) + '</span>]' : '')
				+ (p.published ? ' [<span style="color:green">published</span>]' : '')
				+ (p.property ? ' [<span style="color:magenta">property</span>]' : '')
				+ " *<b>"
				+ p.group
				+ "</b><br/>";
		}
		return html;
	},
	dumpKinds: function() {
		var html = '';
		for (var i=0, k; k=this.kinds[i]; i++) {
			html += 
				k.name + "<br/>"
				+ "&nbsp;&nbsp;Superkinds:<br/>"
				+ this.formatKindTree(k)
				+ "&nbsp;&nbsp;Properties:<br/>"
				+ this.dumpProperties(k)
				;
		}
		return html;
	},
	dumpObjects: function(inObjects) {
		var html = '';
		for (var i=0, o; o=inObjects[i]; i++) {
			html += o.name + "<br/>";
		}
		return html;
	},
	//
	// don't belong here, just expedient for now
	formatLink: function(inName) {
		return '<a href="#' + inName + '">' + inName + '</a>';
	},
	formatKindTree: function(inKind) {
		var html = '<div>';
		var suffix = "";
		for (var j=0, s; s=inKind.superkinds[j]; j++) {
			html += 
				"<ul><li>" 
				+ this.formatLink(s)
				+ "</li>";
			suffix += "</ul>";
		}
		return html + suffix + "</div>";
	},
	//
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
	}
});
