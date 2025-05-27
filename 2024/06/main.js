const rawInput = require('../../utils/raw-input')
const map = rawInput
	.trim()
	.split('\n')
	.map((l) => l.split(''))
const rows = map.length
const cols = map[0].length
const dirMap = {
	'^': 0,
	'>': 1,
	v: 2,
	'<': 3,
}
const dirVec = [
	[-1, 0],
	[0, +1],
	[+1, 0],
	[0, -1],
]
const curr = {
	row: -1,
	col: -1,
	dir: -1,
	time: 0,
	inside: false,
}
const move = () => {
	let { row, col, dir } = curr
	const [incRow, incCol] = dirVec[dir]
	row += incRow
	col += incCol
	const inside = row >= 0 && row < rows && col >= 0 && col < cols
	if (inside && map[row][col] === '#') {
		curr.dir = (curr.dir + 1) & 3
	} else {
		curr.row = row
		curr.col = col
	}
	curr.inside = inside
	curr.time += 1
}
const reset = () => {
	for (let i = 0; i < rows; ++i) {
		for (let j = 0; j < cols; ++j) {
			const cell = map[i][j]
			if (cell !== '#' && cell !== '.') {
				curr.row = i
				curr.col = j
				curr.dir = dirMap[cell]
				curr.inside = true
				curr.time = 0
			}
		}
	}
}
const visitedCell = new Set()
const stateToTime = {}
const cellToTime = {}
const timeToState = []
const record = () => {
	const cell = curr.row * cols + curr.col
	const state = cell * 4 + curr.dir
	visitedCell.add(cell)
	stateToTime[state] = curr.time
	timeToState[curr.time] = state
	if (cellToTime[cell] === undefined) cellToTime[cell] = curr.time
}
reset()
while (curr.inside) {
	record()
	move()
}
console.log('Visited cells:', visitedCell.size)
reset()
const decodeState = (key) => {
	const dir = key & 3
	const cell = key >> 2
	const row = (cell / cols) | 0
	const col = cell % cols
	return { row, col, dir }
}
const setCell = (cell, val) => {
	const row = (cell / cols) | 0
	const col = cell % cols
	map[row][col] = val
}
let count = 0
for (const cell of visitedCell) {
	const time = cellToTime[cell]
	if (time === 0) continue
	const baseTime = time - 1
	const prev = decodeState(timeToState[baseTime])
	curr.row = prev.row
	curr.col = prev.col
	curr.dir = prev.dir
	curr.inside = true
	curr.time = baseTime
	const temp = new Set()
	setCell(cell, '#')
	for (;;) {
		move()
		if (!curr.inside) break
		const state = (curr.row * cols + curr.col) * 4 + curr.dir
		if (temp.has(state)) {
			count += 1
			break
		}
		temp.add(state)
		const time = stateToTime[state]
		if (time !== undefined && time < baseTime) {
			count += 1
			break
		}
	}
	setCell(cell, '.')
}
console.log('Loop causing cells:', count)
