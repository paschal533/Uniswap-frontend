import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import { WagmiConfig, createClient } from 'wagmi'
import { getDefaultProvider } from 'ethers'
 
const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={client}>
    <App />
    </WagmiConfig>
  </React.StrictMode>
);