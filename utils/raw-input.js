const inputName = process.argv[2] ?? './input.txt'
const rawInput = require('fs').readFileSync(inputName).toString('utf-8')
module.exports = rawInput
