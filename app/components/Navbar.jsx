"use client"

import React from 'react'
import Link from 'next/link'
import {
  ConnectWallet,
} from "@thirdweb-dev/react";

export default function Navbar() {
  return (
    <nav className=''>
      <Link href="/">Lottery 4D</Link>
      <Link href="/play">How To Play</Link> 
      <Link href="/numbers?page=1&per_page=5">Your numbers</Link>
      <Link href="/winners?page=1&per_page=5" >Previous Winners</Link>
      <div className='ml-auto'>
        <ConnectWallet
          theme={"light"}
          modalSize={"compact"}
        />
      </div>
      
    </nav>
  )
}
