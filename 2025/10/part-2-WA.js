import fs from 'fs';

const parseMachine = (machine) => {
	const clean = machine.replace(/[^\d,{\s]/g, '').trim();
	const [a, b] = clean.split(/\s+{/);
	const buttons = a.split(/\s/).map((b) => b.split(',').map(Number));
	const vals = b.split(',').map(Number);
	return { buttons, vals };
};

const lowestBit = (x) => (x & (x - 1)) ^ x;
const hasOneBit = (x) => (x & (x - 1)) === 0;
const subtract = (major, minor) => {
	if ((major & minor) !== minor) return null;
	return major ^ minor;
};

const getSolution = (system, nBits, refMasks) => {
	// console.log(
	// 	'getting solution of',
	// 	Object.entries(system).map((entry) => [format(entry[0] * 1, nBits), entry[1]]),
	// 	refMasks.map((m) => format(m, nBits))
	// );
	for (let mask of refMasks) {
		let sum = system[mask];
		while (mask !== 0) {
			const bit = lowestBit(mask);
			sum -= system[bit];
			mask ^= bit;
		}
		if (sum !== 0) return false;
	}
	let res = 0;
	for (let i = 0; i < nBits; i++) {
		res += system[1 << i];
	}
	return res;
};

const format = (mask, nBits) => {
	let res = '';
	for (let i = 0; i < nBits; i++) {
		if (mask & (1 << i)) {
			res += String.fromCharCode(65 + i);
		} else {
			res += '_';
		}
	}
	return res;
};

const solveSystem = (system, nBits, refMasks) => {
	const masks = Object.keys(system).map(Number);
	const all = (1 << nBits) - 1;

	let unknown = all;
	for (const mask of masks) {
		// console.log(format(mask, nBits), '=', system[mask]);
		if (hasOneBit(mask)) unknown ^= mask;
	}

	// console.log('unknown:', format(unknown, nBits));

	let failed = false;
	const check = (i, j) => {
		const major = Math.max(masks[i], masks[j]);
		const minor = Math.min(masks[i], masks[j]);
		const mask = subtract(major, minor);
		if (mask === null) return;
		if (system[mask] !== undefined) return;
		const sum = system[major] - system[minor];
		if (sum < 0) return (failed = true);
		masks.push(mask);
		system[mask] = sum;
		if (hasOneBit(mask)) unknown ^= mask;
		// console.log(format(major, nBits), '+', format(minor, nBits), '=>', format(mask, nBits), '=', sum);
	};

	// console.log('First round of inferences:');
	let cut = masks.length;
	for (let j = 1; j < cut; j++) {
		for (let i = 0; i < j; i++) {
			check(i, j);
			if (unknown === 0) return getSolution(system, nBits, refMasks);
			if (failed === true) return false;
		}
	}

	while (cut !== masks.length) {
		const end = masks.length;
		// console.log('New round of inferences:', { cut, end });
		for (let i = 0; i < cut; i++) {
			for (let j = cut; j < end; j++) {
				check(i, j);
				if (unknown === 0) return getSolution(system, nBits, refMasks);
				if (failed === true) return false;
			}
		}
		cut = end;
	}
	// console.log('--> No more inferences');

	let selected;
	let max;
	for (const mask of masks) {
		if ((mask & unknown) !== mask) continue;
		selected = lowestBit(mask);
		max = system[mask];
		break;
	}

	if (selected === undefined) return false;
	for (let i = 0; i <= max; i++) {
		const newSystem = { ...system, [selected]: i };
		const solution = solveSystem(newSystem, nBits, refMasks);
		if (solution !== false) return solution;
	}

	return false;
};

const solveMachine = ({ buttons, vals }) => {
	const system = {};
	vals.forEach((val, vi) => {
		let mask = 0;
		buttons.forEach((button, bi) => {
			if (button.includes(vi)) mask |= 1 << bi;
		});
		system[mask] = val;
	});
	const nBits = buttons.length;
	const min = Math.max(...vals);
	const max = vals.reduce((a, b) => a + b, 0);
	const all = (1 << nBits) - 1;
	const refMasks = Object.keys(system).map(Number);
	for (let n = min; n <= max; n++) {
		const newSystem = { ...system, [all]: n };
		const solution = solveSystem(newSystem, nBits, refMasks);
		if (solution) return solution;
	}
	console.error('Unsolvable system:', system);
	throw new Error('Unable to solve system');
};

const solve = (text) => {
	const lines = text.trim().split('\n');
	let sum = 0;
	lines.forEach((line, i) => {
		const t0 = performance.now();
		const res = solveMachine(parseMachine(line));
		const t1 = performance.now();
		console.log('Line', i + 1, 'solved in', (t1 - t0).toPrecision(3) * 1, 'ms', '=', res);
		sum += res;
	});
	return sum;
};

const sampleText = `
[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}
`;
const expected = 33;
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
