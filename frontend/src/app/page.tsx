'use client'
import Image from "next/image";
import PortalImage from "@/../public/portal.png";
import ChestClosed from "@/../public/chest-closed.png";
import ChestOpened from "@/../public/chest-opened.png";
import BrandLogo from "@/../public/logos/vertical-white-blue-logo.png";
import Link from "next/link";
import {useAuth} from "@/utils/AuthContext";

export default function Home() {

  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null) {
    return <div>Loading...</div>;
  }

  if (isLoggedIn) {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard";
    }
    return null;
  }

  return (
      <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
          <Image src={BrandLogo} alt="Brand Logo" width={250} height={250}/>
          <h1 className="text-white text-4xl font-bold mt-6 text-center">
              A new way to store and share files
          </h1>
          <Link href="/login">
              <button className="bg-purple-700 text-white px-6 py-3 rounded-md mt-8 hover:bg-purple-800">
                  Get Started
              </button>
          </Link>
      </div>
  );

}
