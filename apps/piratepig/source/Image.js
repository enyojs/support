enyo.kind({
     name: "Image",
     kind: "Control",
     tag: "img",
     attributes: {
          onload: "enyo.bubble(event)"
     }
});