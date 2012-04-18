/* CryptoTweets, a game built using Enyo 2.0 */

/* common Unicode strings for use directly in content */
var Unicode = {
	nbsp: "\u00A0",
	mdash: "\u2014",
	leftwardArrow: "\u2190",
	upwardArrow: "\u2191",
	rightwardArrow: "\u2192",
	downwardArrow: "\u2193"
};

/** swap two elements of an array or object */
function swapElements(obj, idx1, idx2) {
	var hold = obj[idx1];
	obj[idx1] = obj[idx2];
	obj[idx2] = hold;
}
/** call a function for each letter in the range 'A' to 'Z'.
	Additional arguments are passed into the callback. */
function forEachLetter(that, fn) {
	// copy arguments into new array with space for letter in front */
	var args = enyo.cloneArray(arguments, 2);
	args.unshift("");

	var aCode = 'A'.charCodeAt(0);
	var zCode = 'Z'.charCodeAt(0);
	for (var chCode = aCode; chCode <= zCode; ++chCode) {
		args[0] = String.fromCharCode(chCode);
		fn.apply(that, args);
	}
}

/** takes a string, returns an array where the 0 element is the
	string truncated at the last space before length and the
	second string is the remainder after spaces are trimmed.
	remainder is null if there's nothing left. */
function wrapStringAtSpace(str, length) {
	str = str.replace(/ +/g, " ").trim();
	if (str.length <= length)
		return [str, null];

	/* chop string at length bytes */
	var trimmed = str.slice(0, length);
	/* find last space in string */
	var lastSpace = trimmed.lastIndexOf(' ');
	/* chop off spaces and left over characters */
	if (lastSpace !== -1) {
		trimmed = trimmed.slice(0, lastSpace).trim();
	}
	/* prepare remainder using offsets */
	remainder = str.slice(trimmed.length).trim();
	return [trimmed, remainder];
}

/** identify hashtags in a string and save start & end
	positions to an array for use in determining if they should be
	encrypted or not */
function findHashTags(str) {
	var hashTagRE = /#[a-zA-Z0-9_]+/g;
	var results = [];
	var match;
	while ((match = hashTagRE.exec(str))) {
		results.push(match.index, match.index + match[0].length - 1);
	}
	return results;
}

