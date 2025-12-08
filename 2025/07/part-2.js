import fs from 'fs';

const solve = (text) => {
	const grid = text.trim().split('\n');
	const n = grid.length;
	const m = grid[0].length;
	const cache = Array(m * n);
	const count = (i, j) => {
		if (i === n - 1) return 1;
		const key = i * m + j;
		if (cache[key] !== undefined) return cache[key];
		if (grid[i][j] !== '^') return (cache[key] = count(i + 1, j));
		return (cache[key] = count(i, j - 1) + count(i, j + 1));
	};
	return count(0, grid[0].indexOf('S'));
};

const sampleText = `
.......S.......
...............
.......^.......
...............
......^.^......
...............
.....^.^.^.....
...............
....^.^...^....
...............
...^.^...^.^...
...............
..^...^.....^..
...............
.^.^.^.^.^...^.
...............
`;
const expected = 40;
const actual = solve(sampleText);

if (actual !== expected) {
	console.error('Failed with sample input');
	console.error('Expected:', expected);
	console.error('Actual:  ', actual);
	process.exit(1);
}

console.log('Matched sample result');

const inputText = fs.readFileSync('./input.txt', 'ascii');
const start = performance.now();
const result = solve(inputText);
const end = performance.now();

console.log('Result:', result);
console.log('Runtime:', (end - start).toPrecision(2) * 1, 'ms');
