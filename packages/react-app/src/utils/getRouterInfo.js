import { abis } from '@my-app/contracts';

export const getRouterInfo = async (routerAddress, web3) => {
  // JavaScript Representation of Smart Contract
  const routerContract = new web3.eth.Contract(abis.router02, routerAddress);

  return {
    // Returning Factory for Smart Contract
    factory: await routerContract.methods.factory().call(),
  };
};
