const rawInput = require('../../utils/raw-input')
const schemes = rawInput.trim().split('\n\n')
const LOCK = 'LOCK'
const KEY = 'KEY'
const decodeScheme = (scheme) => {
	const type = scheme[0] === '#' ? LOCK : KEY
	const lines = scheme.split('\n')
	const heights = [-1, -1, -1, -1, -1]
	lines.forEach((l) => l.split('').forEach((char, i) => (heights[i] += char === '#')))
	return { type, heights }
}
const decodedSchemes = schemes.map(decodeScheme)
const keys = decodedSchemes.filter((scheme) => scheme.type === KEY)
const locks = decodedSchemes.filter((scheme) => scheme.type === LOCK)
const fits = (key, lock) => {
	for (let i = 0; i < 5; ++i) {
		if (key.heights[i] + lock.heights[i] > 5) return false
	}
	return true
}
let count = 0
for (let i = 0; i < keys.length; ++i) {
	for (let j = 0; j < locks.length; ++j) {
		count += fits(keys[i], locks[j])
	}
}
console.log('Part 1', count)
