import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { ethers, BigNumber } from "ethers";
import Web3Modal from "web3modal";
import ERC20Abi from "./abis/ERC20.json";

const web3Modal = new Web3Modal({
  providerOptions: {},
});

function App() {
  const [instance, setInstance] = useState();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [address, setAddress] = useState<string>();
  const [daiBalance, setDaiBalance] = useState<string>();

  // Goerli testnet
  const DAIAddress = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";

  // using if inside useEffect will only run when instance is defined
  useEffect(() => {
    if (instance) {
      const provider = new ethers.providers.Web3Provider(instance);
      setSigner(provider.getSigner());
    }
  }, [instance]);

  useEffect(() => {
    const getAddress = async () => {
      if (signer) {
        setAddress(await signer.getAddress());
      }
    };

    getAddress();
  }, [signer]);

  useEffect(() => {
    const getBalance = async () => {
      if (signer && address) {
        const daiContract = new ethers.Contract(DAIAddress, ERC20Abi, signer);
        const daiBalanceBN = (await daiContract.balanceOf(
          address
        )) as BigNumber;

        const daiDecimalsBN = (await daiContract.decimals()) as BigNumber;

        setDaiBalance(ethers.utils.formatUnits(daiBalanceBN, daiDecimalsBN));

        // in single-line
        // setDaiBalance((await daiContract.balanceOf(address) as BigNumber).toString())
      }
    };

    getBalance();
  }, [address, signer]);

  return (
    <>
      <div>GOERLI BALANCE CHECKER</div>
      {/* if function is of await use async on arrow function */}
      {address ? (
        <>
          <div>address: {address}</div>
          <div>DaiBalance: {daiBalance}</div>
        </>
      ) : (
        <Button onClick={async () => setInstance(await web3Modal.connect())}>
          Connect Wallet
        </Button>
      )}
    </>
  );
}

export default App;
