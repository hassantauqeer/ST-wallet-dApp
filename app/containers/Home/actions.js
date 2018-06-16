/*
 *
 * Home actions
 *
 */

import {
  LOAD_TOKEN, SAVE_TOKEN, SAVE_TIMESTAMP
} from './constants';

export function loadToken() {
  return {
    type: LOAD_TOKEN,
  };
}

export function saveToken(data) {
  return {
    type: SAVE_TOKEN,
    data
  };
}

export function saveTimeStamp(val) {
  return {
    type: SAVE_TIMESTAMP,
    val
  };
}


