import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import {
  getProfile,
  updateProfile,
  changePassword,
  getMyMemories,
  getSubscriptionStatus,
  cancelSubscription,
  resumeSubscription,
  createPortalSession,
} from "../services/userServices";
import type { ProfileData, MemoryItem, SubscriptionStatus } from "../services/userServices";
import { ErrorPage } from "../components/common/ErrorPage";
import { Header } from "../components/common/Header";
import { InputField } from "../components/common/InputField";
import { Button } from "../components/common/Button";
import { useToast } from "../hooks/useToast";
import { validatePassword, validateConfirmPassword } from "../components/common/validate/ValidateInputs";

const initialProfileForm = { firstName: "", lastName: "" };
const initialPasswordForm = { currentPassword: "", newPassword: "", confirmNewPassword: "" };

const messageFrom = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

export const ProfilePage: React.FC = () => {
  const Styles = useComponentStyle("profile");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [searchParams, setSearchParams] = useSearchParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [changingPassword, setChangingPassword] = useState(false);
  const [billingPending, setBillingPending] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const [profileData, memoriesData, subscriptionData] = await Promise.all([
        getProfile(),
        getMyMemories(),
        getSubscriptionStatus(),
      ]);
      setProfile(profileData);
      setMemories(memoriesData);
      setSubscription(subscriptionData);
      setProfileForm({
        firstName: profileData.firstName,
        lastName: profileData.lastName
      });
    } catch (error) {
      setPageError(messageFrom(error, "Failed to load profile."));
    } finally {
      setLoading(false);
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
    const checkout = searchParams.get("checkout");
    if (!checkout) return;

    if (checkout === "success") {
      toast.success("Payment received. Your Premium access will appear here shortly.");
    } else if (checkout === "cancel") {
      toast.error("Checkout was cancelled. You have not been charged.");
    }
    searchParams.delete("checkout");
    setSearchParams(searchParams, { replace: true });
  }, [searchParams, setSearchParams, toast]);

  const handleUpdateProfile = async () => {
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName
      });
      setEditing(false);
      await loadData();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to update profile."));
    }
  };

  const newPasswordCheck = validatePassword(passwordForm.newPassword);
  const confirmPasswordCheck = validateConfirmPassword(
    passwordForm.confirmNewPassword,
    passwordForm.newPassword
  );
  const canChangePassword =
    !!passwordForm.currentPassword &&
    newPasswordCheck.valid === true &&
    confirmPasswordCheck.valid === true &&
    !changingPassword;

  const handleChangePassword = async () => {
    if (!canChangePassword) {
      toast.error("Please complete all password fields correctly.");
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
    } catch (error) {
      toast.error(messageFrom(error, "Failed to change password."));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const handleCancelSubscription = async () => {
    setBillingPending(true);
    try {
      await cancelSubscription();
      toast.success("Your subscription will not renew after the current period.");
      await loadData();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to cancel the subscription."));
    } finally {
      setBillingPending(false);
    }
  };

  const handleResumeSubscription = async () => {
    setBillingPending(true);
    try {
      await resumeSubscription();
      toast.success("Your subscription will renew as normal.");
      await loadData();
    } catch (error) {
      toast.error(messageFrom(error, "Failed to resume the subscription."));
    } finally {
      setBillingPending(false);
    }
  };

  const handleManageBilling = async () => {
    setBillingPending(true);
    try {
      const { portalUrl } = await createPortalSession(`${window.location.origin}/profile`);
      window.location.href = portalUrl;
    } catch (error) {
      toast.error(messageFrom(error, "Failed to open the billing portal."));
      setBillingPending(false);
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

  const usagePercentage = profile.quota && profile.quota.monthlyMemoriesLimit > 0
    ? Math.min(100, Math.round((profile.quota.monthlyMemoriesUsed / profile.quota.monthlyMemoriesLimit) * 100))
    : 0;

  const renewalDate = subscription?.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
    : null;

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

                {subscription?.cancelAtPeriodEnd && renewalDate && (
                  <div style={Styles.quotaItem}>
                    <span style={Styles.quotaLabel}>Access ends:</span>
                    <span style={Styles.quotaValue}>{renewalDate}</span>
                  </div>
                )}
                {subscription && !subscription.cancelAtPeriodEnd && renewalDate && (
                  <div style={Styles.quotaItem}>
                    <span style={Styles.quotaLabel}>Renews:</span>
                    <span style={Styles.quotaValue}>{renewalDate}</span>
                  </div>
                )}

                <div style={Styles.buttonGroup}>
                  {profile.tier === 'free' && (
                    <Button
                      label="See Plans"
                      type="button"
                      variant="primary"
                      disabled={false}
                      onClick={() => navigate("/pricing")} />
                  )}
                  {subscription?.hasActiveSubscription && (
                    <>
                      <Button
                        label="Manage Billing"
                        type="button"
                        variant="secondary"
                        disabled={billingPending}
                        onClick={handleManageBilling} />
                      {subscription.cancelAtPeriodEnd ? (
                        <Button
                          label="Resume Subscription"
                          type="button"
                          variant="primary"
                          disabled={billingPending}
                          loading={billingPending}
                          onClick={handleResumeSubscription} />
                      ) : (
                        <Button
                          label="Cancel Subscription"
                          type="button"
                          variant="dangerOutline"
                          disabled={billingPending}
                          loading={billingPending}
                          onClick={handleCancelSubscription} />
                      )}
                    </>
                  )}
                </div>
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
                validation={passwordForm.newPassword ? newPasswordCheck : undefined}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
              />
              <InputField
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={passwordForm.confirmNewPassword}
                validation={passwordForm.confirmNewPassword ? confirmPasswordCheck : undefined}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
              />
              <Button
                label="Change Password"
                type="button"
                variant="primary"
                disabled={!canChangePassword}
                loading={changingPassword}
                onClick={handleChangePassword}
              />
            </div>
          </div>

          <div style={Styles.section}>
            <div style={Styles.sectionTitleRow}>
              <h2 style={Styles.sectionTitle}>My Memories</h2>
              <Button label="Manage in My Videos" type="button" variant="outline" disabled={false} onClick={() => navigate('/videos')} />
            </div>
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