import { ThirdwebNftMedia } from "@thirdweb-dev/react";
import { FC, useState } from "react";

export const NFTCard = ({ nft, onclick }: any) => {
  const [hover, setHover] = useState<boolean>(false);

  return (
    <div
      className="z-10 mx-auto flex h-36 w-36 cursor-pointer flex-col items-center justify-center gap-4 bg-transparent transition-all duration-300 hover:scale-105 md:h-60 md:w-60"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onclick && onclick(nft)}
    >
      <ThirdwebNftMedia
        metadata={nft.metadata}
        className="!md:h-60 !md:w-60 h-36 w-36 rounded-lg"
      />

      {hover && (
        <div className="absolute flex h-36 w-36 flex-col items-center justify-center rounded-lg bg-black/50 backdrop-filter md:h-60 md:w-60">
          <h1 className="text-2xl text-gray-200">{nft.metadata.name}</h1>
          <h1 className="text-2xl font-bold text-gray-200"># {nft.tokenId}</h1>
          {onclick && <p>Click to 🔥</p>}
        </div>
      )}
    </div>
  );
};
