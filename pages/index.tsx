import Image from "next/image";
import { Inter } from "next/font/google";
import {
  ConnectWallet,
  useAddress,
  useContract,
  useOwnedNFTs,
} from "@thirdweb-dev/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const address = useAddress();
  const contractAddress = "0x1bfF254B7D20021F4427e93b8008f520B5B22fa6";
  const { contract } = useContract(contractAddress);
  const { data, isLoading, error } = useOwnedNFTs(contract, address);
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <ConnectWallet
          theme={"dark"}
          modalSize={"wide"}
          dropdownPosition={{
            side: "bottom",
            align: "center",
          }}
        />

        {address && (
          <div className="flex flex-col items-center justify-center">
            {isLoading && <p>Loading...</p>}
            {data && (
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">Your NFTs</p>
                <div className="flex flex-wrap items-center justify-center">
                  {data.map((nft: any) => (
                    <div
                      key={nft.tokenId}
                      className="flex flex-col items-center justify-center"
                    >
                      <Image
                        src={nft.image}
                        alt={nft.name}
                        width={200}
                        height={200}
                      />
                      <p className="text-sm">{nft.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
