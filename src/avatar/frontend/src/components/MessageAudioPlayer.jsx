import { useEffect } from "react";
import { useSpeech } from "../hooks/useSpeech";

/**
 * Plays the current message’s audio when the full 3D avatar isn’t mounted
 * (e.g. placeholder is shown because avatar.glb is missing).
 */
export function MessageAudioPlayer() {
  const { message, onMessagePlayed } = useSpeech();

  useEffect(() => {
    if (!message?.audio) return;
    const audio = new Audio("data:audio/mp3;base64," + message.audio);
    audio.play();
    audio.onended = onMessagePlayed;
    return () => audio.pause();
  }, [message]);

  return null;
}
