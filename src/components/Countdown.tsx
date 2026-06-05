import { useEffect, useState } from "react";

function nextMidnight(): number {
  const d = new Date();
  d.setHours(24, 0, 0, 0);
  return d.getTime();
}

export function Countdown() {
  const [target] = useState(nextMidnight);
  const [left, setLeft] = useState(target - Date.now());

  useEffect(() => {
    const t = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);

  const h = Math.max(0, Math.floor(left / 3.6e6));
  const m = Math.max(0, Math.floor((left % 3.6e6) / 6e4));
  const s = Math.max(0, Math.floor((left % 6e4) / 1000));
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-1 font-mono" dir="ltr">
      {[h, m, s].map((v, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <span className="font-bold text-white">:</span>}
          <span className="grid h-7 min-w-7 place-items-center rounded-md bg-foreground px-1 text-sm font-bold text-background">
            {pad(v)}
          </span>
        </span>
      ))}
    </div>
  );
}
