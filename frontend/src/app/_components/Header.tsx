'use client'
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/../public/logos/horizontal-white-blue-logo.png";
import {useAuth} from "@/utils/AuthContext";

export default function Header() {
    const { isLoggedIn, logout } = useAuth();

  return (
    <header className="h-16 dark-purple-border text-white flex justify-between items-center px-12 border-b-2 border-black">
      <Link href={"/"}>
        <Image src={BrandLogo} alt="Brand Logo" width={250} height={250} />
      </Link>
      <div className="flex gap-8">
          {isLoggedIn ? (
              <button onClick={logout} className="text-white hover:underline">Logout</button>
          ) : (
              <Link href={"/login"}>Login</Link>
          )}
        <Link href={"/about"}>About</Link>
      </div>
    </header>
  );
}
