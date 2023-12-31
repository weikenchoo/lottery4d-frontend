'use server'
import { utils } from 'ethers';
import ShowRecentWinningNumbers from './ShowRecentWinningNumbers';
import { fetchUsdValue } from '../components/PrizePool';



const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const contractAddress = process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;


const winningNumbersEndpoint = `https://api-sepolia.etherscan.io/api
                                ?module=logs
                                &action=getLogs
                                &fromBlock=0
                                &toBlock=latest
                                &address=${contractAddress}
                                &topic0=${utils.id("WinningNumbers(uint256,uint256,uint256)")}
                                &apikey=${etherscanApiKey}`.replace(/\s+/g, '');

const prizeWinnerEndpoint = `https://api-sepolia.etherscan.io/api
                    ?module=logs
                    &action=getLogs
                    &fromBlock=0
                    &toBlock=latest
                    &address=${contractAddress}
                    &topic0=${utils.id("PrizeClaimed(address,uint256)")}
                    &apikey=${etherscanApiKey}`.replace(/\s+/g, '');




const getWinningNumbersAndWinners = async() =>{

    const combinedData = {};


    try {
        const numberResponse = await fetch(winningNumbersEndpoint,{
            cache: 'no-store'
        });    
        const numberData = await numberResponse.json();
        numberData.result.reverse(); 
          
        numberData.result.forEach(item => {
            combinedData[item.transactionHash] = {
                ...combinedData[item.transactionHash],
                numberData: item
            };
        }); 
        
    } catch (error) {
        console.error(error);
    }

    try {
        const winnerResponse = await fetch(prizeWinnerEndpoint,{
            cache: 'no-store'
        });

        const winnerData = await winnerResponse.json();

        winnerData.result.forEach(item => {
            if (!combinedData[item.transactionHash].winnerData) {
                combinedData[item.transactionHash].winnerData = [];
            }
            combinedData[item.transactionHash].winnerData.push(item);
        });

    } catch (error) {
        console.error(error);
    }

    return combinedData;


}





export default async function GetRecentWinningNumbers() {
    
    const numbersAndWinners = await getWinningNumbersAndWinners();
    const ethUsd = await fetchUsdValue();

    return (
        <div className=''>
            <ShowRecentWinningNumbers  numbersAndWinners={numbersAndWinners} ethUsd={ethUsd}/>
            
        </div>
    )
}
