'use client'
import React, { useEffect, useState } from 'react'
import { ethers} from 'ethers';
import { hexStripZeros } from 'ethers/lib/utils';
import { Card } from 'flowbite-react';
import clearCachesByServerAction from "../components/revalidate";
import Link from 'next/link';
import lottery4d  from '../components/Lottery4d.json'
import { useSearchParams, usePathname } from 'next/navigation'
import PaginationControls from '../components/PaginationControls';



const handleNumbersAndWinners = (numbersAndWinners)=>{

    const list = [];
    
    Object.keys(numbersAndWinners).forEach(key => {
        const numbers = numbersAndWinners[key].numberData;
        const winners = numbersAndWinners[key].winnerData;
        const winnersDetails = [];
        const firstPrize = ethers.BigNumber.from(numbers.topics[1]).toString();
        const secondPrize = ethers.BigNumber.from(numbers.topics[2]).toString();
        const thirdPrize = ethers.BigNumber.from(numbers.topics[3]).toString();
        const transactionHash = key;
        winners.forEach(item => {
            if (item.topics[1] != 0) {
                const address = hexStripZeros(item.topics[1]);
                const prizeAmount = ethers.utils.formatEther(item.topics[2]);
                winnersDetails.push({address,prizeAmount});
            }
           
        });
        list.push({firstPrize,secondPrize,thirdPrize,winnersDetails,transactionHash});
        
        
    });
    
    return list;
}


const eventCallback = (event) => {
    setTimeout(() => {
        clearCachesByServerAction('/winners');
    }, 5000);
    
  };



export default function ShowRecentWinningNumbers(props) {

    const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
    const contractAddress = process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;
    const provider = new ethers.providers.JsonRpcProvider(alchemyUrl);
    const contract = new ethers.Contract(contractAddress,lottery4d.abi,provider)
    const transactionEndpoint = "https://sepolia.etherscan.io/tx/";

    
    const {numbersAndWinners, ethUsd} = props;
    const [numbersAndPrizeWinners, setNumbersAndPrizeWinners] = useState([]);
    const [currentPage, setCurrentPage] = useState([]);
    const searchParams = useSearchParams();
    const pathName = usePathname();


    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('per_page') ?? '5';
    const start = (Number(page) - 1) * Number(perPage);
    const end = start + Number(perPage);



    useEffect(() => {

        const data = handleNumbersAndWinners(numbersAndWinners);
        const currentPage = data.slice(start,end);
        setNumbersAndPrizeWinners(data);
        setCurrentPage(currentPage);
      
    }, [props,page])


    useEffect(() => {
        contract.on("WinningNumbers",eventCallback);
        
        return () => {
            contract.off("WinningNumbers",eventCallback);
        }
    }, [])
    

  return (
    <div className=''>
        {
            numbersAndPrizeWinners.length > 0 ? (
                <div className='flex flex-col text-center space-y-4 items-center'>
                    <h1>All previous winning numbers</h1>
                    {
                        currentPage.map((item, index) => (
                            <Card key={index} className='max-w-sm'>
                                <p>First Prize: {item.firstPrize}</p>
                                <p>Second Prize: {item.secondPrize}</p>
                                <p>Third Prize: {item.thirdPrize}</p>
        
                                {item.winnersDetails.length > 0 ? (
                                    <div>
                                        <p>Winners:</p>
                                        {item.winnersDetails.map((item,index)=>(
                                            <div key={index}>
                                                <p>Address: {item.address}</p>
                                                <p>Prize won: {item.prizeAmount} ETH ($ {item.prizeAmount*ethUsd})</p>
                                            </div>
                                            
                                        ))}
                                    </div>
                                    
                                ) : (
                                    <p>No winners</p>
                                )}
                                
                                <p>Transaction hash: 
                                    <Link href={transactionEndpoint + item.transactionHash} className='text-blue-800 hover:text-blue-500'>
                                        {item.transactionHash.slice(0,15) + "..."}
                                    </Link>
                                </p>
                                
                            </Card>
                        ))
                    }
                    <PaginationControls
                        hasNextPage={end < numbersAndPrizeWinners.length}
                        hasPrevPage={start > 0} 
                        total={numbersAndPrizeWinners.length}
                        pathName={pathName}
                    />
                </div>
            ) : (
                <h1 className='text-center'>Submit a number to start the countdown for a new pick! </h1>
            )
        }
        
    </div>
  )
}
