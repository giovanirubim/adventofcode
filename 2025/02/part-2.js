import fs from 'fs';

const isInvalid = (val) => {
	const size = val.toString().length;
	for (let len = 1; len * 2 <= size; len++) {
		if (size % len) continue;
		const shift = 10 ** len;
		const target = val % shift;
		let temp = val;
		for (;;) {
			temp = Math.floor(temp / shift);
			if (temp === 0) return true;
			if (temp % shift !== target) break;
		}
	}
	return false;
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
