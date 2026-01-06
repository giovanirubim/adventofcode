import fs from 'fs';

const parsePad = (str) => {
	const lines = str.trim().split('\n');
	const grid = lines.map((line) => line.trim().split(/\s+/));
	const cols = grid[0].length;
	const keys = grid.flat();
	const nKeys = keys.length;
	const dirSeqMap = {};
	for (let i = 0; i < nKeys; i++) {
		const a = keys[i];
		const [ai, aj] = [(i / cols) | 0, i % cols];
		if (a === '#') continue;
		for (let j = 0; j < nKeys; j++) {
			const b = keys[j];
			if (b === '#') continue;
			const [bi, bj] = [(j / cols) | 0, j % cols];
			const vPath = bi > ai ? 'v'.repeat(bi - ai) : '^'.repeat(ai - bi);
			const hPath = bj > aj ? '>'.repeat(bj - aj) : '<'.repeat(aj - bj);
			const res = new Set();
			if (grid[bi][aj] !== '#') res.add(vPath + hPath);
			if (grid[ai][bj] !== '#') res.add(hPath + vPath);
			dirSeqMap[a + b] = [...res];
		}
	}
	return { dirSeqMap };
};

const pads = [
	parsePad(`
        7 8 9
        4 5 6
        1 2 3
        # 0 A
    `),
	parsePad(`
        # ^ A
        < v >
    `),
];
const NUM_TYPE = 0;
const DIR_TYPE = 1;

const mem = {};
const moveAndPressCost = (type, src, dst, extraDirPads) => {
	if (extraDirPads === 0) return 1;

	const memKey = type + src + dst + extraDirPads;
	if (mem[memKey] !== undefined) return mem[memKey];

	const pad = pads[type];
	const dirSeqArr = pad.dirSeqMap[src + dst];
	let minCost = Infinity;
	for (let dirSeq of dirSeqArr) {
		let cost = 0;
		for (let i = 0; i <= dirSeq.length; i++) {
			const nextKey = dirSeq[i] ?? 'A';
			const prevKey = dirSeq[i - 1] ?? 'A';
			cost += moveAndPressCost(DIR_TYPE, prevKey, nextKey, extraDirPads - 1);
		}
		minCost = Math.min(minCost, cost);
	}

	return (mem[memKey] = minCost);
};

const solve = (inputText, numDirPads) => {
	const codes = inputText.split('\n');
	let sum = 0;
	for (const code of codes) {
		let cost = 0;
		for (let i = 0; i < code.length; i++) {
			cost += moveAndPressCost(NUM_TYPE, code[i - 1] ?? 'A', code[i], numDirPads);
		}
		sum += Number(code.replace('A', '')) * cost;
	}
	return sum;
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
