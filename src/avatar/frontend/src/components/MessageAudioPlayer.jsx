import { useEffect } from "react";
import { useSpeech } from "../hooks/useSpeech";

/**
 * Plays the current message’s audio when the full 3D avatar isn’t mounted
 * (e.g. placeholder is shown because avatar.glb is missing).
 */
export function MessageAudioPlayer() {
  const { message, onMessagePlayed } = useSpeech();

  useEffect(() => {
    if (!message) return;

    if (!message.audio) {
      // If backend returns text-only (e.g. TTS unavailable), still advance queue.
      const delayMs = Math.min(6000, Math.max(1200, (message.text?.length || 0) * 35));
      const timer = setTimeout(onMessagePlayed, delayMs);
      return () => clearTimeout(timer);
    }

    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audio.onended = onMessagePlayed;
    audio.onerror = onMessagePlayed;
    audio.play().catch(() => onMessagePlayed());

    return () => {
      audio.pause();
      audio.onended = null;
      audio.onerror = null;
    };
  }, [message, onMessagePlayed]);

  return null;
}
