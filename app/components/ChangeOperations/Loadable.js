/**
 *
 * Asynchronously loads the component for ChangeOwner
 *
 */

import Loadable from 'react-loadable';

export default Loadable({
  loader: () => import('./index'),
  loading: () => null,
});
