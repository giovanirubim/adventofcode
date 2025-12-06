import fs from 'fs';

console.clear();

const solve = (text) => {
	const lines = text.split('\n').filter((l) => l.trim());
	const n = lines.length;
	const m = lines[0].length;
	let strCols = Array(m).fill('');
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			strCols[j] += lines[i][j];
		}
	}
	strCols = strCols.map((s) => s.replaceAll(' ', '')).concat('');
	let [res, curr, op] = [0, 0, ''];
	for (const strCol of strCols) {
		const num = Number(strCol.replace(/[+*]/g, ''));
		if (strCol.endsWith('*')) {
			op = '*';
			curr = num;
		} else if (strCol.endsWith('+')) {
			op = '+';
			curr = num;
		} else if (strCol === '') {
			res += curr;
			curr = 0;
		} else {
			if (op === '+') curr += num;
			else curr *= num;
		}
	}
	return res;
};

const sampleText = `
123 328  51 64 
 45 64  387 23 
  6 98  215 314
*   +   *   +  
`;
const expected = 3263827;
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
