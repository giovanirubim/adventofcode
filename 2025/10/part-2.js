import fs from 'fs';

const hasOneBit = (x) => (x & (x - 1)) === 0;
const lowestBit = (x) => (x & (x - 1)) ^ x;
const maxMin = (a, b) => [Math.max(a, b), Math.min(a, b)];
const numArr = (str) => str.split(',').map(Number);

const SRC_INITIAL = 'src-initial';
const INFERRED_INITIALLY = 'inferred-initially';
const INSERTED = 'inserted';

const pruneTree = (tree, nBits) => {
	const res = {};
	const copy = (mask) => {
		const val = (res[mask] = tree[mask]);
		val?.map(copy);
	};
	for (let i = 0; i < nBits; i++) {
		copy(1 << i);
	}
	const all = (1 << nBits) - 1;
	copy(all);
	return res;
};

const pruneSrcMap = (srcMap, tree) => {
	const map = {};
	for (const sMask in tree) {
		map[sMask] = srcMap[sMask];
	}
	return map;
};

const remapSrcMap = (srcMap, tree) => {
	const map = {};
	for (const sMask in tree) {
		const src = srcMap[sMask];
		if (src === null) continue;
		map[src] = [];
	}
	for (const sMask in tree) {
		const src = srcMap[sMask];
		if (src === null) continue;
		const mask = Number(sMask);
		map[src].push(mask);
	}
	return map;
};

const cascade = (system, rootMask, affectedMasks, tree, srcMap) => {
	const memo = {};
	let used = 0;
	const solve = (mask) => {
		if (srcMap[mask] !== rootMask) return system[mask];
		if (memo[mask] !== undefined) return memo[mask];
		const [major, minor] = tree[mask];
		const res = solve(major) - solve(minor);
		if (res < 0) return -1;
		if (hasOneBit(mask)) used += res;
		return (system[mask] = memo[mask] = res);
	};
	for (const mask of affectedMasks) {
		solve(mask);
	}
	return used;
};

const mapSystemInferences = (masks, nBits) => {
	const all = (1 << nBits) - 1;
	let unknown = all;
	let tree = {};
	let srcMap = {};
	for (const mask of masks) {
		tree[mask] = null;
		srcMap[mask] = SRC_INITIAL;
		if (hasOneBit(mask)) unknown ^= mask;
	}
	const missing = [];
	let src = INFERRED_INITIALLY;
	for (let i = 1; i < masks.length; i++) {
		const iMask = masks[i];
		for (let j = 0; j < i; j++) {
			const jMask = masks[j];
			const [major, minor] = maxMin(iMask, jMask);
			if ((major & minor) !== minor) continue;
			const mask = major ^ minor;
			if (tree[mask] !== undefined) continue;
			masks.push(mask);
			tree[mask] = [major, minor];
			srcMap[mask] = src;
			if (hasOneBit(mask)) unknown ^= mask;
		}
		if (unknown === 0) break;
		if (i === masks.length - 1) {
			let newMask = all;
			if (missing.length !== 0) {
				newMask = lowestBit(unknown);
				unknown ^= newMask;
			}
			masks.push(newMask);
			tree[newMask] = null;
			srcMap[newMask] = INSERTED;
			missing.push(newMask);
			src = newMask;
		}
	}
	tree = pruneTree(tree, nBits);
	srcMap = pruneSrcMap(srcMap, tree);
	return { tree, missing, srcMap };
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

const hasNegative = (system, masks) => {
	for (const mask of masks) {
		if (system[mask] < 0) return true;
	}
	return false;
};

const computeSolution = (system, nBits, tree, memo) => {
	let sum = 0;
	for (let i = 0; i < nBits; i++) {
		const mask = 1 << i;
		sum += solveMask(mask, system, tree, memo);
	}
	return sum;
};

const validSystem = (system) => {
	for (const sMask in system) {
		let mask = Number(sMask);
		if (hasOneBit(mask)) continue;
		let sum = 0;
		while (mask !== 0) {
			const bit = lowestBit(mask);
			mask ^= bit;
			sum += system[bit];
		}
		if (sum !== system[sMask]) {
			return false;
		}
	}
	return true;
};

const solveLine = (line) => {
	const clear = line.replace(/[^\d,{\s]/g, '').trim();
	const [a, b] = clear.split(' {');
	const vals = numArr(b);
	const buttons = a.split(' ').map(numArr);
	const system = {};
	const nBits = buttons.length;
	const masks = Array(vals.length);
	for (let vi = 0; vi < vals.length; vi++) {
		let mask = 0;
		for (let bi = 0; bi < nBits; bi++) {
			mask |= buttons[bi].includes(vi) << bi;
		}
		if (system[mask] !== undefined) continue;
		system[mask] = vals[vi];
		masks[vi] = mask;
	}
	const { tree, missing, srcMap } = mapSystemInferences(masks.slice(), nBits);
	const ansMin = Math.max(...vals);
	const ansMax = vals.reduce((a, b) => a + b);
	const all = (1 << nBits) - 1;
	if (missing.length === 0) {
		return computeSolution(system, nBits, tree, {});
	}
	const masksBySrc = remapSrcMap(srcMap, tree);
	const ignore = {};
	for (const mask of missing) {
		ignore[mask] = true;
	}
	const initialUse = cascade(system, INFERRED_INITIALLY, masksBySrc[INFERRED_INITIALLY] ?? [], tree, srcMap);
	if (missing.length === 1) {
		const fx = masksBySrc[all];
		for (let ans = ansMin; ans <= ansMax; ans++) {
			system[all] = ans;
			cascade(system, all, fx, tree, srcMap);
			if (validSystem(system) && !hasNegative(system, fx)) {
				return ans;
			}
		}
		return NaN;
	}
	const maskArr = missing.slice(1);
	const maxArr = maskArr.map((mask) => {
		let max = Infinity;
		for (const sMask in system) {
			if ((sMask & mask) === 0) continue;
			if (system[sMask] === null) continue;
			max = Math.min(max, system[sMask]);
		}
		return max;
	});
	const n = maskArr.length;
	const bruteForce = (index, unused) => {
		if (index === n) return validSystem(system);
		const mask = maskArr[index];
		const fx = masksBySrc[mask] ?? [];
		const max = Math.min(unused, maxArr[index]);
		for (let i = 0; i <= max; i++) {
			system[mask] = i;
			const used = cascade(system, mask, fx, tree, srcMap);
			if (hasNegative(system, fx)) continue;
			if (bruteForce(index + 1, unused - i - used)) return true;
		}
		return false;
	};
	const fx = masksBySrc[all] ?? [];
	for (let ans = ansMin; ans <= ansMax; ans++) {
		system[all] = ans;
		const use = cascade(system, all, fx, tree, srcMap);
		if (use < 0) continue;
		if (hasNegative(system, fx)) continue;
		if (bruteForce(0, ans - use - initialUse)) {
			return ans;
		}
	}
	return NaN;
};

const solve = (text) => {
	const lines = text.trim().split('\n');
	let total = 0;
	for (let i = 0; i < lines.length; i++) {
		const ans = solveLine(lines[i]);
		total += ans;
	}
	console.log({ total });
};

const inputText = fs.readFileSync('./input.txt', 'ascii');
solve(inputText);
console.log('Processing complete');
