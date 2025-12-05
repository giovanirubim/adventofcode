import fs from 'fs';

const solve = (text) => {
	const lines = text.trim().split('\n');
	const ranges = [];
	let res = 0;
	for (const l of lines) {
		if (l.includes('-')) {
			ranges.push(l.split('-').map(Number));
		} else if (l.trim()) {
			const val = Number(l);
			res += ranges.some(([a, b]) => val >= a && val <= b);
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
