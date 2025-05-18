const buildAdjacentGenerator = require('../../utils/grid-adjacents')

const coords = require('../../utils/raw-input')
	.trim()
	.split('\n')
	.map((l) => l.split(',').map(Number))

const size = 71
const firstCut = 1024
let map = []

const buildMap = (nBytes) => {
	map = [...Array(size)].map(() => Array(size).fill(0))
	const arr = coords.slice(0, nBytes)
	for (const [col, row] of arr) {
		map[row][col] = 1
	}
}

const toKey = (row, col) => row * size + col

const getAdjacent = buildAdjacentGenerator(size, size)

const part1 = (nBytes) => {
	buildMap(nBytes)
	const end = toKey(size - 1, size - 1)
	const visited = new Set([toKey(0, 0)])
	let q = [[0, 0]]
	let steps = 0
	while (q.length !== 0) {
		const next = []
		steps += 1
		for (const [row, col] of q) {
			const neighbors = getAdjacent(row, col)
			for (const [row, col] of neighbors) {
				if (map[row][col] === 1) continue
				const key = toKey(row, col)
				if (visited.has(key)) continue
				visited.add(key)
				next.push([row, col])
				if (key === end) return steps
			}
		}
		q = next
	}
	return null
}

const part2 = () => {
	let min = firstCut
	let max = coords.length - 1
	let res = null
	while (min <= max) {
		const mid = (min + max) >> 1
		const blocks = part1(mid + 1) === null
		if (blocks) {
			res = mid
			max = mid - 1
		} else {
			min = mid + 1
		}
	}
	return coords[res]
}

console.log('Part 1:', part1(firstCut))
console.log('Part 2:', part2())
