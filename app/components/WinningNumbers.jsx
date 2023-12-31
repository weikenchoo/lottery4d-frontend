"use client"


import { useContractEvents, useContract } from "@thirdweb-dev/react";
import { useEffect, useState } from 'react'




export default function WinningNumbers() {


  const contractAddress= process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;
  const { contract } = useContract(contractAddress);
  const { data, isLoading, error } = useContractEvents(
    contract,
    "WinningNumbers",
    {
      queryFilter: {
        order: "desc", 
      },
      subscribe: true, 
    },);
  const [mostRecentWinningNumbers, setMostRecentWinningNumbers] = useState(null);


  useEffect(() => {
    if (!isLoading && data.length>0) {
      setMostRecentWinningNumbers(data[0].data);
    }
    
  }, [isLoading, data]);
  
  
  
  

  return (
    <div>
        <div className='card text-center'>
            <h1>Most recent winning numbers</h1>
            {
              mostRecentWinningNumbers ? (
                <div>
                  <h5>First Prize Number: {mostRecentWinningNumbers && mostRecentWinningNumbers.firstPrize.toString()}</h5>
                  <h5>Second Prize Number: {mostRecentWinningNumbers && mostRecentWinningNumbers.secondPrize.toString()}</h5>
                  <h5>Third Prize Number: {mostRecentWinningNumbers && mostRecentWinningNumbers.thirdPrize.toString()}</h5>
                </div>
                
              ) : (
                <div>Submit a number to initiate a pick!</div>
              )
            }
            
        </div>
    </div>
  )
}
