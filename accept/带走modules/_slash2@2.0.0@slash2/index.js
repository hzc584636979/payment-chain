'use strict';
module.exports = function(input) {
	const isExtendedLengthPath = /^\\\\\?\\/.test(input);

	if (isExtendedLengthPath) {
		return input;
	}

	return input.replace(/\\/g, '/');
};
