import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import { getProfile, updateProfile, changePassword, getMyMemories, createCheckoutSession } from "../services/userServices";
import type { ProfileData, MemoryItem } from "../services/userServices";
import { ErrorPage } from "../components/common/ErrorPage";
import { Header } from "../components/common/Header";
import { InputField } from "../components/common/InputField";
import { Button } from "../components/common/Button";
import { useToast } from "../hooks/useToast";

const initialProfileForm = { firstName: "", lastName: "" };
const initialPasswordForm = { currentPassword: "", newPassword: "" };

export const ProfilePage: React.FC = () => {
  const Styles = useComponentStyle("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
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
      toast.error(error.message || "Failed to update profile.");
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      toast.error("Please fill in both password fields.");
      return;
    }
    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setPasswordForm(initialPasswordForm);
      toast.success("Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password.");
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
      toast.error(error.message || "Failed to start checkout.");
    }
  };

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
        <ErrorPage message={pageError} onRetry={loadData} onGoHome={() => navigate('/')} />
      </>
    );
  }
  if (!profile) {
    return (
      <>
        <Header />
        <ErrorPage message="Unable to load profile data." onRetry={loadData} onGoHome={() => navigate('/')} />
      </>
    );
  }

  const usagePercentage = profile.quota
    ? Math.round((profile.quota.monthlyMemoriesUsed / profile.quota.monthlyMemoriesLimit) * 100)
    : 0;

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <h1 style={Styles.title}>My Profile</h1>

          <div style={Styles.section}>
            <h2 style={Styles.sectionTitle}>Account Information</h2>
            {editing ? (
              <div style={Styles.form}>
                <div style={Styles.fieldRow}>
                  <InputField
                    label="First Name"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <InputField
                    label="Last Name"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
                <div style={Styles.buttonGroup}>
                  <Button label="Save" type="button" variant="primary" disabled={false} onClick={handleUpdateProfile} />
                  <Button label="Cancel" type="button" variant="secondary" disabled={false} onClick={() => setEditing(false)} />
                </div>
              </div>
            ) : (
              <div style={Styles.infoDisplay}>
                <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Tier:</strong> <span style={profile.tier === 'premium' ? Styles.premiumBadge : Styles.freeBadge}>{profile.tier}</span></p>
                <Button label="Edit Profile" type="button" variant="primary" disabled={false} onClick={() => setEditing(true)} />
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
                  <Button label="Upgrade to Premium" type="button" variant="primary" disabled={false} onClick={handleUpgrade} />
                )}
              </div>
            )}
          </div>

          <div style={Styles.section}>
            <h2 style={Styles.sectionTitle}>Change Password</h2>
            <div style={Styles.form}>
              <InputField
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              />
              <InputField
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              />
              <Button
                label="Change Password"
                type="button"
                variant="primary"
                disabled={changingPassword}
                loading={changingPassword}
                onClick={handleChangePassword}
              />
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
                        backgroundColor: memory.status === 'Completed' ? 'var(--color-success)' : memory.status === 'Processing' ? 'var(--color-warning)' : 'var(--color-text-muted)'
                      }}>
                        {memory.status}
                      </span>
                    </div>
                    {memory.hasVideo && (
                      <Button label="Download" type="button" variant="outline" disabled={false} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={Styles.footer}>
            <Button label="Sign Out" type="button" variant="dangerOutline" disabled={false} onClick={handleSignOut} />
          </div>
        </div>
      </main>
    </div>
  );
};