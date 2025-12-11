const parseInput = (inputText) => {
	const lines = inputText.trim().split('\n');
	const edgeMap = {};
	for (const line of lines) {
		const [src, ...out] = line.split(/:?\s/);
		edgeMap[src] = out;
	}
	return edgeMap;
};

export const solve = (inputText, src, dst, targets) => {
	const edgeMap = parseInput(inputText);
	const memo = {};
	const countsPathFrom = (node, mask) => {
		const i = targets.indexOf(node);
		const isTarget = i !== -1;

		if (node === dst) {
			if (!isTarget) return mask === 0 ? 1 : 0;
			const targetMask = 1 << i;
			return mask === targetMask ? 1 : 0;
		}

		const key = node + mask;
		if (memo[key] !== undefined) {
			return memo[key];
		}

		let nextMask = mask;
		if (isTarget) {
			const bit = (mask >> i) & 1;
			if (bit === 0) return 0;
			nextMask ^= 1 << i;
		}

		let res = 0;
		for (const prev of edgeMap[node] ?? []) {
			res += countsPathFrom(prev, nextMask);
		}
		return (memo[key] = res);
	};

	const fullMask = (1 << targets.length) - 1;
	return countsPathFrom(src, fullMask);
};
