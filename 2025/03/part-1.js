import fs from 'fs';

const solve = (inputText) => {
	const banks = inputText.trim().split('\n');
	let sum = 0;
	for (const bank of banks) {
		const n = bank.length;
		let res = '00';
		let max = bank[n - 1];
		for (let i = n - 2; i >= 0; i--) {
			const c = bank[i];
			const num = c + max;
			if (num > res) res = num;
			if (c > max) max = c;
		}
		sum += Number(res);
	}
	return sum;
};

const inputText = fs.readFileSync('./input.txt', 'ascii');
const start = performance.now();
const res = solve(inputText);
const end = performance.now();

console.log('Result:', res);
console.log('Runtime:', end - start, 'ms');
