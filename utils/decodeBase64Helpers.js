export function decodeArray(encodedArray) {
	const separator = "#;";
	return encodedArray.split(separator).map(el => b64DecodeUnicode(el));
}

export function b64DecodeUnicode(str) {
	// Going backwards: from bytestream, to percent-encoding, to original string.
	return decodeURIComponent(atob(str).split("").map(function (c) {
		return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(""));
}