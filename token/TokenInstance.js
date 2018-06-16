import web3 from './web3';
import * as VotingSystem from './build/SavingToken.json';

export default new web3.eth.Contract(JSON.parse(VotingSystem.interface), "0x302f80A674dC6cE4b73af3ef75E03C8612d0684F");