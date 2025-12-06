import fs from 'fs';

console.clear();

const solve = (text) => {
	const lines = text.trim().split('\n');
	const table = lines.map((l) => l.trim().split(/\s+/));
	const n = table.length;
	const m = table[0].length;
	let res = 0;
	for (let j = 0; j < m; j++) {
		const op = table[n - 1][j];
		let curr = op === '+' ? 0 : 1;
		for (let i = 0; i < n - 1; i++) {
			const val = Number(table[i][j]);
			if (op === '+') curr += val;
			else curr *= val;
		}
		res += curr;
	}
	return res;
};

const sampleText = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;
const expected = 4277556;
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
