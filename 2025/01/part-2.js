import fs from 'fs';

const inputText = fs.readFileSync('./input.txt', 'ascii');
const lines = inputText.trim().split('\n');

let pointer = 50;
let res = 0;

for (const line of lines) {
	let offset = Number(line.slice(1));
	const R = line[0] === 'R';
	const sign = R ? 1 : -1;
	const toReach0 = R ? 100 - pointer : pointer || 100;
	if (offset < toReach0) {
		pointer = (pointer + offset * sign + 100) % 100;
	} else {
		offset -= toReach0;
		res += 1 + Math.floor(offset / 100);
		pointer = ((offset % 100) * sign + 100) % 100;
	}
}

console.log(res);
