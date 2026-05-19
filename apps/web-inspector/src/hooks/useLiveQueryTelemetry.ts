import { useEffect, useMemo, useRef, useState } from "react";

import { fetchServerSubscriptions } from "jazz-tools";

import { useInspector } from "@/components/providers/inspectorProvider";
import type { LiveQueryRow } from "@/types/liveQuery";

const LIVE_QUERY_POLL_MS = 20_000;

interface LiveQueryTelemetryCacheEntry {
  generatedAt: number | null;
  rows: LiveQueryRow[];
}

const liveQueryTelemetryCache = new Map<string, LiveQueryTelemetryCacheEntry>();

export interface UseLiveQueryTelemetryResult {
  error: string | null;
  generatedAt: number | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  rows: LiveQueryRow[];
}

interface LiveQueryConnectionConfig {
  adminSecret: string;
  appId: string;
  connectionKey: string;
  serverUrl: string;
}

interface LiveQueryTelemetryState {
  error: string | null;
  generatedAt: number | null;
  isInitialLoading: boolean;
  isRefreshing: boolean;
  rows: LiveQueryRow[];
}

export function useLiveQueryTelemetry(): UseLiveQueryTelemetryResult {
  const { activeConnection } = useInspector();
  const connectionConfig = useMemo<LiveQueryConnectionConfig | null>(() => {
    if (
      activeConnection === null ||
      activeConnection === undefined ||
      activeConnection.serverUrl === null ||
      activeConnection.serverUrl === undefined ||
      activeConnection.adminSecret === null ||
      activeConnection.adminSecret === undefined ||
      activeConnection.appId === null ||
      activeConnection.appId === undefined
    ) {
      return null;
    }

    return {
      connectionKey: `${activeConnection.id}:${activeConnection.serverUrl}:${activeConnection.appId}:${activeConnection.adminSecret}`,
      serverUrl: activeConnection.serverUrl,
      adminSecret: activeConnection.adminSecret,
      appId: activeConnection.appId,
    };
  }, [activeConnection]);
  const cachedTelemetry = useMemo(
    () => (connectionConfig !== null ? (liveQueryTelemetryCache.get(connectionConfig.connectionKey) ?? null) : null),
    [connectionConfig],
  );
  const isFetchingRef = useRef(false);
  const [state, setState] = useState<LiveQueryTelemetryState>(() => ({
    rows: cachedTelemetry?.rows ?? [],
    generatedAt: cachedTelemetry?.generatedAt ?? null,
    error: connectionConfig === null ? "No connection selected." : null,
    isInitialLoading: connectionConfig !== null && cachedTelemetry === null,
    isRefreshing: false,
  }));

  useEffect(() => {
    let cancelled: boolean = false;
    const nextCachedTelemetry =
      connectionConfig !== null ? (liveQueryTelemetryCache.get(connectionConfig.connectionKey) ?? null) : null;

    if (connectionConfig === null) {
      setState({
        rows: [],
        generatedAt: null,
        error: "No connection selected.",
        isInitialLoading: false,
        isRefreshing: false,
      });
      return;
    }

    if (nextCachedTelemetry !== null) {
      setState({
        rows: nextCachedTelemetry.rows,
        generatedAt: nextCachedTelemetry.generatedAt,
        error: null,
        isInitialLoading: false,
        isRefreshing: false,
      });
    } else {
      setState({
        rows: [],
        generatedAt: null,
        error: null,
        isInitialLoading: true,
        isRefreshing: false,
      });
    }

    const load = async (mode: "initial" | "refresh") => {
      if (cancelled === true || isFetchingRef.current === true) {
        return;
      }

      isFetchingRef.current = true;

      setState((currentState) => ({
        ...currentState,
        isInitialLoading: mode === "initial" && currentState.rows.length === 0,
        isRefreshing: mode === "refresh" || currentState.rows.length > 0,
      }));

      try {
        const response = await fetchServerSubscriptions(connectionConfig.serverUrl, {
          adminSecret: connectionConfig.adminSecret,
          appId: connectionConfig.appId,
        });

        if (cancelled === true) {
          return;
        }

        liveQueryTelemetryCache.set(connectionConfig.connectionKey, {
          rows: response.queries,
          generatedAt: response.generatedAt,
        });

        setState({
          rows: response.queries,
          generatedAt: response.generatedAt,
          error: null,
          isInitialLoading: false,
          isRefreshing: false,
        });
      } catch (liveQueryError) {
        if (cancelled === true) {
          return;
        }

        setState((currentState) => ({
          ...currentState,
          error: liveQueryError instanceof Error ? liveQueryError.message : String(liveQueryError),
          isInitialLoading: false,
          isRefreshing: false,
        }));
      } finally {
        isFetchingRef.current = false;
      }
    };

    void load(nextCachedTelemetry === null ? "initial" : "refresh");
    const intervalId = window.setInterval(() => {
      void load("refresh");
    }, LIVE_QUERY_POLL_MS);

    return () => {
      cancelled = true;
      isFetchingRef.current = false;
      window.clearInterval(intervalId);
    };
  }, [connectionConfig]);

  return {
    rows: state.rows,
    generatedAt: state.generatedAt,
    error: state.error,
    isInitialLoading: state.isInitialLoading,
    isRefreshing: state.isRefreshing,
  };
}
