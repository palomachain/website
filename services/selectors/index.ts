/* istanbul ignore file */

import * as tokens from 'services/selectors/tokens';
import * as price from 'services/selectors/price';

const selectors = {
  ...tokens,
  ...price,
};

export default selectors;
