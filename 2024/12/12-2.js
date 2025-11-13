const grid = require('../../utils/raw-input').trim().split('\n');
const rows = grid.length;
const cols = grid[0].length;
const visited = Array(rows * cols);
const getType = ([i, j]) => (i < 0 || j < 0 || i >= rows || j >= cols ? null : grid[i][j]);
const incs = [
	[-1, 0],
	[0, +1],
	[+1, 0],
	[0, -1],
];
const add = ([ai, aj], [bi, bj]) => [ai + bi, aj + bj];
const rot = ([i, j]) => [j, -i];
const getKey = ([i, j]) => i * cols + j;
const dfs = (a) => {
	const key = getKey(a);
	if (visited[key] === true) return [0, 0];
	visited[key] = true;
	const aType = getType(a);
	let area = 1;
	let perimeter = 0;
	for (const inc of incs) {
		const b = add(a, inc);
		const bType = getType(b);
		if (bType === aType) {
			const [a, p] = dfs(b);
			area += a;
			perimeter += p;
			continue;
		}
		const dir = rot(inc);
		const aSide = add(a, dir);
		const bSide = add(b, dir);
		if (getType(aSide) !== aType || getType(bSide) === aType) {
			perimeter += 1;
		}
	}
	return [area, perimeter];
};
let res = 0;
for (let i = 0; i < rows; i++) {
	for (let j = 0; j < rows; j++) {
		const coord = [i, j];
		const [a, p] = dfs(coord);
		res += a * p;
	}
}
console.log(res);
