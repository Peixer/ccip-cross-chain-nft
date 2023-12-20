import { Inter } from "next/font/google";
import { useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Web3 from "web3";
import Alert from "@/components/Alert";
import { NFTCard } from "@/components/NFTCard";

const inter = Inter({ subsets: ["latin"] });
const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(settings);

const MyNFTSourceContractAddress = "0x472FcbbbA22790768a2784bdB7f66D14baE5B1C2";
const SourceMinterContractAddress =
  "0x02531E19c2cF708507dB81ca720924086e4051d3";
const DestinationMinterContractAddress =
  "0x75E64940524c1E958Fb0A75A131512Af42299097";

export default function Home() {
  const address = useAddress();
  const [nfts, setNfts] = useState<any>([]);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  function getWeb3Instance() {
    const web3 = new Web3(window.ethereum);

    const MyNFTSourceContractABI = require("../MyNFTSource.json").abi;
    const MyNFTSourceContract: any = new web3.eth.Contract(
      MyNFTSourceContractABI,
      MyNFTSourceContractAddress
    );

    const SourceMinterContractABI = require("../SourceMinter.json").abi;
    const SourceMinterContract: any = new web3.eth.Contract(
      SourceMinterContractABI,
      SourceMinterContractAddress
    );
    return { SourceMinterContract, MyNFTSourceContract, web3 };
  }

  function loadNFts() {
    setIsLoading(true);
    if (!address) return;
    alchemy.nft.getNftsForOwner(address).then((nfts: any) => {
      const filteredNfts = nfts.ownedNfts
        .filter(
          (nft: any) => nft.contract.address === MyNFTSourceContractAddress
        )
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

  async function mint() {
    try {
      const { MyNFTSourceContract } = getWeb3Instance();

      await MyNFTSourceContract.methods
        .mint(address)
        .send({ from: address })
        .on("transactionHash", function (hash: any) {
          console.log("transactionHash", hash);
        });

      loadNFts();
    } catch (error) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }

  async function crossChain(nft: any) {
    try {
      const { SourceMinterContract, MyNFTSourceContract } = getWeb3Instance();

      const isApprovedForAllReturn = await MyNFTSourceContract.methods
        .isApprovedForAll(address, SourceMinterContractAddress)
        .call();

      if (!isApprovedForAllReturn) {
        await MyNFTSourceContract.methods
          .setApprovalForAll(SourceMinterContractAddress, true)
          .send({ from: address });
      }

      const destinationChainSelector: bigint = BigInt("16015286601757825753");
      const payFeesIn = 1;
      const receiver = DestinationMinterContractAddress;
      await SourceMinterContract.methods
        .mint(destinationChainSelector, receiver, payFeesIn, nft.tokenId)
        .send({ from: address });

      loadNFts();
    } catch (error) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-24 ${inter.className}`}
    >
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white">
          Polygon to Ethereum Bridge
        </h1>

        <button
          type="button"
          onClick={mint}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-10"
        >
          Mint NFT ✨
        </button>
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
                    return (
                      <NFTCard
                        nft={nft}
                        key={nft.tokenId}
                        onclick={crossChain}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        <Alert show={show} setShow={setShow} />
      </div>
    </main>
  );
}
