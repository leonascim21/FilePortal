import Image from "next/image";

export default function Footer() {
  return (
    <footer className="h-14 dark-purple-border text-white flex justify-between items-center px-12 border-t-2 border-black">
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
        <span className="w-24">How To Use</span>
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
        <span className="w-40">GitHub Repository</span>
      </a>
      <p className="">© 2024 File Portal</p>
    </footer>
  );
}
