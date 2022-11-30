import './App.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import ConnectButton from './components/ConnectButton';
import axios from "axios";
import { useSendTransaction } from "wagmi";

function App() {
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)

  const [fromToken] = useState("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE");
  const [toToken, setToToken] = useState(
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  ); //USDC ERC20 Contract
  const [value, setValue] = useState("10000000000000");
  const [valueExchanged, setValueExchanged] = useState("");
  const [valueExchangedDecimals, setValueExchangedDecimals] = useState(1e18);
  const [to, setTo] = useState("");
  const [txData, setTxData] = useState("");

  const { data, isLoading, isSuccess, sendTransaction } = useSendTransaction({
    request: {
        from: signerAddress,
        to: String(to),
        data: String(txData),
        value: String(value),
    },
})


function changeToToken(e){
  setToToken(e.target.value);
  setValueExchanged("");
}

function changeValue(e){
  setValue(e.target.value * 1E18);
  setValueExchanged("");
}

async function get1inchSwap(){
  const tx = await axios.get(`https://api.1inch.io/v5.0/1/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${value}&fromAddress=${signerAddress}&slippage=5`);    
  console.log(tx.data)
  //setTo(tx.data.tx.to);
  setTxData(tx.data.tx.data);
  setValueExchangedDecimals(Number(`1E${tx.data.toToken.decimals}`));
  setValueExchanged(tx.data.toTokenAmount);
  }


  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
    }
    onLoad()
  }, [])

  const getSigner = async provider => {
    provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setSigner(signer)
  }
  const isConnected = () => signer !== undefined
  const getWalletAddress = () => {
    signer.getAddress()
      .then(address => {
        setSignerAddress(address)

      })
  }

  if (signer !== undefined) {
    getWalletAddress()
  }


  return (
    <div className="App">

          <div className="connectButtonContainer">
            <ConnectButton
              provider={provider}
              isConnected={isConnected}
              signerAddress={signerAddress}
              getSigner={getSigner}
            />
          </div>

          <div>
      <div>User: {signerAddress}</div>
      <select>
        <option value="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE">
          MATIC
        </option>
      </select>
      <input
        onChange={(e) => changeValue(e)}
        value={value / 1e18}
        type="number"
        min={0}
      ></input>
      <br />
      <br />
      <select name="toToken" value={toToken} onChange={(e) => changeToToken(e)}>
        <option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">WETH</option>
        <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">USDC</option>
      </select>
      <input
        value={
          !valueExchanged
            ? ""
            : (valueExchanged / valueExchangedDecimals).toFixed(5)
        }
        disabled={true}
      ></input>
      <br />
      <br />
      <button onClick={get1inchSwap}>Get Conversion</button>
      <button disabled={!valueExchanged} onClick={sendTransaction}>Swap Tokens</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      <br />
      <br />
    </div>
           

    </div>
  );
}

export default App;