import fs from 'fs';

const max = (a, b) => (a > b ? a : b);

const solveBank = (bank) => {
	const n = bank.length;
	const mem = Array(13);
	mem[0] = '';
	for (let i = n - 1; i >= 0; i--) {
		const dig = bank[i];
		for (let j = 12; j >= 1; j--) {
			if (mem[j] === undefined) {
				if (mem[j - 1] === undefined) continue;
				mem[j] = dig + mem[j - 1];
				continue;
			}
			mem[j] = max(mem[j], dig + mem[j - 1]);
		}
	}
	return Number(mem[12]);
};

const solve = (inputText) => {
	const banks = inputText.trim().split('\n');
	let sum = 0;
	for (const bank of banks) {
		let res = solveBank(bank);
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
