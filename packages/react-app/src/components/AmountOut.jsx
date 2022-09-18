import { useState, useEffect, useRef } from 'react';

import { formatUnits } from 'ethers/lib/utils';

import { chevronDown } from '../assets';
import { useOnClickOutside, useAmountsOut } from '../utils';
import styles from '../styles';

const AmountOut = ({
  onSelect,
  fromToken,
  toToken,
  amountIn,
  pairContract,
  currencyValue,
  currencies,
}) => {
  const [showList, setShowList] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('Select');

  const ref = useRef();
  useOnClickOutside(ref, () => setShowList(false));

  const amountOut =
    useAmountsOut(pairContract, amountIn, fromToken, toToken) ?? 0;

  useEffect(() => {
    if (Object.keys(currencies).includes(currencyValue)) {
      setActiveCurrency(currencies[currencyValue]);
    } else {
      setActiveCurrency('Select');
    }
  }, [currencies, currencyValue]);

  return (
    <div className={styles.amountContainer}>
      <input
        placeholder={'0.0'}
        type={'number'}
        value={formatUnits(amountOut)}
        disabled={true}
        className={styles.amountOutput}
      />
      <div
        onClick={() => {
          setShowList((previousState) => !previousState);
        }}
        className={'relative'}
      >
        <button className={styles.currencyButton}>
          {activeCurrency}
          <img
            src={chevronDown}
            alt={'Chevron Down'}
            className={`w-4 h-4 object-contain ml-2 ${
              showList ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>
        {showList && (
          <ul ref={ref} className={styles.currencyList}>
            {Object.entries(currencies).map(([token, tokenName], index) => (
              <li
                onClick={() => {
                  if (typeof onSelect === 'function') {
                    onSelect(token);
                  }
                  setActiveCurrency(tokenName);
                  setShowList(false);
                }}
                key={index}
                className={styles.currencyListItem}
              >
                {tokenName}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AmountOut;
