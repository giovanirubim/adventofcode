import fs from 'fs';

const swap = (arr, i, j) => {
	const tmp = arr[i];
	arr[i] = arr[j];
	arr[j] = tmp;
};

const getTrueIndices = (arr) => {
	const n = arr.length;
	const res = [];
	for (let i = 0; i < n; i++) {
		if (arr[i] === true) res.push(i);
	}
	return res;
};

const solve = (text) => {
	const lines = text.trim().split('\n');

	const wireNames = [];
	const gateTo = [];

	let inputLen = lines.filter((l) => l.includes(':')).length / 2;
	const [x0, y0, z0] = [0, inputLen, inputLen * 2];

	for (let i = 0; ; i++) {
		const num = i.toString().padStart(2, 0);
		wireNames[z0 + i] = 'z' + num;
		if (i === inputLen) break;
		wireNames[x0 + i] = 'x' + num;
		wireNames[y0 + i] = 'y' + num;
	}

	const toIndex = { OR: 0, AND: 1, XOR: 2 };
	wireNames.forEach((name, i) => (toIndex[name] = i));

	const getIndex = (w) => {
		let index = toIndex[w];
		if (index !== undefined) return index;
		index = wireNames.length;
		wireNames.push(w);
		return (toIndex[w] = index);
	};

	for (const line of lines) {
		if (!line.includes('->')) continue;
		const [a, op, b, out] = line.split(/\s->\s|\s/).map(getIndex);
		gateTo[out] = [a, b, op];
	}

	const nWires = wireNames.length;
	const values = Array(nWires).fill(0);

	let time = 0;
	const setAt = Array(nWires).fill(0);
	const usedAt = Array(nWires).fill(0);

	const calcWire = (w) => {
		if (w < inputLen * 2) return values[w];
		if (setAt[w] === time) return values[w];
		setAt[w] = time;
		const [a, b, op] = gateTo[w];
		const [x, y] = [calcWire(a), calcWire(b)];
		const or = x | y;
		if (or === 1) usedAt[w] = time;
		const val = op === 0 ? or : op === 1 ? x & y : x ^ y;
		return (values[w] = val);
	};

	const cleanUp = (i) => {
		values[x0 + i] = values[y0 + i] = 0;
		if (i !== 0) values[x0 + i - 1] = values[y0 + i - 1] = 0;
	};

	const checkErrorIn = (i, lazy) => {
		let err = false;
		const max = i === 0 ? 0b11 : 0b111;
		for (let m = 1; m <= max; m++) {
			const [x, y, c] = [m & 1, (m >> 1) & 1, m >> 2];
			values[x0 + i] = x;
			values[y0 + i] = y;
			if (i !== 0) {
				values[x0 + i - 1] = c;
				values[y0 + i - 1] = c;
			}
			const sum = x + y + c;
			const [low, hig] = [sum & 1, sum >> 1];
			time += 1;
			if (lazy) {
				if (calcWire(z0 + i) !== low || calcWire(z0 + i + 1) !== hig) {
					cleanUp(i);
					return true;
				}
			} else {
				const [lOut, hOut] = [calcWire(z0 + i), calcWire(z0 + i + 1)];
				err = err || lOut !== low || hOut !== hig;
			}
		}
		cleanUp(i);
		return err;
	};

	const res = [];

	const isSuspect = Array(nWires);
	const indexHasErr = Array(inputLen);

	const solveOnePair = () => {
		isSuspect.fill(false);
		indexHasErr.fill(false);

		for (let i = 0; i < inputLen; i++) {
			const before = time;
			const err = (indexHasErr[i] = checkErrorIn(i, false));
			if (err) {
				for (let w = inputLen * 2; w < nWires; w++) {
					if (usedAt[w] > before) isSuspect[w] = true;
				}
			}
		}

		const measureScore = (a, b) => {
			swap(gateTo, a, b);
			let score = 0;
			for (let i = 0; i < inputLen; i++) {
				const failed = checkErrorIn(i, true);
				score += indexHasErr[i] - failed;
			}
			swap(gateTo, a, b);
			return score;
		};

		let bestScore = 0;
		let selected;
		const gates = getTrueIndices(isSuspect);
		for (let j = gates.length - 1; j > 0; j--) {
			const b = gates[j];
			for (let i = 0; i < j; i++) {
				const a = gates[i];
				const score = measureScore(a, b);
				if (score <= bestScore) continue;
				bestScore = score;
				selected = [a, b];
			}
		}

		swap(gateTo, ...selected);
		res.push(...selected);
	};

	for (let i = 0; i < 4; i++) solveOnePair();

	return res
		.map((w) => wireNames[w])
		.sort()
		.join(',');
};

const inputText = fs.readFileSync('./input.txt', 'ascii');

const start = performance.now();
const res = solve(inputText);
const end = performance.now();

console.log('Result:', res);
console.log('Runtime:', end - start, 'ms');
