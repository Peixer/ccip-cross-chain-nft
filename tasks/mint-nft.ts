import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import {
  getPrivateKey,
  getProviderRpcUrl,
} from "./utils";
import { ethers, Wallet } from "ethers";
import {
  MyNFTSource,
  MyNFTSource__factory,
} from "../typechain-types";
import { Spinner } from "../utils/spinner";

task(`mint-nft`, `Mints the new NFT by sending the Cross-Chain Message`)
  .addParam(
    `contractAddress`,
    `The MyNFTSource.sol smart contract address on the source blockchain`
  )
  .addParam(
    `addressReceiver`,
    `The address of the receiver of the NFT`
  )
  .addParam(
    `sourceBlockchain`,
    `The name of the source blockchain (for example ethereumSepolia)`
  )
  .setAction(
    async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
      const { contractAddress, sourceBlockchain, addressReceiver } = taskArguments;

      const privateKey = getPrivateKey();
      const sourceRpcProviderUrl = getProviderRpcUrl(sourceBlockchain);

      const sourceProvider = new ethers.JsonRpcProvider(sourceRpcProviderUrl);
      const wallet = new Wallet(privateKey);
      const signer = wallet.connect(sourceProvider);

      const spinner: Spinner = new Spinner();

      const myNft: MyNFTSource = MyNFTSource__factory.connect(
        contractAddress,
        signer
      );

      spinner.start();

      const tx = await myNft.mint(addressReceiver);

      spinner.stop();
      console.log(`✅ Mint request sent, transaction hash: ${tx.hash}`);
    }
  );
