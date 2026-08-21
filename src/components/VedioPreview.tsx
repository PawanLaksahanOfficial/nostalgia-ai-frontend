import React from "react";
import { useComponentStyle } from "../hooks/useComponentStyle";

interface VideoPreviewProps {
  src: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ src }) => {
  const Styles = useComponentStyle("videoPreview");

  return (
    <div style={Styles.wrapper} className="animate-fade-in-up">
      <h3 style={Styles.title}>Generated Video</h3>
      <video style={Styles.video} controls>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};