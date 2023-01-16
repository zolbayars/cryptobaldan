import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <div className="text-center max-w-screen-sm mb-10">
          <h1 className="text-stone-200 font-bold text-2xl">
            Binance Futures Trading Insights
          </h1>
          <p className="text-stone-400 mt-5">
            Analyze your trades, get insight on how to improve your trading skills
          </p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/dashboard"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            Dashboard
          </Link>
          <p className="text-white">·</p>
          <a
            href="https://github.com/zolbayars/cryptobaldan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-stone-400 underline hover:text-stone-200 transition-all"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
