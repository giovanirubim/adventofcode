import fs from 'fs';

const solve = (text) => {
	const lines = text.trim().split('\n');
	const grid = lines.map((l) => l.split(''));
	const n = grid.length;
	const count = (i, j) => {
		if (grid[i][j] === '|') return 0;
		if (grid[i][j] === '^') return 1 + count(i, j - 1) + count(i, j + 1);
		grid[i][j] = '|';
		if (i === n - 1) return 0;
		return count(i + 1, j);
	};
	return count(0, lines[0].indexOf('S'));
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
const expected = 21;
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
