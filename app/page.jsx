
import PrizePool from "./components/PrizePool";
import SubmitNumber from "./components/SubmitNumber";
import Timer from "./components/Timer";
import WinningNumbers from "./components/WinningNumbers";




export default function Home() {

  return (
    <main >
      
      
      <WinningNumbers/>
      <Timer/>
      <PrizePool/>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-black"></span>
        <span className="shrink-0 px-6">Try submitting a number below.</span>
        <span className="h-px flex-1 bg-black"></span>
      </span>

      <SubmitNumber/>

      
    </main>
  )
}
