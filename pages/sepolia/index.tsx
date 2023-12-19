import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const address = useAddress();
  const [nfts, setNfts] = useState([]);

  const settings = {
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // Replace with your Alchemy API Key.
    network: Network.ETH_SEPOLIA, // Replace with your network.
  };
  const alchemy = new Alchemy(settings);

  useEffect(() => {
    if (!address) return;

    alchemy.nft.getNftsForOwner(address).then((nfts: any) => {
      setNfts(nfts.ownedNfts);
    });
  }, [address]);
  

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl items-center font-mono text-sm flex-col w-full">
        <div className="relative flex items-end right-0 end-0 place-content-between">
          <Image
            className=" align-middle justify-center"
            src={"/logo.jpg"}
            width={200}
            height={150}
            alt={""}
          />
          <ConnectWallet
            theme={"dark"}
            modalSize={"wide"}
            dropdownPosition={{
              side: "bottom",
              align: "center",
            }}
          />
        </div>
        <div className="flex flex-col p-6 w-full">
          {address && (
            <div className="flex flex-row items-center justify-center">
              {nfts && (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl font-bold">Your NFTs</p>
                  <Link href={"/"}>
                    <p className="text-2xl font-bold">Other Chains ⛓️</p>
                  </Link>
                  <div className="flex flex-row flex-wrap items-center pt-6">
                    {nfts.map((nft: any) => {
                      // debugger;
                      return (
                        <div
                          key={nft.tokenId}
                          className="flex flex-col items-center justify-center m-4 max-w-[200px]"
                        >
                          <Image
                            src={nft.image.cachedUrl}
                            alt={nft.name}
                            width={200}
                            height={200}
                          />
                          <p className="text-sm">Name: {nft.name}</p>
                          <p className="text-sm">Token Id {nft.tokenId}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
