import logo from './logo.svg';
import {useState,useEffect} from 'react';
import abi from './contracts/spotify.json'
import { ethers } from 'ethers';
import PopupForm from './components/PopUpForm';
import Songs from './components/Songs';




function Navbar({state}) {
  return (
    <nav>
      <h1>Spotify Dapp</h1>
      <PopupForm state={state}/>
      <style jsx>{`
        nav {
          background-color: #000000;
          color: white;
          display: flex;
          justify-content: space-between;
          padding: 20px;
          font-size: 24px;
        }
        h1 {
          margin: 0;
        }
      `}</style>
    </nav>
  );
}

function App() {
  const [showModal, setShowModal] = useState(false);
 
  //above for navbar
  const [state, setState] = useState({
    provider: null,
    signer: null,
    contract: null,
  });
  const [account, setAccount] = useState("None");
  
  useEffect(()=>{
    const connectWallet = async () => {
      const contractAddress = "0xbA61eb395a9E503D08ec061B800292bCd01b6Dfe";
      const contractABI = abi.abi;
      try {
        const { ethereum } = window;

        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });

          window.ethereum.on("accountsChanged", () => {
            window.location.reload();
          });

          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          setAccount(accounts[0]);
          setState({ provider, signer, contract });
          
          console.log(contract);

        } else {
          alert("Please install metamask");
        }
      } catch (error) {
        console.log(error);
      }
    };
    
      connectWallet();
   
  }, []);
    
  const backgroundStyle = {
    background: `linear-gradient(to bottom right, 
      rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}, 0.8),
      rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}, 0.8)
    )`,
    height: "100vh",
    width: "100vw",
    overflow: "auto" 
  };  
  return (
   <>
    <div style={backgroundStyle}> 
   <Navbar state={state} />
   <Songs state={state} />
   </div>
    </>
  );
}

export default App;
