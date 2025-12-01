import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'ascii');
const lines = inputText.trim().split('\n');

let pointer = 50;
let res = 0;
const sign = { R: 1, L: -1 };

for (const line of lines) {
	const dir = line[0];
	const offset = Number(line.slice(1));
	pointer = (pointer + 100 + offset * sign[dir]) % 100;
	res += pointer === 0;
}

console.log(res);
