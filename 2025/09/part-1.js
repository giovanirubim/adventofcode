import fs from 'fs';

const solve = (text) => {
	const arr = text.trim().split('\n').map((l) => l.split(',').map(Number));
	const clacArea = ([ax, ay], [bx, by]) => (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1);
	let res = 0;
	for (let i = 0; i < arr.length; i++) {
		for (let j = 0; j < i; j++) {
			let area = clacArea(arr[i], arr[j]);
			res = Math.max(res, area);
		}
	}
	return res;
};

const sampleText = `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`;
const expected = 50;
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
