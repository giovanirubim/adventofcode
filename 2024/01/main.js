const inputName = process.argv[2] ?? './input.txt'
const input = require('fs')
	.readFileSync(inputName)
	.toString('utf-8')
	.split('\n')
	.map((l) => l.trim())
	.filter((l) => l)
	.map((l) => l.trim().split(/\s+/).map(Number))

const array1 = input.map((row) => row[0]).sort()
const array2 = input.map((row) => row[1]).sort()

const sum = array1.map((val, i) => Math.abs(val - array2[i])).reduce((a, b) => a + b, 0)

const countMap = {}
for (const val of array2) {
	countMap[val] = (countMap[val] ?? 0) + 1
}
let score = 0
for (const val of array1) {
	score += val * (countMap[val] ?? 0)
}

console.log('Part 1:', sum)
console.log('Part 2:', score)
