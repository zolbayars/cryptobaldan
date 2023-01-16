import TradesTable from "@/components/tradesTable";
import LatestTrades from "./latestTrades";

export default function Dashboard() {
  
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center">
        <LatestTrades>
          { /** @ts-expect-error see https://github.com/vercel/next.js/issues/43537 */ }
          <TradesTable fromId={null}/>
        </LatestTrades>
      </div>
    </div>
  );
}
