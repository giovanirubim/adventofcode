import fs from 'fs';

const solve = (text) => {
	const lines = text.trim().split('\n');
	const ranges = lines
		.filter((l) => l.includes('-'))
		.map((l) => l.split('-').map(Number))
		.sort((a, b) => a[0] - b[0]);
	let [start, end, res] = [0, -1, 0];
	for (const [a, b] of ranges) {
		if (a > end) {
			res += b - a + 1;
			[start, end] = [a, b];
		} else if (b > end) {
			res += b - end;
			end = b;
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
