import Image from "next/image";
import { Navbar } from "../components/Navbar";
import { Wallet } from "../components/Wallet";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div>
      <Navbar />

      </div>
      <main className="container mx-auto flex flex-col items-center justify-center min-h-[92vh]">
          <Wallet />
      </main>
    </div>
  );
}
