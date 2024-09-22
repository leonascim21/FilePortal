import Link from "next/link";

export default function Header() {
  return (
    <header className="h-14 dark-purple-border text-white flex justify-between items-center">
      <h1>File Portal</h1>

      <Link href="/">Home</Link>
      <Link href="/">About</Link>
    </header>
  );
}
