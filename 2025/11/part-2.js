import fs from 'fs';
import { solve } from './solution.js';

const sample = `
svr: aaa bbb
aaa: fft
fft: ccc
bbb: tty
tty: ccc
ccc: ddd eee
ddd: hub
hub: fff
eee: dac
dac: fff
fff: ggg hhh
ggg: out
hhh: out
`;
const expected = 2;
const actual = solve(sample, 'svr', 'out', ['dac', 'fft']);

if (actual !== expected) {
	console.error('Failed with sample input');
	console.error('Expected:', expected);
	console.error('Actual:  ', actual);
	process.exit(1);
}

console.log('Matched sample result');

const inputText = fs.readFileSync('input.txt', 'ascii');
const start = performance.now();
const result = solve(inputText, 'svr', 'out', ['dac', 'fft']);
const end = performance.now();

console.log('Result:', result);
console.log('Runtime:', (end - start).toPrecision(2) * 1, 'ms');
