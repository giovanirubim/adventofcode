import fs from 'fs';

const solve = (text, count) => {
	const lines = text.trim().split('\n');
	const arr = lines.map(l => l.split(',').map(Number));
	const pairs = [];
	const n = arr.length;
	const calcDist = ([ax, ay, az], [bx, by, bz]) => (ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2;
	for (let i = 1; i < n; i++) {
		for (let j = 0; j < i; j++) {
			pairs.push([i, j, calcDist(arr[i], arr[j])]);
		}
	}
	pairs.sort((a, b) => a[2] - b[2]);
	const parent = Array(n);
	for (let i = 0; i < n; i++) parent[i] = i;
	const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
	const join = (i, j) => (parent[find(i)] = find(j));
	for (const [i, j] of pairs.slice(0, count)) {
		if (find(i) !== find(j)) join(i, j);
	}
	const sizes = Array(n).fill(0);
	for (let i = 0; i < n; i++) sizes[find(i)] += 1;
	sizes.sort((a, b) => b - a);
	return sizes.slice(0, 3).reduce((a, b) => a * b);
};

const sampleText = `
162,817,812
57,618,57
906,360,560
592,479,940
352,342,300
466,668,158
542,29,236
431,825,988
739,650,466
52,470,668
216,146,977
819,987,18
117,168,530
805,96,715
346,949,466
970,615,88
941,993,340
862,61,35
984,92,344
425,690,689
`;
const expected = 40;
const actual = solve(sampleText, 10);

if (actual !== expected) {
	console.error('Failed with sample input');
	console.error('Expected:', expected);
	console.error('Actual:  ', actual);
	process.exit(1);
}

console.log('Matched sample result');

const inputText = fs.readFileSync('./input.txt', 'ascii');
const start = performance.now();
const result = solve(inputText, 1000);
const end = performance.now();

console.log('Result:', result);
console.log('Runtime:', (end - start).toPrecision(2) * 1, 'ms');
