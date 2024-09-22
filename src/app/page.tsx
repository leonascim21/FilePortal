import Image from "next/image";
import PortalImage from "@/../public/portal.png";
import ChestClosed from "@/../public/chest-closed.png";
import ChestOpened from "@/../public/chest-opened.png";

export default function Home() {
  return (
    <div className="dark-purple-bg flex flex-col justify-center items-center min-h-screen">
      {/* <main className="flex gap-8 row-start-2 justify-center items-center sm:items-start dark-purple-bg"> */}
      {/* <Image src={ChestClosed} alt="Chest Closed" width={200} height={200} /> */}
      <div className="w-[100%] flex justify-center items-center">
        <Image src={ChestOpened} alt="Chest Opened" width={300} height={300} />
        <Image src={PortalImage} alt="Portal" width={300} height={300} />
      </div>

      {/* </main> */}
      <footer className="text-white flex gap-6 items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/iyilmaz24/FilePortal/blob/main/README.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          How to use
        </a>

        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://github.com/iyilmaz24/FilePortal"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          GitHub Repository
        </a>
      </footer>
    </div>
  );
}
