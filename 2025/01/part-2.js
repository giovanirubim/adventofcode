import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'ascii');
const lines = inputText.trim().split('\n');

let pointer = 50;
let res = 0;
const incMap = { R: 1, L: 99 };

for (const line of lines) {
	const dir = line[0];
	let offset = Number(line.slice(1));
	const inc = incMap[dir];
	while (offset !== 0) {
		pointer = (pointer + inc) % 100;
		res += pointer === 0;
		offset -= 1;
	}
}

console.log(res);
