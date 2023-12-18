
import { task } from "hardhat/config";
import { TaskArguments } from "hardhat/types";
import { getPayFeesIn, getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, ethers } from "ethers";
import { SourceMinter, SourceMinter__factory, MyNFTSource__factory, MyNFTSource } from "../typechain-types";
import { Spinner } from "../utils/spinner";
import { getCcipMessageId } from "./helpers";

task(`cross-chain-mint`, `Mints the new NFT by sending the Cross-Chain Message`)
    .addParam(`sourceBlockchain`, `The name of the source blockchain (for example ethereumSepolia)`)
    .addParam(`sourceMinter`, `The address of the SourceMinter.sol smart contract on the source blockchain`)
    .addParam(`destinationBlockchain`, `The name of the destination blockchain (for example polygonMumbai)`)
    .addParam(`destinationMinter`, `The address of the DestinationMinter.sol smart contract on the destination blockchain`)
    .addParam(`payFeesIn`, `Choose between 'Native' and 'LINK'`)
    .addParam(`myNftSource`, `The address of the MyNFTSource.sol smart contract on the source blockchain`)
    .addParam(`tokenId`, `Token Id to burn on the source blockchain`)
    .setAction(async (taskArguments: TaskArguments) => {
        const { sourceBlockchain, sourceMinter, destinationBlockchain, destinationMinter, payFeesIn, myNftSource, tokenId } = taskArguments;

        const privateKey = getPrivateKey();
        const sourceRpcProviderUrl = getProviderRpcUrl(sourceBlockchain);

        const sourceProvider = new ethers.JsonRpcProvider(sourceRpcProviderUrl);
        const wallet = new Wallet(privateKey);
        const signer = wallet.connect(sourceProvider);

        const spinner: Spinner = new Spinner();

        const sourceMinterContract: SourceMinter = SourceMinter__factory.connect(sourceMinter, signer)

        const MyNFTSourceContract: MyNFTSource = MyNFTSource__factory.connect(myNftSource, signer);
        const txApprove = await MyNFTSourceContract.connect(signer).setApprovalForAll(sourceMinterContract.target, true);
        await txApprove.wait();

        const destinationChainSelector = getRouterConfig(destinationBlockchain).chainSelector;
        const fees = getPayFeesIn(payFeesIn);

        console.log(`ℹ️  Attempting to call the mint function of the SourceMinter.sol smart contract on the ${sourceBlockchain} from ${signer.address} account`);
        spinner.start();

        const tx = await sourceMinterContract.mint(
            destinationChainSelector,
            destinationMinter,
            fees,
            tokenId
        );

        const receipt = await tx.wait();

        spinner.stop();
        console.log(`✅ Mint request sent, transaction hash: ${tx.hash}`);
        
        if(receipt != null) {
            await getCcipMessageId(tx, receipt, sourceProvider);    
        } else {
            console.log(`❌ Receipt is null`);
        }

        console.log(`✅ Task cross-chain-mint finished with the execution`);
    })