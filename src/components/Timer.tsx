import React, { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import "./timer.css";
import useSound from 'use-sound';

const numbers = [
  0x7E, 0x30, 0x6D, 0x79, 0x33,
  0x5B, 0x5F, 0x70, 0x7F, 0x7B
];

interface SegmentProps {
  on: boolean;
  position: string;
}

const Segment: React.FC<SegmentProps> = ({ on, position }) => (
  <div className={`Segment Segment-${position} ${on ? "Segment--on" : ""}`} />
);

interface DisplayProps {
  value: string;
}

const Display: React.FC<DisplayProps> = ({ value }) => {
  const segments = ["G", "F", "E", "D", "C", "B", "A"];
  const bit = numbers[parseInt(value) || 0];

  return (
    <div className="Display">
      {segments.map((seg, i) => (
        <Segment key={seg} on={!!((bit >> i) & 1)} position={seg} />
      ))}
    </div>
  );
};

interface TimerProps {
  value: string;
}
export interface TimerHandle {
  stopSound: () => void;
}
const Timer = forwardRef<TimerHandle, TimerProps>(({ value }, ref) => {
  const target = Math.min(parseInt(value, 10), 99);
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);
  const [play, { stop }] = useSound('/sounds/beep.mp3');

  useEffect(() => {
    if (isNaN(target)) return;

    const interval = setInterval(() => {
      setCount(prev => {
        if (prev >= target) {
          clearInterval(interval);
          setDone(true);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [target]);

  useEffect(() => {
    if (done) {
      play();
    }
  }, [done, play]);

  useImperativeHandle(ref, () => ({
    stopSound: () => stop()
  }));

  const tens = Math.floor(count / 10).toString();
  const ones = (count % 10).toString();

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex" }}>
        <Display value={tens} />
        <Display value={ones} />
      </div>
      {done && <div className="text-6xl">تمام :)</div>}
    </div>
  );
});

export default Timer;
