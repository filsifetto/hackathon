import { useEffect, useRef } from "react";
import { useSpeech } from "../hooks/useSpeech";

export const ChatInterface = ({ hidden }) => {
  const input = useRef();
  const timeline = useRef();
  const { tts, loading, message, chatMessages } = useSpeech();

  const sendMessage = () => {
    const text = input.current?.value?.trim();
    if (!text || loading || message) {
      return;
    }
    tts(text);
    input.current.value = "";
  };

  useEffect(() => {
    if (!timeline.current) return;
    timeline.current.scrollTop = timeline.current.scrollHeight;
  }, [chatMessages, loading]);

  if (hidden) {
    return null;
  }

  return (
    <div className="chat-card inngang inngang-1">
      <div className="chat-header">
        <h3>Spørsmålslinje</h3>
        <p>
          {loading
            ? "Representanten forbereder svar..."
            : message
            ? "Representanten svarer nå"
            : "Still et spørsmål om partiets politikk"}
        </p>
      </div>

      <div className="chat-log" ref={timeline}>
        {chatMessages.length === 0 ? (
          <p className="chat-empty">Samtalen vises her når du sender et spørsmål.</p>
        ) : (
          chatMessages.map((entry) => (
            <div key={entry.id} className={`chat-bubble ${entry.role === "user" ? "chat-bubble-user" : "chat-bubble-assistant"}`}>
              {entry.text}
            </div>
          ))
        )}
      </div>

      <div className="chat-controls">
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
