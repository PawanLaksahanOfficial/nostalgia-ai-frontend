import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useToast } from "../hooks/useToast";
import { createCheckoutSession, getPlans, getSubscriptionStatus } from "../services/userServices";
import type { PlanOption } from "../services/userServices";
import type { RootState } from "../redux/store";

const formatPrice = (plan: PlanOption): string | null => {
  if (plan.amountMinorUnits == null || !plan.currency) {
    return null;
  }
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: plan.currency.toUpperCase(),
  }).format(plan.amountMinorUnits / 100);
};

const describeFeatures = (plan: PlanOption): string[] => [
  `${plan.monthlyMemories} memories per month`,
  `Up to ${plan.maxVideoDurationSeconds}s per video`,
  `${plan.quality.toUpperCase()} quality`,
  plan.hasWatermark ? "Includes watermark" : "No watermark",
];

export const PricingPage: React.FC = () => {
  const Styles = useComponentStyle("pricing");
  const navigate = useNavigate();
  const toast = useToast();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [currentTier, setCurrentTier] = useState<'free' | 'premium' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkoutPending, setCheckoutPending] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loadedPlans = await getPlans();
      setPlans(loadedPlans);

      if (isAuthenticated) {
        try {
          setCurrentTier((await getSubscriptionStatus()).tier);
        } catch {
          setCurrentTier(null);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load plans.");
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpgrade = async (plan: PlanOption) => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }
    if (!plan.priceId) {
      toast.error("This plan is not available for purchase right now.");
      return;
    }

    setCheckoutPending(true);
    try {
      const { sessionUrl } = await createCheckoutSession(
        plan.priceId,
        `${window.location.origin}/profile?checkout=success`,
        `${window.location.origin}/pricing?checkout=cancel`
      );
      window.location.href = sessionUrl;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to start checkout.");
      setCheckoutPending(false);
    }
  };

  const renderCta = (plan: PlanOption) => {
    if (plan.tier === "free") {
      return currentTier === "free"
        ? <span style={Styles.currentBadge}>Current plan</span>
        : null;
    }
    if (currentTier === "premium") {
      return <span style={Styles.currentBadge}>Current plan</span>;
    }
    if (!plan.priceId || plan.amountMinorUnits == null) {
      return <Button label="Coming soon" type="button" variant="outline" disabled={true} />;
    }
    return (
      <Button
        label={isAuthenticated ? "Upgrade to Premium" : "Sign in to upgrade"}
        type="button"
        variant="primary"
        disabled={checkoutPending}
        loading={checkoutPending}
        onClick={() => handleUpgrade(plan)}
      />
    );
  };

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <header style={Styles.header}>
          <h1 style={Styles.title}>Choose Your Plan</h1>
          <p style={Styles.subtitle}>Start free. Upgrade when you need more.</p>
        </header>
        {error && <div style={Styles.errorAlert}>{error}</div>}
        {loading ? (
          <p style={Styles.loadingText}>Loading plans...</p>
        ) : (
          <div style={Styles.planGrid}>
            {plans.map((plan) => {
              const price = formatPrice(plan);
              return (
                <div
                  key={plan.tier}
                  className="card animate-fade-in-up"
                  style={{
                    ...Styles.planCard,
                    ...(plan.tier === "premium" ? Styles.planCardFeatured : {}),
                  }}
                >
                  <h2 style={Styles.planName}>{plan.name}</h2>
                  <div style={Styles.planPrice}>
                    {plan.tier === "free" ? "Free" : price ?? "—"}
                    {plan.tier !== "free" && price && plan.interval && (
                      <span style={Styles.planInterval}> / {plan.interval}</span>
                    )}
                  </div>
                  <ul style={Styles.featureList}>
                    {describeFeatures(plan).map((feature) => (
                      <li key={feature} style={Styles.featureItem}>{feature}</li>
                    ))}
                  </ul>
                  {renderCta(plan)}
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};
