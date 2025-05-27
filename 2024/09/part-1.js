const arr = require('../../utils/raw-input').trim()
let n = 0
for (let i = 0; i < arr.length; i += 2) {
	n += Number(arr[i])
}
let l = 0
let usedL = 0
let r = arr.length - 1
let usedR = 0
let rId = (arr.length - 1) >> 1
let lId = 0
let sum = 0
const isFile = (i) => (i & 1) === 0
const nextL = () => {
	while (Number(arr[l]) === usedL) {
		l += 1
		if (isFile(l)) lId += 1
		usedL = 0
	}
}
const nextR = () => {
	while (Number(arr[r]) === usedR) {
		r -= 1
		if (isFile(r)) rId -= 1
		usedR = 0
	}
}
const spendL = () => {
	usedL += 1
	nextL()
}
const spendR = () => {
	usedR += 1
	nextR()
}
nextL()
nextR()
for (let i = 0; i < n; ++i) {
	if (isFile(l)) {
		sum += i * lId
	} else {
		while (!isFile(r)) spendR()
		sum += i * rId
		spendR()
	}
	spendL()
}
console.log(sum)
