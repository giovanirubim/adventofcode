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

const sum = array1
	.map((val, i) => Math.abs(val - array2[i]))
	.reduce((a, b) => a + b, 0)

console.log(sum)
