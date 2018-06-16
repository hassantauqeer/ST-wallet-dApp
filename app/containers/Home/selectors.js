import { createSelector } from 'reselect';

/**
 * Direct selector to the home state domain
 */
const selectHomeDomain = (state) => state.get('home');

/**
 * Other specific selectors
 */


/**
 * Default selector used by Home
 */

const makeSelectToken = () => createSelector(
  selectHomeDomain,
  (substate) => substate.toJS()
);

export default makeSelectToken;
export {
  selectHomeDomain,
};
