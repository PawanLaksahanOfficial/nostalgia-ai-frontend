import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import { getProfile, updateProfile, changePassword, getMyMemories, getUsageQuota } from "../services/userServices";
import { shareMemory, unshareMemory, deleteMemory, regenerateMemory, downloadVideo } from "../services/homeServices";

export const ProfilePage: React.FC = () => {
  const Styles = useComponentStyle("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<any>(null);
  const [memories, setMemories] = useState<any[]>([]);
  const [quota, setQuota] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  const [sharingId, setSharingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      const [profileData, memoriesData, quotaData] = await Promise.all([
        getProfile(),
        getMyMemories(),
        getUsageQuota()
      ]);
      setProfile(profileData);
      setMemories(memoriesData);
      setQuota(quotaData);
      setFirstName(profileData.firstName);
      setLastName(profileData.lastName);
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({ firstName, lastName });
      setEditing(false);
      loadData();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      alert("Password changed successfully!");
    } 
    catch (error) {
      console.error("Failed to change password:", error);
      alert("Failed to change password.");
    } 
    finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleUpgrade = () => {
    // Redirect to Stripe checkout
    alert("Stripe checkout would open here. Configure Stripe price ID in backend.");
  };

  const handleShare = async (memoryId: number) => {
    try {
      const result = await shareMemory(memoryId);
      await navigator.clipboard.writeText(result.shareUrl);
      alert(`Share link copied to clipboard!\n\n${result.shareUrl}`);
      loadData();
    } catch (error) {
      console.error("Failed to share memory:", error);
      alert("Failed to share memory.");
    } finally {
      setSharingId(null);
    }
  };

  const handleUnshare = async (memoryId: number) => {
    try {
      await unshareMemory(memoryId);
      loadData();
    } catch (error) {
      console.error("Failed to unshare memory:", error);
      alert("Failed to unshare memory.");
    } finally {
      setSharingId(null);
    }
  };

  const handleDelete = async (memoryId: number) => {
    if (!confirm("Are you sure you want to delete this memory? This action cannot be undone.")) return;
    try {
      await deleteMemory(memoryId);
      loadData();
    } catch (error) {
      console.error("Failed to delete memory:", error);
      alert("Failed to delete memory.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleRegenerate = async (memoryId: number) => {
    if (!confirm("Regenerate this video? This will create a new version.")) return;
    try {
      setRegeneratingId(memoryId);
      await regenerateMemory(memoryId);
      alert("Regeneration started! Check back soon.");
      loadData();
    } catch (error) {
      console.error("Failed to regenerate memory:", error);
      alert("Failed to regenerate memory.");
    } finally {
      setRegeneratingId(null);
    }
  };

  const handleDownload = async (memoryId: number, title: string) => {
    try {
      setDownloadingId(memoryId);
      const blob = await downloadVideo(memoryId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.replace(/[^a-z0-9]/gi, '_')}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
        console.error("Failed to download video:", error);
        alert("Failed to download video. You may not have access to this quality.");
    } finally {
        setDownloadingId(null);
    }
  };

  if (loading) {
    return <div style={Styles.loading}>Loading...</div>;
  }

  if (!profile) {
    return <div style={Styles.error}>Failed to load profile.</div>;
  }

  const usagePercentage = quota ? Math.round((quota.monthlyMemoriesUsed / quota.monthlyMemoriesLimit) * 100) : 0;

  return (
    <div style={Styles.wrapper}>
      <main style={Styles.content}>
        <div style={Styles.card}>
          <h1 style={Styles.title}>My Profile</h1>
          <div style={Styles.section}>
            <h2 style={Styles.sectionTitle}>Account Information</h2>
            {editing ? (
              <div style={Styles.form}>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    style={Styles.input}
                  />
                </div>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    style={Styles.input}
                  />
                </div>
                <div style={Styles.buttonGroup}>
                  <button style={Styles.primaryButton} onClick={handleUpdateProfile}>Save</button>
                  <button style={Styles.secondaryButton} onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div style={Styles.infoDisplay}>
                <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Tier:</strong> <span style={profile.tier === 'premium' ? Styles.premiumBadge : Styles.freeBadge}>{profile.tier}</span></p>
                <button style={Styles.primaryButton} onClick={() => setEditing(true)}>Edit Profile</button>
              </div>
            )}
          </div>
          <div style={Styles.section}>
            <h2 style={Styles.sectionTitle}>Subscription & Usage</h2>
            {quota && (
              <div style={Styles.quotaDisplay}>
                <div style={Styles.quotaItem}>
                  <span style={Styles.quotaLabel}>Monthly Memories:</span>
                  <span style={Styles.quotaValue}>{quota.monthlyMemoriesUsed} / {quota.monthlyMemoriesLimit}</span>
                </div>
                <div style={Styles.progressBar}>
                  <div style={{ ...Styles.progressFill, width: `${usagePercentage}%` }}></div>
                </div>
                <div style={Styles.quotaItem}>
                  <span style={Styles.quotaLabel}>Max Video Duration:</span>
                  <span style={Styles.quotaValue}>{quota.maxVideoDurationSeconds}s</span>
                </div>
                <div style={Styles.quotaItem}>
                  <span style={Styles.quotaLabel}>Quality:</span>
                  <span style={Styles.quotaValue}>{quota.quality}</span>
                </div>
                {quota.hasWatermark && <p style={Styles.watermarkNote}>Videos will include a "Made with Nostalgia AI" watermark</p>}
                {profile.tier === 'free' && (
                  <button style={Styles.upgradeButton} onClick={handleUpgrade}>Upgrade to Premium</button>
                )}
              </div>
            )}
          </div>
          <div style={Styles.section}>
            <h2 style={Styles.sectionTitle}>Change Password</h2>
            <div style={Styles.form}>
              <div style={Styles.inputGroup}>
                <label style={Styles.label}>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={Styles.input}
                />
              </div>
              <div style={Styles.inputGroup}>
                <label style={Styles.label}>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={Styles.input}
                />
              </div>
              <button 
                style={Styles.primaryButton} 
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
          <div style={Styles.section}>
            <h2 style={Styles.sectionTitle}>My Memories</h2>
            {memories.length === 0 ? (
              <p style={Styles.emptyState}>No memories created yet.</p>
            ) : (
              <div style={Styles.memoryList}>
                {memories.map((memory) => (
                  <div key={memory.id} style={Styles.memoryItem}>
                    <div style={Styles.memoryInfo}>
                      <h3 style={Styles.memoryTitle}>{memory.title}</h3>
                      <p style={Styles.memoryMeta}>
                        Created: {new Date(memory.createdAt).toLocaleDateString()}
                        {memory.completedAt && ` • Completed: ${new Date(memory.completedAt).toLocaleDateString()}`}
                      </p>
                      <span style={{
                        ...Styles.statusBadge,
                        backgroundColor: memory.status === 'Completed' ? '#10b981' : memory.status === 'Processing' ? '#f59e0b' : '#6b7280'
                      }}>
                        {memory.status}
                      </span>
                    </div>
                    {memory.hasVideo && (
                      <div style={Styles.actionButtons}>
                        <button 
                          style={Styles.downloadButton}
                          onClick={() => handleDownload(memory.id, memory.title)}
                          disabled={downloadingId === memory.id}
                        >
                          {downloadingId === memory.id ? "..." : "Download"}
                        </button>
                        {memory.isPublic ? (
                          <button 
                            style={Styles.secondaryButton} 
                            onClick={() => handleUnshare(memory.id)}
                            disabled={sharingId === memory.id}
                          >
                            {sharingId === memory.id ? "..." : "Unshare"}
                          </button>
                        ) : (
                          <button 
                            style={Styles.primaryButton} 
                            onClick={() => handleShare(memory.id)}
                            disabled={sharingId === memory.id}
                          >
                            {sharingId === memory.id ? "..." : "Share"}
                          </button>
                        )}
                        <button 
                          style={Styles.regenerateButton} 
                          onClick={() => handleRegenerate(memory.id)}
                          disabled={regeneratingId === memory.id}
                        >
                          {regeneratingId === memory.id ? "..." : "Re-generate"}
                        </button>
                        <button 
                          style={Styles.deleteButton} 
                          onClick={() => handleDelete(memory.id)}
                          disabled={deletingId === memory.id}
                        >
                          {deletingId === memory.id ? "..." : "Delete"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={Styles.footer}>
            <button style={Styles.signOutButton} onClick={handleSignOut}>Sign Out</button>
          </div>
        </div>
      </main>
    </div>
  );
};