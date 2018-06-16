import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { LOAD_TOKEN } from "./constants";
import { saveToken } from "./actions";

import web3 from '../../../token/web3';
import instance from '../../../token/TokenInstance';
import * as SavingToken from '../../../token/build/SavingToken.json';

async function getTokenData() {

  const accounts = await web3.eth.getAccounts();
  const totalSupply = await instance.methods.totalSupply().call();
  const contractAddress = await instance._address;
  const name = await instance.methods.name().call();
  const owner = await instance.methods.owner().call();
  const symbol = await instance.methods.symbol().call();
  const metaMaskAccountBalance = await instance.methods.balanceOf(accounts[0]).call();
  const metaMaskAccountNextTxTime = await instance.methods.nextTxTime(accounts[0]).call();

  // console.log(symbol, accounts[0], totalSupply, contractAddress, name, owner, metaMaskAccountBalance, metaMaskAccountNextTxTime)
  return {symbol, metaMaskAccount: accounts[0], totalSupply, contractAddress, name, owner, metaMaskAccountBalance, metaMaskAccountNextTxTime, tokenLoaded: true};
}



function* loadTokenSaga () {
  // var x = await getSymbol();
  // getSymbol.then(function* (x) {
  //   // console.log(x)
  //   yield put(saveToken("", contractAddress, name, owner, "", x));
  // })
  const results = yield call(getTokenData);

  yield put(saveToken((results)));


  // const resp = yield call(getSymbol);
  // console.log(JSON.parse(SavingToken.interface))
  // var metaMaskAccountBalance
  // yield* instance.methods.balanceOf(accounts[0]).call().then(function* (metaMaskAccountBalance) {
  //   // yield* put(saveToken(totalSupply, contractAddress, name, owner, symbol, metaMaskAccountBalance));
  //   console.log( totalSupply, contractAddress, name, owner, symbol, metaMaskAccountBalance );
  // });

}

// Individual exports for testing
export default function* defaultSaga() {
  yield takeLatest(LOAD_TOKEN, loadTokenSaga)
  // See example in containers/HomePage/saga.js
}
