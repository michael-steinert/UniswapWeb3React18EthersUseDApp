import { abis } from '@my-app/contracts';

import { getPairsInfo } from './getPairsInfo';

export const getFactoryInfo = async (factoryAddress, web3) => {
  const factoryContract = new web3.eth.Contract(abis.factory, factoryAddress);
  const factoryInfo = {
    fee: await factoryContract.methods.feeTo().call(),
    feeToSetter: await factoryContract.methods.feeToSetter().call(),
    allPairsLength: await factoryContract.methods.allPairsLength().call(),
    allPairs: [],
    pairsInfo: {},
  };

  for (let i = 0; i < factoryInfo.allPairsLength; i++) {
    factoryInfo.allPairs[i] = await factoryContract.methods.allPairs(i).call();
  }

  factoryInfo.pairsInfo = await getPairsInfo(factoryInfo.allPairs, web3);

  return factoryInfo;
};
