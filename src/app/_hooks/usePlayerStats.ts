"use client";

import { useEffect, useState } from "react";

export function usePlayerStats() {
  const [stats, setStats] = useState<{
    xp: number;
    level: number;
    xpForNext: number;
  } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/profile", {
        cache: "no-store",
      });

      const data = await res.json();
      setStats(data);
    }
    load();
  }, []);

  return stats;
}
