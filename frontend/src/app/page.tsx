"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydrated } from "@/store/useAuthHydrated";

export default function Home() {
  const router = useRouter();
  const { user } = useAuthStore();
  const hydrated = useAuthHydrated();

  useEffect(() => {
    if (hydrated && user) router.replace("/app/main");
  }, [hydrated, router, user]);

  if (!hydrated || user) {
    return (
      <main className="workspace">
        <div className="empty-state">Loading your auction desk...</div>
      </main>
    );
  }

  return (
    <main className="landing-page min-h-screen">
      <section className="landing-hero">
        <div className="landing-copy">
          <div className="landing-kicker">A BETTER WAY TO SELL</div>

          <h1>
            Make every bid <span>count.</span>
          </h1>

          <p>
            Bring your inventory to the auction floor. Host a live room, follow
            every bid, and close the sale with confidence.
          </p>

          <div className="landing-actions">
            <Link className="button button-primary" href="/auth">
              Open your desk <span aria-hidden="true">→</span>
            </Link>

            <Link className="landing-secondary" href="/auth">
              Already have an account? Sign in
            </Link>
          </div>
        </div>

        <div
          className="landing-visual"
          aria-label="Illustration of a live auction bid rising"
        >
          <div className="visual-grid" />
          <span className="visual-label">LOT 024 · LIVE ROOM</span>

          <div className="visual-price">
            <span>Leading bid</span>
            <strong>$1,280</strong>
          </div>

          <div className="visual-curve" />

          <span className="visual-live">
            <i /> BIDDING LIVE
          </span>
        </div>
      </section>

      <section className="landing-socials">
        <span className="landing-socials-label">CONNECT WITH ME</span>

        <div className="landing-socials-links">
          <a
            href="https://github.com/shivendra-dev54"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <a
            href="http://linkedin.com/in/shivendra-devadhe-97017a327/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>

          <a
            href="https://x.com/shivendraYellow"
            target="_blank"
            rel="noopener noreferrer"
          >
            X
          </a>

          <a
            href="https://leetcode.com/u/shivendra_devadhe"
            target="_blank"
            rel="noopener noreferrer"
          >
            LeetCode
          </a>
        </div>
      </section>

      <footer className="landing-footer">
        <span>LOTLINE · THE AUCTION DESK</span>
        <span>Inventory in. Highest bid wins.</span>
      </footer>
    </main>
  );
}