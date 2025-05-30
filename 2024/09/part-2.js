const rawInput = require('../../utils/raw-input')
const digs = rawInput.trim().split('').map(Number)
let head = null
let foot = null
const append = (id, size) => {
	if (size === 0) return
	if (id === null && foot !== null && foot.id === null) {
		foot.id += size
		return
	}
	const node = {
		id,
		size,
		prev: foot,
		next: null,
		index: (foot?.index ?? -1) + 1,
	}
	if (foot === null) {
		head = node
	} else {
		foot.next = node
	}
	foot = node
}
const linkNode = (node) => {
	let prevIndex, nextIndex
	if (node.prev) {
		prevIndex = node.prev.index
		node.prev.next = node
	} else {
		prevIndex = head.index - 1
		head = node
	}
	if (node.next) {
		nextIndex = node.next.index
		node.next.prev = node
	} else {
		nextIndex = foot.index + 1
		foot = node
	}
	node.index = (prevIndex + nextIndex) / 2
}
const deleteNode = (node) => {
	if (node.next === null) {
		foot = node.prev
	} else {
		node.next.prev = node.prev
	}
	if (node.prev === null) {
		head = node.next
	} else {
		node.prev.next = node.next
	}
}
const mergeNeighborSpaces = (node) => {
	if (node.prev !== null && node.prev.id === null) {
		node.size += node.prev.size
		deleteNode(node.prev)
	}
	if (node.next !== null && node.next.id === null) {
		node.size += node.next.size
		deleteNode(node.next)
	}
}
digs.forEach((size, i) => {
	const id = i & 1 ? null : i >> 1
	append(id, size)
})
const nextSpace = (minSize, start = head) => {
	let node = start
	while (node !== null && (node.id !== null || node.size < minSize)) {
		node = node.next
	}
	return node
}
const nextFile = (start) => {
	let node = start
	while (node !== null && node.id === null) {
		node = node.prev
	}
	return node
}
const attempted = new Set()
const transfer = (fileNode, spaceNode) => {
	if (attempted.has(fileNode.id)) return false
	attempted.add(fileNode.id)
	if (fileNode.index <= spaceNode.index) return false
	if (fileNode.size === spaceNode.size) {
		spaceNode.id = fileNode.id
	} else {
		const node = {
			id: fileNode.id,
			size: fileNode.size,
			prev: spaceNode.prev,
			next: spaceNode,
		}
		linkNode(node)
		spaceNode.size -= fileNode.size
	}
	fileNode.id = null
	mergeNeighborSpaces(fileNode)
	return true
}
const log = () => {
	let output = ''
	for (let n = head; n; n = n.next) {
		output += (n.id === null ? '.' : n.id + '').repeat(n.size)
	}
	console.log(output)
}
let filePtr = foot
for (;;) {
	filePtr = nextFile(filePtr)
	if (filePtr === null) break
	let space = nextSpace(filePtr.size)
	if (!space || !transfer(filePtr, space)) {
		filePtr = filePtr.prev
	}
}
let sum = 0,
	i = 0
for (let n = head; n; n = n.next) {
	let mul = n.id ?? 0
	for (let j = 0; j < n.size; ++j) {
		sum += mul * i++
	}
}
console.log(sum)
