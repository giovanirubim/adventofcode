import fs from 'fs';

const solve = (text) => {
	const arr = text
		.trim()
		.split('\n')
		.map((coord) => coord.split(',').map(Number));
	console.log('N points:', arr.length);
	const pairs = [];
	const n = arr.length;
	const calcDist = ([ax, ay, az], [bx, by, bz]) => Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2);
	for (let i = 1; i < n; i++) {
		for (let j = 0; j < i; j++) {
			pairs.push([calcDist(arr[i], arr[j]), i, j]);
		}
	}
	pairs.sort((a, b) => a[0] - b[0]);
	const parent = Array(n);
	for (let i = 0; i < n; i++) parent[i] = i;
	const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
	const join = (i, j) => (parent[find(i)] = find(j));
	let count = arr.length - 1;
	for (let [_, i, j] of pairs) {
		if (find(i) === find(j)) continue;
		join(i, j);
		if (--count > 0) continue;
		return arr[i][0] * arr[j][0];
	}
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
const expected = 25272;
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
