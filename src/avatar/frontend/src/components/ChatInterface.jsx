import { useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";

export const ChatInterface = ({ hidden }) => {
  const input = useRef();
  const { tts, loading, message, startRecording, stopRecording, recording } = useSpeech();

  const sendMessage = () => {
    const text = input.current?.value?.trim();
    if (!text || loading || message) {
      return;
    }
    tts(text);
    input.current.value = "";
  };

  if (hidden) {
    return null;
  }

  return (
    <div className="chat-card inngang inngang-1">
      <div className="chat-header">
        <h3>Sporsmalslinje</h3>
        <p>
          {recording
            ? "Tar opp lyd..."
            : loading
            ? "Representanten forbereder svar..."
            : message
            ? "Representanten svarer na"
            : "Still et sporsmal om partiets politikk"}
        </p>
      </div>

      <div className="chat-controls">
        <button
          onClick={recording ? stopRecording : startRecording}
          disabled={loading || !!message}
          className={`mic-button ${recording ? "is-recording" : ""}`}
          aria-label={recording ? "Stopp opptak" : "Start opptak"}
        >
          {recording ? "Stopp" : "Mikrofon"}
        </button>

        <input
          className="chat-input"
          placeholder="Eksempel: Hvordan vil dere styrke skolen?"
          ref={input}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
        />

        <button disabled={loading || !!message} onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
    </div>
  );
};
