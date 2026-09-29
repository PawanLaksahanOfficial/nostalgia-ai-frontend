import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { useComponentStyle } from "../hooks/useComponentStyle";

const LAST_UPDATED = "29 September 2026";
const SUPPORT_EMAIL = String(import.meta.env.VITE_SUPPORT_EMAIL ?? "").trim();

export const PrivacyPage: React.FC = () => {
  const Styles = useComponentStyle("legalPage");

  useEffect(() => {
    document.title = "Privacy Policy · Nostalgia AI";
    return () => {
      document.title = "Nostalgia AI";
    };
  }, []);

  const contact = SUPPORT_EMAIL ? (
    <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
  ) : (
    "the support email address shown when you sign in with Google"
  );

  return (
    <div style={Styles.wrapper}>
      <Header />
      <main style={Styles.content}>
        <article style={Styles.card} className="card animate-fade-in-up">
          <h1 style={Styles.title}>Privacy Policy</h1>
          <p style={Styles.updated}>Last updated: {LAST_UPDATED}</p>

          <p style={Styles.paragraph}>
            Nostalgia AI turns memories you write into short narrated videos. This page explains what
            information the app collects, how it is used, who else processes it, and the choices you have.
          </p>

          <h2 style={Styles.heading}>Information we collect</h2>
          <ul style={Styles.list}>
            <li>
              <strong style={Styles.strong}>Account details:</strong> your first name, last name and email
              address. If you create a password, we store only a one-way hash of it, never the password itself.
            </li>
            <li>
              <strong style={Styles.strong}>Google or Facebook sign-in:</strong> if you choose to sign in this
              way, we receive your name and email address from that account. We use them only to create and
              sign in to your Nostalgia AI account.
            </li>
            <li>
              <strong style={Styles.strong}>Profile photo:</strong> only if you upload one.
            </li>
            <li>
              <strong style={Styles.strong}>Your memories:</strong> the title, story text, music mood and any
              image you add, plus what we create from them: narration text, voice audio, captions, the video
              and its thumbnail.
            </li>
            <li>
              <strong style={Styles.strong}>Usage and plan:</strong> your plan, how many videos you have made
              this month, when you last signed in, and how many times your shared links were viewed.
            </li>
            <li>
              <strong style={Styles.strong}>Payments:</strong> if you upgrade, Stripe handles your card
              details. We store only the customer and subscription references Stripe gives us.
            </li>
            <li>
              <strong style={Styles.strong}>Stored in your browser:</strong> a sign-in token and your light or
              dark theme choice, kept in local storage. We do not use advertising or tracking cookies.
            </li>
          </ul>

          <h2 style={Styles.heading}>How we use it</h2>
          <ul style={Styles.list}>
            <li>To create your account and keep you signed in.</li>
            <li>To generate, store and play back your videos, and to show them in My Videos.</li>
            <li>To apply your plan's monthly limits and, if you upgrade, manage your subscription.</li>
            <li>To send password reset emails you request.</li>
            <li>To keep the service secure, for example by limiting repeated requests from one address.</li>
          </ul>
          <p style={Styles.paragraph}>
            We do not sell your information and do not use it for advertising.
          </p>

          <h2 style={Styles.heading}>Services that process data for us</h2>
          <ul style={Styles.list}>
            <li><strong style={Styles.strong}>Vercel</strong> hosts this website.</li>
            <li><strong style={Styles.strong}>Render</strong> hosts the application server.</li>
            <li><strong style={Styles.strong}>Supabase</strong> hosts the database and stores uploaded images and videos.</li>
            <li>
              <strong style={Styles.strong}>OpenRouter</strong> and the AI model providers it routes to receive
              your story text to write the narration.
            </li>
            <li>
              <strong style={Styles.strong}>Microsoft</strong> text-to-speech receives the narration text to
              produce the voice-over.
            </li>
            <li><strong style={Styles.strong}>Google</strong> and <strong style={Styles.strong}>Meta</strong> handle sign-in, only if you choose them.</li>
            <li><strong style={Styles.strong}>Stripe</strong> processes payments, only if you upgrade.</li>
            <li><strong style={Styles.strong}>Amazon Web Services</strong> delivers password reset emails.</li>
          </ul>
          <p style={Styles.paragraph}>
            Some free AI models may keep the text they receive under their providers' own terms, so please
            avoid putting highly sensitive details, such as health or financial information, in your stories.
          </p>

          <h2 style={Styles.heading}>Sharing your videos</h2>
          <p style={Styles.paragraph}>
            Your videos are private by default. If you create a share link, anyone with that link can watch
            the video and see its title, narration text and your first name. You can revoke a link at any
            time from My Videos, and links can be set to expire.
          </p>

          <h2 style={Styles.heading}>Keeping and deleting your data</h2>
          <p style={Styles.paragraph}>
            We keep your information while your account is active. You can delete any video from My Videos,
            which also removes its files, and you can remove your profile photo at any time from your profile.
            To delete your account and its data, email us at {contact}.
          </p>

          <h2 style={Styles.heading}>Security</h2>
          <p style={Styles.paragraph}>
            All traffic uses HTTPS, passwords are stored only as hashes, and your videos can be viewed only by
            you unless you share them. No online service is perfectly secure, but we work to protect your data.
          </p>

          <h2 style={Styles.heading}>Children</h2>
          <p style={Styles.paragraph}>
            Nostalgia AI is not intended for children under 13, and we do not knowingly collect their information.
          </p>

          <h2 style={Styles.heading}>Changes to this policy</h2>
          <p style={Styles.paragraph}>
            If this policy changes, we will update this page and the date at the top.
          </p>

          <h2 style={Styles.heading}>Contact</h2>
          <p style={Styles.paragraph}>
            Questions or requests about your data: {contact}.
          </p>

          <p style={Styles.paragraph}>
            <Link to="/">Back to Nostalgia AI</Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
};
