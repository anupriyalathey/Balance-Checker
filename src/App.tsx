import React, { useState, useEffect } from "react";
import { Button } from "@chakra-ui/react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const web3Modal = new Web3Modal({
  providerOptions: {},
});

function App() {
  const [instance, setInstance] = useState();
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner>();
  const [address, setAddress] = useState<string>();

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

  return (
    <>
      <div>BALANCE CHECKER</div>
      {/* if function is of await use async on arrow function */}
      {address ? (
        <div>address: {address}</div>
      ) : (
        <Button onClick={async () => setInstance(await web3Modal.connect())}>
          Connect Wallet
        </Button>
      )}
    </>
  );
}

export default App;
