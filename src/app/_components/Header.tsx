import Link from "next/link";

export default function Header() {
  return (
    <header className="h-14 dark-purple-border text-white flex justify-between items-center px-12 border-b-2 border-black">
      <h1>File Portal</h1>
      <div className="flex gap-8">
        <Link href="/">Login</Link>
        <Link href="/">About</Link>
      </div>
    </header>
  );
}
