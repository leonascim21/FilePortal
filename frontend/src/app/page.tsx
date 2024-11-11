import Image from "next/image";
import PortalImage from "@/../public/portal.png";
import ChestClosed from "@/../public/chest-closed.png";
import ChestOpened from "@/../public/chest-opened.png";
import BrandLogo from "@/../public/logos/vertical-white-blue-logo.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
      <Image src={BrandLogo} alt="Brand Logo" width={250} height={250} />
      <div className="w-[100%] flex justify-center items-center">
        <div>
          <Image
            src={ChestClosed}
            alt="Chest Closed"
            width={250}
            height={250}
          />
          <Link href={"/store-files"}>
            <button className="bg-white text-black px-4 py-2 rounded-md">
              Store Files
            </button>
          </Link>

        </div>
        <div>
          <Image
            src={ChestOpened}
            alt="Chest Opened"
            width={300}
            height={300}
          />
          <Link href={"/open-files"}>
            <button className="bg-white text-black px-4 py-2 rounded-md">
              Open Files
            </button>
          </Link>
        </div>

        <div>
          <Image src={PortalImage} alt="Portal" width={300} height={300} />
          <Link href={"/portal"}>
            <button className="bg-white text-black px-4 py-2 rounded-md">
              Open Portal
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
