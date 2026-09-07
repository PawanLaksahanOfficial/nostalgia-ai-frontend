import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { TextArea } from "../components/common/TextArea";
import { Button } from "../components/common/Button";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { useToast } from "../hooks/useToast";
import { generate } from "../services/homeServices";
import type { RootState } from "../redux/store";

const MAX_MEMORY_LENGTH = 2000;

export const HomePage: React.FC = () => {
  const Styles = useComponentStyle("homePage");
  const toast = useToast();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [text, setText] = useState("");
  const [narrative, setNarrative] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const isOverLimit = text.length > MAX_MEMORY_LENGTH;
  const handleGenerate = async () => {
    if (!isAuthenticated) {
      navigate("/signIn");
      return;
    }

    setLoading(true);
    setNarrative(null);
    try {
      setNarrative(await generate(text));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error generating your memory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <div style={Styles.card} className="card animate-fade-in-up">
          <h1 style={Styles.title}>Create Your Nostalgic Memory</h1>
          <p style={Styles.subtext}>
            Describe a memory and we'll retell it as a nostalgic story.
          </p>
          <div style={Styles.form}>
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
            <Button
              label={loading ? "Generating..." : "Generate Memory"}
              type="button"
              variant="primary"
              disabled={loading || !text.trim() || isOverLimit}
              loading={loading}
              onClick={handleGenerate} />
          </div>
        </div>

        {narrative && (
          <div style={Styles.result} className="card animate-fade-in-up">
            <h2 style={Styles.resultTitle}>Your nostalgic story</h2>
            <p style={Styles.resultText}>{narrative}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};