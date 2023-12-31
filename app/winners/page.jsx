import React from 'react'
import GetRecentWinningNumbers from './GetRecentWinningNumbers'
import Loading from "../loading"
import { Suspense } from "react"


export default function Winner() {
  return (
    <main>
      
      <GetRecentWinningNumbers/>
     
    </main>
    
  )
}
