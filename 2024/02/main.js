const rawInput = require('../../utils/raw-input')
const input = rawInput
	.trim()
	.split('\n')
	.map((line) => line.split(' ').map(Number))

const isSafe = (arr, index, prev, sign, skip) => {
	if (arr.length === index) return true
	const curr = arr[index]
	if (prev === null) {
		return isSafe(arr, index + 1, curr, sign, skip) || (skip && isSafe(arr, index + 1, prev, sign, false))
	}
	const diff = curr - prev
	const abs = Math.abs(diff)
	const newSign = Math.sign(diff)
	return (
		(abs > 0 && abs < 4 && (sign === 0 || sign === newSign) && isSafe(arr, index + 1, curr, newSign, skip)) ||
		(skip && isSafe(arr, index + 1, prev, sign, false))
	)
}

let count1 = 0
let count2 = 0
for (const row of input) {
	if (isSafe(row, 0, null, 0, false)) count1 += 1
	if (isSafe(row, 0, null, 0, true)) count2 += 1
}

console.log('Part 1:', count1)
console.log('Part 2:', count2)
