import { createContext, useContext, useEffect, useState } from "react";

const configuredUrls = [
  ...(import.meta.env.VITE_AVATAR_BACKEND_URLS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  import.meta.env.VITE_AVATAR_BACKEND_URL || "",
  "http://localhost:3200",
  "http://localhost:3100",
  "http://localhost:3000",
].filter(Boolean);

const backendUrls = Array.from(new Set(configuredUrls));

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function postWithFallback(path, body) {
  let lastError = null;

  for (const baseUrl of backendUrls) {
    const endpoint = `${baseUrl}${path}`;
    try {
      const response = await fetchWithTimeout(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let detail = "";
        try {
          const err = await response.json();
          detail = err?.detail || err?.error || "";
        } catch {
          // Ignore JSON parsing errors.
        }
        throw new Error(detail || `Backend returned ${response.status} on ${baseUrl}`);
      }
      return await response.json();
    } catch (error) {
      lastError = error;
      // Try next backend URL.
    }
  }

  throw lastError || new Error("No available backend URL");
}

const SpeechContext = createContext();

export const SpeechProvider = ({ children }) => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  let chunks = [];

  const initiateRecording = () => {
    chunks = [];
  };

  const onDataAvailable = (e) => {
    chunks.push(e.data);
  };

  const sendAudioData = async (audioBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async function () {
      const base64Audio = reader.result.split(",")[1];
      setLoading(true);
      try {
        const payload = await postWithFallback("/sts", { audio: base64Audio });
        const response = payload?.messages || [];
        setMessages((messages) => [...messages, ...response]);
        setChatMessages((current) => [
          ...current,
          ...response
            .filter((item) => item?.text)
            .map((item, idx) => ({
              id: `assistant-voice-${Date.now()}-${idx}`,
              role: "assistant",
              text: item.text,
            })),
        ]);
      } catch (error) {
        console.error(error);
        setChatMessages((current) => [
          ...current,
          {
            id: `assistant-error-${Date.now()}`,
            role: "assistant",
            text: "Beklager, jeg fikk ikke behandlet lydmeldingen nå.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const newMediaRecorder = new MediaRecorder(stream);
          newMediaRecorder.onstart = initiateRecording;
          newMediaRecorder.ondataavailable = onDataAvailable;
          newMediaRecorder.onstop = async () => {
            const audioBlob = new Blob(chunks, { type: "audio/webm" });
            try {
              await sendAudioData(audioBlob);
            } catch (error) {
              console.error(error);
              alert(error.message);
            }
          };
          setMediaRecorder(newMediaRecorder);
        })
        .catch((err) => console.error("Error accessing microphone:", err));
    }
  }, []);

  const startRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const tts = async (message) => {
    const text = message?.trim();
    if (!text) {
      return;
    }

    setChatMessages((current) => [
      ...current,
      {
        id: `user-${Date.now()}`,
        role: "user",
        text,
      },
    ]);

    setLoading(true);
    try {
      const payload = await postWithFallback("/chat", { message: text });
      const response = payload?.messages || [];
      setMessages((messages) => [...messages, ...response]);
      setChatMessages((current) => [
        ...current,
        ...response
          .filter((item) => item?.text)
          .map((item, idx) => ({
            id: `assistant-${Date.now()}-${idx}`,
            role: "assistant",
            text: item.text,
          })),
      ]);
    } catch (error) {
      console.error(error);
      setChatMessages((current) => [
        ...current,
        {
          id: `assistant-error-${Date.now()}`,
          role: "assistant",
          text: `Beklager, jeg klarte ikke å svare akkurat nå. (${error?.message || "ukjent feil"})`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onMessagePlayed = () => {
    setMessages((messages) => messages.slice(1));
  };

  useEffect(() => {
    if (messages.length > 0) {
      setMessage(messages[0]);
    } else {
      setMessage(null);
    }
  }, [messages]);

  return (
    <SpeechContext.Provider
      value={{
        startRecording,
        stopRecording,
        recording,
        tts,
        message,
        onMessagePlayed,
        loading,
        chatMessages,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
};

export const useSpeech = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeech must be used within a SpeechProvider");
  }
  return context;
};
