import Link from "next/link";

export const Footer = () => {
  return (
    <footer >
       <div className="flex flex-col md:flex-row bg-[#A5B4FC] p-3 md:p-2.5 justify-center items-center gap-1 md:gap-4 text-sm font-normal md:h-11">
          <span className="font-medium">Made with 🧡 by AE Studio.</span>
          
          <span>See what we could build for you</span>
          <Link
            href="https://ae.studio?utm_term=5e9e4933-985a-4431-b11f-d9b552ce2fb2&utm_campaign=inno-pod&utm_source=innopod&utm_medium=referral"
            target="_blank"
            className="font-semibold"
            data-analytics="learn-more-about-ae-link"
          >
            Learn more →
          </Link>
        </div>
    </footer>
  );
};