"use client";

import { useEffect, useMemo, useState } from "react";
import { Activity, Bot, CircleStop, Loader2, Mic, RefreshCw, Send, ShieldCheck, Sparkles, Unplug } from "lucide-react";
import { ConvaiWidget, useConvaiClient } from "@convai/web-sdk/react";
import type { ChatMessage, ConvaiClientState } from "@convai/web-sdk";

const apiKey = process.env.NEXT_PUBLIC_CONVAI_API_KEY || "";
const characterId = process.env.NEXT_PUBLIC_CONVAI_CHARACTER_ID || "";

const starterPrompts = [
  "Say hello and introduce yourself as a Apothecary wellness companion.",
  "Guide me through a 30 second grounding exercise.",
  "Ask me one gentle check-in question about my mood today.",
  "Explain how you can support a patient between Consultations.",
];

function getOrCreateEndUserId() {
  if (typeof window === "undefined") return "Apothecary-web-test";

  const storageKey = "ApothecaryConvaiTestUserId";
  const saved = window.localStorage.getItem(storageKey);
  if (saved) return saved;

  const nextId = `Apothecary-test-${crypto.randomUUID()}`;
  window.localStorage.setItem(storageKey, nextId);
  return nextId;
}

function formatState(state: ConvaiClientState) {
  if (state.isConnecting) return "Connecting";
  if (!state.isConnected) return "Disconnected";
  if (state.isSpeaking) return "Speaking";
  if (state.isThinking) return "Thinking";
  if (state.isListening) return "Listening";
  return "Connected";
}

function messageText(message: ChatMessage) {
  return message.content || "";
}

function messageSender(message: ChatMessage) {
  return message.type.includes("user") ? "You" : "Character";
}

export default function ConvaiPlaytest() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [events, setEvents] = useState<string[]>([]);

  const config = useMemo(
    () => ({
      apiKey,
      characterId,
      endUserId: getOrCreateEndUserId(),
      endUserMetadata: {
        app: "Apothecary",
        mode: "avatar_playtest",
      },
      enableVideo: true,
      startWithVideoOn: false,
      startWithAudioOn: false,
      ttsEnabled: true,
      enableEmotion: true,
      enableLipsync: true,
      blendshapeConfig: {
        format: "arkit" as const,
      },
    }),
    [],
  );

  const convaiClient = useConvaiClient(config);
  const state = convaiClient.state;
  const isReady = state.isConnected && convaiClient.isBotReady;
  const hasCredentials = Boolean(apiKey && characterId);

  useEffect(() => {
    const unsubscribeError = convaiClient.on("error", (nextError) => {
      const message = nextError instanceof Error ? nextError.message : String(nextError);
      setError(message);
      setEvents((current) => [`Error: ${message}`, ...current].slice(0, 8));
    });

    const unsubscribeState = convaiClient.on("stateChange", (nextState: ConvaiClientState) => {
      setEvents((current) => [`State: ${formatState(nextState)}`, ...current].slice(0, 8));
    });

    const unsubscribeMessage = convaiClient.on("message", (message: ChatMessage) => {
      setEvents((current) => [`Message: ${messageSender(message)}`, ...current].slice(0, 8));
    });

    return () => {
      unsubscribeError();
      unsubscribeState();
      unsubscribeMessage();
      void convaiClient.disconnect().catch(() => undefined);
    };
  }, [convaiClient]);

  const connect = async () => {
    setError("");
    try {
      await convaiClient.connect();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Unable to connect to Convai.";
      setError(message);
    }
  };

  const disconnect = async () => {
    setError("");
    try {
      await convaiClient.disconnect();
    } catch (nextError) {
      const message = nextError instanceof Error ? nextError.message : "Unable to disconnect.";
      setError(message);
    }
  };

  const resetSession = () => {
    setError("");
    convaiClient.resetSession();
    setEvents((current) => ["Session reset", ...current].slice(0, 8));
  };

  const sendMessage = (text = input) => {
    const trimmed = text.trim();
    if (!trimmed || !isReady) return;

    setError("");
    convaiClient.sendUserTextMessage(trimmed);
    setInput("");
  };

  const interrupt = () => {
    convaiClient.sendInterruptMessage();
    setEvents((current) => ["Interrupted character response", ...current].slice(0, 8));
  };

  const currentEmotion = state.emotion?.emotion || "Neutral";

  return (
    <main className="min-h-screen bg-[#f7f4ef] text-[#24180f]">
      <section className="relative overflow-hidden border-b border-[#eadfd4] bg-[#231711] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,126,60,0.28),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.12),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="flex flex-col justify-center">
            <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white/85">
              <Sparkles size={16} />
              Convai avatar play-test
            </div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal md:text-5xl">
              Apothecary interactive companion lab
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-white/72">
              Test voice, text, emotion, video, and session behavior with the configured Convai character before deciding how it should appear in the patient app.
            </p>
          </div>

          <div className="rounded-lg border border-white/12 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-white/60">Character ID</p>
                <p className="mt-1 break-all font-mono text-sm text-white">{characterId || "Missing"}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-sm font-medium ${state.isConnected ? "bg-emerald-400/20 text-emerald-100" : "bg-white/12 text-white/70"}`}>
                {formatState(state)}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-md border border-white/10 bg-black/16 p-4">
                <p className="text-xs uppercase text-white/50">Bot Ready</p>
                <p className="mt-2 text-2xl font-semibold">{convaiClient.isBotReady ? "Yes" : "No"}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/16 p-4">
                <p className="text-xs uppercase text-white/50">Emotion</p>
                <p className="mt-2 truncate text-2xl font-semibold capitalize">{currentEmotion}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/16 p-4">
                <p className="text-xs uppercase text-white/50">Mode</p>
                <p className="mt-2 text-2xl font-semibold capitalize">{convaiClient.connectionType || "Audio"}</p>
              </div>
              <div className="rounded-md border border-white/10 bg-black/16 p-4">
                <p className="text-xs uppercase text-white/50">Messages</p>
                <p className="mt-2 text-2xl font-semibold">{convaiClient.chatMessages.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[380px_1fr] lg:px-8">
        <aside className="space-y-4">
          <div className="rounded-lg border border-[#e3d7cb] bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Bot size={20} />
              Session Controls
            </h2>

            {!hasCredentials ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Convai credentials are missing. Add `NEXT_PUBLIC_CONVAI_API_KEY` and `NEXT_PUBLIC_CONVAI_CHARACTER_ID`.
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={connect}
                disabled={!hasCredentials || state.isConnecting || state.isConnected}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#e67e3c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d16b2a] disabled:cursor-not-allowed disabled:bg-[#d9d2ca]"
              >
                {state.isConnecting ? <Loader2 className="animate-spin" size={17} /> : <Mic size={17} />}
                Connect
              </button>
              <button
                type="button"
                onClick={disconnect}
                disabled={!state.isConnected}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d5c8bb] bg-white px-4 py-3 text-sm font-semibold text-[#3a2a20] transition hover:bg-[#fbf7f1] disabled:cursor-not-allowed disabled:text-[#a4998f]"
              >
                <Unplug size={17} />
                Disconnect
              </button>
              <button
                type="button"
                onClick={interrupt}
                disabled={!state.isConnected}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d5c8bb] bg-white px-4 py-3 text-sm font-semibold text-[#3a2a20] transition hover:bg-[#fbf7f1] disabled:cursor-not-allowed disabled:text-[#a4998f]"
              >
                <CircleStop size={17} />
                Interrupt
              </button>
              <button
                type="button"
                onClick={resetSession}
                disabled={!state.isConnected}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#d5c8bb] bg-white px-4 py-3 text-sm font-semibold text-[#3a2a20] transition hover:bg-[#fbf7f1] disabled:cursor-not-allowed disabled:text-[#a4998f]"
              >
                <RefreshCw size={17} />
                Reset
              </button>
            </div>

            <div className="mt-5 rounded-md border border-[#f0dfc8] bg-[#fff8ed] p-4 text-sm leading-6 text-[#67442b]">
              <div className="mb-1 flex items-center gap-2 font-semibold text-[#49301f]">
                <ShieldCheck size={16} />
                Play-test note
              </div>
              Use neutral sample prompts. Avoid real patient data until privacy, retention, and vendor terms are approved.
            </div>
          </div>

          <div className="rounded-lg border border-[#e3d7cb] bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Activity size={20} />
              Live Events
            </h2>
            <div className="mt-4 space-y-2">
              {events.length ? (
                events.map((event, index) => (
                  <div key={`${event}-${index}`} className="rounded-md bg-[#f8f2eb] px-3 py-2 text-sm text-[#5f4b3d]">
                    {event}
                  </div>
                ))
              ) : (
                <p className="rounded-md bg-[#f8f2eb] px-3 py-2 text-sm text-[#7b6a5c]">
                  Connect to start seeing state and message events.
                </p>
              )}
            </div>
          </div>
        </aside>

        <div className="space-y-4">
          <div className="rounded-lg border border-[#e3d7cb] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Message Test</h2>
                <p className="mt-1 text-sm text-[#76675b]">
                  Connect first, then send text prompts or open the floating Convai widget for voice/video.
                </p>
              </div>
              <span className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${isReady ? "bg-emerald-100 text-emerald-700" : "bg-[#f3ede6] text-[#7b6a5c]"}`}>
                {isReady ? "Ready to chat" : "Waiting for bot"}
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => sendMessage(prompt)}
                  disabled={!isReady}
                  className="min-h-20 rounded-md border border-[#e4d7c9] bg-[#fbf8f5] p-4 text-left text-sm leading-6 text-[#3a2a20] transition hover:border-[#e67e3c] hover:bg-white disabled:cursor-not-allowed disabled:text-[#a99b8f]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form
              className="mt-5 flex gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Type a message to the Convai character..."
                className="min-h-12 flex-1 rounded-md border border-[#d5c8bb] bg-white px-4 text-sm outline-none transition focus:border-[#e67e3c] focus:ring-2 focus:ring-[#e67e3c]/20"
              />
              <button
                type="submit"
                disabled={!isReady || !input.trim()}
                className="inline-flex min-w-28 items-center justify-center gap-2 rounded-md bg-[#e67e3c] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#d16b2a] disabled:cursor-not-allowed disabled:bg-[#d9d2ca]"
              >
                <Send size={17} />
                Send
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-[#e3d7cb] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Transcript</h2>
            <div className="mt-4 max-h-[460px] min-h-[300px] space-y-3 overflow-y-auto rounded-md border border-[#eadfd4] bg-[#fcfaf7] p-4">
              {convaiClient.chatMessages.length ? (
                convaiClient.chatMessages.map((message, index) => {
                  const isUser = messageSender(message) === "You";
                  return (
                    <div key={`${message.id || index}`} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[78%] rounded-lg px-4 py-3 text-sm leading-6 ${isUser ? "bg-[#e67e3c] text-white" : "bg-white text-[#3a2a20] shadow-sm ring-1 ring-[#eadfd4]"}`}>
                        <p className={`mb-1 text-xs font-semibold ${isUser ? "text-white/80" : "text-[#907b68]"}`}>{messageSender(message)}</p>
                        <p className="whitespace-pre-wrap">{messageText(message)}</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex h-[260px] items-center justify-center text-center text-sm leading-6 text-[#7c6f63]">
                  No messages yet. Try a starter prompt after the character connects.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {hasCredentials ? (
        <ConvaiWidget convaiClient={convaiClient} showVideo showScreenShare defaultVoiceMode={false} />
      ) : null}
    </main>
  );
}
