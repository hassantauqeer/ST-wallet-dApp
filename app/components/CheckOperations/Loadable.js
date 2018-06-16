/**
 *
 * Asynchronously loads the component for CheckBalance
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
