const MinHeap = require('../../utils/min-heap')

const input = require('../../utils/raw-input')
	.trim()
	.split('\n')
	.map((l) => l.split(''))

const rows = input.length,
	cols = input[0].length,
	UP = 0,
	RIGHT = 1,
	DOWN = 2,
	LEFT = 3,
	START = 'S',
	END = 'E',
	WALL = '#',
	dirs = [UP, RIGHT, DOWN, LEFT],
	costMap = {}

const calcTurningCost = (prevDir, nextDir) => {
	const diff = Math.abs(nextDir - prevDir)
	return (diff === 3 ? 1 : diff) * 1000
}

const buildItem = (row, col, dir, cost) => ({ row, col, dir, cost })
const getCellKey = (row, col) => row * cols + col
const getStateKey = (row, col, dir) => getCellKey(row, col) * 4 + dir
const costFor = (stateKey) => costMap[stateKey] ?? Infinity

const findStartEnd = () => {
	let start, end
	for (let row = 0; row < rows; row++) {
		for (let col = 0; col < cols; col++) {
			const cell = input[row][col]
			if (cell === START) {
				start = { row, col }
			} else if (cell === END) {
				end = { row, col }
			}
		}
	}
	return { start, end }
}

const isValidCell = (row, col) =>
	row >= 0 && row < rows && col >= 0 && col < cols && input[row][col] !== WALL

const addNeighbor = (h, row, col, dir, cost) => {
	if (!isValidCell(row, col)) return
	const key = getStateKey(row, col, dir)
	const currentCost = costFor(key)
	if (cost >= currentCost) return
	costMap[key] = cost
	h.push(buildItem(row, col, dir, cost))
}

const addBackwardNeighbors = (h, { row, col, dir, cost }) => {
	for (const prevDir of dirs) {
		if (prevDir === dir) continue
		addNeighbor(h, row, col, prevDir, cost + calcTurningCost(prevDir, dir))
	}
	if (dir === UP) row += 1
	if (dir === RIGHT) col -= 1
	if (dir === DOWN) row -= 1
	if (dir === LEFT) col += 1
	addNeighbor(h, row, col, dir, cost + 1)
}

const getOptimalNeighbors = (row, col, dir) => {
	let bestCost = Infinity
	const res = []
	for (const nextDir of dirs) {
		if (nextDir === dir) continue
		const newCost =
			calcTurningCost(dir, nextDir) +
			costFor(getStateKey(row, col, nextDir))
		if (newCost > bestCost || newCost === Infinity) continue
		if (newCost < bestCost) res.length = 0
		res.push({ row, col, dir: nextDir })
		bestCost = newCost
	}
	if (dir === UP) row -= 1
	else if (dir === RIGHT) col += 1
	else if (dir === DOWN) row += 1
	else if (dir === LEFT) col -= 1
	if (isValidCell(row, col)) {
		const newCost = costFor(getStateKey(row, col, dir)) + 1
		if (newCost < bestCost) res.length = 0
		if (newCost <= bestCost) res.push({ row, col, dir })
	}
	return res
}

const countOptimalCells = (start) => {
	const visitedStates = new Set()
	const optimalCell = new Set()

	const stack = [{ ...start, dir: RIGHT }]
	optimalCell.add(getCellKey(start.row, start.col))

	while (stack.length) {
		const { row, col, dir } = stack.pop()
		const neighbors = getOptimalNeighbors(row, col, dir)
		for (const { row, col, dir } of neighbors) {
			optimalCell.add(getCellKey(row, col))
			const stateKey = getStateKey(row, col, dir)
			if (visitedStates.has(stateKey)) continue
			visitedStates.add(stateKey)
			stack.push({ row, col, dir })
		}
	}

	return optimalCell.size
}

const main = () => {
	const t0 = performance.now()
	const { start, end } = findStartEnd()
	const { row, col } = end
	const h = new MinHeap((a, b) => a.cost - b.cost)
	h.array = dirs.map((dir) => buildItem(row, col, dir, 0))
	for (const { row, col, dir } of h.array) {
		costMap[getStateKey(row, col, dir)] = 0
	}
	let min_cost, optimal_count
	while (h.length) {
		const item = h.pop()
		if (
			item.row === start.row &&
			item.col === start.col &&
			item.dir === RIGHT
		) {
			min_cost = item.cost
			break
		}
		addBackwardNeighbors(h, item)
	}
	const t1 = performance.now()
	optimal_count = countOptimalCells(start)
	const t2 = performance.now()
	console.log('Minimum cost:', min_cost)
	console.log('Number of optimal cells:', optimal_count)
	console.log('Part 1 elapsed time:', t1 - t0, 'ms')
	console.log('Part 2 elapsed time:', t2 - t1, 'ms')
}

main()
