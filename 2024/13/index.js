const rawInput = require('../../utils/raw-input');
const inputs = rawInput
	.trim()
	.split(/\n\n/)
	.map((t) => {
		const [a, b, prize] = t.split(/\n/).map((l) =>
			l
				.replace(/[^\d,]/g, '')
				.split(',')
				.map(Number)
		);
		return { a, b, prize };
	});

const mulVecMat = ([x, y], [ix, iy, jx, jy]) => [x * ix + y * jx, x * iy + y * jy];
const mulMatMat = (a, b) => [...mulVecMat(a.slice(0, 2), b), ...mulVecMat(a.slice(2, 4), b)];
const invert = (mat) => {
	let res = [1, 0, 0, 1];
	const t1 = [1, -mat[1] / mat[0], 0, 1];
	mat = mulMatMat(mat, t1);
	res = mulMatMat(res, t1);
	const t2 = [1, 0, -mat[2] / mat[3], 1];
	mat = mulMatMat(mat, t2);
	res = mulMatMat(res, t2);
	return mulMatMat(res, [1 / mat[0], 0, 0, 1 / mat[3]]);
};

const costs = inputs.map((input) => {
	const { a, b, prize } = input;
	prize[0] += 1e13; // Added for part 2
	prize[1] += 1e13; // Added for part 2
	const [ax, ay] = a;
	const [bx, by] = b;
	const [na, nb] = mulVecMat(prize, invert([ax, ay, bx, by])).map(Math.round);
	// if (na > 100 || nb > 100) return 0; // Commented for part 2
	if (na < 0 || nb < 0) return 0;
	const x = ax * na + bx * nb;
	const y = ay * na + by * nb;
	if (x !== prize[0] || y !== prize[1]) return 0;
	if (ax / ay === bx / by) throw 'Aligned vectors';
	return na * 3 + nb;
});
console.log(costs.reduce((a, b) => a + b, 0));
