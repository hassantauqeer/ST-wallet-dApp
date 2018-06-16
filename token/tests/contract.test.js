const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledToken = require('../build/SavingToken.json');

let accounts;
let savingToken;
let tokenAddress;
let owner;
let totalSupply;
process.setMaxListeners(0);

describe('SavingToken', () => {
    beforeAll(async () => {
        accounts = await web3.eth.getAccounts();

        savingToken = await new web3.eth.Contract(JSON.parse(compiledToken.interface))
            .deploy({data: compiledToken.bytecode, arguments: [1000]})
            .send({from: accounts[0], gas: '4712388'});
        owner = await savingToken.methods.owner().call();
        totalSupply = await savingToken.methods.totalSupply().call();
        console.log(owner)
        // console.log(totalSupply)
        // console.log(accounts)
    });

    it('deploys Saving Token a modified ERC20', () => {
        assert.ok(savingToken.options.address);
    })

    it('token Supply in exactly 1,000 ST', () => {
        assert.equal(1000, totalSupply);
    })

    it('deployer is the Owner of contract', async () => {
        assert.equal(accounts[0], owner);
    })

    it('deployer (Owner) of contract has all 1,000 ST', async () => {
        const balance = await savingToken.methods.balances(owner).call();
            assert.equal(balance, 1000);
    })

    it('executes transfer function, sends tokens from accounts[0] to accounts[1]', async () => {
        const tx = await savingToken.methods.transfer(accounts[1], 100).send({from: accounts[0], gas: '1000000'});

        //check balance of both accounts, one should have 100 less tokens and other should have 100 more.
        const balanceAcc1 = await savingToken.methods.balances(owner).call();
        const balanceAcc2 = await savingToken.methods.balances(accounts[1]).call();

        console.log("From Acc0unt : " ,accounts[0] , balanceAcc1);
        console.log("Acc0unt : " ,accounts[1] , balanceAcc2);

        assert.equal(balanceAcc1, 900);
        assert.equal(balanceAcc2, 100);
    })

    it('is Should change the LockTime of an account', async () => {
      //It gets current Locktime of account[0] that will be 0, OfCourse
        const currentTime = await savingToken.methods.lockTime(accounts[0]).call();
        console.log("Current Time: ", currentTime)


      //changing LockTime to 2 minute (120 seconds)
      await savingToken.methods.changeLockTime(2).send({from: accounts[0], gas: '1000000'});


      //It gets New Locktime of account[0] that will be 2 minutes (120secs), OfCourse
      const newTime = await savingToken.methods.lockTime(accounts[0]).call();
      console.log("New Time: ", newTime)
      const balanceAcc1 = await savingToken.methods.balances(owner).call();
      assert.equal(balanceAcc1, 900);

        // await savingToken.methods.changeLockTime(1).send({from: accounts[0], gas: '1000000'});
        // const nextTxTime = await savingToken.methods.nextTxTime(accounts[0]).call();
        // console.log("Next Time: ", (new Date(nextTxTime*1000)).toString())
        // console.log("Next Time Time Stamp: ", nextTxTime)
        // const tx = await savingToken.methods.transfer(accounts[1], 100).send({from: accounts[0], gas: '1000000'});
        // console.log(tx)

        assert.equal(currentTime, 0);
        assert.equal(newTime, 2);
    })

    // it('locked account can\'t transfer until locked time is over ', async () => {
    //     const balance = await savingToken.methods.balanceOf(accounts[1]).call();
    //
    //     console.log("account balance before tx: ", balance)
    //
    //     const tx = await savingToken.methods.transfer(accounts[2], 50).send({from: accounts[1], gas: '1000000'});
    //     //check balance of both accounts, one should have 100 less tokens and other should have 100 more.
    //     const balanceAcc1 = await savingToken.methods.balances(accounts[1]).call();
    //     const balanceAcc2 = await savingToken.methods.balances(accounts[2]).call();
    //     const balanceowner = await savingToken.methods.balances(owner).call();
    //
    //     // console.log(tx);
    //     console.log("Acc0unt to: " ,accounts[1] , balanceAcc1);
    //     console.log("Acc0unt from: " ,accounts[2] , balanceAcc2);
    //     console.log("Owner: ", owner ," = " ,balanceowner);
    //     assert.ok(true);
    //     // assert.equal(balanceAcc1, 900);
    //     // assert.equal(balanceAcc2, 100);
    // })

    // it('balance of token Owner', async () => {
    //     const owner = await savingToken.methods.balanceOf(owner).call();
    //     assert.equal(accounts[0], owner);
    // })
})
