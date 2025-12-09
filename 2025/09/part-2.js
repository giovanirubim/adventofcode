import fs from 'fs';

const moves = [[0, 1], [0, -1], [-1, 0], [1, 0]];

// Create an array of values to compact a coordinate axis
const compact = (coords, axis) => {
	const vals = coords.map((coord) => coord[axis]);
	const uniqueSorted = [...new Set(vals)].sort((a, b) => a - b);
	return [0, ...uniqueSorted, 1e10]; // Add a gap to flood fill around the drawing
};

const minMax = (a, b) => [Math.min(a, b), Math.max(a, b)];
const buildMat = (n, m, v) => Array.from({ length: n }, () => Array(m).fill(v));

const solve = (text) => {
	const lines = text.trim().split('\n');
	const coords = lines.map((l) => l.split(',').map(Number));
	const [xVals, yVals] = [compact(coords, 0), compact(coords, 1)];
	const arr = coords.map(([x, y]) => [xVals.indexOf(x), yVals.indexOf(y)]); // Array of compacted coordinates
	const n = arr.length;
	const grid = buildMat(xVals.length, yVals.length, '.');

	// Connect points
	const connect = ([ax, ay], [bx, by]) => {
		for (;;) {
			grid[ax][ay] = '#';
			if (ax === bx && ay === by) break;
			ax += Math.sign(bx - ax);
			ay += Math.sign(by - ay);
		}
	};
	for (let i = 0; i < n; i++) {
		const j = (i + 1) % n;
		connect(arr[i], arr[j]);
	}

	// Flood fill, DFS
	const stack = [[0, 0]];
	while (stack.length) {
		const [x, y] = stack.pop();
		for (const [mx, my] of moves) {
			const [nx, ny] = [x + mx, y + my];
			if (grid[nx]?.[ny] !== '.') continue;
			grid[nx][ny] = '_';
			stack.push([nx, ny]);
		}
	}

	// Build prefix matrix
	const prefix = buildMat(xVals.length, yVals.length, 0);
	for (let x = 0; x < xVals.length; x++) {
		let colCount = 0;
		for (let y = 0; y < yVals.length; y++) {
			const bit = grid[x][y] === '_';
			prefix[x][y] = bit + (prefix[x - 1]?.[y] ?? 0) + colCount;
			colCount += bit;
		}
	}

	// Helpers for the rectangle search
	const isValid = ([ax, ay], [bx, by]) => {
		const [x0, x1] = minMax(ax, bx);
		const [y0, y1] = minMax(ay, by);
		const a = prefix[x0 - 1]?.[y0 - 1] ?? 0;
		const b = prefix[x0 - 1]?.[y1] ?? 0;
		const c = prefix[x1][y0 - 1] ?? 0;
		const d = prefix[x1][y1];
		return d - b - c + a === 0;
	};
	const recover = (i) => {
		const [ix, iy] = arr[i];
		return [xVals[ix], yVals[iy]];
	};
	const calcArea = (i, j) => {
		const [ax, ay] = recover(i);
		const [bx, by] = recover(j);
		return (Math.abs(bx - ax) + 1) * (Math.abs(by - ay) + 1);
	};

	// Rectangle search
	let res = 0;
	for (let i = 1; i < n; i++) {
		for (let j = 1; j < n; j++) {
			const area = calcArea(i, j);
			if (area <= res) continue;
			if (!isValid(arr[i], arr[j])) continue;
			res = area;
		}
	}
	return res;
};

const sampleText = `
7,1
11,1
11,7
9,7
9,5
2,5
2,3
7,3
`;
const expected = 24;
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
