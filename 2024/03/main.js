const rawInput = require('../../utils/raw-input')
const regex = /mul\(\d{1,3},\d{1,3}\)|do(n't)?\(\)/
let src = rawInput
let enabled = true
let res = 0
while (src.length) {
	const match = src.match(regex)
	if (!match) break
	const [val] = match
	const { index } = match
	if (val === "don't()") {
		enabled = false
	} else if (val === 'do()') {
		enabled = true
	} else if (enabled) {
		const [a, b] = val.substring(4, val.length - 1).split(',')
		res += a * b
	}
	src = src.substring(index + val.length)
}
console.log(res)
