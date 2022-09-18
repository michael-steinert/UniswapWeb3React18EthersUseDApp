import React from 'react';
import { useEthers } from '@usedapp/core';

import { usePools } from './hooks';
import styles from './styles';
import { uniswapLogo } from './assets';
import { Exchange, Loader, WalletButton } from './components';

const App = () => {
  const { account } = useEthers();
  const [poolsLoading, pools] = usePools();

  return (
    <div className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <img
            src={uniswapLogo}
            alt={'Uniswap'}
            className={'w-16 h-16 object-contain'}
          />
          <WalletButton />
        </header>
        <div className={styles.exchangeContainer}>
          <h1 className={styles.headTitle}>Uniswap Clone</h1>
          <p className={styles.subTitle}>Exchange Tokens</p>
          <div className={styles.exchangeBoxWrapper}>
            <div className={styles.exchangeBox}>
              <div className={'pink-gradient'} />
              <div className={styles.exchange}>
                {account ? (
                  poolsLoading ? (
                    <Loader title={'Loading Liquidity Pools'} />
                  ) : (
                    <Exchange pools={pools} />
                  )
                ) : (
                  <Loader title={'Wallet is not connected'} />
                )}
                <p className={'text-white'}>{account}</p>
              </div>
              <div className={'blue-gradient'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
