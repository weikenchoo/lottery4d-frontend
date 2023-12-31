"use client"

import { useState } from "react";
import { Card } from 'flowbite-react';
import { Label, TextInput,Button } from 'flowbite-react';
import { Web3Button, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { ethers,utils } from "ethers";


export default function SubmitNumber() {

    const contractAddress= process.env.NEXT_PUBLIC_TESTNET_CONTRACT_ADDRESS;
    
    
    const { contract } = useContract(contractAddress);

    const { mutateAsync, isLoading, error } = useContractWrite(
        contract,
        "submitNumber",
    );

    const [number, setNumber] = useState(0);
    const [validation, setValidation] = useState(true);


    const handleChange = (e) => {
        const newNumber = e.target.value
        setNumber(e.target.value);
        e.preventDefault();
        
        
        if (newNumber >= 0 && newNumber <= 9999 && !isNaN(newNumber) && newNumber !== "") {
            setValidation(true);
            
        } else {
            setValidation(false);
            
        }
        
    } 



  return (
    <div >


    <Card className="max-w-sm mx-auto mt-8">
        <div className="flex max-w-md flex-col gap-4">
        {
            validation ? (
                <div>
                    <div className="mb-2 block">
                        <Label  value="Submit a number" />
                    </div>
                    <TextInput
                        
                        placeholder="Enter a number between 0 - 9999."
                        required
                        value={number} 
                        onChange={(e) => handleChange(e)}
                        
                    />
                </div>
            ) : (
                <div>
                    <div className="mb-2 block">
                    <Label  color="failure" value="Submit a number" />
                    </div>
                    <TextInput
                    
                    placeholder="Enter a number between 0 - 9999."
                    required
                    color="failure"
                    helperText={
                        <>
                        <span className="font-medium">Oops!</span> Please choose a number between 0 - 9999!
                        </>
                    }
                    value={number} 
                    onChange={(e) => handleChange(e)}
                    />
                </div>
            )
        }
        </div>
        
        <Web3Button
            contractAddress={contractAddress}
            action={() =>
                mutateAsync({
                args: [number],
                overrides: {
                    value: utils.parseEther("0.01"), 
                  },
                })
            }
            >
            Submit
        </Web3Button>
      
    </Card>

    
    </div>
  )
}
