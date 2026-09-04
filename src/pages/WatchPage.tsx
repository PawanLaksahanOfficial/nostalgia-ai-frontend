import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { ErrorPage } from "../components/common/ErrorPage";
import { Button } from "../components/common/Button";
import { getPublicVideo, publicStreamUrl, publicThumbnailUrl } from "../services/videoServices";
import type { PublicVideo } from "../services/videoServices";

export const WatchPage: React.FC = () => {
  const Styles = useComponentStyle("watchPage");
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();

  const [video, setVideo] = useState<PublicVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    setPageError(null);
    try {
      const data = await getPublicVideo(token);
      setVideo(data);
    } catch (error: any) {
      setPageError(error.message || "This link is no longer available.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading) {
    return (
      <>
        <Header />
        <div style={Styles.loading}>Loading...</div>
      </>
    );
  }

  if (pageError || !video || !token) {
    return (
      <>
        <Header />
        <ErrorPage
          message={pageError || "This link is no longer available."}
          onGoHome={() => navigate("/")}
        />
      </>
    );
  }

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <h1 style={Styles.title}>{video.title}</h1>
          <p style={Styles.subtext}>
            Shared by {video.ownerFirstName || "a Nostalgia AI user"} · {new Date(video.createdAt).toLocaleDateString()}
          </p>

          <video
            style={Styles.video}
            controls
            poster={publicThumbnailUrl(token)}
            src={publicStreamUrl(token)}
          >
            Your browser does not support the video tag.
          </video>

          {video.narrative && <p style={Styles.narrative}>{video.narrative}</p>}

          <div style={Styles.footerRow}>
            <span style={Styles.viewCount}>{video.viewCount} view{video.viewCount === 1 ? "" : "s"}</span>
            <Button label="Create your own memory video" type="button" variant="primary" disabled={false} onClick={() => navigate("/")} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
