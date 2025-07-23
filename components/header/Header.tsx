export default function Header() {
  return (
    <header className="w-full px-4 py-3 bg-black text-white flex flex-col md:flex-row justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold">AGROTM</h1>
      <nav className="mt-2 md:mt-0 flex gap-4 text-sm md:text-base">
        <a href="#">Home</a>
        <a href="#">NFTs</a>
        <a href="#">Stake</a>
        <a href="#">Docs</a>
      </nav>
    </header>
  );
}