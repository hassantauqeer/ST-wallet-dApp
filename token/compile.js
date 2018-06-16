const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const SavingToken = path.resolve(__dirname, 'contracts', 'SavingToken.sol');
const SafeMath = path.resolve(__dirname, 'contracts', 'SafeMath.sol');
const ERC20Modified = path.resolve(__dirname, 'contracts', 'ERC20Modified.sol');
const source = {
    'ERC20Modified.sol': fs.readFileSync(ERC20Modified, 'utf8'),
    'SafeMath.sol': fs.readFileSync(SafeMath, 'utf8'),
    'SavingToken.sol': fs.readFileSync(SavingToken, 'utf8')
}
const output = solc.compile({sources: source}, 1).contracts;

fs.ensureDirSync(buildPath);


//***  If One Contract File contains more than One Contract. This loop will iterate
//***  through each Contract in ABI creating a separate ${contractName}.json file for each one.
console.log(output)
for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(/^(.*?)\:/, '') + '.json'),
    output[contract]
  );
}
