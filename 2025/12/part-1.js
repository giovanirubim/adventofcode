import fs from 'fs';

const solve = (text) => {
	const lines = text.trim().split('\n');
	const shapes = [];
	let res = 0;
	for (const line of lines) {
		if (!line.trim()) continue;
		if (line.includes(':') && line.includes('x')) {
			const [a, b] = line.split(':');
			const [width, height] = a.trim().split('x').map(Number);
			const area = width * height;
			const counts = b.trim().split(' ').map(Number);
			const sum = counts.map((count, i) => count * shapes[i]).reduce((a, b) => a + b, 0);
			res += sum < area;
		} else if (line.includes(':')) {
			shapes.push(0);
		} else {
			const [a, b, c] = line.split('').map((c) => '.#'.indexOf(c));
			shapes[shapes.length - 1] += a + b + c;
		}
	}
	return res;
};

const inputText = fs.readFileSync('./input.txt', 'ascii');
const start = performance.now();
const result = solve(inputText);
const end = performance.now();

console.log('Result:', result);
console.log('Runtime:', (end - start).toPrecision(2) * 1, 'ms');
