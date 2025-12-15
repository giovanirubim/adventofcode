import fs from 'fs';

const hasOneBit = (x) => (x & (x - 1)) === 0;
const lowestBit = (x) => (x & (x - 1)) ^ x;
const maxMin = (a, b) => [Math.max(a, b), Math.min(a, b)];
const numArr = (str) => str.split(',').map(Number);

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

const pruneDepMap = (depMap, tree) => {
	const map = {};
	for (const sMask in tree) {
		map[sMask] = depMap[sMask];
	}
	return map;
};

const remapDepMap = (depMap, tree) => {
	const map = {};
	for (const sMask in tree) {
		const dep = depMap[sMask];
		if (dep === null) continue;
		map[dep] = [];
	}
	for (const sMask in tree) {
		const dep = depMap[sMask];
		if (dep === null) continue;
		const mask = Number(sMask);
		map[dep].push(mask);
	}
	return map;
};

const cascade = (system, rootMask, affectedMasks, tree, depMap) => {
	const memo = {};
	let used = 0;
	const solve = (mask) => {
		if (depMap[mask] !== rootMask) return system[mask];
		if (memo[mask] !== undefined) return memo[mask];
		const [major, minor] = tree[mask];
		const res = solve(major) - solve(minor);
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
	let depMap = {};
	for (const mask of masks) {
		tree[mask] = depMap[mask] = null;
		if (hasOneBit(mask)) unknown ^= mask;
	}
	const missing = [];
	let dep = null;
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
			depMap[mask] = dep;
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
			tree[newMask] = depMap[newMask] = null;
			missing.push(newMask);
			dep = newMask;
		}
	}
	tree = pruneTree(tree, nBits);
	depMap = pruneDepMap(depMap, tree);
	return { tree, missing, depMap };
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

const preCalc = (system, tree, depMap, ignore) => {
	let sum = 0;
	for (const sMask in tree) {
		if (depMap[sMask] !== null) continue;
		if (ignore[sMask] !== undefined) continue;
		solveMask(Number(sMask), system, tree, system);
		const mask = Number(sMask);
		if (hasOneBit(mask)) sum += system[sMask];
	}
	return sum;
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
	const { tree, missing, depMap } = mapSystemInferences(masks.slice(), nBits);
	const ansMin = Math.max(...vals);
	const ansMax = vals.reduce((a, b) => a + b);
	const all = (1 << nBits) - 1;
	if (missing.length === 0) {
		return computeSolution(system, nBits, tree, {});
	}
	const masksByDep = remapDepMap(depMap, tree);
	const ignore = {};
	for (const mask of missing) {
		ignore[mask] = true;
	}
	let used = preCalc(system, tree, depMap, ignore);
	if (missing.length === 1) {
		const fx = masksByDep[all];
		for (let ans = ansMin; ans <= ansMax; ans++) {
			system[all] = ans;
			cascade(system, all, fx, tree, depMap);
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
		const fx = masksByDep[mask] ?? [];
		const max = Math.min(unused, maxArr[index]);
		for (let i = 0; i < max; i++) {
			system[mask] = i;
			const used = i + cascade(system, mask, fx, tree, depMap);
			if (hasNegative(system, fx)) continue;
			if (bruteForce(index + 1, unused - used)) return true;
		}
		return false;
	};
	const fx = masksByDep[all] ?? [];
	for (let ans = ansMin; ans <= ansMax; ans++) {
		system[all] = ans;
		const newUsed = used + cascade(system, all, fx, tree, depMap);
		if (hasNegative(system, fx)) continue;
		if (bruteForce(0, ans - newUsed)) {
			return ans;
		}
	}
	return NaN;
};

const solve = (text) => {
	const lines = text.trim().split('\n');
	let total = 0;
	for (let i = 0; i < lines.length; i++) {
		const t0 = performance.now();
		const ans = solveLine(lines[i]);
		const t1 = performance.now();
		total += ans;
		console.log(`Line ${i}:`, ans);
	}
	console.log(total);
};

const inputText = fs.readFileSync('./input.txt', 'ascii');
solve(inputText);
