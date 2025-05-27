const rawInput = require('../../utils/raw-input')
const map = rawInput.trim().split('\n')
const rows = map.length
const cols = map[0].length
const groups = {}
for (let i = 0; i < rows; ++i) {
	for (let j = 0; j < cols; ++j) {
		const val = map[i][j]
		if (val === '.') continue
		let group = groups[val]
		if (group === undefined) {
			group = []
			groups[val] = group
		}
		const pos = [i, j]
		group.push(pos)
	}
}
const nodes = new Set()
function addNode(row, col) {
	if (row >= 0 && row < rows && col >= 0 && col < cols) {
		nodes.add(row * cols + col)
	}
}
function createNodesV1([ai, aj], [bi, bj]) {
	const di = bi - ai
	const dj = bj - aj
	addNode(bi + di, bj + dj)
	addNode(ai - di, aj - dj)
}
function gdc(a, b) {
	while (b !== 0) {
		const t = b
		b = a % b
		a = t
	}
	return a
}
function shoot(i, j, di, dj) {
	while (i >= 0 && i < rows && j >= 0 && j < cols) {
		addNode(i, j)
		i += di
		j += dj
	}
}
function createNodesV2([ai, aj], [bi, bj]) {
	let di = bi - ai
	let dj = bj - aj
	const f = gdc(Math.abs(di), Math.abs(dj))
	di /= f
	dj /= f
	shoot(ai, aj, di, dj)
	shoot(ai, aj, -di, -dj)
}
for (const name in groups) {
	const group = groups[name]
	for (let i = 1; i < group.length; ++i) {
		const a = group[i]
		for (let j = 0; j < i; ++j) {
			const b = group[j]
			createNodesV2(a, b)
		}
	}
}
console.log(nodes.size)
