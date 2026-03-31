"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const MIN_CHARS = 20;
const MAX_CHARS = 1000;
const features = [
  { emoji: "🌿", text: "Duygunu tanı" },
  { emoji: "🧠", text: "Zihnini dinle" },
  { emoji: "✨", text: "Netliğe ulaş" },
];

function makeId() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

function FeaturePills() {
  return (
    <div className="my-6 flex flex-wrap justify-center gap-3">
      {features.map((f, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-full border border-amber-200 bg-white/60 px-5 py-3 text-sm font-medium text-amber-900 shadow-sm backdrop-blur-sm"
        >
          <span>{f.emoji}</span>
          <span>{f.text}</span>
        </div>
      ))}
    </div>
  );
}

export default function LiloHome() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const trimmedLength = useMemo(() => input.trim().length, [input]);

  const validationMessage = useMemo(() => {
    if (trimmedLength === 0) return null;
    if (trimmedLength < MIN_CHARS) return `Minimum ${MIN_CHARS} karakter gerekir.`;
    if (trimmedLength > MAX_CHARS) return `Maksimum ${MAX_CHARS} karakter aşılır.`;
    return null;
  }, [trimmedLength]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  function reset() {
    abortRef.current?.abort();
    abortRef.current = null;
    setInput("");
    setMessages([]);
    setIsSubmitting(false);
    setHasCompleted(false);
    setFormError(null);
  }

  async function streamAssistantReply(userText: string, assistantId: string) {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/lilo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userText }),
        signal: controller.signal,
      });

      if (!res.ok) {
        let msg = "Şu an yanıt üretemiyorum. Lütfen biraz sonra tekrar dene.";
        try {
          const data = (await res.json()) as { error?: string };
          if (data?.error) msg = data.error;
        } catch {
          // ignore
        }
        setMessages((prev) =>
          prev.map((m) => (m.id === assistantId ? { ...m, content: msg } : m)),
        );
        setIsSubmitting(false);
        setHasCompleted(true);
        return;
      }

      if (!res.body) {
        setFormError("Tarayıcı streaming’i desteklemiyor gibi görünüyor.");
        setIsSubmitting(false);
        setHasCompleted(true);
        return;
      }

      setFormError(null);

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      const appendToAssistant = (chunkText: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: `${m.content ?? ""}${chunkText}` }
              : m,
          ),
        );
      };

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const lines = block.split("\n").map((l) => l.trimEnd());
          const dataLines = lines.filter((l) => l.startsWith("data:"));
          if (dataLines.length === 0) continue;

          const dataText = dataLines
            .map((l) => l.replace(/^data:\s?/, ""))
            .join("\n");

          if (dataText === "__LILO_STREAM_DONE__") {
            setIsSubmitting(false);
            setHasCompleted(true);
            return;
          }

          appendToAssistant(dataText);
        }
      }

      setIsSubmitting(false);
      setHasCompleted(true);
    } catch (err) {
      // Kullanıcı iptal ederse (AbortController) sessizce çıkıyoruz.
      const aborted =
        err instanceof DOMException && err.name === "AbortError";
      if (aborted) return;

      const message = "Şu an yanıt üretemiyorum. Lütfen biraz sonra tekrar dene.";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: message } : m,
        ),
      );
      setIsSubmitting(false);
      setHasCompleted(true);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    const length = trimmedLength;
    if (length === 0) {
      setFormError("Lütfen önce duygu ve kararı yaz.");
      return;
    }
    if (length < MIN_CHARS) {
      setFormError(`Minimum ${MIN_CHARS} karakter gerekir.`);
      return;
    }
    if (length > MAX_CHARS) {
      setFormError(`Maksimum ${MAX_CHARS} karakter aşılır.`);
      return;
    }

    setFormError(null);
    setHasCompleted(false);
    setIsSubmitting(true);

    const userText = input.trim();
    const assistantId = makeId();

    const userMessage: ChatMessage = {
      id: makeId(),
      role: "user",
      content: userText,
    };

    setMessages([
      userMessage,
      {
        id: assistantId,
        role: "assistant",
        content: "",
      },
    ]);

    await streamAssistantReply(userText, assistantId);
  }

  const canSubmit =
    !isSubmitting && trimmedLength >= MIN_CHARS && trimmedLength <= MAX_CHARS;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top,#ffd17d_0%,#ffb449_24%,#ffecd0_54%,#fff7e9_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute right-[-3rem] top-28 h-64 w-64 rounded-full bg-yellow-200/50 blur-3xl" />
        <div className="absolute left-[-1rem] top-24 h-56 w-2 rounded-full bg-emerald-900/20 rotate-[-22deg]" />
        <div className="absolute left-8 top-52 h-28 w-1 rounded-full bg-emerald-900/20 rotate-[45deg]" />
        <div className="absolute left-14 top-46 h-7 w-14 rounded-full bg-emerald-700/20 rotate-[18deg]" />
        <div className="absolute left-4 top-64 h-8 w-16 rounded-full bg-emerald-700/20 -rotate-[22deg]" />
        <div className="absolute right-10 top-22 h-44 w-1 rounded-full bg-emerald-900/15 rotate-[28deg]" />
        <div className="absolute right-18 top-34 h-24 w-1 rounded-full bg-emerald-900/15 -rotate-[42deg]" />
        <div className="absolute right-18 top-32 h-8 w-16 rounded-full bg-emerald-700/20 rotate-[16deg]" />
        <div className="absolute right-2 top-48 h-8 w-16 rounded-full bg-emerald-700/20 -rotate-[18deg]" />
        <div className="absolute bottom-10 left-10 h-40 w-1 rounded-full bg-emerald-900/15 rotate-[20deg]" />
        <div className="absolute bottom-28 left-14 h-8 w-14 rounded-full bg-emerald-700/20 rotate-[32deg]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-4xl flex-col px-4 pb-14 pt-10 sm:px-6">
        <header className="mb-8">
          <div className="rounded-[2rem] border border-amber-100/80 bg-white/45 p-6 shadow-[0_18px_60px_rgba(136,88,20,0.14)] backdrop-blur-md sm:p-8">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-200/80 bg-amber-50/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-amber-900">
              Doğa esintili karar alanı
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-14 w-14 items-center justify-center rounded-[1.4rem] bg-[linear-gradient(135deg,#c47b2a,#f4c255)] text-amber-950 shadow-lg shadow-amber-900/15">
                <span className="text-lg font-semibold">L</span>
              </div>
              <div className="max-w-2xl">
                <p className="text-sm font-medium text-amber-950/80">
                  Karar vermeden önce bir nefes al.
                </p>
                <h1 className="mt-1 text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
                  Lilo
                </h1>
                <p className="mt-3 max-w-xl text-sm leading-6 text-stone-800/75 sm:text-base">
                  Seni duyuyorum. Şimdi birlikte düşünelim.
                </p>
              </div>
            </div>

            <FeaturePills />
          </div>
        </header>

        <section className="rounded-[2rem] border border-amber-100/80 bg-white/68 p-5 shadow-[0_18px_50px_rgba(89,73,24,0.12)] backdrop-blur-md sm:p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="lilo-input"
                className="block text-sm font-medium text-stone-900/85"
              >
                Şu an ne hissediyorsun ve ne yapmak istiyorsun?
              </label>
              <textarea
                id="lilo-input"
                value={input}
                disabled={isSubmitting}
                onChange={(ev) => setInput(ev.target.value)}
                placeholder="İçinden geçeni yaz. Lilo önce duyguyu duyar, sonra düşünceyi düzenler."
                className="min-h-[160px] w-full resize-none rounded-[1.5rem] border border-amber-200/70 bg-white/85 px-5 py-4 text-stone-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] outline-none ring-0 transition placeholder:text-stone-500 focus:border-amber-400 focus:ring-4 focus:ring-amber-200/60 disabled:cursor-not-allowed disabled:opacity-70"
                maxLength={MAX_CHARS + 200}
                aria-invalid={!!formError || !!validationMessage}
              />
            </div>

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-stone-700/70">
                {trimmedLength}/{MAX_CHARS} karakter
              </p>
              <div className="text-xs text-rose-700" aria-live="polite">
                {formError ?? validationMessage ?? ""}
              </div>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="flex h-12 w-full items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#c87823,#f1af3f,#ffd166)] px-5 font-medium text-stone-900 shadow-[0_14px_35px_rgba(164,101,24,0.28)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:bg-slate-300/70 disabled:text-slate-600"
            >
              {isSubmitting ? "Lilo seninle düşünüyor..." : "Lilo'ya Sor"}
            </button>
          </form>
        </section>

        {messages.length > 0 && (
          <section className="mt-6 rounded-[2rem] border border-amber-100/80 bg-white/68 p-4 shadow-[0_18px_50px_rgba(89,73,24,0.12)] backdrop-blur-md sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-stone-900">
                Çözüm Alanı
              </p>
              {hasCompleted && (
                <p className="text-xs text-amber-800">
                  Yanıt hazır.
                </p>
              )}
            </div>

            <div
              className="space-y-3"
              aria-live="polite"
              aria-busy={isSubmitting}
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={
                      m.role === "user"
                        ? "max-w-[85%] whitespace-pre-wrap rounded-[1.6rem] rounded-tr-md bg-[linear-gradient(135deg,#d4892b,#ffd76d)] px-4 py-3 text-sm leading-6 text-stone-900 shadow-sm"
                        : "max-w-[85%] whitespace-pre-wrap rounded-[1.6rem] rounded-tl-md border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm leading-6 text-stone-900"
                    }
                  >
                    {m.content || (m.role === "assistant" ? "" : null)}
                  </div>
                </div>
              ))}
            </div>

            {hasCompleted && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-[1rem] border border-amber-300/40 bg-white/80 px-4 py-2 text-sm font-medium text-stone-900 shadow-sm transition hover:bg-amber-50"
                >
                  Yeniden Başla
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

