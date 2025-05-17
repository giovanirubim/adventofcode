const rawInput = require('../../utils/raw-input')

let count = 0
rawInput
	.trim()
	.split('\n')
	.forEach((line) => {
		const arr = line.split(/\s+/).map(Number)
		const diff = arr[1] - arr[0]
		const abs = Math.abs(diff)
		if (abs < 1 || abs > 3) return
		const sign = Math.sign(diff)
		for (let i = 2; i < arr.length; ++i) {
			const diff = arr[i] - arr[i - 1]
			const abs = Math.abs(diff)
			if (abs < 1 || abs > 3) return
			if (Math.sign(diff) !== sign) return
		}
		count += 1
	})

console.log(count)
