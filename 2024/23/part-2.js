import fs from "fs";

const inputText = fs.readFileSync("./input.txt", "ascii");

const tStart = performance.now();

const lines = inputText.trim().split("\n");
const edges = lines.map((l) => l.split("-"));
const allNodes = [...new Set(edges.flat())].sort();
const n = allNodes.length;
const indexMap = Object.fromEntries(allNodes.map((node, i) => [node, i]));
const nWords = Math.ceil(n / 32);
const range = allNodes.map((_, i) => i);

const setBit = (arr, i) => (arr[i >> 5] |= 1 << (i & 31));
const getBit = (arr, i) => (arr[i >> 5] >> (i & 31)) & 1;
const toggleBit = (arr, i) => (arr[i >> 5] ^= 1 << (i & 31));
const lowestWordBit = (w) => w & -w;
const wordToHex = (w) => w.toString(16).padStart(8, "0");

const arrToHex = (arr) => {
	let res = "";
	for (let i = 0; i < nWords; i++) {
		res += wordToHex(arr[i]);
	}
	return res;
};

const andArr = (arr, mask) => {
	for (let i = 0; i < nWords; i++) {
		arr[i] &= mask[i];
	}
	return arr;
};

const getSetBitIndices = (arr) => {
	const res = [];
	for (let wi = 0; wi < nWords; wi++) {
		let mask = arr[wi];
		while (mask !== 0) {
			const bit = lowestWordBit(mask);
			mask ^= bit;
			res.push((wi << 5) | Math.log2(bit));
		}
	}
	return res;
};

const connectionMat = range.map((i) => {
	const arr = new Uint32Array(nWords);
	setBit(arr, i);
	return arr;
});

for (const [a, b] of edges) {
	const [i, j] = [indexMap[a], indexMap[b]];
	setBit(connectionMat[i], j);
	setBit(connectionMat[j], i);
}

const canJoin = (setArr, nodeIndex) => {
	const connArr = connectionMat[nodeIndex];
	for (let i = 0; i < nWords; i++) {
		if ((connArr[i] & setArr[i]) !== setArr[i]) return false;
	}
	return true;
};

const expand = ([setArr, connArr], hexMap, res) => {
	const indices = getSetBitIndices(connArr);
	for (let i of indices) {
		if (getBit(setArr, i)) {
			continue;
		}
		if (!canJoin(setArr, i)) {
			continue;
		}
		setBit(setArr, i);
		const hex = arrToHex(setArr);
		if (hexMap[hex] === undefined) {
			hexMap[hex] = true;
			const newSetArr = setArr.slice();
			const newConnArr = connArr.slice();
			andArr(newConnArr, connectionMat[i]);
			res.push([newSetArr, newConnArr]);
		}
		toggleBit(setArr, i);
	}
};

const iterate = (cliques) => {
	const newCliques = [];
	const hexMap = {};
	for (const clique of cliques) {
		expand(clique, hexMap, newCliques);
	}
	return newCliques;
};

let cliques = range.map((i) => {
	const setArr = new Uint32Array(nWords);
	setBit(setArr, i);
	const connArr = connectionMat[i].slice();
	return [setArr, connArr];
});

let res = "";
for (;;) {
	const next = iterate(cliques);
	if (next.length !== 0) {
		cliques = next;
		continue;
	}
	const [clique] = cliques;
	const [setArr, _] = clique;
	const nodes = getSetBitIndices(setArr).map((i) => allNodes[i]);
	nodes.sort();
	res = nodes.join(",");
	break;
}

const tEnd = performance.now();

console.log("Result:", res);
console.log(tEnd - tStart, "ms");
