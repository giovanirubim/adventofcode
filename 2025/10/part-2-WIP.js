import fs from 'fs';

const hasOneBit = (x) => (x & (x - 1)) === 0;
const lowestBit = (x) => (x & (x - 1)) ^ x;

const prune = (tree, srcMap) => {
	const prunedTree = {};
	const prunedSrc = {};
	const copy = (mask) => {
		if (prunedTree[mask] !== undefined) return;
		const val = tree[mask];
		prunedTree[mask] = val;
		if (srcMap[mask] !== undefined) {
			prunedSrc[mask] = srcMap[mask];
		}
		if (val !== null) {
			const [a, b] = val;
			copy(a);
			copy(b);
		}
	};
	let mask = 1;
	while (tree[mask] !== undefined) {
		copy(mask);
		mask <<= 1;
	}
	return [prunedTree, prunedSrc];
};

const buildMasksBySrcMap = (srcMap) => {
	const res = {};
	for (const sMask in srcMap) {
		const mask = Number(sMask);
		const val = srcMap[mask];
		let keys = res[val];
		if (keys === undefined) {
			keys = [];
			res[val] = keys;
		}
		keys.push(mask);
	}
	return res;
};

const getInferenceTree = (masks, nBits) => {
	let tree = {};
	let srcMap = {};
	const all = (1 << nBits) - 1;
	const missing = [];
	let unknown = all;
	for (const mask of masks) {
		tree[mask] = null;
		if (hasOneBit(mask)) {
			unknown ^= mask;
		}
	}
	let src = null;
	for (let i = 0; unknown !== 0; i++) {
		const mi = masks[i];
		for (let j = 0; j < i && unknown !== 0; j++) {
			const mj = masks[j];
			const [major, minor] = mi > mj ? [mi, mj] : [mj, mi];
			if ((major & minor) !== minor) continue;
			const mask = major ^ minor;
			if (tree[mask] !== undefined) continue;
			tree[mask] = [major, minor];
			masks.push(mask);
			if (hasOneBit(mask)) unknown ^= mask;
			if (src !== null) srcMap[mask] = src;
		}
		if (i + 1 === masks.length) {
			if (unknown === 0) break;
			const mask = missing.length === 0 ? all : lowestBit(unknown);
			if (mask !== all) unknown ^= mask;
			masks.push(mask);
			missing.push(mask);
			src = mask;
			tree[mask] = null;
		}
	}
	[tree, srcMap] = prune(tree, srcMap);
	const masksBySrc = buildMasksBySrcMap(srcMap);
	return { missing, tree, masksBySrc };
};

const solveMask = (mask, system, tree, memo) => {
	const dfs = (mask) => {
		if (system[mask] !== undefined) return system[mask];
		if (memo[mask] !== undefined) return memo[mask];
		const [major, minor] = tree[mask];
		return (memo[mask] = dfs(major) - dfs(minor));
	};
	return dfs(mask);
};

const runPositiveChecks = (masks, system, tree, memo) => {
	for (const mask of masks) {
		if (solveMask(mask, system, tree, memo) < 0) return false;
	}
	return true;
};

const inputText = fs.readFileSync('./10-input.txt', 'ascii');
const lines = inputText.trim().split('\n');

const solveCompleteSystem = (system, nBits, tree) => {
	const memo = {};
	const counts = Array(nBits);
	for (let i = 0; i < nBits; i++) {
		const mask = 1 << i;
		counts[i] = solveMask(mask, system, tree, memo);
	}
	return counts;
};

const validateSolution = (system, counts) => {
	const sumMap = {};
	for (let i = 0; i < counts.length; i++) {
		const sum = counts[i];
		if (sum < 0) return false;
		sumMap[1 << i] = sum;
	}
	for (const sMask in system) {
		let mask = Number(sMask);
		if (hasOneBit(mask)) continue;
		let sum = system[mask];
		while (mask !== 0) {
			const bit = lowestBit(mask);
			sum -= sumMap[bit];
			mask ^= bit;
		}
		if (sum !== 0) return false;
	}
	return true;
};

lines.forEach((line, i) => {
	const clear = line.replace(/[^\d,{\s]/g, '').trim();
	const [a, b] = clear.split(' {');
	const vals = b.split(',').map(Number);
	const buttons = a.split(' ').map((b) => b.split(',').map(Number));
	const system = {};
	vals.forEach((val, vi) => {
		let mask = 0;
		buttons.forEach((b, bi) => {
			if (b.includes(vi)) mask |= 1 << bi;
		});
		system[mask] = val;
	});
	const nBits = buttons.length;
	const all = (1 << nBits) - 1;
	const masks = Object.keys(system).map(Number);
	const { missing, tree, masksBySrc } = getInferenceTree(masks.slice(), nBits);
	if (missing.length === 0) {
		const counts = solveCompleteSystem(system, nBits, tree);
		const res = counts.reduce((a, b) => a + b, 0);
		console.log(`Line ${i + 1}:`, res, 'solved directly');
	} else if (missing.length === 1) {
		const min = Math.max(...vals);
		const max = vals.reduce((a, b) => a + b, 0);
		let res;
		for (let total = min; total <= max; total++) {
			system[all] = total;
			const map = solveCompleteSystem(system, nBits, tree);
			if (!runPositiveChecks(masksBySrc[all], system, tree, {})) {
				continue;
			}
			if (validateSolution(system, map)) {
				res = map.reduce((a, b) => a + b, 0);
				break;
			}
		}
		console.log(`Line ${i + 1}:`, res, 'solved with simple search');
	} else {
		const tMin = Math.max(...vals);
		const tMax = vals.reduce((a, b) => a + b, 0);
		console.log(`Line ${i + 1}: between`, tMin, 'and', tMax);
	}
});
