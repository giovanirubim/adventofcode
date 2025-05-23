const p1 = [4, 1, 7, 6, 4, 1, 0, 2, 7]
const p2 = [2, 4, 1, 1, 7, 5, 1, 5, 4, 0, 5, 5, 0, 3, 3, 0]
const UNKNOWN = '?'
const handleUnknown = (bits, uIdx, target, it) => {
	bits[uIdx] = 0
	if (solve(bits, target, it)) return true
	bits[uIdx] = 1
	if (solve(bits, target, it)) return true
	bits[uIdx] = UNKNOWN
	return false
}
const solve = (bits, target, it) => {
	const n = bits.length
	const bit = (i) => bits[i] ?? 0
	for (let i = it ?? Math.ceil(n / 3) - 1; i >= 0; i--) {
		const base = i * 3
		const b2 = bit(base + 2)
		if (b2 === UNKNOWN) return handleUnknown(bits, base + 2, target, i)
		const b1 = bit(base + 1)
		if (b1 === UNKNOWN) return handleUnknown(bits, base + 1, target, i)
		const b0 = bit(base)
		if (b0 === UNKNOWN) return handleUnknown(bits, base, target, i)
		const x = (b2 << 2) | (b1 << 1) | (b0 ^ 1)
		if (
			(bit(base) ^ bit(base + x)) !== (target[i] & 1) ||
			(bit(base + 1) ^ bit(base + x + 1)) !== ((target[i] >> 1) & 1) ||
			(bit(base + 2) ^ bit(base + x + 2) ^ 1) !== ((target[i] >> 2) & 1)
		) {
			return false
		}
	}
	return true
}
const nIt = p2.length
const base = '???'.repeat(nIt - 1)
for (let i = 1; i <= 7; ++i) {
	const bits = base.split('').concat(i.toString(2).split('').reverse())
	if (!solve(bits, p2)) continue
	console.log(parseInt(bits.reverse().join(''), 2))
	break
}
