import React, { useEffect, useState } from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { useToast } from "../../hooks/useToast";
import { Button } from "../common/Button";
import { InputField } from "../common/InputField";
import { Modal } from "../common/Modal";
import { VideoPreview } from "../VedioPreview";
import { ShareModal } from "./ShareModal";
import {
  deleteVideo,
  downloadVideo,
  fetchVideoObjectUrl,
  renameVideo,
} from "../../services/videoServices";
import type { VideoListItem } from "../../services/videoServices";

interface VideoCardProps {
  video: VideoListItem;
  onChanged: () => void;
}

const statusStyle = (status: string): "statusCompleted" | "statusProcessing" | "statusFailed" | "statusPending" => {
  if (status === "Completed") return "statusCompleted";
  if (status === "Processing") return "statusProcessing";
  if (status === "Failed") return "statusFailed";
  return "statusPending";
};

const formatDuration = (seconds: number | null): string | null => {
  if (!seconds) return null;
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
};

const formatFileSize = (bytes: number | null): string | null => {
  if (!bytes) return null;
  return `${(bytes / 1_048_576).toFixed(1)} MB`;
};

export const VideoCard: React.FC<VideoCardProps> = ({ video, onChanged }) => {
  const Styles = useComponentStyle("videoCard");
  const toast = useToast();

  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState(video.title);
  const [renaming, setRenaming] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, [videoUrl]);

  const handleSaveRename = async () => {
    if (!titleDraft.trim()) {
      toast.error("Title cannot be empty.");
      return;
    }
    setRenaming(true);
    try {
      await renameVideo(video.id, titleDraft.trim());
      toast.success("Video renamed.");
      setEditing(false);
      onChanged();
    } catch (error: any) {
      toast.error(error.message || "Failed to rename video.");
    } finally {
      setRenaming(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteVideo(video.id);
      toast.success("Video deleted.");
      setConfirmDeleteOpen(false);
      onChanged();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete video.");
      setDeleting(false);
    }
  };

  const handlePlay = async () => {
    if (videoUrl) {
      setPlaying((prev) => !prev);
      return;
    }
    setLoadingVideo(true);
    try {
      const url = await fetchVideoObjectUrl(video.id);
      setVideoUrl(url);
      setPlaying(true);
    } catch (error: any) {
      toast.error(error.message || "Failed to load video.");
    } finally {
      setLoadingVideo(false);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadVideo(video.id, video.title);
    } catch (error: any) {
      toast.error(error.message || "Failed to download video.");
    } finally {
      setDownloading(false);
    }
  };

  const duration = formatDuration(video.durationSeconds);
  const fileSize = formatFileSize(video.fileSizeBytes);

  return (
    <div style={Styles.card}>
      <div style={Styles.mainRow}>
        <div style={Styles.info}>
          {editing ? (
            <div style={Styles.editRow}>
              <InputField
                value={titleDraft}
                onChange={(e) => setTitleDraft(e.target.value)}
              />
              <div style={Styles.editButtons}>
                <Button label="Save" type="button" variant="primary" disabled={renaming} loading={renaming} onClick={handleSaveRename} />
                <Button label="Cancel" type="button" variant="secondary" disabled={renaming} onClick={() => { setEditing(false); setTitleDraft(video.title); }} />
              </div>
            </div>
          ) : (
            <h3 style={Styles.title}>{video.title}</h3>
          )}

          <div style={Styles.metaRow}>
            <span style={Styles[statusStyle(video.status)]}>{video.status}</span>
            {duration && <span style={Styles.metaText}>{duration}</span>}
            {fileSize && <span style={Styles.metaText}>{fileSize}</span>}
            {video.isPublic && <span style={Styles.publicBadge}>Shared</span>}
          </div>

          {video.status === "Processing" && video.processingStep && (
            <p style={Styles.stepText}>{video.processingStep}</p>
          )}
          {video.status === "Failed" && video.failureReason && (
            <p style={Styles.errorText}>{video.failureReason}</p>
          )}
        </div>

        {!editing && (
          <div style={Styles.actions}>
            {video.hasVideo && (
              <Button
                label={playing ? "Hide" : "Play"}
                type="button"
                variant="outline"
                disabled={loadingVideo}
                loading={loadingVideo}
                onClick={handlePlay}
              />
            )}
            {video.hasVideo && (
              <Button label="Download" type="button" variant="outline" disabled={downloading} loading={downloading} onClick={handleDownload} />
            )}
            {video.hasVideo && (
              <Button label="Share" type="button" variant="outline" disabled={false} onClick={() => setShareOpen(true)} />
            )}
            <Button label="Rename" type="button" variant="secondary" disabled={false} onClick={() => setEditing(true)} />
            <Button label="Delete" type="button" variant="dangerOutline" disabled={video.status === "Processing"} onClick={() => setConfirmDeleteOpen(true)} />
          </div>
        )}
      </div>

      {playing && videoUrl && <VideoPreview src={videoUrl} />}

      <Modal title="Delete video" isOpen={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <p style={Styles.confirmText}>
          Delete "{video.title}"? This permanently removes the video and any share links.
        </p>
        <div style={Styles.confirmButtons}>
          <Button label="Delete" type="button" variant="dangerOutline" disabled={deleting} loading={deleting} onClick={handleDelete} />
          <Button label="Cancel" type="button" variant="secondary" disabled={deleting} onClick={() => setConfirmDeleteOpen(false)} />
        </div>
      </Modal>

      <ShareModal videoId={video.id} isOpen={shareOpen} onClose={() => setShareOpen(false)} />
    </div>
  );
};
