import { useEffect, useState, useCallback, useRef } from "react";
import { getMatchDetails, Match } from "@/lib/matchApi";

const POLL_INTERVAL_MS = 15_000;

export function useMatchUpdates(matchId: string | string[] | undefined, enabled: boolean = true) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadMatch = useCallback(async () => {
    if (!matchId || typeof matchId !== "string") return;

    try {
      setLoading(true);
      setError("");
      const data = await getMatchDetails(matchId);
      setMatch(data);
      setLastUpdate(new Date());
    } catch (err: any) {
      console.error("Error loading match:", err);
      setError(err?.message || "Failed to load match");
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(loadMatch, POLL_INTERVAL_MS);
  }, [loadMatch]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled || !matchId || typeof matchId !== "string") return;

    loadMatch();
    startPolling();

    // Sahifa yashirilganda polling to'xtasin, qaytganda darhol yangilansin
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        stopPolling();
      } else {
        loadMatch();
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [matchId, enabled, loadMatch, startPolling, stopPolling]);

  return {
    match,
    loading,
    error,
    lastUpdate,
    refresh: loadMatch,
  };
}
