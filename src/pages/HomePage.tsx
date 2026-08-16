import React, { useState } from "react";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { InputField } from "../components/common/InputField";
import { TextArea } from "../components/common/TextArea";
import { Button } from "../components/common/Button";
import { VideoPreview } from "../components/VedioPreview";
import { useComponentStyle } from "../hooks/useComponentStyle";
import { generate } from "../services/homeServices";

export const HomePage: React.FC = () => {
  const Styles = useComponentStyle("homePage");
  const [text, setText] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

const handleGenerate = async () => {
  setLoading(true);

    try {
      const response = await generate(text, image)
      if (!response) throw new Error("Failed to generate video");
      setVideoUrl(response);
    } catch (error) {
      console.error(error);
      alert("Error generating video. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <div style={Styles.card}>
          <h1 style={Styles.title}>Create Your Nostalgic Memory Video</h1>
          <p style={Styles.subtext}>
            Describe your memory and optionally upload an image.  
            We'll turn it into a beautiful nostalgic video.
          </p>
          <div style={Styles.form}>
            <TextArea
              label="Enter your nostalgic memory"
              value={text}
              onChange={(e) => setText(e.target.value)}/>
            <InputField
              type="file"
              label="Upload an optional image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}/>
            <Button
              label={loading ? "Generating..." : "Generate Video"}
              type="button"
              variant="primary"
              disabled={loading || !text.trim()}
              loading={loading}
              onClick={handleGenerate}/>
          </div>
        </div>
        {videoUrl && <VideoPreview src={videoUrl} />}
      </main>
      <Footer />
    </div>
  );
};