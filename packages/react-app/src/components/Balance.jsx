import React from 'react';
import { formatUnits, parseUnits } from 'ethers/lib/utils';

import styles from '../styles';

const Balance = ({ tokenBalance }) => {
  return (
    <div className={styles.balance}>
      <p className={styles.balanceText}>
        {tokenBalance && (
          <React.Fragment>
            <span className={styles.balanceBold}>
              Balance: {formatUnits(tokenBalance || parseUnits('0'))}
            </span>
          </React.Fragment>
        )}
      </p>
    </div>
  );
};

export default Balance;
