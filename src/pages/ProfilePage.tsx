import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import { getProfile, updateProfile, changePassword, getMyMemories, createCheckoutSession } from "../services/userServices";
import type { ProfileData, MemoryItem } from "../services/userServices";
import { ErrorPage } from "../components/common/ErrorPage";

const initialProfileForm = { firstName: "", lastName: "" };
const initialPasswordForm = { currentPassword: "", newPassword: "" };

export const ProfilePage: React.FC = () => {
  const Styles = useComponentStyle("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    setLoading(true);
    setPageError(null);
    try {
      const [profileData, memoriesData] = await Promise.all([
        getProfile(),
        getMyMemories()
      ]);
      setProfile(profileData);
      setMemories(memoriesData);
      setProfileForm({
        firstName: profileData.firstName,
        lastName: profileData.lastName
      });
    } catch (error: any) {
      setPageError(error.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName
      });
      setEditing(false);
      await loadData();
    } catch (error: any) {
      alert(error.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm(initialPasswordForm);
      alert("Password changed successfully!");
    } catch (error: any) {
      alert(error.message || "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleUpgrade = async () => {
    try {
      const priceId = "price_1Tuo7TCljtrS1H5Ci8449rkm";
      const successUrl = `${window.location.origin}/profile?checkout=success`;
      const cancelUrl = `${window.location.origin}/profile?checkout=cancel`;
      const { sessionUrl } = await createCheckoutSession(priceId, successUrl, cancelUrl);
      window.location.href = sessionUrl;
    } catch (error: any) {
      alert(error.message || "Failed to start checkout.");
    }
  };

  if (loading) {
    return <div style={Styles.loading}>Loading...</div>;
  }
  if (pageError) {
    return <ErrorPage message={pageError} onRetry={loadData} onGoHome={() => navigate('/')} />;
  }
  if (!profile) {
    return <ErrorPage message="Unable to load profile data." onRetry={loadData} onGoHome={() => navigate('/')} />;
  }

  const usagePercentage = profile.quota
    ? Math.round((profile.quota.monthlyMemoriesUsed / profile.quota.monthlyMemoriesLimit) * 100)
    : 0;

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
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                    style={Styles.input}
                  />
                </div>
                <div style={Styles.inputGroup}>
                  <label style={Styles.label}>Last Name</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
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
            {profile.quota && (
              <div style={Styles.quotaDisplay}>
                <div style={Styles.quotaItem}>
                  <span style={Styles.quotaLabel}>Monthly Memories:</span>
                  <span style={Styles.quotaValue}>{profile.quota.monthlyMemoriesUsed} / {profile.quota.monthlyMemoriesLimit}</span>
                </div>
                <div style={Styles.progressBar}>
                  <div style={{ ...Styles.progressFill, width: `${usagePercentage}%` }}></div>
                </div>
                <div style={Styles.quotaItem}>
                  <span style={Styles.quotaLabel}>Max Video Duration:</span>
                  <span style={Styles.quotaValue}>{profile.quota.maxVideoDurationSeconds}s</span>
                </div>
                <div style={Styles.quotaItem}>
                  <span style={Styles.quotaLabel}>Quality:</span>
                  <span style={Styles.quotaValue}>{profile.quota.quality}</span>
                </div>
                {profile.quota.hasWatermark && (
                  <p style={Styles.watermarkNote}>Videos will include a "Made with Nostalgia AI" watermark</p>
                )}
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
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  style={Styles.input}
                />
              </div>
              <div style={Styles.inputGroup}>
                <label style={Styles.label}>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
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
                      <button style={Styles.downloadButton}>Download</button>
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