const { expect } = require("chai");

describe("MyNFTSource contract", function () {
  it("Should deploy and mint one NFT", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("MyNFTSource");

    const tx = await hardhatToken.mint(owner.address);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    expect(ownerBalance).to.equal(1n);
  });

  it("Should mint a NFT and burn it", async function () {
    const [owner] = await ethers.getSigners();

    const hardhatToken = await ethers.deployContract("MyNFTSource");

    const tx = await hardhatToken.mint(owner.address);
    const burnTx = await hardhatToken.burn(0n);

    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    expect(ownerBalance).to.equal(0n);
  });

  // it("Should mint a NFT and burn it 2", async function () {
  //   const [owner] = await ethers.getSigners();

  //   const MyNFTSourceSmartContract = await ethers.deployContract("MyNFTSource");
  //   const SourceMinterSmartContract = await ethers.deployContract(
  //     "SourceMinter",
  //     [
  //     MyNFTSourceSmartContract.target,
  //     MyNFTSourceSmartContract.target,
  //     MyNFTSourceSmartContract.target]
  //   );

  //   const tx = await MyNFTSourceSmartContract.mint(owner.address);
  //   tx.wait();

  //   const ownerBalanceBefore = await MyNFTSourceSmartContract.balanceOf(owner.address);
  //   const address = await MyNFTSourceSmartContract.ownerOf(0);

  //   expect(ownerBalanceBefore).to.equal(1n);
  //   expect(address).to.equal(owner.address)

  //   // approve owner to burn the NFT in SourceMinterSmartContract
  //   const txApprove = await MyNFTSourceSmartContract.connect(owner).setApprovalForAll(SourceMinterSmartContract.target, true);
  //   txApprove.wait();

  //   const txMint = await SourceMinterSmartContract.mint(
  //     0,    // uint64 destinationChainSelector,
  //     owner.address,  // address receiver,
  //     0n,  // PayFeesIn payFeesIn,
  //     0n // uint256 tokenId
  //   );
  //   txMint.wait();

  //   const ownerBalance = await MyNFTSourceSmartContract.balanceOf(owner.address);
  //   expect(ownerBalance).to.equal(0n);
  // });
});
