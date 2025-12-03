import fs from 'fs';

const solve = (text) => {
	const lines = text.trim().split('\n');
	const gates = {};
	const wireVal = {};
	for (const line of lines) {
		if (line.includes(':')) {
			const [name, strVal] = line.split(': ');
			wireVal[name] = Number(strVal);
		}
		if (line.includes('->')) {
			const [a, op, b, out] = line.split(/\s->\s|\s/);
			gates[out] = [a, b, op];
		}
	}
	const solve = (wire) => {
		if (wireVal[wire] !== undefined) return wireVal[wire];
		if (gates[wire] === undefined) return null;
		const [a, b, op] = gates[wire];
		const [x, y] = [solve(a), solve(b)];
		const res = op === 'AND' ? x & y : op === 'OR' ? x | y : x ^ y;
		return (wireVal[wire] = res);
	};
	let res = 0;
	for (let i = 0; ; i++) {
		const wire = 'z' + i.toString().padStart(2, 0);
		const bit = solve(wire);
		if (bit === null) break;
		res += 2 ** i * bit;
	}
	return res;
};

const inputText = fs.readFileSync('./input.txt', 'ascii');

const start = performance.now();
const res = solve(inputText);
const end = performance.now();

console.log('Result:', res);
console.log('Runtime:', end - start, 'ms');
