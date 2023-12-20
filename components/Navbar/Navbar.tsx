import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Navbar.module.css";

/**
 * Navigation bar that shows up on all pages.
 * Rendered in _app.tsx file above the page content.
 */
export function Navbar() {
  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navLeft}>
          <Link href="/" className={`${styles.homeLink} ${styles.navLeft}`}>
            <Image src="/logo.png" width={48} height={48} alt="FusionCube" />
            <p className="text-2xl font-bold text-white">FusionCube</p>
          </Link>

          <div className={styles.navMiddle}>
            <Link href="/mumbai" className={styles.link}>
              Polygon
            </Link>
            <Link href="/sepolia" className={styles.link}>
              Ethereum
            </Link>
          </div>
        </div>

        <div className={styles.navRight}>
          <div className={styles.navConnect}>
            <ConnectWallet theme="dark" btnTitle="Connect Wallet" />
          </div>
        </div>
      </nav>
    </div>
  );
}
