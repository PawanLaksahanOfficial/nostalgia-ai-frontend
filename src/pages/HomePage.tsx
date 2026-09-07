import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { InputField } from "../components/common/InputField";
import { TextArea } from "../components/common/TextArea";
import { Button } from "../components/common/Button";
import { VideoPreview } from "../components/VedioPreview";
import { ShareModal } from "../components/videos/ShareModal";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useToast } from "../hooks/useToast";
import {
  createVideo,
  downloadVideo,
  fetchVideoObjectUrl,
  getVideoStatus,
} from "../services/videoServices";
import type { VideoStatus } from "../services/videoServices";
import type { RootState } from "../redux/store";

const MAX_MEMORY_LENGTH = 2000;

const musicMoods = [
  { value: "", label: "No preference" },
  { value: "warm", label: "Warm" },
  { value: "melancholy", label: "Melancholy" },
  { value: "hopeful", label: "Hopeful" },
  { value: "playful", label: "Playful" },
];

const FAST_POLL_MS = 2000;
const SLOW_POLL_MS = 5000;
const FAST_POLL_COUNT = 5;
const MAX_POLL_MS = 5 * 60 * 1000;

export const HomePage: React.FC = () => {
  const Styles = useComponentStyle("homePage");
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [musicMood, setMusicMood] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pollCountRef = useRef(0);
  const pollStartRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const isOverLimit = text.length > MAX_MEMORY_LENGTH;

  useEffect(() => {
    return () => {
      cancelledRef.current = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (videoId === null || status === "Completed" || status === "Failed" || status === null) {
      return;
    }

    if (pollStartRef.current === null) {
      pollStartRef.current = Date.now();
    }

    if (Date.now() - pollStartRef.current > MAX_POLL_MS) {
      setTimedOut(true);
      return;
    }

    const delay = pollCountRef.current < FAST_POLL_COUNT ? FAST_POLL_MS : SLOW_POLL_MS;
    timeoutRef.current = setTimeout(async () => {
      if (cancelledRef.current) return;
      pollCountRef.current += 1;
      try {
        const response = await getVideoStatus(videoId);
        if (cancelledRef.current) return;
        setStatus(response.status);
        setProcessingStep(response.processingStep);
        setFailureReason(response.failureReason);
      } catch {
        // A missed poll is not worth surfacing; the next poll retries.
      }
    }, delay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [videoId, status]);

  useEffect(() => {
    if (status !== "Completed" || videoId === null || videoUrl) return;

    setLoadingPreview(true);
    fetchVideoObjectUrl(videoId)
      .then((url) => {
        if (!cancelledRef.current) setVideoUrl(url);
      })
      .catch((error: any) => {
        toast.error(error.message || "Failed to load video preview.");
      })
      .finally(() => setLoadingPreview(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, videoId]);

  const handleGenerate = async () => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }

    if (!title.trim() || !text.trim()) {
      toast.error("Please add a title and describe your memory.");
      return;
    }

    setCreating(true);
    try {
      const response = await createVideo(title.trim(), text.trim(), musicMood || null, image);
      pollCountRef.current = 0;
      pollStartRef.current = null;
      setTimedOut(false);
      setVideoId(response.id);
      setStatus(response.status);
    } catch (error: any) {
      toast.error(error.message || "Failed to create video.");
    } finally {
      setCreating(false);
    }
  };

  const handleDownload = async () => {
    if (videoId === null) return;
    setDownloading(true);
    try {
      await downloadVideo(videoId, title);
    } catch (error: any) {
      toast.error(error.message || "Failed to download video.");
    } finally {
      setDownloading(false);
    }
  };

  const resetForm = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    cancelledRef.current = false;
    pollCountRef.current = 0;
    pollStartRef.current = null;
    setVideoId(null);
    setStatus(null);
    setProcessingStep(null);
    setFailureReason(null);
    setVideoUrl(null);
    setTimedOut(false);
  };

  const handleCreateAnother = () => {
    resetForm();
    setTitle("");
    setText("");
    setMusicMood("");
    setImage(null);
  };

  const isFormPhase = videoId === null;
  const isFailed = status === "Failed";

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        {isFormPhase || isFailed ? (
          <div style={Styles.card} className="card animate-fade-in-up">
            <h1 style={Styles.title}>Create Your Nostalgic Memory Video</h1>
            <p style={Styles.subtext}>
              Describe your memory and optionally upload an image.
              We'll turn it into a beautiful nostalgic video.
            </p>
            <div style={Styles.form}>
              <InputField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)} />
              <TextArea
                label="Enter your nostalgic memory"
                value={text}
                onChange={(e) => setText(e.target.value)} />
              <div style={{
                ...Styles.charCount,
                ...(isOverLimit ? Styles.charCountOver : {}),
              }}>
                {text.length} / {MAX_MEMORY_LENGTH}
              </div>
              <div style={Styles.fieldGroup}>
                <label style={Styles.fieldLabel}>Music mood (optional)</label>
                <select
                  className="input"
                  style={Styles.select}
                  value={musicMood}
                  onChange={(e) => setMusicMood(e.target.value)}
                >
                  {musicMoods.map((mood) => (
                    <option key={mood.value} value={mood.value}>{mood.label}</option>
                  ))}
                </select>
              </div>
              <InputField
                type="file"
                label="Upload an optional image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)} />
              {isFailed && failureReason && (
                <p style={Styles.errorText}>{failureReason}</p>
              )}
              <Button
                label={creating ? "Creating..." : isFailed ? "Try Again" : "Generate Video"}
                type="button"
                variant="primary"
                disabled={creating || !title.trim() || !text.trim() || isOverLimit}
                loading={creating}
                onClick={handleGenerate} />
            </div>
          </div>
        ) : (
          <div style={Styles.card} className="card animate-fade-in-up">
            <h1 style={Styles.title}>{title}</h1>

            {status !== "Completed" && (
              <div style={Styles.progressWrap}>
                <span className="spinner" aria-hidden="true" />
                <p style={Styles.stepText}>{processingStep || "Getting started…"}</p>
                {timedOut && (
                  <p style={Styles.stepText}>
                    Still working on it. You can check My Videos in a bit.
                  </p>
                )}
              </div>
            )}

            {status === "Completed" && (
              loadingPreview ? (
                <p style={Styles.stepText}>Loading preview…</p>
              ) : videoUrl && (
                <>
                  <VideoPreview src={videoUrl} />
                  <div style={Styles.resultActions}>
                    <Button label="Download" type="button" variant="primary" disabled={downloading} loading={downloading} onClick={handleDownload} />
                    <Button label="Share" type="button" variant="outline" disabled={false} onClick={() => setShareOpen(true)} />
                    <Button label="Go to My Videos" type="button" variant="outline" disabled={false} onClick={() => navigate("/videos")} />
                    <Button label="Create Another" type="button" variant="secondary" disabled={false} onClick={handleCreateAnother} />
                  </div>
                </>
              )
            )}
          </div>
        )}
      </main>
      <Footer />
      {videoId !== null && (
        <ShareModal videoId={videoId} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
      )}
    </div>
  );
};
