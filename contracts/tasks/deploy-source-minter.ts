import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment, TaskArguments } from "hardhat/types";
import { getPrivateKey, getProviderRpcUrl, getRouterConfig } from "./utils";
import { Wallet, ethers } from "ethers";
import { SourceMinter, SourceMinter__factory, MyNFTSource } from "../typechain-types";
import { Spinner } from "../utils/spinner";
import { LINK_ADDRESSES } from "./constants";


task(`deploy-source-minter`, `Deploys SourceMinter.sol smart contract`)
    .addOptionalParam(`router`, `The address of the Router contract on the source blockchain`)
    .setAction(async (taskArguments: TaskArguments, hre: HardhatRuntimeEnvironment) => {
        const routerAddress = taskArguments.router ? taskArguments.router : getRouterConfig(hre.network.name).address;
        const linkAddress = taskArguments.link ? taskArguments.link : LINK_ADDRESSES[hre.network.name]

        const privateKey = getPrivateKey();
        const rpcProviderUrl = getProviderRpcUrl(hre.network.name);

        const provider = new ethers.JsonRpcProvider(rpcProviderUrl);
        const wallet = new Wallet(privateKey);
        const deployer = wallet.connect(provider);

        const spinner: Spinner = new Spinner();

        console.log(`ℹ️  Attempting to deploy SourceMinter smart contract on the ${hre.network.name} blockchain using ${deployer.address} address, with the Router address ${routerAddress} and LINK address ${linkAddress} provided as constructor arguments`);
        spinner.start();

        const myNftSource: MyNFTSource = await hre.ethers.deployContract("MyNFTSource", []);
        await myNftSource.waitForDeployment();

        const sourceMinter: SourceMinter = await hre.ethers.deployContract("SourceMinter", [routerAddress, linkAddress, myNftSource.target]);
        await sourceMinter.waitForDeployment();

        spinner.stop();
        console.log(`✅ SourceMinter contract deployed at address ${sourceMinter.target} on the ${hre.network.name} blockchain`);
        console.log(`✅ MyNFTSource contract deployed at address ${myNftSource.target} on the ${hre.network.name} blockchain`);
    })