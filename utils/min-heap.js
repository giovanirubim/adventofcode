module.exports = class MinHeap {
	constructor(cmp, array = []) {
		this.array = array
		this.cmp = cmp
	}
	push(item) {
		const { array, cmp } = this
		let i = array.length
		array.push(item)
		while (i > 0) {
			const p = (i - 1) >> 1
			if (cmp(array[p], item) <= 0) break
			array[i] = array[p]
			i = p
		}
		array[i] = item
	}
	pop() {
		const { array, cmp } = this
		const res = array[0]
		const item = array[array.length - 1]
		array.length -= 1
		if (array.length) {
			let i = 0
			for (const n = array.length; ; ) {
				let c = (i << 1) | 1
				if (c >= n) break
				if (c + 1 !== n && cmp(array[c], array[c + 1]) > 0) c += 1
				if (cmp(array[c], item) >= 0) break
				array[i] = array[c]
				i = c
			}
			array[i] = item
		}
		return res
	}
	get length() {
		return this.array.length
	}
}
