const rawInput = require('../../utils/raw-input')
const map = rawInput.split('\n').map((l) => l.split('').map(Number))
const rows = map.length
const cols = map[0].length
const toKey = (row, col) => row * cols + col
const getAdjacent = (row, col) => {
	const res = []
	for (let i = 0; i < 4; ++i) {
		const newRow = i & 1 ? row + 1 - (i & 2) : row
		const newCol = i & 1 ? col : col + 1 - (i & 2)
		if (newRow < 0 || newRow >= rows) continue
		if (newCol < 0 || newCol >= cols) continue
		res.push([newRow, newCol])
	}
	return res
}
const score1 = (row, col) => {
	const ends = new Set()
	const dfs = (row, col, val) => {
		if (map[row][col] !== val) return
		if (val !== 9) {
			getAdjacent(row, col).forEach(([row, col]) => dfs(row, col, val + 1))
		} else {
			ends.add(toKey(row, col))
		}
	}
	dfs(row, col, 0)
	return ends.size
}
const score2 = (row, col) => {
	if (map[row][col] !== 0) return 0
	const countMap = { [toKey(row, col)]: 1 }
	const valueMap = { [toKey(row, col)]: 0 }
	let q = [[row, col]]
	let val = 0
	while (q.length !== 0) {
		const next = []
		val += 1
		for (const [row, col] of q) {
			console.log('exploring', row, col)
			const count = countMap[toKey(row, col)]
			getAdjacent(row, col).forEach(([row, col]) => {
				if (map[row][col] !== val) return
				const key = toKey(row, col)
				countMap[key] = (countMap[key] ?? 0) + count
				valueMap[key] = val
				if (val !== 9) next.push([row, col])
			})
		}
		q = next
	}
	let res = 0
	for (const key in valueMap) {
		if (valueMap[key] !== 9) continue
		res += countMap[key]
	}
	return res
}
let res1 = 0
let res2 = 0
for (let row = 0; row < rows; row++) {
	for (let col = 0; col < cols; col++) {
		res1 += score1(row, col)
		res2 += score2(row, col)
	}
}
console.log('Part 1:', res1)
console.log('Part 2:', res2)
