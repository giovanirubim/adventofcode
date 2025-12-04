import fs from 'fs';

const solve = (text) => {
	const grid = text.trim().split('\n');
	const n = grid.length;
	const m = grid[0].length;
	let res = 0;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			if (grid[i][j] !== '@') continue;
			let count = 0;
			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x === 0 && y === 0) continue;
					count += grid[i + x]?.[j + y] === '@';
				}
			}
			res += count < 4;
		}
	}
	return res;
};

const inputText = fs.readFileSync('input.txt', 'ascii');
const start = performance.now();
const res = solve(inputText);
const end = performance.now();

console.log('Result:', res);
console.log('Runtime:', end - start, 'ms');
