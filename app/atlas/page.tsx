"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LISTINGS, fmtTRY } from "@/lib/data";
import { IconCompass, IconSparkle, IconSend, IconKebab } from "@/components/icons";
import { Photo } from "@/components/photos";
import type { Listing } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
  listingIds?: string[];
  streaming?: boolean;
}

// ─── Suggest chips ────────────────────────────────────────────────────────────

const SUGGESTS = [
  "Kadıköy'de 3+1 daire, bütçem 9M",
  "Cihangir kiralık",
  "Çeşme'de yazlık villa",
  "Levent ofis kira",
  "Bodrum Yalıkavak",
];

// ─── Listing mini-card ────────────────────────────────────────────────────────

const MsgListingCard = ({ id, onClick }: { id: string; onClick: (l: Listing) => void }) => {
  const l = LISTINGS.find((x) => x.id === id);
  if (!l) return null;
  return (
    <div className="msg-listing" onClick={() => onClick(l)} style={{ cursor: "pointer" }}>
      <div className="msg-listing-photo">
        <Photo scene={l.scene} palette={l.palette} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div className="msg-listing-title">{l.title}</div>
        <div className="msg-listing-meta">
          {l.district} · {l.area} m² · {l.rooms}
        </div>
      </div>
      <div className="msg-listing-price">{fmtTRY(l.price)}</div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AtlasPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "İyi günler. Bugün nasıl bir ev arıyoruz?\n\nİsterseniz konuşma dilinde anlatın — bütçe, çocuk var mı, ofisiniz nerede gibi. Filtre kutucuklarını doldurmaktan daha hızlı olacaktır.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOpenListing = (l: Listing) => router.push(`/ilanlar/${l.id}`);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text };
      const history = [...messages, userMsg];
      setMessages(history);
      setInput("");
      setLoading(true);

      // Add placeholder streaming message
      const streamingMsg: Message = { role: "assistant", content: "", streaming: true };
      setMessages([...history, streamingMsg]);

      try {
        const res = await fetch("/api/atlas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({ role: m.role, content: m.content })),
            mode: "search",
          }),
        });

        if (!res.ok || !res.body) throw new Error("API error");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let aiText = "";
        let listingIds: string[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.type === "listings") {
                listingIds = parsed.ids;
              } else if (parsed.type === "text") {
                aiText += parsed.text;
                setMessages((prev) => {
                  const next = [...prev];
                  next[next.length - 1] = { role: "assistant", content: aiText, listingIds, streaming: true };
                  return next;
                });
              }
            } catch {}
          }
        }

        // Finalize
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: aiText, listingIds, streaming: false };
          return next;
        });
      } catch {
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: "Atlas AI şu an kullanılamıyor. Lütfen biraz sonra tekrar deneyin.",
            streaming: false,
          };
          return next;
        });
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="atlas-page">
      {/* Sidebar */}
      <aside className="atlas-side">
        <div className="atlas-side-head">
          <div className="atlas-side-mark">
            <IconCompass />
          </div>
          <div>
            <div className="atlas-side-title">Atlas AI</div>
            <div className="atlas-side-sub">FILTERRA.AI Powered</div>
          </div>
        </div>

        <div className="atlas-side-section">
          <div className="atlas-side-section-label">Bu Hafta</div>
          <div className="atlas-thread" data-active="true">
            Aktif konuşma
            <div className="atlas-thread-time">Şimdi</div>
          </div>
          <div className="atlas-thread">
            Levent ofis kira analizi
            <div className="atlas-thread-time">Dün · 15:08</div>
          </div>
          <div className="atlas-thread">
            Çeşme yazlık değerleme
            <div className="atlas-thread-time">21 Mayıs</div>
          </div>
        </div>

        <div className="atlas-side-section">
          <div className="atlas-side-section-label">Önceki</div>
          <div className="atlas-thread">Galata tarihi apartman riski</div>
          <div className="atlas-thread">Mortgage karşılaştırma</div>
          <div className="atlas-thread">DASK ve yangın sigortası</div>
        </div>

        <div className="atlas-side-section" style={{ marginTop: "auto" }}>
          <button
            className="btn btn-outline btn-sm"
            style={{ width: "100%" }}
            onClick={() => setMessages([{
              role: "assistant",
              content: "Yeni konuşma başladı. Nasıl yardımcı olabilirim?",
            }])}
          >
            + Yeni Konuşma
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="atlas-main">
        <header className="atlas-main-head">
          <div>
            <h2>Atlas AI</h2>
            <div className="atlas-main-status">{loading ? "yazıyor…" : "çevrimiçi"}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <span className="pill pill-line" style={{ height: 24, fontSize: 11 }}>
              <IconSparkle size={12} /> claude-sonnet-4-6
            </span>
            <button className="btn btn-ghost btn-sm">
              <IconKebab size={16} />
            </button>
          </div>
        </header>

        <div className="atlas-chat">
          {messages.map((m, i) => (
            <div key={i} className="msg" data-from={m.role === "user" ? "user" : "ai"}>
              <div className="msg-avatar">{m.role === "assistant" ? <IconCompass /> : "ZA"}</div>
              <div>
                <div className="msg-bubble">
                  {m.content.split("\n").map((line, j) =>
                    line ? <p key={j} style={{ margin: "0 0 6px" }}>{line}</p> : <br key={j} />
                  )}
                  {m.streaming && (
                    <span className="atlas-cursor">▋</span>
                  )}
                  {m.listingIds && m.listingIds.length > 0 && (
                    <div className="msg-listings">
                      {m.listingIds.map((id) => (
                        <MsgListingCard key={id} id={id} onClick={handleOpenListing} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Suggest chips */}
        {messages.length <= 1 && (
          <div className="atlas-suggest">
            <div className="atlas-suggest-row">
              {SUGGESTS.map((s) => (
                <button key={s} className="atlas-suggest-chip" onClick={() => send(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="atlas-input">
          <div className="atlas-input-inner">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Atlas AI&apos;a bir şey sor…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              className="atlas-send"
              aria-label="Gönder"
              onClick={() => send(input)}
              disabled={loading || !input.trim()}
            >
              <IconSend />
            </button>
          </div>
          <div style={{ maxWidth: 820, margin: "10px auto 0", fontSize: 11, color: "var(--muted)", textAlign: "center" }}>
            Atlas AI hata yapabilir. Hukuki konularda her zaman sertifikalı avukat onayı alın.
          </div>
        </div>
      </main>
    </div>
  );
}
