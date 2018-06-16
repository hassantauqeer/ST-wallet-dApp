/*
 *
 * Home reducer
 *
 */

import { fromJS } from 'immutable';
import {
  SAVE_TOKEN, SAVE_TIMESTAMP
} from './constants';

const initialState = fromJS({
  info: {
    tokenLoaded: false,
    name: '',
    symbol: '',
    totalSupply: '',
    contractAddress: '',
    owner: '',
    metaMaskAccountBalance: '',
    metaMaskAccount: undefined,
    metaMaskAccountNextTxTime: '',
  },
  timeStamp: ''
});

function homeReducer(state = initialState, action) {
  switch (action.type) {
    case SAVE_TOKEN:
      return state.set('info', action.data);

    case SAVE_TIMESTAMP:
      return state.set('timeStamp', action.val);

    default:
      return state;
  }
}

export default homeReducer;
