import { useState, useEffect } from 'react';
import { Contract } from '@ethersproject/contracts';
import {
  ERC20,
  useContractFunction,
  useTokenAllowance,
  useTokenBalance,
  useEthers,
} from '@usedapp/core';
import { ethers } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';

import { abis } from '@my-app/contracts';
import { ROUTER_ADDRESS } from '../config';
import { AmountIn, AmountOut, Balance } from './';
import {
  getAvailableTokens,
  getCounterpartTokens,
  findPoolByTokens,
  isOperationPending,
  getFailureMessage,
  getSuccessMessage,
} from '../utils';
import styles from '../styles';

const Exchange = ({ pools }) => {
  const [fromValue, setFromValue] = useState('0');
  const [fromToken, setFromToken] = useState(pools[0].token0Address);
  const [toToken, setToTokenValue] = useState('');
  const [resetState, setResetState] = useState(false);

  const { account } = useEthers();

  const routerContract = new Contract(ROUTER_ADDRESS, abis.router02);
  const fromTokenContract = new Contract(fromToken, ERC20.abi);
  const fromTokenBalance = useTokenBalance(fromToken, account);
  const toTokenBalance = useTokenBalance(toToken, account);
  const tokenAllowance = useTokenAllowance(
    fromToken,
    account,
    ROUTER_ADDRESS || parseUnits(0)
  );
  // Custom Checks
  // Amount to swap
  const fromValueBigNumber = parseUnits(fromValue || '0');
  // Greater then
  const approvalNeeded = fromValueBigNumber.gt(
    tokenAllowance || parseUnits('0')
  );
  const isFromValueGreaterThenZero = fromValueBigNumber.gt(parseUnits('0'));
  // Less then or equal
  const hasEnoughBalance = fromValueBigNumber.lte(
    fromTokenBalance ?? parseUnits('0')
  );

  // Smart Contract Interaction
  const {
    state: swapApprovalState,
    send: swapApprovalSend,
  } = useContractFunction(fromTokenContract, 'approve', {
    transactionName: 'onApproveRequested',
    gasLimitBufferPercentage: 10,
  });
  const isApproving = isOperationPending(swapApprovalState);

  const {
    state: swapExecuteState,
    send: swapExecuteSend,
  } = useContractFunction(routerContract, 'swapExactTokensForTokens', {
    transactionName: 'swapExactTokensForTokens',
    gasLimitBufferPercentage: 10,
  });
  const isSwapping = isOperationPending(swapExecuteState);

  // Custom Checks
  const canApprove = !isApproving && approvalNeeded;
  const canSwap =
    !approvalNeeded &&
    !isSwapping &&
    isFromValueGreaterThenZero &&
    hasEnoughBalance;

  // List of available Tokens to swap
  const availableTokens = getAvailableTokens(pools);
  // List of Tokens that a Conversion to is possible
  const counterpartTokens = getCounterpartTokens(pools, fromToken);
  // Pool that allows the exchange of the `fromToken` to `counterpartToken`
  const pairAddress =
    findPoolByTokens(pools, fromToken, toToken)?.address ?? '';

  // Check States of Application
  const successMessage = getSuccessMessage(swapApprovalState, swapExecuteState);
  const failureMessage = getFailureMessage(swapApprovalState, swapExecuteState);

  const onApprovalRequested = () => {
    // Using `MaxUint256` to allowance only once and then swap automatically
    swapApprovalSend(ROUTER_ADDRESS, ethers.constants.MaxUint256);
  };

  const onSwapRequested = () => {
    // amountIn, amountOutMin, path, to, deadline
    swapApprovalSend(
      fromValueBigNumber,
      0,
      [fromToken, toToken],
      account,
      Math.floor(Date.now / 1000 + 42)
    ).then(() => {
      setFromValue('0');
    });
  };

  const onFromValueChange = (value) => {
    const trimmedValue = value.trim();
    try {
      if (trimmedValue) {
        setFromValue(parseUnits(value));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onFromTokenChange = (value) => {
    setFromToken(value);
  };

  const onToTokenChange = (value) => {
    setToTokenValue(value);
  };

  useEffect(() => {
    if (failureMessage || successMessage) {
      setTimeout(() => {
        setResetState(true);
        setFromValue('0');
        setToTokenValue('');
      }, 4200);
    }
  }, [failureMessage, successMessage]);

  return (
    <div className={'flex flex-col w-full items-center'}>
      <div className={'mb-8'}>
        <AmountIn
          onChange={onFromValueChange}
          onSelect={onFromTokenChange}
          value={fromValue}
          currencyValue={fromToken}
          currencies={availableTokens}
          isSwapping={isSwapping && hasEnoughBalance}
        />
        <Balance tokenBalance={fromTokenBalance} />
      </div>
      <div className={'mb-8 w-[100%]'}>
        <AmountOut
          onSelect={onToTokenChange}
          fromToken={fromToken}
          toToken={toToken}
          amountIn={fromValueBigNumber}
          pairContract={pairAddress}
          currencyValue={toToken}
          currencies={counterpartTokens}
        />
        <Balance tokenBalance={toTokenBalance} />
      </div>
      {approvalNeeded && !isSwapping ? (
        <button
          onClick={onApprovalRequested}
          disabled={!canApprove}
          className={`${
            canApprove
              ? 'bg-site-pink text-white'
              : 'bg-site-dim2 text-site-dim2'
          } ${styles.actionButton}}`}
        >
          {isApproving ? 'Approving' : 'Approve'}
        </button>
      ) : (
        <button
          onClick={onSwapRequested}
          disabled={!canSwap}
          className={`${
            canSwap ? 'bg-site-pink text-white' : 'bg-site-dim2 text-site-dim2'
          } ${styles.actionButton}}`}
        >
          {isSwapping
            ? 'Swapping'
            : hasEnoughBalance
            ? 'Swap'
            : 'Insufficient Balance'}
        </button>
      )}
      {failureMessage && !resetState ? (
        <p className={styles.message}>{failureMessage}</p>
      ) : successMessage ? (
        <p className={styles.message}>{successMessage}</p>
      ) : (
        ''
      )}
    </div>
  );
};

export default Exchange;
