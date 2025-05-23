// Instructions
// adv|0: A >>= cop
// bxl|1: B ^= lop
// bst|2: B = cop & 7
// jnz|3: A ? jmp(lop) : nop
// bxc|4: B ^= C
// out|5: print (cop & 7)
// bdv|6: B = A >> cop
// cdv|7: C = A >> cop
const rawInput = require('../../utils/raw-input')
const cop = (ctx, op) => (op < 4 ? op : ctx['ABC'[op - 4]])
const instructions = {
	0: (ctx, op) => (ctx.A >>= cop(ctx, op)),
	1: (ctx, op) => (ctx.B ^= op),
	2: (ctx, op) => (ctx.B = cop(ctx, op) & 7),
	3: (ctx, op) => (ctx.A ? (ctx.pc = op - 2) : null),
	4: (ctx, op) => (ctx.B ^= ctx.C),
	5: (ctx, op) => ctx.out.push(cop(ctx, op) & 7),
	6: (ctx, op) => (ctx.B = ctx.A >> cop(ctx, op)),
	7: (ctx, op) => (ctx.C = ctx.A >> cop(ctx, op)),
}
function run(A, B, C, prog) {
	const ctx = { A, B, C, pc: 0, prog, out: [] }
	while (ctx.pc < prog.length) {
		const opcode = prog[ctx.pc]
		const op = prog[ctx.pc + 1]
		instructions[opcode](ctx, op)
		ctx.pc += 2
	}
	console.log(ctx.out.join(','))
}
let [A, B, C, prog] = rawInput.match(/(?<=:\s)[^\n]+/g)
run(...[A, B, C].map(Number), prog.split(',').map(Number))
