import { useState, useEffect, useRef } from 'react';

import { chevronDown } from '../assets';
import { useOnClickOutside } from '../utils';
import styles from '../styles';

const AmountIn = ({
  onSelect,
  onChange,
  value,
  currencyValue,
  currencies,
  isSwapping,
}) => {
  const [showList, setShowList] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('Select');

  const ref = useRef();
  useOnClickOutside(ref, () => setShowList(false));

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
        onChange={(event) =>
          typeof onChange === 'function' && onChange(event.target.value)
        }
        placeholder={'0.0'}
        type={'number'}
        value={value}
        disabled={isSwapping}
        className={styles.amountInput}
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
                className={` ${styles.currencyListItem} ${
                  activeCurrency === tokenName ? 'bg-site-dim2' : ''
                } cursor-pointer`}
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

export default AmountIn;
