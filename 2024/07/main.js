const rawInput = require('../../utils/raw-input')
const lines = rawInput.trim().split('\n')
let concat = true
const solvable = (test, args, i) => {
	const val = args[i]
	if (i === 0) return val === test
	const sub = test - val
	if (sub >= 0 && solvable(sub, args, i - 1)) return true
	const div = test / val
	if (Number.isInteger(div) && solvable(div, args, i - 1)) return true
	if (!concat) return false
	const strTest = test.toString()
	const strVal = val.toString()
	if (!strTest.endsWith(strVal)) return false
	const skip = strTest.length - strVal.length
	return solvable(strTest.substring(0, skip) * 1, args, i - 1)
}
;[false, true].forEach((concatVal) => {
	concat = concatVal
	let res = 0
	for (const line of lines) {
		const [test, ...args] = line.split(/[^\d]+/).map(Number)
		res += test * solvable(test, args, args.length - 1)
	}
	console.log(concat ? 'Part 2:' : 'Part 1:', res)
})
