"use client";
import { useEffect, useRef, useState } from "react";
import Timer from "@/components/Timer";

export default function Home() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // ✅ Correct type

  const [countdown, setCountdown] = useState<number | null>(null);
  // Import the type for the Timer component's instance if available, or use 'any' as a fallback
  const timerRef = useRef<{ stopSound: () => void } | null>(null); // Timer ref

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [running]);

  const formatTime = (totalSeconds: number) => {
    const hrs = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSeconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
  };

  const playHandler = () => {
    if (!running) {
      setRunning(true);
    }
  };

  const stopHandler = () => {
    setCountdown(null);
    if (timerRef.current) {
      timerRef.current.stopSound(); // Stop beep if playing
    }
  };

  const speakHandler = () => setCountdown(60);
  const challengeHandler = () => setCountdown(30);
  const deffenceHandler = () => setCountdown(90);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <div>
        <p onClick={playHandler} className="hover:cursor-pointer text-2xl">
          {formatTime(time)}
        </p>
      </div>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        {countdown !== null
          ? <Timer ref={timerRef} value={countdown.toString()} />
          : <div className="text-6xl">در انتظار گاد</div>}
      </main>

      <footer className="row-start-3 flex gap-[24px] flex-col items-center justify-center">
        <div className="flex flex-row gap-4">
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-4" onClick={speakHandler}>
            Next Turn
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-4" onClick={challengeHandler}>
            Challenge
          </button>
          <button className="bg-violet-500 text-white px-4 py-2 rounded mt-4" onClick={deffenceHandler}>
            Deffence
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded mt-4" onClick={stopHandler}>
            Stop
          </button>
        </div>
        <div>
          <p>Coded By <a href="https://alirezaarabi.com">Alirezaarabi</a></p>
        </div>
      </footer>
    </div>
  );
}
