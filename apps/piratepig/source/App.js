enyo.kind({
	name:"App",
	kind:"Control",
	hatsize: 48,
	hatmargin: 8,
	rows: 10,
	score: 0,
	canplay: true,
	moves: [],
	components:[
		{name:"bottom", classes:"overlap center bottom"},
		{name:"hats", style:"display: none;", components: [
			{kind:"Image", onload:"loadHandler", src:"images/game_bear.png"},
			{kind:"Image", onload:"loadHandler", src:"images/game_bunny_02.png"},
			{kind:"Image", onload:"loadHandler", src:"images/game_carrot.png"},
			{kind:"Image", onload:"loadHandler", src:"images/game_lemon.png"},
			{kind:"Image", onload:"loadHandler", src:"images/game_panda.png"},
			{kind:"Image", onload:"loadHandler", src:"images/game_piratePig.png"},
		]},
		// why can't there just be one standard that isn't wav?
		{name:"sounds", style:"display: none;", components:[
			{name:"three", kind:"GameAudio", src:["sounds/3.ogg", "sounds/3.mp3", "sounds/3.wav"], onEnded: "endedHandler"},
			{name:"four", kind:"GameAudio", src:["sounds/4.ogg", "sounds/4.mp3", "sounds/4.wav"], onEnded: "endedHandler"},
			{name:"fiveplus", kind:"GameAudio", src:["sounds/5.ogg", "sounds/5.mp3", "sounds/5.wav"], onEnded: "endedHandler"},
			{name:"whiff", kind:"GameAudio", src:["sounds/whiff.ogg", "sounds/whiff.mp3", "sounds/whiff.wav"], onEnded:"endedHandler"},
			{name:"theme", kind:"GameAudio", src:["sounds/theme.ogg", "sounds/theme.mp3", "sounds/theme.wav"], onEnded:"endedHandler"}
		]},
		{name:"title", classes:"hcenter banner", components:[
			{name:"score", classes:"score", content:"0"},
		]},
		{name:"backgroundbox", kind:"Canvas", attributes:{height:"560px", width:"560px"}, classes:"overlap hcenter", components:[
			{name:"background", kind:"canvas.Rectangle", bounds:{t:0, l:0, w:560, h:560}, color:"rgba(255,255,255,0.9)"},
		]},
		{name:"selectbox", kind:"Canvas", attributes:{height:"560px", width:"560px"}, classes:"overlap hcenter", components:[
			{name:"selector", kind:"Selector", color:"red"}
		]},
		{name:"hatbox", kind:"Canvas", attributes:{height:"560px", width:"560px"}, classes:"overlap hcenter border", ontap:"hatTap"}
	],
	create: function() {
		this.inherited(arguments);
		this.addClass("bg");
		// sounds only occur on user actions on ios
		if (navigator.userAgent.match(/i(?:pad|phone)/i)) {
			this.ios = true;
		}
	},
	loadHandler: function() {
		this.loaded = (this.loaded || 0) + 1;
		if (this.loaded == this.$.hats.getClientControls().length) {
			this.initHats();
		}
	},
	endedHandler: function() {
		enyo.job.stop(this.id + "enableSound");
		this.canplay = true;
	},
	getImage: function(inIndex) {
		return this.$.hats.getClientControls()[inIndex].hasNode();
	},
	getType: function() {
		return enyo.irand(this.$.hats.getClientControls().length);
	},
	scale: function() {
		var b = this.getBounds();
		var h = b.height;
		var w = b.width;
		var i, c;
		if (w < this.rows * 36 || h < (this.rows+1) * 36) {
			this.hatsize = 28;
			this.hatmargin = 4;
		} else if (w < this.rows * 56 || h < (this.rows+1) * 56) {
			this.hatsize = 32;
			this.hatmargin = 4;
		} else if (w > this.rows * 100 && h > (this.rows+1) * 100) {
			this.hatsize = 62;
			this.hatmargin = 10;
		} else {
			this.hatsize = 48;
			this.hatmargin = 8;
		}
		var s = (this.hatsize + this.hatmargin) * this.rows;
		this.$.title.applyStyle("width", s + "px");
		this.$.title.applyStyle("height", s/10 + "px");
		this.$.score.applyStyle("line-height", s/10 + "px");
		this.$.background.bounds.w = s;
		this.$.background.bounds.h = s;
		this.$.selector.setSize(this.hatsize);
		this.$.selector.setMargin(this.hatmargin);
		var hc = this.$.hatbox.getClientControls();
		for (i = 0; (h = hc[i]); i++) {
			h.setSize(this.hatsize);
			h.setMargin(this.hatmargin);
			h.iChanged();
			h.jChanged();
		}
		for (i = 0; (c = ["background", "select", "hat"][i]); i++) {
			this.$[c+"box"].setAttribute("width", s);
			this.$[c+"box"].setAttribute("height", s);
			this.$[c+"box"].update();
		}
	},
	initHats: function() {
		this.scale();
		this.$.hatbox.destroyClientControls();
		var col;
		this.map = [];
		var src, t, l;
		for (var i = 0; i < this.rows; i++) {
			// i = which column = x = left
			col = this.map[i] = [];
			for (var j = 0; j < this.rows; j++) {
				// j = which row = y = top
				var nhat = this.newHat(i,j);
				col.push(nhat);
			}
		}
		this.playSound(-1);
		this.start();
		this.splatMatches(this.checkMatches());
	},
	start: function() {
		this.pulse = setInterval(enyo.bind(this, "heartbeat"), 30);
	},
	stop: function() {
		clearInterval(this.pulse);
	},
	playSound: function(inNum, inUserEvent) {
		var iosplay = this.ios ? inUserEvent : true;
		if (this.canplay && iosplay) {
			this.canplay = false;
			var n;
			var delay = 0;
			if (inNum >= 5) {
				n = this.$.fiveplus;
				delay = 2800;
			} else if (inNum == 4) {
				n = this.$.four;
				delay = 800;
			} else if (inNum <= 3 && inNum > 0) {
				n = this.$.three;
				delay = 100;
			} else if (inNum == -1) {
				n = this.$.theme;
				delay = 6000;
			} else {
				n = this.$.whiff;
				delay = 2000;
			}
			n.play();
			enyo.job(this.id+"enableSound", enyo.bind(this,"endedHandler"), delay);
		}
	},
	hatTap: function(inSender, inEvent) {
		var t = inEvent.target;
		var x = inEvent.pageX - t.offsetLeft;
		var y = inEvent.pageY - t.offsetTop;
		var col = Math.floor(x / (this.hatsize + this.hatmargin));
		var row = Math.floor(y / (this.hatsize + this.hatmargin));
		var oh = this.map[col][row];
		var matches = 0;
		if (oh.animating) {
			return;
		}
		if (!this.selected) {
			this.selected = oh;
			this.$.selector.show(col, row);
		} else {
			var d = this.selected.distance(oh);
			// manhattan distance
			var md = Math.abs(d.di) + Math.abs(d.dj);
			if (md == 1) {
				matches = this.exchange(this.selected, oh);
			}
			// don't play sound if you tap the selected square again
			if (md !== 0) {
				this.playSound(matches, true);
			}
			this.selected = null;
			this.$.selector.hide();
		}
		this.$.selectbox.update();
	},
	distance: function(inHatA, inHatB) {
		return Math.abs(inHatA.i - inHatB.i) + Math.abs(inHatA.j - inHatB.j);
	},
	exchange: function(inA, inB) {
		var d = inA.distance(inB);
		var na = {i: inA.i + d.di, j: inA.j + d.dj};
		var nb = {i: inB.i - d.di, j: inB.j - d.dj};
		this.map[na.i][na.j] = inA;
		this.map[nb.i][nb.j] = inB;
		var matches = this.checkMatches();
		if (matches.length) {
			if (d.di) {
				this.moves.push(inA.moveX(d.di));
				this.moves.push(inB.moveX(-d.di));
			} else {
				this.moves.push(inA.moveY(d.dj));
				this.moves.push(inB.moveY(-d.dj));
			}
		}
		this.map[inA.i][inA.j] = inA;
		this.map[inB.i][inB.j] = inB;
		return matches.length;
	},
	checkMatches: function() {
		var matches = [];
		this._checkMatches(
			enyo.bind(this,"fget"),
			enyo.bind(this,"fmake"),
			matches
		);
		this._checkMatches(
			enyo.bind(this,"rget"),
			enyo.bind(this,"rmake"),
			matches
		);
		return matches;
	},
	fget: function(a,b) {
		return this.map[a][b].type;
	},
	rget: function(a,b) {
		return this.map[b][a].type;
	},
	fmake: function(a,b) {
		return {i:a,j:b};
	},
	rmake: function(a,b) {
		return {i:b,j:a};
	},
	_checkMatches: function(get, make, matches) {
		for (var i=0, t, c, k0; i<this.rows; i++) {
			c = 0;
			t = -1;
			for (var j=0, tt; j<this.rows; j++) {
				tt = get(i, j);
				if (t == -1) {
					t = tt;
					continue;
				}
				if (tt == t) {
					c++;
				}
				if (tt != t || j == this.rows-1) {
					k0 = j - c - 1;
					if (c >= 2) {
						if (j == this.rows-1 && tt == t) {
							k0++;
						}
						this.score += Math.pow(c,2) * 50;
						for (var k=k0; c>-1; k++,c--) {
							matches.push(make(i, k));
						}
					}
					c = 0;
					t = tt;
				}
			}
		}
	},
	splatMatches: function(inMatches) {
		for (var i=0, m; (m=inMatches[i]); i++) {
			this.splat(m.i, m.j);
		}
		if (inMatches.length) {
			this.playSound(inMatches.length);
		}
		this.$.score.setContent(this.score);
	},
	splat: function(i, j) {
		var hat0 = this.map[i][j];
		if (hat0.animating) {
			return;
		}
		this.map[hat0.i][hat0.j] = null;
		for (i=hat0.i, j=hat0.j-1; j>=0; j--) {
			var hat = this.map[i][j];
			if (hat) {
				this.map[i][j] = null;
				this.map[i][j+1] = hat;
				this.moves.push(hat.moveDown());
			}
		}
		var nhat = this.map[hat0.i][0] = this.newHat(hat0.i, -1);
		this.moves.push(nhat.moveDown());
		this.moves.push(hat0.splat());
	},
	heartbeat: function() {
		if (this.moves.length) {
			var live = [], i, m;
			for (i = 0; (m = this.moves[i]); i++) {
				if (m.move()) {
					live.push(m);
				}
			}
			this.moves = live;
			if (this.moves.length === 0) {
				this.splatMatches(this.checkMatches());
				// stabilze board
				var hc = this.$.hatbox.getClientControls();
				for (i = 0, h; (h = hc[i]); i++) {
					h.iChanged();
					h.jChanged();
				}
			}
			this.$.hatbox.update();
		}
	},
	newHat: function(i,j) {
		var type = this.getType();
		var image = this.getImage(type);
		return this.$.hatbox.createComponent({kind: "Hat", i: i, j: j, owner: this, image:image, type:type, bounds:{}, size:this.hatsize, margin:this.hatmargin});
	},
	resizeHandler: function() {
		enyo.job(this.id + "resize", enyo.bind(this, "rescale"), 100);
	},
	rescale: function() {
		this.stop();
		this.scale();
		this.start();
	},
	touchstartHandler: function() {
		if (this.ios && !this.iosfirstsound) {
			this.iosfirstsound = true;
			this.playSound(-1, true);
		}
	}
});
