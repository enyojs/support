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

/** generate a new cypher alphabet for the letters A-Z where no
	encrypted letter maps to the original one. The distribution is 
	probably not uniform, but it works well enough for game purposes */
function generateCypherAlphabet() {
	var alpha = [
		"A","B","C","D","E","F","G","H","I",
		"J","K","L","M","N","O","P","Q","R",
		"S","T","U","V","W","X","Y","Z"];
	// we'll go through alphabet and randomly swap each letter with
	// another letter in the string, rejecting swaps that would put a
	// letter back in its original position.
	for (var i = 0; i < 26; ++i) {
		var swapPos;
		do {
			swapPos = enyo.irand(26);
			// and skip over a swap that puts the letter
			// back in its original position
		} while (alpha[swapPos] === String.fromCharCode(65 + i) ||
			alpha[i] === String.fromCharCode(65 + swapPos));
		swapElements(alpha, i, swapPos);
	}
	return alpha;
}