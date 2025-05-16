const MinHeap = require('./min-heap.js')
const n = 1e5
const values = []
const h = new MinHeap((a, b) => a - b)
for (let i = 0; i < n; ++i) {
	const val = (Math.random() * n * 10) | 0
	values.push(val)
	h.push(val)
}
const expected = values.sort((a, b) => a - b).join(',')
const output = []
while (h.length) {
	output.push(h.pop())
}
const actual = output.join(',')
console.log(`MinHeap test: ${actual === expected ? 'PASS' : 'FAIL'}`)
