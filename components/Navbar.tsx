"use client"
import Link from "next/link";
import { Zoom } from "react-awesome-reveal";
import { BsGithub } from "react-icons/bs";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full bg-transparent via-purple-600 to-pink-600 shadow-lg ">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        <Link href="/" className="flex items-center gap-3" prefetch={false}>
          <img
            src="/safex.png"
            alt="SafeX Logo"
            className="h-12 w-12 rounded-full border-2 border-white shadow-lg transition transform hover:scale-105 hover:rotate-6"
          />
          <span className="text-2xl font-bold text-yellow-300 tracking-wide">SafeX</span>
        </Link>

        <div className="hidden md:block">
   
          <Zoom delay={100} triggerOnce>
                  <Link
                    href="https://github.com/tushar-agarwal7"
                    target='_blank'
                    className="transition-all text-pink-500 hover:scale-125 duration-300"
                  >
                    <BsGithub size={35} className="drop-shadow-lg" />
                  </Link>
                </Zoom>
        </div>
      </div>
    </header>
  );
}
