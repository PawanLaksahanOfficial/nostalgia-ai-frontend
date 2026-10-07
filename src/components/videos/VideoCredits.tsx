import React from "react";
import { useComponentStyle } from "../../hooks/useComponentStyle";
import type { NarrationSource } from "../../services/videoServices";

interface Props {
  narrationSource?: NarrationSource | null;
  stockPhotoCredit?: string | null;
}

const PIXABAY = { name: "Pixabay", url: "https://pixabay.com" };
const PEXELS = { name: "Pexels", url: "https://www.pexels.com" };

// Credits are stored as "<photographers> on <site>"; older ones hold only Pexels photographers' names.
const splitCredit = (credit: string) => {
  const site = [PIXABAY, PEXELS].find((candidate) => credit.endsWith(` on ${candidate.name}`));
  return site
    ? { names: credit.slice(0, -` on ${site.name}`.length), site }
    : { names: credit, site: PEXELS };
};

export const VideoCredits: React.FC<Props> = ({ narrationSource, stockPhotoCredit }) => {
  const Styles = useComponentStyle("videoCredits");
  const fellBack = narrationSource === "Original";
  if (!fellBack && !stockPhotoCredit) {
    return null;
  }
  const photoCredit = stockPhotoCredit ? splitCredit(stockPhotoCredit) : null;

  return (
    <div style={Styles.wrapper}>
      {fellBack && (
        <p style={Styles.notice}>
          Narrated from your original text because the AI writer was busy.
        </p>
      )}
      {photoCredit && (
        <p style={Styles.credit}>
          Photos by {photoCredit.names} on{" "}
          <a href={photoCredit.site.url} target="_blank" rel="noopener noreferrer" style={Styles.link}>
            {photoCredit.site.name}
          </a>
        </p>
      )}
    </div>
  );
};
