import fs from 'fs';

const parseMachine = (machine) => {
	const [a, b] = machine.split(/(?<=])\s|\s(?={)/);
	const bitMap = { '#': 1, '.': 0 };
	const bits = a.split('').map((c) => bitMap[c] ?? '');
	const target = parseInt(bits.reverse().join(''), 2);
	const buttons = b
		.replace(/[()]/g, '')
		.split(' ')
		.map((s) =>
			s
				.split(',')
				.map((i) => 1 << i)
				.reduce((a, b) => a + b, 0)
		);
	return { target, buttons };
};

const solveMachine = ({ target, buttons }) => {
	if (target === 0) return 0;
	let front = [0];
	const visited = new Set([0]);
	let presses = 0;
	while (front.length !== 0) {
		presses += 1;
		const add = [];
		for (const stt of front) {
			for (const b of buttons) {
				const nextStt = stt ^ b;
				if (nextStt === target) return presses;
				if (visited.has(nextStt)) continue;
				visited.add(nextStt);
				add.push(nextStt);
			}
		}
		front = add;
	}
	return presses;
};

const solve = (text) => {
	const lines = text.trim().split('\n');
	let res = 0;
	for (const line of lines) {
		res += solveMachine(parseMachine(line));
	}
	return res;
};

const sampleText = `
[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`;
const expected = 7;
const actual = solve(sampleText);

if (actual !== expected) {
	console.error('Failed with sample input');
	console.error('Expected:', expected);
	console.error('Actual:  ', actual);
	process.exit(1);
}

console.log('Matched sample result');

const inputText = fs.readFileSync('./input.txt', 'ascii');
const start = performance.now();
const result = solve(inputText);
const end = performance.now();

console.log('Result:', result);
console.log('Runtime:', (end - start).toPrecision(2) * 1, 'ms');
