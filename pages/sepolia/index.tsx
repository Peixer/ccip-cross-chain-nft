import { Inter } from "next/font/google";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import { NFTCard } from "@/components/NFTCard";

const inter = Inter({ subsets: ["latin"] });
const MyNFTContractAddress = "0x3DB772DE51cF71e4318f0fB997c48dB0fa1fDbe0";

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

export default function Home() {
  const address = useAddress();
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function loadNFts() {
    setIsLoading(true);
    if (!address) return;
    alchemy.nft.getNftsForOwner(address).then((nfts: any) => {
      const filteredNfts = nfts.ownedNfts
        .filter((nft: any) => nft.contract.address === MyNFTContractAddress)
        .map((nft: any) => {
          return {
            ...nft,
            metadata: {
              ...nft.raw.metadata,
            },
          };
        });
      setNfts(filteredNfts);
      setIsLoading(false);
    });
  }

  useEffect(() => {
    loadNFts();
  }, [address]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">Ethereum 💎</h1>
      </div>
      <div className="z-10 max-w-5xl items-center font-mono text-sm flex-col w-full">
        <div className="flex flex-col p-6 w-full">
          {address && (
            <div className="flex flex-row items-center justify-center">
              {isLoading && (
                <div className="mx-auto flex flex-wrap items-center justify-center gap-8">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div
                      key={i}
                      className="!h-60 !w-60 animate-pulse rounded-lg bg-gray-800"
                    />
                  ))}
                </div>
              )}

              {!isLoading && nfts && (
                <div className="flex flex-wrap items-center justify-normal gap-8">
                  {nfts.map((nft: any) => {
                    return <NFTCard nft={nft} key={nft.tokenId} />;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
