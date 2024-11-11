import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/../public/logos/horizontal-white-blue-logo.png";

export default function Header() {
  return (
    <header className="h-16 dark-purple-border text-white flex justify-between items-center px-12 border-b-2 border-black">
      <Link href={"/"}>
        <Image src={BrandLogo} alt="Brand Logo" width={250} height={250} />
      </Link>
      <div className="flex gap-8">
        <Link href={"/login"}>Login</Link>
        <Link href={"/about"}>About</Link>
      </div>
    </header>
  );
}
