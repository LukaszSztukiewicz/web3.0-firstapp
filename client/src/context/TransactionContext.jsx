import React, { useEffect, useState } from "react";
import { ethers } from 'ethers';
import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transtactionContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transtactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({addressTo:"", amount:"", keyword:"", message:""});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

    const handleChange = (e, name ) => {
        setFormData((prevState)=>({...prevState, [name]:e.target.value}));
        console.log(
            {
                formData
            }
        )
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Metamask not found, please install it in order to use this app!");
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length) {
                setCurrentAccount(accounts[0]);
            }
            else {
                console.log("No accounts found");
            }
        } catch (error) {
            console.error(error);
        }
    }

    const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({ method: "eth_requestAccounts", });

      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object connectWallet");
    }
  };

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    

    const sendTransaction = async () => {
        try {
          if (ethereum) {
            const { addressTo, amount, keyword, message } = formData;
            const transactionsContract = createEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);
            
    
            await ethereum.request({
              method: "eth_sendTransaction",
              params: [{
                from: currentAccount,
                to: addressTo,
                gas: "0x5208",
                value: parsedAmount._hex,
              }],
            });
    
            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
    
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log(`Success - ${transactionHash.hash}`);
            setIsLoading(false);
    
            const transactionsCount = await transactionsContract.getTransactionCount();
    
            setTransactionCount(transactionsCount.toNumber());
          } else {
            console.log("No ethereum object sendin");
          }
        } catch (error) {
          console.log(error);
    
          throw new Error("No ethereum object sendouteer");
        }
      };

    return (
        <TransactionContext.Provider value={{connectWallet, currentAccount, handleChange, formData, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    );
};
