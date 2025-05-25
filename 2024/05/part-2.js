const rawInput = require('../../utils/raw-input').trim()
const [rules, updates] = rawInput.split('\n\n')
const order = Object.fromEntries(rules.split('\n').map((rule) => [rule, true]))
const swap = (arr, i, j) => {
	const aux = arr[i]
	arr[i] = arr[j]
	arr[j] = aux
}
const needsSwap = (a, b) => order[b + '|' + a]
const solve = (update) => {
	const arr = update.split(',')
	const n = arr.length
	let changed = false
	for (let i = 0; i < n - 1; ++i) {
		for (let j = i + 1; j < n; ++j) {
			if (needsSwap(arr[i], arr[j])) {
				swap(arr, i, j)
				changed = true
			}
		}
	}
	return changed ? Number(arr[n >> 1]) : 0
}
const res = updates
	.split('\n')
	.map(solve)
	.reduce((a, b) => a + b, 0)
console.log(res)
