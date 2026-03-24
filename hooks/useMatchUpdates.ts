import { useEffect, useState, useCallback } from "react";
import { getMatchDetails, Match } from "@/lib/matchApi";

export function useMatchUpdates(matchId: string | string[] | undefined, enabled: boolean = true) {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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

  useEffect(() => {
    if (!enabled || !matchId || typeof matchId !== "string") return;

    loadMatch();

    // Polling for updates (backend WebSocket/SSE bo'lmaganda)
    const interval = setInterval(() => {
      loadMatch();
    }, 15000); // 15 sekund interval

    return () => clearInterval(interval);
  }, [matchId, enabled, loadMatch]);

  return {
    match,
    loading,
    error,
    lastUpdate,
    refresh: loadMatch,
  };
}
