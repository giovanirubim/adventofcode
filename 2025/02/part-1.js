import fs from 'fs';

const isInvalid = (val) => {
	const size = val.toString().length;
	if (size & 1) return;
	const shift = 10 ** (size >> 1);
	const low = val % shift;
	const high = Math.floor(val / shift);
	return low === high;
};

const solve = (text) => {
	const ranges = text.split(',').map((range) => range.split('-').map(Number));
	let res = 0;
	for (const [a, b] of ranges) {
		for (let i = a; i <= b; i++) {
			if (isInvalid(i)) res += i;
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
