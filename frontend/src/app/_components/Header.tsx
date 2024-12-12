'use client'
import Link from "next/link";
import Image from "next/image";
import BrandLogo from "@/../public/logos/horizontal-white-blue-logo.png";
import {FormEvent} from "react";
import {useRouter} from "next/navigation";

export default function Header() {
    const router = useRouter();

    const handleLogout = async (e: FormEvent) => {
        e.preventDefault();
        localStorage.removeItem('auth-token');
        router.push('/login');
    };

  return (
    <header className="h-16 dark-purple-border text-white flex justify-between items-center px-12 border-b-2 border-black">
      <Link href={"/"}>
        <Image src={BrandLogo} alt="Brand Logo" width={250} height={250} />
      </Link>
      <div className="flex gap-8">
        <Link href={"/login"}>Login</Link>
        <button onClick={handleLogout} className="text-white hover:underline">
            Logout
        </button>
        <Link href={"/about"}>About</Link>
      </div>
    </header>
  );
}
