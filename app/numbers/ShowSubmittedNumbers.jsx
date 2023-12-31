'use client'

import { useAddress, useConnectionStatus } from '@thirdweb-dev/react'
import React, { useEffect, useState } from 'react'
import { Card } from 'flowbite-react';
import { ethers} from 'ethers';
import { hexZeroPad } from 'ethers/lib/utils';
import Link from 'next/link';
import lottery4d from '../components/Lottery4d.json'
import clearCachesByServerAction from "../components/revalidate"
import { useSearchParams, usePathname } from 'next/navigation'
import PaginationControls from '../components/PaginationControls';





const sortLogs = (logs,address) =>{

    
    let submittedNumbers = [];
    for (const key in logs) {
        if (logs[key].topics) {
            const eventAddress = logs[key].topics[1];
            if (eventAddress == hexZeroPad(address.toLowerCase(),32)) {
                const hex = logs[key].topics[2]
                const number = ethers.BigNumber.from(hex).toString();
                const transactionHash = logs[key].transactionHash;

                submittedNumbers.push({
                    number,
                    transactionHash,
                })
            }
        }
        
        
    }
    submittedNumbers.reverse();

    return submittedNumbers;
}



export default function ShowSubmittedNumbers(props) {
    
    const {logs} = props;
    const alchemyUrl = process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL;
    const contractAddress = process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;
    
    const address = useAddress();
    const connectionStatus = useConnectionStatus();
    const [submittedNumbers, setSubmittedNumbers] = useState([]);
    const [currentPage, setCurrentPage] = useState([]);
    const searchParams = useSearchParams();
    const pathName = usePathname();


    const page = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('per_page') ?? '5';
    const start = (Number(page) - 1) * Number(perPage);
    const end = start + Number(perPage);

    const provider = new ethers.providers.JsonRpcProvider(alchemyUrl);
    const contract = new ethers.Contract(contractAddress,lottery4d.abi,provider);
    const transactionEndpoint = "https://sepolia.etherscan.io/tx/";

    

    const eventCallback = (event) => {
        
        setTimeout(() => {
            clearCachesByServerAction('/numbers');
            
        }, 5000);
        
      };

    useEffect(() => {
        if (address) {
            const submittedNumbers = sortLogs(logs,address)
            const currentPage = submittedNumbers.slice(start,end);
            
            setSubmittedNumbers(submittedNumbers);
            setCurrentPage(currentPage);
            
        }
        
    }, [address,props,page])

    useEffect(() => {
        contract.on("NumberSubmitted",eventCallback);
        
        return () => {
            contract.off("NumberSubmitted",eventCallback);
        }
    }, [])
    
    


    return (
        <div className=''>
            
            
            {connectionStatus == "connected" && address ? (
                <div className=''>
                    <h1 className='text-center mb-3'>Numbers submitted by {address.slice(0,8)}...{address.slice(-7)}</h1>
                    {
                        currentPage.length > 0 ? (
                            <div className='flex flex-col text-center space-y-4 items-center'>
                                {
                                    currentPage.map((item,index)=>(
                                        <div className='' key={index}>
                                            
                                            <Card  className='max-w-sm'>
                                                <h5 className=''>Number submitted: {item.number}</h5>
                                                <p>Transaction hash: 
                                                    <Link href={transactionEndpoint + item.transactionHash} className='text-blue-800 hover:text-blue-500'>
                                                        {item.transactionHash.slice(0,15) + "..."}
                                                    </Link>
                                                </p>
                                                
                                            </Card>
                                        </div>
                                        
                                        
                                    ))
                                }
                                <PaginationControls
                                hasNextPage={end < submittedNumbers.length}
                                hasPrevPage={start > 0} 
                                total={submittedNumbers.length}
                                pathName={pathName}
                                />
                                
                            </div>
                            
                        ) : (
                            <div className='text-center'>You have not submitted any numbers.</div>
                        )
                    }
                    
                </div>
                
                
                
            ) :  (
                <div className='text-center'>Please connect to a wallet</div>
            )
            }
        </div>
    )
}
