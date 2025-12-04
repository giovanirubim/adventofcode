import fs from 'fs';

const solve = (text) => {
	const lines = text.trim().split('\n');
	const grid = lines.map((l) => l.split(''));
	const n = grid.length;
	const m = grid[0].length;
	const getNeighbors = (i, j) => {
		const res = [];
		for (let di = -1; di <= 1; di++) {
			for (let dj = -1; dj <= 1; dj++) {
				if (di === 0 && dj === 0) continue;
				if (grid[i + di]?.[j + dj] === '@') {
					res.push([i + di, j + dj]);
				}
			}
		}
		return res;
	};
	const checkList = [];
	const isInCheckList = {};
	const add = (i, j) => {
		const key = i * m + j;
		if (isInCheckList[key]) return;
		isInCheckList[key] = true;
		checkList.push([i, j]);
	};
	const pop = () => {
		const item = checkList.pop();
		const [i, j] = item;
		const key = i * m + j;
		isInCheckList[key] = false;
		return item;
	};
	const isRemovable = (i, j) => getNeighbors(i, j).length < 4;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if (grid[i][j] !== '@') continue;
			add(i, j);
		}
	}
	let res = 0;
	while (checkList.length !== 0) {
		const [i, j] = pop();
		if (!isRemovable(i, j)) continue;
		grid[i][j] = '.';
		res += 1;
		getNeighbors(i, j).forEach(([i, j]) => add(i, j));
	}
	return res;
};

const inputText = fs.readFileSync('input.txt', 'ascii');
const start = performance.now();
const res = solve(inputText);
const end = performance.now();

console.log('Result:', res);
console.log('Runtime:', end - start, 'ms');
