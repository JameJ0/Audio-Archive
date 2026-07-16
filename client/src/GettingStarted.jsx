import { useState } from "react";

function GettingStarted() {
  const STORAGE_KEY = "aa_seen_getting_started";

  // Read localStorage during initial render to avoid showing the card
  // briefly before we know whether the user dismissed it.
  const [visible, setVisible] = useState(() => {
    try {
      if (typeof window === "undefined") return false;
      const seen = localStorage.getItem(STORAGE_KEY);
      return seen !== "true";
    } catch (e) {
      return true;
    }
  });

  if (!visible) return null;

  return (
    <div className="getting-started-card">
      <div className="gs-inner">
        <h2>Welcome to AudioArchive</h2>
        <p>Quick start - four simple steps:</p>
        <ol>
          <li>Search for a song using the search bar.</li>
          <li>Preview or click "+ Tag Song" to save it to your Archive.</li>
          <li>Open the Archive to add tags and organize your collection.</li>
          <li>If search doesn't work, please wait around 30 seconds for the initial load.</li>
        </ol>
        <div className="gs-actions">
          <button
            onClick={() => {
              try {
                localStorage.setItem(STORAGE_KEY, "true");
              } catch (e) {}
              setVisible(false);
            }}
          >
            Got it — don't show again
          </button>
          <button
            className="muted"
            onClick={() => {
              setVisible(false);
            }}
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;
