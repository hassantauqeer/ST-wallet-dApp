const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const SavingToken = require('./build/SavingToken.json');
const fs = require('fs-extra');
const path = require('path');

const TokenInstance = path.resolve(__dirname, 'TokenInstance.js');
fs.removeSync(TokenInstance);

const provider = new HDWalletProvider(
  'clown shiver beach wheel this mixture emotion illness fatigue amateur talent bitter',
  'https://rinkeby.infura.io/TnLV7HlGk5SeiboICQWq'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);
  // console.log(SavingToken.bytecode)
  // console.log(SavingToken.interface)
  const result = await new web3.eth.Contract(
    JSON.parse(SavingToken.interface)
  )
    .deploy({ data: SavingToken.bytecode, arguments: [1000] }) //Creating 1,000 ST
    .send({ gas: '4712388', from: accounts[0] });
    console.log('Contract deployed to: ', result.options.address);
    fs.writeFile("./token/TokenInstance.js", TokenInstanceContent(result.options.address));

};
deploy();

function TokenInstanceContent (address) {
    return (
        `import web3 from './web3';
import * as SavingToken from './build/SavingToken.json';

export default new web3.eth.Contract(JSON.parse(SavingToken.interface), "${address}");`
    )
}