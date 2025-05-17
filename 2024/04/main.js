const rawInput = require('../../utils/raw-input')
const grid = rawInput.trim().split('\n')
const dirToIncs = {
	0: [-1, 0],
	1: [-1, +1],
	2: [0, +1],
	3: [+1, +1],
	4: [+1, 0],
	5: [+1, -1],
	6: [0, -1],
	7: [-1, -1],
}
const rows = grid.length
const cols = grid[0].length
const part1 = () => {
	const target = 'XMAS'
	let count = 0
	const match = (row, col, dir, index) => {
		if (index === target.length) return true
		if (row < 0 || row >= rows || col < 0 || col >= cols) return false
		if (grid[row][col] !== target[index]) return false
		const [incRow, incCol] = dirToIncs[dir]
		return match(row + incRow, col + incCol, dir, index + 1)
	}
	for (let row = 0; row < rows; ++row) {
		for (let col = 0; col < cols; ++col) {
			if (grid[row][col] !== target[0]) continue
			for (let dir = 0; dir < 8; ++dir) {
				count += match(row, col, dir, 0)
			}
		}
	}
	console.log('Part 1:', count)
}
const part2 = () => {
	let count = 0
	const get = (row, col) => {
		if (row < 0 || col < 0 || row >= rows || col >= cols) return '-'
		return grid[row][col]
	}
	const countMatches = (row, col) => {
		if (grid[row][col] !== 'A') return 0
		const a = get(row - 1, col - 1)
		const b = get(row + 1, col + 1)
		const c = get(row - 1, col + 1)
		const d = get(row + 1, col - 1)
		count += 'SMS'.includes(a + b) && 'SMS'.includes(c + d)
	}
	for (let row = 0; row < rows; ++row) {
		for (let col = 0; col < cols; ++col) {
			countMatches(row, col)
		}
	}
	console.log('Part 2:', count)
}
part1()
part2()
