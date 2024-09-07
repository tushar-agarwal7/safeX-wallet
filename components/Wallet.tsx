"use client";

import { useState } from "react";
import { generateMnemonic } from "bip39";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

export function Wallet() {
  const [mnemonic, setMnemonic] = useState("");
  const [count, setCount] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false); 
  const [alertMessage, setAlertMessage] = useState("");
  
  const handleCopyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24 gap-y-10">
      {/* Title */}
      <div className="text-5xl font-bold bg-sky-900 rounded-xl font-serif text-white mb-6 text-center p-4">
        Generate Your <span className="text-yellow-300">SafeX Wallet </span>
        
      </div>

      {alertVisible && (
        <div className="mb-6 w-full max-w-md">
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertDescription>
              { "Your Private Key or Seed Phrase is needed to recover your account. Keep it safe and don’t share it."}
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
    </main>
  );
}
