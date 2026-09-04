import React, { useEffect, useState } from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import { useToast } from "../../hooks/useToast";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import {
  createShareLink,
  getShareLinks,
  revokeShareLink,
} from "../../services/videoServices";
import type { ShareLinkItem } from "../../services/videoServices";

interface ShareModalProps {
  videoId: number;
  isOpen: boolean;
  onClose: () => void;
}

const expiryOptions = [
  { value: "", label: "Never expires" },
  { value: "7", label: "Expires in 7 days" },
  { value: "30", label: "Expires in 30 days" },
];

export const ShareModal: React.FC<ShareModalProps> = ({ videoId, isOpen, onClose }) => {
  const Styles = useComponentStyle("shareModal");
  const toast = useToast();
  const [links, setLinks] = useState<ShareLinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [revokingId, setRevokingId] = useState<number | null>(null);
  const [expiresInDays, setExpiresInDays] = useState("");

  useEffect(() => {
    if (isOpen) {
      loadLinks();
    }
  }, [isOpen, videoId]);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const data = await getShareLinks(videoId);
      setLinks(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load share links.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      await createShareLink(videoId, expiresInDays ? Number(expiresInDays) : null, null);
      toast.success("Share link created!");
      await loadLinks();
    } catch (error: any) {
      toast.error(error.message || "Failed to create share link.");
    } finally {
      setCreating(false);
    }
  };

  const handleRevoke = async (shareId: number) => {
    setRevokingId(shareId);
    try {
      await revokeShareLink(videoId, shareId);
      toast.success("Share link revoked.");
      await loadLinks();
    } catch (error: any) {
      toast.error(error.message || "Failed to revoke share link.");
    } finally {
      setRevokingId(null);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    } catch {
      toast.error("Couldn't copy automatically — select the link and copy it.");
    }
  };

  return (
    <Modal title="Share video" isOpen={isOpen} onClose={onClose}>
      <div style={Styles.createRow}>
        <select
          className="input"
          style={Styles.select}
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(e.target.value)}
        >
          {expiryOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <Button
          label="Create link"
          type="button"
          variant="primary"
          disabled={creating}
          loading={creating}
          onClick={handleCreate}
        />
      </div>

      {loading ? (
        <p style={Styles.emptyState}>Loading…</p>
      ) : links.length === 0 ? (
        <p style={Styles.emptyState}>No share links yet. Create one above.</p>
      ) : (
        <div style={Styles.linkList}>
          {links.map((link) => {
            const isDead = link.isRevoked || link.isExpired;
            return (
              <div key={link.id} style={Styles.linkItem}>
                <div style={Styles.linkRow}>
                  <input
                    className="input"
                    style={Styles.linkInput}
                    readOnly
                    value={link.shareUrl}
                    onFocus={(e) => e.currentTarget.select()}
                  />
                  <Button
                    label="Copy"
                    type="button"
                    variant="outline"
                    disabled={isDead}
                    onClick={() => handleCopy(link.shareUrl)}
                  />
                </div>
                <div style={Styles.linkMeta}>
                  <span style={isDead ? Styles.statusDead : Styles.statusActive}>
                    {link.isRevoked ? "Revoked" : link.isExpired ? "Expired" : "Active"}
                  </span>
                  <span style={Styles.metaText}>{link.viewCount} view{link.viewCount === 1 ? "" : "s"}</span>
                  {link.expiresAt && (
                    <span style={Styles.metaText}>
                      Expires {new Date(link.expiresAt).toLocaleDateString()}
                    </span>
                  )}
                  {!link.isRevoked && (
                    <Button
                      label="Revoke"
                      type="button"
                      variant="dangerOutline"
                      disabled={revokingId === link.id}
                      loading={revokingId === link.id}
                      onClick={() => handleRevoke(link.id)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
};
