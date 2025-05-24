const input = require('../../utils/raw-input').trim().split('\n').map(Number)
const mod = (1 << 24) - 1
const nxt = (s) => {
	s = ((s << 6) ^ s) & mod
	s = ((s >> 5) ^ s) & mod
	s = ((s << 11) ^ s) & mod
	return s
}
const jmp = (s, n) => {
	for (let i = 0; i < n; i++) s = nxt(s)
	return s
}
console.log(
	'Part 1:',
	input.map((x) => jmp(x, 2000)).reduce((a, b) => a + b, 0)
)
const results = {}
const solveFor = (s) => {
	const occurred = new Set()
	let curr = 0
	for (let i = 0; i < 2000; ++i) {
		const prev = s
		s = nxt(s)
		const newPrice = s % 10
		const oldPrice = prev % 10
		const dt = newPrice - oldPrice + 9
		curr = (curr * 18 + dt) % 18 ** 4
		if (i < 3 || occurred.has(curr)) continue
		occurred.add(curr)
		results[curr] = (results[curr] ?? 0) + newPrice
	}
}
input.forEach(solveFor)
let combo = null,
	val = -Infinity
for (const key in results) {
	const newVal = results[key]
	if (newVal <= val) continue
	combo = key
	val = newVal
}
const seq = []
for (let i = 0; i < 4; ++i) {
	seq[3 - i] = (Math.floor(combo / 18 ** i) % 18) - 9
}
console.log('Part 2:', { seq, val })
