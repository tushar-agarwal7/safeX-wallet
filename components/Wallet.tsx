"use client";

import { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39"; // Change to mnemonicToSeedSync
import { Alert, AlertDescription } from "./ui/alert";
import { Terminal } from "lucide-react";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import bs58 from "bs58";

export function Wallet() {
  const [mnemonic, setMnemonic] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [solIndex, setSolIndex] = useState<number>(0);
  const [solAddress, setSolAddress] = useState<string[]>([]);
  const [ethIndex, setEthIndex] = useState<number>(0);
  const [ethAddress, setEthAddress] = useState<string[]>([]);

  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
  };

  const createSolWallet = () => {
    if (!mnemonic) return;
    const seed = mnemonicToSeedSync(mnemonic); // Use synchronous version
    const path = `m/44'/501'/${solIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();

    setSolAddress((prevAddresses) => [...prevAddresses, publicKey]);
    setSolIndex((prevIndex) => prevIndex + 1);
  };

  const createEthWallet = () => {
    if (!mnemonic) return;
    const seed = mnemonicToSeedSync(mnemonic); // Use synchronous version
    const path = `m/44'/60'/${ethIndex}'/0'`;
    const hdNode = ethers.HDNodeWallet.fromSeed(seed);
    const wallet = hdNode.derivePath(path);
    const publicKey = wallet.publicKey;

    setEthAddress((prevAddresses) => [
      ...prevAddresses,
      bs58.encode(Buffer.from(publicKey as Uint8Array)), // Ensure correct type
    ]);
    setEthIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-y-10">
      {/* Title */}
      <div className="text-5xl font-bold bg-sky-900 rounded-xl font-serif text-white mb-6 text-center p-4">
        Generate Your <span className="text-yellow-300">SafeX Wallet</span>
      </div>

      {alertVisible && (
        <div className="mb-6 w-full max-w-md">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertDescription>
              {
                "Your Private Key or Seed Phrase is needed to recover your account. Keep it safe and don’t share it."
              }
            </AlertDescription>
          </Alert>
        </div>
      )}

      {!mnemonic && (
        <div>
          <button
            onClick={async function () {
              const mn = await generateMnemonic();
              setMnemonic(mn);
              if (count === 0) {
                setAlertVisible(true);
                setTimeout(() => setAlertVisible(false), 3000);
              }
              setCount(1);
            }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold rounded-full px-6 py-3 shadow-lg transition-transform transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-300"
          >
            Generate Secret Phrase
          </button>
        </div>
      )}

      {mnemonic && (
        <div className="mt-6 p-6 bg-gray-800 rounded-lg shadow-lg w-full max-w-5xl text-center">
          <h3 className="font-bold mb-4 text-2xl text-yellow-300">Your Seed Phrase:</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-900 p-4 rounded-md text-lg font-mono text-gray-200">
            {mnemonic.split(" ").map((word, index) => (
              <div key={index} className="flex items-center justify-center space-x-2">
                <span className="text-yellow-400 font-bold">{index + 1}.</span>
                <span>{word}</span>
              </div>
            ))}
          </div>
          <button
            onClick={handleCopyMnemonic}
            className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Copy Seed Phrase
          </button>

          <p className="mt-4 text-sm text-gray-400">
            Keep this phrase safe and secure. Never share it with anyone.
          </p>
        </div>
      )}

      {mnemonic && (
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <button
            onClick={createSolWallet}
            className="relative w-full md:w-auto py-3 px-8 bg-gradient-to-r from-green-400 via-green-500 to-emerald-600 text-white font-bold rounded-full shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:rotate-3 hover:bg-gradient-to-br hover:shadow-emerald-400/50 hover:text-white active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400"
          >
            <span className="absolute inset-0 bg-white opacity-10 rounded-full blur-lg"></span>
            <span className="relative z-10">Create SOLANA Wallet</span>
          </button>

          <button
            onClick={createEthWallet}
            className="relative w-full md:w-auto py-3 px-8 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-600 text-white font-bold rounded-full shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:rotate-3 hover:bg-gradient-to-br hover:shadow-purple-400/50 hover:text-white active:scale-95 focus:outline-none focus:ring-4 focus:ring-indigo-400"
          >
            <span className="absolute inset-0 bg-white opacity-10 rounded-full blur-lg"></span>
            <span className="relative z-10">Create ETHEREUM Wallet</span>
          </button>
        </div>
      )}
  {/* solana addresses  */}
     <div className="w-full flex flex-col lg:flex-row gap-12 mt-8 items-center justify-center">
  {solAddress.length > 0 && (
    <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-300 via-blue-900 to-indigo-700 p-8 rounded-3xl shadow-xl backdrop-blur-md border border-blue-500/50">
      <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-8 text-center">
       Solana Addresses
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {solAddress.map((address, index) => (
          <li
            key={index}
            className="relative font-mono text-gray-100 bg-blue-900 bg-opacity-70 p-5 rounded-xl shadow-lg border border-blue-700 hover:bg-opacity-80 hover:scale-105 transform transition-all duration-300"
          >
            <span className="absolute top-2 right-2 p-2 bg-yellow-400 text-gray-900 font-bold rounded-full">
              {index + 1}
            </span>
            <p className="break-all text-center">{address}</p>
          </li>
        ))}
      </ul>
    </div>
  )}

  

{/*  etherium address */}
  {ethAddress.length > 0 && (
    <div className="lg:w-1/2 w-full bg-gradient-to-br from-blue-300 via-indigo-600 to-blue-500 p-8 rounded-3xl shadow-xl backdrop-blur-md border border-indigo-500/50">
      <h3 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500 mb-8 text-center">
        Ethereum Addresses
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {ethAddress.map((address, index) => (
          <li
            key={index}
            className="relative font-mono text-gray-100 bg-blue-900 bg-opacity-70 p-5 rounded-xl shadow-lg border border-indigo-600 hover:bg-opacity-80 hover:scale-105 transform transition-all duration-300"
          >
            <span className="absolute top-2 right-2 p-2 bg-yellow-400 text-gray-900 font-bold rounded-full">
              {index + 1}
            </span>
            <p className="break-all text-center">{address}</p>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>



    </main>
  );
}
