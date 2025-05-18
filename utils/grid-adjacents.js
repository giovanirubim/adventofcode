function buildAdjacentGenerator(rows, cols) {
	return (row, col) => {
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
}

module.exports = buildAdjacentGenerator
