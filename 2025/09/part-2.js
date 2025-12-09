import fs from 'fs';

const minMax = (a, b) => [Math.min(a, b), Math.max(a, b)];
const compact = (coords, axis) => {
	const vals = coords.map((coord) => coord[axis]);
	const uq = [...new Set(vals)];
	return [0, ...uq.sort((a, b) => a - b), 1e10]; // Add a gap to flood fill around the drawing
};
const moves = [[0, 1], [0, -1], [-1, 0], [1, 0]];
const solve = (text) => {
	const lines = text.trim().split('\n');
	const coords = lines.map((l) => l.split(',').map(Number));
	const [xVals, yVals] = [compact(coords, 0), compact(coords, 1)];
	const arr = coords.map(([x, y]) => [xVals.indexOf(x), yVals.indexOf(y)]); // Array of compacted coordinates
	const n = arr.length;
	const grid = Array.from({ length: xVals.length }, () => Array(yVals.length).fill('.'));
	const connect = ([ax, ay], [bx, by]) => {
		for (;;) {
			grid[ax][ay] = '#';
			if (ax === bx && ay === by) break;
			ax += Math.sign(bx - ax);
			ay += Math.sign(by - ay);
		}
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
	const isValid = ([ax, ay], [bx, by]) => {
		const [x0, x1] = minMax(ax, bx);
		const [y0, y1] = minMax(ay, by);
		for (let x = x0; x <= x1; x++) {
			for (let y = y0; y <= y1; y++) {
				if (grid[x][y] === '_') return false;
			}
		}
		return true;
	};
	for (let i = 0; i < n; i++) {
		const j = (i + 1) % n;
		connect(arr[i], arr[j]);
	}
	const stack = [[0, 0]];
	while (stack.length) { // Flood fill, DFS
		const [x, y] = stack.pop();
		for (const [mx, my] of moves) {
			const [nx, ny] = [x + mx, y + my];
			if (grid[nx]?.[ny] !== '.') continue;
			grid[nx][ny] = '_';
			stack.push([nx, ny]);
		}
	}
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
