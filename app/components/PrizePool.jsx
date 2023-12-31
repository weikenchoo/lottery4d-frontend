'use server'

const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const contractAddress = process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;


const balanceEndpoint = "https://api-sepolia.etherscan.io/api?module=account&action=balance&address="+ contractAddress +"&tag=latest&apikey=" +etherscanApiKey;
const usdEndpoint = "https://api-sepolia.etherscan.io/api?module=stats&action=ethprice&apikey=" + etherscanApiKey;



const fetchBalance = async () => {
  try {
    const response = await fetch(balanceEndpoint, {
      next: {
        revalidate: 0 
      }
    });
    const data = await response.json();
    const ethAmount = data.result / 10**18;
    return ethAmount;
    
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
  }
};

export const fetchUsdValue = async () => {
  try {
    const response = await fetch(usdEndpoint,{
      next: {
        revalidate: 0 
      }
    });
    const data = await response.json();
    const ethUsd = data.result.ethusd;
    return ethUsd;
    
  } catch (error) {
    console.error('Error fetching ETH balance:', error);
  }
};





export default async function PrizePool() {

  const ethAmount = await fetchBalance();

  const calculatePrize = async () => {
    
    const ethUsd = await fetchUsdValue();
    const value =ethAmount * ethUsd;
    
    return value.toFixed(2);
  };
  

  return (
    <div className="card text-center">
        Total Prize Pool : {ethAmount} ETH ($ {calculatePrize()})
    </div>
  )
}
