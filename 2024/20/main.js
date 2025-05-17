const rawInput = require('../../utils/raw-input.js')
const map = rawInput.trim().split('\n')

const rows = map.length,
	cols = map[0].length,
	START = 'S',
	END = 'E',
	WALL = '#'

let start, end
for (let row = 0; row < rows; row++) {
	for (let col = 0; col < cols; col++) {
		const cell = map[row][col]
		if (cell === START) start = { row, col }
		else if (cell === END) end = { row, col }
	}
}
const costMap = {}
const toStateKey = (row, col, cheat) => (row * cols + col) * 4 + cheat
const isValidPos = (r, c) => r >= 0 && r < rows && c >= 0 && c < cols
const isWall = (row, col) => map[row][col] === WALL
const buildItem = (row, col, cheat) => ({ row, col, cheat })
const itemKey = ({ row, col, cheat }) => toStateKey(row, col, cheat)
const isTangible = (cheat) => cheat === 0 || cheat === 3
const getAdjacent = (row, col) => {
	const res = []
	for (let i = 0; i < 4; ++i) {
		const newRow = i & 1 ? row + 1 - (i & 2) : row
		const newCol = i & 1 ? col : col + 1 - (i & 2)
		if (isValidPos(newRow, newCol)) res.push([newRow, newCol])
	}
	return res
}
const updateCost = (key, newCost) => {
	const currCost = costMap[key]
	if (currCost !== undefined && currCost <= newCost) return false
	costMap[key] = newCost
	return true
}
const prevCheats = { 0: [0], 1: [0], 2: [1], 3: [2, 3] }
const nextCheats = { 0: [0, 1], 1: [2], 2: [3], 3: [3] }
const fillCostMap = () => {
	const first = buildItem(end.row, end.col, 3)
	costMap[itemKey(first)] = 0
	let q = [first]
	let cost = 0
	while (q.length !== 0) {
		const next = []
		cost += 1
		for (const item of q) {
			getAdjacent(item.row, item.col).forEach(([row, col]) => {
				prevCheats[item.cheat].forEach((cheat) => {
					if (isTangible(cheat) && isWall(row, col)) return
					if (cheat === 1 && !isWall(row, col)) return
					if (updateCost(toStateKey(row, col, cheat), cost)) {
						next.push(buildItem(row, col, cheat))
					}
				})
			})
		}
		q = next
	}
}
console.log(rawInput)
const log = (row1, col1, row2, col2) => {
	console.log('')
	const copy = map.map((l) => l.split(''))
	copy[row1][col1] = 1
	copy[row2][col2] = 2
	console.log(copy.map((l) => l.join('')).join('\n'))
}
const countCheatsWithThreshold = (threshold) => {
	const first = buildItem(start.row, start.col, 0)
	const visited = new Set([itemKey(first)])
	let q = [first]
	let cost = 0
	let count = 0
	while (q.length !== 0) {
		const next = []
		cost += 1
		for (const { row, col, cheat } of q) {
			getAdjacent(row, col).forEach(([row, col]) => {
				nextCheats[cheat].forEach((cheat) => {
					const key = toStateKey(row, col, cheat)
					if (visited.has(key)) return
					if (cost + (costMap[key] ?? Infinity) > threshold) return
					visited.add(key)
					next.push(buildItem(row, col, cheat))
					if (cheat !== 1) return
					let one = [row, col]
					getAdjacent(row, col).forEach(([row, col]) => {
						const key = toStateKey(row, col, 2)
						const pathCost = cost + 1 + (costMap[key] ?? Infinity)
						if (pathCost <= threshold) {
							count += 1
							log(...one, row, col)
						}
					})
				})
			})
		}
		q = next
	}
	return count
}
const main = () => {
	const t0 = performance.now()
	fillCostMap()
	const nonCheatingTime = costMap[toStateKey(start.row, start.col, 3)]
	const optimalCheatingTime = costMap[toStateKey(start.row, start.col, 0)]
	const t1 = performance.now()
	const numberOfGoodCheats = countCheatsWithThreshold(nonCheatingTime - 64)
	const t2 = performance.now()
	console.log('Non-cheating time:', nonCheatingTime)
	console.log('Optimal cheating time:', optimalCheatingTime)
	console.log('Elapsed time:', t1 - t0, 'ms')
	console.log('Number of good cheats:', numberOfGoodCheats)
	console.log('Elapsed time:', t2 - t1, 'ms')
}
main()
