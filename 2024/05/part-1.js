const rawInput = require('../../utils/raw-input').trim()
const [rules, updates] = rawInput.split('\n\n')
const previous = {}

rules.split('\n').forEach((rule) => {
	let [a, b] = rule.split('|').map(Number)
	let set = previous[b]
	if (set === undefined) {
		set = []
		previous[b] = set
	}
	set.push(a)
})

const validUpdate = (update) => {
	const prohibited = new Set()
	const values = update.split(',').map(Number)
	for (const val of values) {
		if (prohibited.has(val)) return 0
		const add = previous[val]
		if (!add) continue
		for (const item of add) prohibited.add(item)
	}
	return values[values.length >> 1]
}

const res = updates
	.split('\n')
	.map(validUpdate)
	.reduce((a, b) => a + b, 0)

console.log(res)
