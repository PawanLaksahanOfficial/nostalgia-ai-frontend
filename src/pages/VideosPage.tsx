import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { Header } from "../components/common/Header";
import { ErrorPage } from "../components/common/ErrorPage";
import { Button } from "../components/common/Button";
import { VideoCard } from "../components/videos/VideoCard";
import { getMyVideos } from "../services/videoServices";
import type { VideoListItem } from "../services/videoServices";

const FAST_POLL_MS = 2000;
const SLOW_POLL_MS = 5000;
const FAST_POLL_COUNT = 5;
const MAX_POLL_MS = 5 * 60 * 1000;

const isInProgress = (video: VideoListItem) =>
  video.status === "Pending" || video.status === "Processing";

export const VideosPage: React.FC = () => {
  const Styles = useComponentStyle("videosPage");
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [videos, setVideos] = useState<VideoListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollCountRef = useRef(0);
  const pollStartRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const data = await getMyVideos();
      setVideos(data);
    } catch (error: any) {
      setPageError(error.message || "Failed to load videos.");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    try {
      const data = await getMyVideos();
      if (!cancelledRef.current) setVideos(data);
    } catch {
      // A missed poll refresh is not worth surfacing; the next poll retries.
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }
    loadData();
  }, [isAuthenticated, navigate, loadData]);

  useEffect(() => {
    cancelledRef.current = false;

    const hasPending = videos.some(isInProgress);
    if (!hasPending) {
      pollCountRef.current = 0;
      pollStartRef.current = null;
      return;
    }

    if (pollStartRef.current === null) {
      pollStartRef.current = Date.now();
    }

    const elapsed = Date.now() - pollStartRef.current;
    if (elapsed > MAX_POLL_MS) {
      return;
    }

    const delay = pollCountRef.current < FAST_POLL_COUNT ? FAST_POLL_MS : SLOW_POLL_MS;
    timeoutRef.current = setTimeout(async () => {
      pollCountRef.current += 1;
      await refetch();
    }, delay);

    return () => {
      cancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [videos, refetch]);

  if (loading) {
    return (
      <>
        <Header />
        <div style={Styles.loading}>Loading...</div>
      </>
    );
  }

  if (pageError) {
    return (
      <>
        <Header />
        <ErrorPage message={pageError} onRetry={loadData} onGoHome={() => navigate("/")} />
      </>
    );
  }

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <div style={Styles.titleRow}>
            <h1 style={Styles.title}>My Videos</h1>
            <Button label="Create Video" type="button" variant="primary" disabled={false} onClick={() => navigate("/")} />
          </div>

          {videos.length === 0 ? (
            <div style={Styles.emptyState}>
              <p>You haven't created any videos yet.</p>
              <Button label="Create your first video" type="button" variant="primary" disabled={false} onClick={() => navigate("/")} />
            </div>
          ) : (
            <div style={Styles.list}>
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} onChanged={loadData} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
