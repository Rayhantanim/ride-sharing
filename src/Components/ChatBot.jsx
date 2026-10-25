import React, { useState, useRef, useEffect } from "react";

/* ─────────────── Icons ─────────────── */
const ChatBubbleIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

const ExpandIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3H5a2 2 0 0 0-2 2v3" />
    <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
    <path d="M3 16v3a2 2 0 0 0 2 2h3" />
    <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
  </svg>
);

const ShrinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 3v3a2 2 0 0 1-2 2H3" />
    <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
    <path d="M3 16h3a2 2 0 0 1 2 2v3" />
    <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

/* ─────────────── Helpers ─────────────── */
const API_BASE = "http://localhost:5000";

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
};

/* ─────────────── Main Component ─────────────── */
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const endRef = useRef(null);

  const userId = getUserId();

  // Load history when chat first opened
  useEffect(() => {
    if (!isOpen || historyLoaded || !userId) return;

    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/chat/history?userId=${userId}`);
        const data = await res.json();
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch (err) {
        console.error("Failed to load history:", err);
      } finally {
        setHistoryLoaded(true);
      }
    })();
  }, [isOpen, historyLoaded, userId]);

  // Auto scroll
  useEffect(() => {
    if (isOpen) endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // Escape to exit fullscreen
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isFullscreen]);

  // Body scroll lock in fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isFullscreen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    if (!userId) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "অনুগ্রহ করে আগে login করুন।" },
      ]);
      return;
    }

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const sentText = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, message: sentText }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error(data.error || "No message");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "দুঃখিত, এখন উত্তর দিতে পারছি না। আবার চেষ্টা করুন।" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = async () => {
    if (!userId) return;
    if (!window.confirm("সব chat history মুছে ফেলতে চান?")) return;

    try {
      await fetch(`${API_BASE}/api/chat/history?userId=${userId}`, {
        method: "DELETE",
      });
      setMessages([]);
    } catch (err) {
      console.error("Clear failed:", err);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsFullscreen(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI chat"
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-[#8EB800] hover:bg-[#7AA300] text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        >
          <ChatBubbleIcon />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={
            isFullscreen
              ? "fixed inset-0 z-[9999] bg-white flex flex-col"
              : "fixed bottom-24 right-6 z-50 w-[340px] h-[480px] bg-white rounded-2xl border border-[#E5E7EB] shadow-[0_10px_40px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden"
          }
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#8EB800] text-white">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center text-sm font-bold">
                zy
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">zyGo Assistant</p>
                <p className="text-[11px] opacity-90 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                  AI · Online
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Clear history */}
              {messages.length > 0 && (
                <button
                  onClick={clearHistory}
                  aria-label="Clear chat history"
                  title="Clear history"
                  className="p-1.5 rounded hover:bg-white/20 transition"
                >
                  <TrashIcon />
                </button>
              )}

              {/* Fullscreen toggle */}
              <button
                onClick={() => setIsFullscreen((v) => !v)}
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                className="p-1.5 rounded hover:bg-white/20 transition"
              >
                {isFullscreen ? <ShrinkIcon /> : <ExpandIcon />}
              </button>

              {/* Close */}
              <button
                onClick={closeChat}
                aria-label="Close chat"
                className="p-1.5 rounded hover:bg-white/20 transition"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            className={`flex-1 overflow-y-auto px-3 py-3 space-y-2 bg-[#F9FAFB] ${
              isFullscreen ? "px-6 py-4" : ""
            }`}
          >
            <div className={isFullscreen ? "max-w-3xl mx-auto w-full space-y-2" : ""}>
              {messages.length === 0 && (
                <div className="text-center mt-8 px-4">
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">
                    👋 হ্যালো! আমি <b>zyGo Assistant</b>।<br />
                    রাইড, সেফটি বা পেমেন্ট নিয়ে যেকোনো প্রশ্ন করতে পারো।
                  </p>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-[13px] whitespace-pre-wrap break-words ${
                      m.role === "user"
                        ? "bg-[#8EB800] text-white rounded-br-sm"
                        : "bg-white text-[#1D1D1D] border border-[#E5E7EB] rounded-bl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E5E7EB] px-3 py-2 rounded-xl text-[13px] text-[#6B7280] flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:120ms]">●</span>
                    <span className="animate-bounce [animation-delay:240ms]">●</span>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>

          {/* Input */}
          <div className={`p-2 border-t border-[#E5E7EB] bg-white ${isFullscreen ? "px-6 py-3" : ""}`}>
            <div className={`flex gap-2 ${isFullscreen ? "max-w-3xl mx-auto" : ""}`}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type a message…"
                className="flex-1 border border-[#D6D9DE] rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#8EB800] focus:ring-2 focus:ring-[#E8F5C8]"
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="bg-[#8EB800] hover:bg-[#7AA300] text-white px-3 rounded-lg disabled:opacity-50 flex items-center justify-center"
              >
                <SendIcon />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;