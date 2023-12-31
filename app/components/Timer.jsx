"use client"

import { useContract, useContractRead } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react'




const calculateTimeLeft = (data) => {
    if (data === undefined) {
      return;
    }
    const unix_timestamp = ethers.BigNumber.from(data).toString();

    const targetTime = +new Date(unix_timestamp*1000) + 24 * 60 * 60 * 1000;
    const difference = targetTime - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      return 0;
    }

    timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
    timeLeft.hours += timeLeft.days * 24;

    return timeLeft;
  };

export default function Timer() {
    const contractAddress= process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;

    const [timeLeft, setTimeLeft] = useState(null);
    const {contract} = useContract(contractAddress);

    const { data, isLoading, error } = useContractRead(contract, "getLatestTimestamp");
   

    useEffect(() => {
      if (!isLoading && data !== undefined) {
        setTimeLeft(calculateTimeLeft(data));
      }
    }, [isLoading, data]);

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft(data));
        }, 1000);
        return () => clearTimeout(timer);
      });

    
    
      const { hours, minutes, seconds } = timeLeft || {};


  return (
    <div>
        <div className="card text-center">
        <h1>Time until next pick</h1>
        {
          timeLeft ? (
            <p>{hours}h : {minutes}m : {seconds}s</p>
          ) : (
            <div>
              <p>Waiting for next initiation.</p>
              <p>Submit a number to start the initiation.</p>
            </div>
            
          )
        }
        
        </div>
    </div>
  )
}
