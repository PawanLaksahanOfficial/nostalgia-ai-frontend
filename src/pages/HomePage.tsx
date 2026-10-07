import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { InputField } from "../components/common/InputField";
import { TextArea } from "../components/common/TextArea";
import { Button } from "../components/common/Button";
import { VideoPreview } from "../components/VedioPreview";
import { ShareModal } from "../components/videos/ShareModal";
import { VideoCredits } from "../components/videos/VideoCredits";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useToast } from "../hooks/useToast";
import {
  createVideo,
  downloadVideo,
  fetchVideoObjectUrl,
  getVideoStatus,
} from "../services/videoServices";
import type { NarrationSource, VideoStatus } from "../services/videoServices";
import { getProfile, resendVerificationEmail, toUserSummary } from "../services/userServices";
import { setUser } from "../redux/authSlice";
import type { RootState } from "../redux/store";

const MIN_MEMORY_LENGTH = 20;
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
  const dispatch = useDispatch();
  const toast = useToast();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const needsVerification = isAuthenticated && user?.emailVerified === false;
  const [resending, setResending] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [musicMood, setMusicMood] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [creating, setCreating] = useState(false);
  const [videoId, setVideoId] = useState<number | null>(null);
  const [status, setStatus] = useState<VideoStatus | null>(null);
  const [processingStep, setProcessingStep] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState<string | null>(null);
  const [narrationSource, setNarrationSource] = useState<NarrationSource | null>(null);
  const [stockPhotoCredit, setStockPhotoCredit] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const isTooShort = text.trim().length < MIN_MEMORY_LENGTH;
  const isOverLimit = text.length > MAX_MEMORY_LENGTH;

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  // The confirmation link usually opens in a new tab; pick up the change when the user comes back.
  useEffect(() => {
    if (!needsVerification) return;
    const refresh = () => {
      getProfile()
        .then((profile) => dispatch(setUser(toUserSummary(profile))))
        .catch(() => {
          // Stay on the banner; the next focus tries again.
        });
    };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [needsVerification, dispatch]);

  useEffect(() => {
    if (videoId === null) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let polls = 0;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const response = await getVideoStatus(videoId);
        if (cancelled) return;
        setStatus(response.status);
        setProcessingStep(response.processingStep);
        setFailureReason(response.failureReason);
        setNarrationSource(response.narrationSource);
        setStockPhotoCredit(response.stockPhotoCredit);
        if (response.status === "Completed" || response.status === "Failed") return;
      } catch {
        // A missed poll is not worth surfacing; the next poll retries.
      }
      if (cancelled) return;
      if (Date.now() - startedAt > MAX_POLL_MS) {
        setTimedOut(true);
        return;
      }
      polls += 1;
      timer = setTimeout(poll, polls < FAST_POLL_COUNT ? FAST_POLL_MS : SLOW_POLL_MS);
    };

    timer = setTimeout(poll, FAST_POLL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [videoId]);

  useEffect(() => {
    if (status !== "Completed" || videoId === null) return;

    let cancelled = false;
    setLoadingPreview(true);
    fetchVideoObjectUrl(videoId)
      .then((url) => {
        if (cancelled) URL.revokeObjectURL(url);
        else setVideoUrl(url);
      })
      .catch((error: any) => {
        if (!cancelled) toast.error(error.message || "Failed to load video preview.");
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });
    return () => {
      cancelled = true;
    };
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
    if (isTooShort) {
      toast.error(`Please write at least ${MIN_MEMORY_LENGTH} characters so we have something to work with.`);
      return;
    }

    setCreating(true);
    try {
      const response = await createVideo(title.trim(), text.trim(), musicMood || null, image);
      setTimedOut(false);
      setVideoId(response.id);
      setStatus(response.status);
    } catch (error: any) {
      toast.error(error.message || "Failed to create video.");
    } finally {
      setCreating(false);
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      toast.success(await resendVerificationEmail());
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not send the email.");
    } finally {
      setResending(false);
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
    setVideoId(null);
    setStatus(null);
    setProcessingStep(null);
    setFailureReason(null);
    setNarrationSource(null);
    setStockPhotoCredit(null);
    setVideoUrl(null);
    setLoadingPreview(false);
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
              Describe your memory and add a photo if you have one.
              We'll turn it into a narrated video with photos and music.
            </p>
            {needsVerification && (
              <div style={Styles.verifyBanner} role="status">
                <p style={Styles.verifyText}>
                  Confirm your email to start creating videos. We sent a link to <strong>{user?.email}</strong>.
                </p>
                <Button
                  label="Resend email"
                  type="button"
                  variant="outline"
                  size="small"
                  disabled={resending}
                  loading={resending}
                  onClick={handleResendVerification} />
              </div>
            )}
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
                {text.trim().length > 0 && isTooShort && `At least ${MIN_MEMORY_LENGTH} characters · `}
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
                disabled={creating || needsVerification || !title.trim() || isTooShort || isOverLimit}
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
                  <VideoCredits narrationSource={narrationSource} stockPhotoCredit={stockPhotoCredit} />
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
