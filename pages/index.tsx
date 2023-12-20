import Image from "next/image";
import { Inter } from "next/font/google";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import Link from "next/link";
import Web3 from "web3";

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

  function getWeb3Instance() {
    const web3 = new Web3(window.ethereum);

    const MyNFTSourceContractABI = require("./MyNFTSource.json").abi;
    const MyNFTSourceContract: any = new web3.eth.Contract(
      MyNFTSourceContractABI,
      MyNFTSourceContractAddress
    );

    const SourceMinterContractABI = require("./SourceMinter.json").abi;
    const SourceMinterContract: any = new web3.eth.Contract(
      SourceMinterContractABI,
      SourceMinterContractAddress
    );
    return { SourceMinterContract, MyNFTSourceContract, web3 };
  }

  function loadNFts() {
    if (!address) return;
    alchemy.nft.getNftsForOwner(address).then((nfts: any) => {
      setNfts(
        nfts.ownedNfts.filter(
          (nft: any) => nft.contract.address === MyNFTSourceContractAddress
        )
      );
    });
  }

  setTimeout(() => {
    loadNFts();
  }, 2000);

  function mint() {
    const { MyNFTSourceContract } = getWeb3Instance();

    MyNFTSourceContract.methods
      .mint(address)
      .send({ from: address })
      .on("transactionHash", function (hash: any) {
        console.log("transactionHash", hash);
      })
      .on("receipt", (receipt: any) => {
        console.log("receipt", receipt);
        loadNFts();
      })
      .on("error", (error: any) => {
        console.log("error", error);
      });
  }

  async function crossChain() {
    const { SourceMinterContract, MyNFTSourceContract } = getWeb3Instance();

    const isApprovedForAllReturn = await MyNFTSourceContract.methods
      .isApprovedForAll(address, SourceMinterContractAddress)
      .call();

    if (!isApprovedForAllReturn){
      await MyNFTSourceContract.methods
        .setApprovalForAll(SourceMinterContractAddress, true)
        .send({ from: address });
    }

    const destinationChainSelector: bigint = BigInt("16015286601757825753"); 
    const payFeesIn = 1;
    const receiver = DestinationMinterContractAddress;
    SourceMinterContract.methods
      .mint(
        destinationChainSelector,
        receiver,
        payFeesIn,
        nfts[0].tokenId
      )
      .send({ from: address })
      .on("transactionHash", function (hash: any) {
        console.log("transactionHash", hash);
      })
      .on("receipt", (receipt: any) => {
        console.log("receipt", receipt);
        loadNFts();
      })
      .on("error", (error: any) => {
        console.log("error", error);
      });
  }

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
                  <Link href={"/sepolia"}>
                    <p className="text-2xl font-bold">Other Chains ⛓️</p>
                  </Link>

                  <button className="button" onClick={mint}>
                    MINT NFT
                  </button>

                  <button className="button" onClick={crossChain}>
                    CROSS CHAIN
                  </button>

                  <div className="flex flex-row flex-wrap items-center pt-6">
                    {nfts.map((nft: any) => {
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
