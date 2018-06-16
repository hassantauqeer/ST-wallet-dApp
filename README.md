# ERC20 Token Wallet

- [Installation](#installation)
- [Project Structure](#project-structure)
- [Token](#token)
- [Wallet DAPP](#wallet-dapp)


### Installation
```bash
cd wallet-dApp/
```
```bash
yarn
```
```bash
yarn start
```

### Project Structure

```
coding-challenge-blockchain/
  .gitignore
  README.md
  wallet-dApp/
    app/
      components
      containers
      css 
      app.js
      index.html	
      reducers.js
    docs
    internals
    server
    token/
      build       // -> Build files of Contract
      contracts	  // -> Solidity Contracts
      tests       // -> Contract's Unit Tests
      compile.js	    // -> Compiling file
      deploy.js	      // -> Deploying file
      factory.js	    // -> Contracts Instance
      saveToken.js    // -> connected Web3 with deployed contract (ABI + Contract Address)
      web3.js         // -> exporting Web3 instance
      
    README.md
    package.json
    yarn.lock
```

### Token
Name: Saving Token (ST)

Saving Token is an improvement of standard ERC20 with a new functionality of locking your account for a period of time (minutes), after each TX.

#### Scenario:
Contract is deployed, Ahmed has a Balance of 100 ST at xyz(address).
- Ahmed is able to make a ST Transaction which means Ahmed account is not locked at the moment.
- Ahmed checks his account Lock time by entering his address xyz(address), as Ahmed has not performed any transaction yet he     will get 0 as a return value from Locktime.
- Ahmed Locks his Account for some Minutes.
- Ahmed can perform only one TX after changing Locktime, until the LockTime is over after performing a TX again account gets     locked for amount of minutes Ahmed Locked his account.
- To Unlock his account Ahmed will change LockTime to 0 and account will be unlocked now Ahmed can perform a TX without any     wait of account unlocking.

#### New Functions:

* `trnasferOwner(address)` This function in Contract transfer Ownership of Token to another address. Only an owner can transfer Ownership.
* `changeLockTime(lockTime)` changeLockTime changes Lock Time of sender's Address.

#### New Variables:

* `nextTxTime` nextTxTime saves time after which an Account can perform TX.
* `lockTime` lockTime saves number of Minutes for which an account will be locked after each TX, by default its value is 0.
*  Rest are easy to understand.

#### Operations
```bash
cd wallet-dApp/
```
To compile Token
```bash
node token/compile.js
```
To Deploy Token, it will get Compiled ABI from `./compile.js` and it will deploy it.
```bash
node token/deploy.js
```
To run tests for Token
```bash
yarn run test
```


### Wallet DAPP

[React-Boilerplate](https://github.com/react-boilerplate/react-boilerplate) is used to develop Front-End wallet for Saving Token due to its awesome props handling, ajax call thorugh sagas, and most importantly the best project structure I ever saw in any boilerplate. 

[antd](https://ant.design/) the best and fastest React Framework to develop Front-End Apps.

* `containers/Home` combines all other Components at one place.
* `components/ChangeOperations` contains logic for those operations that change state of SavingToken such as `Change Owner`, `Change LockTime`.
* `components/CheckOperations` contains logic for those operations that only check (get) state of SavingToken varibales such as `Check Next TX Time`, `Check Balance`, `Check LockTime`.
* `components/SendToken` contains logic for Transfer(Token's modified Function).

*  Rest are easy to understand.


👤Any Recommendations, EIPs, bug Fixes or Issues are highly welcomed.😇
