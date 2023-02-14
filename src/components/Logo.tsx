import Image from "next/image";
import Link from "next/link";
import React from "react";

const Logo = () => {
  return (
    <Link href="/">
      <Image src="/logo.png" height={100} width={100} alt="Web3 Meets Logo" />
    </Link>
  );
};

export default Logo;
