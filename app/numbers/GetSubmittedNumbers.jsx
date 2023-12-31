'use server'
import {  utils } from 'ethers';


import ShowSubmittedNumbers from './ShowSubmittedNumbers';


const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const contractAddress = process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;


const logEndpoint = `https://api-sepolia.etherscan.io/api
                    ?module=logs
                    &action=getLogs
                    &fromBlock=0
                    &toBlock=latest
                    &address=${contractAddress}
                    &topic0=${utils.id("NumberSubmitted(address,uint256)")}
                    &apikey=${etherscanApiKey}`.replace(/\s+/g, '');



const fetchLogs = async()=>{
    try {
        const response = await fetch(logEndpoint,{
            cache: 'no-store'
        });
        
        
        const data = await response.json();
        return data.result
        
    } catch (error) {
        console.error(error);
    }
}




export default async function GetSubmittedNumbers() {
    
    const logs = await fetchLogs();

    return (
        <div>
            <ShowSubmittedNumbers logs={logs}/>
        </div>
    )
}
