module.exports = {
	globDirectory: '.',
	globPatterns: [
		'**/*.{js,php,html,json,png}'
	],
	swDest: 'sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};