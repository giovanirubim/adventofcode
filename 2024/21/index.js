import fs from 'fs';

const parsePad = (str) => {
	const lines = str.trim().split('\n');
	const grid = lines.map((line) => line.replace(/\s/g, ''));
	const keyToPos = {};
	const n = grid.length;
	const m = grid[0].length;
	for (let i = 0; i < n; i++) {
		for (let j = 0; j < m; j++) {
			keyToPos[grid[i][j]] = [i, j];
		}
	}
	return { grid, keyToPos };
};

const numPad = parsePad(`
    7 8 9
    4 5 6
    1 2 3
    # 0 A
`);

const dirPad = parsePad(`
    # ^ A
    < v >
`);

const pads = [numPad, dirPad];
const NUM_TYPE = pads.indexOf(numPad);
const DIR_TYPE = pads.indexOf(dirPad);

// Return 1 or 2 sequences of direction keys that move the pointer from a src key to a dst key
const seqMemo = {};
const getSequences = (src, dst, padType) => {
	if (src === dst) return [''];

	const cacheKey = src + dst + padType;
	if (seqMemo[cacheKey] !== undefined) return seqMemo[cacheKey];

	const { keyToPos, grid } = pads[padType];
	const [srcI, srcJ] = keyToPos[src];
	const [dstI, dstJ] = keyToPos[dst];
	const dirI = Math.sign(dstI - srcI);
	const dirJ = Math.sign(dstJ - srcJ);
	const vSteps = (dirI > 0 ? 'v' : '^').repeat(Math.abs(dstI - srcI));
	const hSteps = (dirJ > 0 ? '>' : '<').repeat(Math.abs(dstJ - srcJ));

	if (vSteps === '' || hSteps === '') {
		return (seqMemo[cacheKey] = [vSteps || hSteps]);
	}

	const res = [];
	if (grid[dstI][srcJ] !== '#') res.push(vSteps + hSteps);
	if (grid[srcI][dstJ] !== '#') res.push(hSteps + vSteps);

	return (seqMemo[cacheKey] = res);
};

// Calculates the cost of, starting at A, press the keys on the sequence, then move back to A
const costMemo = {};
const calcSeqCost = (seq, padType, nDirPads) => {
	if (nDirPads === 0) return seq.length;
	if (seq === '') return 0;

	const cacheKey = seq + padType + nDirPads;
	if (costMemo[cacheKey] !== undefined) return costMemo[cacheKey];

	let cost = 0;
	let curr = 'A';

	for (const key of seq + 'A') {
		const subSeqArr = getSequences(curr, key, padType);
		let minSubCost = Infinity;
		for (const subSeq of subSeqArr) {
			const subCost = calcSeqCost(subSeq, DIR_TYPE, nDirPads - 1) + 1;
			minSubCost = Math.min(minSubCost, subCost);
		}
		cost += minSubCost;
		curr = key;
	}
	cost -= 1; // Last A isn't pressed

	return (costMemo[cacheKey] = cost);
};

const solve = (inputText, nDirPads) => {
	const codes = inputText.trim().split('\n');
	let res = 0;
	for (const code of codes) {
		const cost = calcSeqCost(code, NUM_TYPE, nDirPads);
		res += cost * Number(code.replace('A', ''));
	}
	return res;
};

const inputText = fs.readFileSync('./input.txt', 'ascii');

const run = (name, nDirPads) => {
	const start = performance.now();
	const res = solve(inputText, nDirPads);
	const end = performance.now();

	console.log(name + ':');
	console.log('- Result:', res);
	console.log('- Runtime:', end - start, 'ms');
};

run('Part 1', 3);
run('Part 2', 26);
