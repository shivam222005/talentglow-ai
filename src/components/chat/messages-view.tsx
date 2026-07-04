import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker, { EmojiStyle, Theme } from "emoji-picker-react";
import { toast } from "sonner";
import {
  Search, Paperclip, Send, Smile, MoreVertical, Trash2, ShieldAlert, Ban,
  ArrowLeft, Circle, CheckCheck, Check, FileText, Bell, X, Plus,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  listConversations, listMessages, sendMessage, markConversationRead, softDeleteMessage,
  setTyping, clearTyping, blockUser, unblockUser, isBlocked, reportUser,
  uploadAttachment, ensureOwnProfile, getOrCreateConversation,
  type ConversationWithPeer, type Message, type Profile,
} from "@/lib/chat/api";

const PRESENCE_CHANNEL = "devscan:presence";

export function MessagesView({ role }: { role: "student" | "recruiter" }) {
  const { user, loading: userLoading } = useCurrentUser();
  const [conversations, setConversations] = useState<ConversationWithPeer[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [draft, setDraft] = useState("");
  const [peerTyping, setPeerTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const active = useMemo(() => conversations.find((c) => c.id === activeId) ?? null, [conversations, activeId]);

  // Ensure this user has a profile row (for peer display) and detect notif support.
  useEffect(() => {
    if (!user) return;
    ensureOwnProfile(user.id, {
      email: user.email ?? undefined,
      full_name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || user.email?.split("@")[0],
      role,
    }).catch(() => {});
    setNotifPerm(typeof Notification !== "undefined" ? Notification.permission : "unsupported");
  }, [user, role]);

  // Load conversations & subscribe to conversation-level realtime.
  const refreshConversations = useCallback(async () => {
    if (!user) return;
    try {
      const list = await listConversations(user.id);
      setConversations(list);
    } catch (e: unknown) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => { refreshConversations(); }, [refreshConversations]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`user-messages:${user.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as Message;
        refreshConversations();
        // Foreground browser notification for messages to us in a non-active convo
        if (msg.sender_id !== user.id && msg.conversation_id !== activeId && typeof Notification !== "undefined" && Notification.permission === "granted") {
          try {
            new Notification("New message", { body: msg.body?.slice(0, 120) ?? "You have a new message", tag: msg.conversation_id });
          } catch { /* ignore */ }
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, activeId, refreshConversations]);

  // Presence channel
  useEffect(() => {
    if (!user) return;
    const channel = supabase.channel(PRESENCE_CHANNEL, { config: { presence: { key: user.id } } });
    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        setOnlineUsers(new Set(Object.keys(state)));
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") await channel.track({ online_at: new Date().toISOString() });
      });
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Load messages for active conversation + subscribe
  useEffect(() => {
    if (!activeId || !user) { setMessages([]); return; }
    let cancelled = false;
    (async () => {
      try {
        const rows = await listMessages(activeId);
        if (cancelled) return;
        setMessages(rows);
        await markConversationRead(activeId, user.id);
        refreshConversations();
      } catch (e) { console.error(e); }
    })();

    const channel = supabase
      .channel(`conv:${activeId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `conversation_id=eq.${activeId}` }, (payload) => {
        if (payload.eventType === "INSERT") {
          setMessages((prev) => (prev.some((m) => m.id === (payload.new as Message).id) ? prev : [...prev, payload.new as Message]));
          if ((payload.new as Message).sender_id !== user.id) markConversationRead(activeId, user.id);
        } else if (payload.eventType === "UPDATE") {
          setMessages((prev) => prev.map((m) => (m.id === (payload.new as Message).id ? (payload.new as Message) : m)));
        } else if (payload.eventType === "DELETE") {
          setMessages((prev) => prev.filter((m) => m.id !== (payload.old as Message).id));
        }
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "typing_indicators", filter: `conversation_id=eq.${activeId}` }, (payload) => {
        const row = (payload.new ?? payload.old) as { user_id: string; updated_at?: string } | null;
        if (!row) return;
        if (row.user_id === user.id) return;
        if (payload.eventType === "DELETE") setPeerTyping(false);
        else setPeerTyping(true);
      })
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [activeId, user, refreshConversations]);

  // Peer typing auto-clear
  useEffect(() => {
    if (!peerTyping) return;
    const t = setTimeout(() => setPeerTyping(false), 4000);
    return () => clearTimeout(t);
  }, [peerTyping, messages.length]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, peerTyping]);

  // Block state for active peer
  useEffect(() => {
    if (!user || !active?.peer) { setBlockedByMe(false); return; }
    isBlocked(user.id, active.peer.id).then(setBlockedByMe).catch(() => {});
  }, [user, active?.peer]);

  const handleSend = async () => {
    if (!user || !activeId) return;
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setShowEmoji(false);
    try {
      await sendMessage({ conversationId: activeId, senderId: user.id, body: text });
      clearTyping(activeId, user.id);
    } catch (e: unknown) {
      toast.error("Couldn't send message");
      setDraft(text);
    }
  };

  const handleTyping = (v: string) => {
    setDraft(v);
    if (!user || !activeId) return;
    setTyping(activeId, user.id).catch(() => {});
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => clearTyping(activeId, user.id).catch(() => {}), 3000);
  };

  const handleFile = async (file: File) => {
    if (!user || !activeId) return;
    if (file.size > 15 * 1024 * 1024) { toast.error("File too large (max 15MB)"); return; }
    try {
      const att = await uploadAttachment(activeId, file);
      await sendMessage({ conversationId: activeId, senderId: user.id, body: draft.trim() || undefined, attachment: att });
      setDraft("");
    } catch (e) {
      toast.error("Upload failed");
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await softDeleteMessage(id);
    } catch { toast.error("Couldn't delete"); }
  };

  const handleToggleBlock = async () => {
    if (!user || !active?.peer) return;
    try {
      if (blockedByMe) { await unblockUser(user.id, active.peer.id); setBlockedByMe(false); toast.success("User unblocked"); }
      else { await blockUser(user.id, active.peer.id); setBlockedByMe(true); toast.success("User blocked"); }
    } catch { toast.error("Action failed"); }
  };

  const handleReport = async () => {
    if (!user || !active?.peer) return;
    const reason = window.prompt("Reason for report:");
    if (!reason) return;
    try { await reportUser({ reporterId: user.id, reportedId: active.peer.id, reason }); toast.success("Report submitted"); }
    catch { toast.error("Couldn't submit report"); }
  };

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    setNotifPerm(perm);
    if (perm === "granted") toast.success("Notifications enabled");
  };

  const filteredConvs = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) =>
      (c.peer?.full_name ?? "").toLowerCase().includes(q) ||
      (c.last_message_preview ?? "").toLowerCase().includes(q)
    );
  }, [conversations, search]);

  const filteredMessages = useMemo(() => {
    if (!messageSearch.trim()) return messages;
    const q = messageSearch.toLowerCase();
    return messages.filter((m) => (m.body ?? "").toLowerCase().includes(q));
  }, [messages, messageSearch]);

  if (userLoading) {
    return <div className="p-8 text-sm text-muted-foreground">Loading…</div>;
  }
  if (!user) {
    return <div className="p-8 text-sm text-muted-foreground">Please sign in to use Messages.</div>;
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] grid-cols-1 gap-4 md:grid-cols-[320px_1fr]">
      {/* Conversation list */}
      <aside className={`flex flex-col overflow-hidden rounded-2xl glass ring-1 ring-white/10 ${activeId ? "hidden md:flex" : "flex"}`}>
        <div className="border-b border-white/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Messages</h2>
            <div className="flex items-center gap-1">
              {notifPerm === "default" && (
                <button onClick={enableNotifications} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground" aria-label="Enable notifications" title="Enable browser notifications">
                  <Bell className="size-3.5" />
                </button>
              )}
              <button onClick={() => setShowNewChat(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground" aria-label="New chat" title="New chat">
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search conversations"
              className="w-full rounded-lg bg-white/5 px-9 py-2 text-xs ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConvs.length === 0 && (
            <div className="p-6 text-center text-xs text-muted-foreground">
              {conversations.length === 0 ? "No conversations yet. Start one with the + button above." : "No matches"}
            </div>
          )}
          {filteredConvs.map((c) => {
            const online = c.peer && onlineUsers.has(c.peer.id);
            const isActive = c.id === activeId;
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-3 border-b border-white/5 p-3 text-left transition-colors ${isActive ? "bg-accent-purple/10" : "hover:bg-white/5"}`}>
                <div className="relative">
                  <div className="flex size-10 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                    {(c.peer?.full_name ?? "?").slice(0, 2).toUpperCase()}
                  </div>
                  {online && <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 ring-2 ring-background" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">{c.peer?.full_name ?? "Unknown"}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{formatShort(c.last_message_at)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">{c.last_message_preview ?? "No messages yet"}</span>
                    {c.unread > 0 && <span className="shrink-0 rounded-full bg-accent-purple px-1.5 py-0.5 text-[10px] font-bold text-white">{c.unread}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Chat panel */}
      <section className={`flex flex-col overflow-hidden rounded-2xl glass ring-1 ring-white/10 ${activeId ? "flex" : "hidden md:flex"}`}>
        {!active ? (
          <div className="flex flex-1 items-center justify-center p-8 text-sm text-muted-foreground">
            Select a conversation to start chatting
          </div>
        ) : (
          <>
            <header className="flex items-center gap-3 border-b border-white/5 p-4">
              <button onClick={() => setActiveId(null)} className="md:hidden" aria-label="Back"><ArrowLeft className="size-4" /></button>
              <div className="relative">
                <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                  {(active.peer?.full_name ?? "?").slice(0, 2).toUpperCase()}
                </div>
                {active.peer && onlineUsers.has(active.peer.id) && (
                  <span className="absolute right-0 bottom-0 size-2.5 rounded-full bg-green-500 ring-2 ring-background" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{active.peer?.full_name ?? "Unknown"}</div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Circle className={`size-1.5 fill-current ${active.peer && onlineUsers.has(active.peer.id) ? "text-green-500" : "text-muted-foreground"}`} />
                  {active.peer && onlineUsers.has(active.peer.id) ? "Online" : "Offline"}
                </div>
              </div>
              <div className="relative">
                <input value={messageSearch} onChange={(e) => setMessageSearch(e.target.value)} placeholder="Search…"
                  className="hidden md:block w-40 rounded-lg bg-white/5 px-3 py-1.5 text-xs ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
              </div>
              <ChatMenu blocked={blockedByMe} onToggleBlock={handleToggleBlock} onReport={handleReport} />
            </header>

            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
              {filteredMessages.map((m) => (
                <MessageBubble key={m.id} msg={m} mine={m.sender_id === user.id} peer={active.peer} onDelete={() => handleDelete(m.id)} />
              ))}
              {peerTyping && (
                <div className="flex items-center gap-1 pl-3 text-xs text-muted-foreground">
                  <span className="inline-block size-1.5 animate-bounce rounded-full bg-accent-purple" />
                  <span className="inline-block size-1.5 animate-bounce rounded-full bg-accent-purple" style={{ animationDelay: "0.1s" }} />
                  <span className="inline-block size-1.5 animate-bounce rounded-full bg-accent-purple" style={{ animationDelay: "0.2s" }} />
                  <span className="ml-2">typing…</span>
                </div>
              )}
            </div>

            <footer className="border-t border-white/5 p-3">
              {blockedByMe ? (
                <div className="rounded-lg bg-white/5 p-3 text-center text-xs text-muted-foreground">
                  You blocked this user. Unblock from the menu to resume messaging.
                </div>
              ) : (
                <div className="relative">
                  {showEmoji && (
                    <div className="absolute bottom-full left-0 z-20 mb-2">
                      <EmojiPicker onEmojiClick={(e) => setDraft((d) => d + e.emoji)} theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE} width={320} height={360} />
                    </div>
                  )}
                  <div className="flex items-end gap-2">
                    <button onClick={() => setShowEmoji((v) => !v)} className="rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground" aria-label="Emoji"><Smile className="size-4" /></button>
                    <label className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-white/5 hover:text-foreground" aria-label="Attach file">
                      <Paperclip className="size-4" />
                      <input type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ""; }} />
                    </label>
                    <textarea
                      value={draft}
                      onChange={(e) => handleTyping(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="Write a message…"
                      rows={1}
                      className="min-h-[40px] max-h-32 flex-1 resize-none rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40"
                    />
                    <button onClick={handleSend} disabled={!draft.trim()} className="flex size-10 items-center justify-center rounded-lg gradient-primary text-white disabled:opacity-50" aria-label="Send"><Send className="size-4" /></button>
                  </div>
                </div>
              )}
            </footer>
          </>
        )}
      </section>

      {showNewChat && user && (
        <NewChatModal
          currentUserId={user.id}
          onClose={() => setShowNewChat(false)}
          onStart={async (peerId) => {
            try {
              const cid = await getOrCreateConversation(peerId);
              await refreshConversations();
              setActiveId(cid);
              setShowNewChat(false);
            } catch (e) { toast.error("Couldn't start conversation"); console.error(e); }
          }}
        />
      )}
    </div>
  );
}

function MessageBubble({ msg, mine, peer, onDelete }: { msg: Message; mine: boolean; peer: Profile | null; onDelete: () => void }) {
  const [menu, setMenu] = useState(false);
  const isImage = msg.attachment_type?.startsWith("image/");
  const isDeleted = !!msg.deleted_at;
  return (
    <div className={`group flex items-end gap-2 ${mine ? "justify-end" : ""}`}>
      {!mine && (
        <div className="flex size-6 shrink-0 items-center justify-center rounded-full gradient-primary text-[9px] font-bold text-white">
          {(peer?.full_name ?? "?").slice(0, 2).toUpperCase()}
        </div>
      )}
      <div className={`relative max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "gradient-primary text-white" : "bg-white/5 ring-1 ring-white/10"} ${isDeleted ? "opacity-60 italic" : ""}`}>
        {isDeleted ? (
          <span className="text-xs">Message deleted</span>
        ) : (
          <>
            {msg.attachment_url && isImage && (
              <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="mb-1 block overflow-hidden rounded-lg">
                <img src={msg.attachment_url} alt={msg.attachment_name ?? "attachment"} className="max-h-64 max-w-full object-cover" />
              </a>
            )}
            {msg.attachment_url && !isImage && (
              <a href={msg.attachment_url} target="_blank" rel="noreferrer" className="mb-1 flex items-center gap-2 rounded-lg bg-black/20 p-2 text-xs hover:bg-black/30">
                <FileText className="size-3.5" />
                <span className="truncate">{msg.attachment_name ?? "attachment"}</span>
              </a>
            )}
            {msg.body && <div className="whitespace-pre-wrap break-words">{msg.body}</div>}
          </>
        )}
        <div className={`mt-1 flex items-center gap-1 text-[10px] ${mine ? "text-white/70" : "text-muted-foreground"}`}>
          <span>{formatTime(msg.created_at)}</span>
          {mine && !isDeleted && (msg.read_at ? <CheckCheck className="size-3" /> : <Check className="size-3" />)}
        </div>
        {mine && !isDeleted && (
          <button onClick={() => setMenu((v) => !v)} className="absolute -top-2 -right-2 hidden rounded-full bg-background p-1 ring-1 ring-white/10 group-hover:block" aria-label="Message options">
            <MoreVertical className="size-3" />
          </button>
        )}
        {menu && (
          <div className="absolute top-0 right-6 z-10 rounded-lg bg-background p-1 shadow-lg ring-1 ring-white/10">
            <button onClick={() => { onDelete(); setMenu(false); }} className="flex items-center gap-2 rounded px-2 py-1 text-xs text-red-400 hover:bg-white/5">
              <Trash2 className="size-3" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatMenu({ blocked, onToggleBlock, onReport }: { blocked: boolean; onToggleBlock: () => void; onReport: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="rounded-md p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground" aria-label="More options">
        <MoreVertical className="size-4" />
      </button>
      {open && (
        <div className="absolute top-full right-0 z-20 mt-1 w-44 rounded-lg bg-background p-1 shadow-xl ring-1 ring-white/10">
          <button onClick={() => { onToggleBlock(); setOpen(false); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs hover:bg-white/5">
            <Ban className="size-3.5" /> {blocked ? "Unblock user" : "Block user"}
          </button>
          <button onClick={() => { onReport(); setOpen(false); }} className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-xs text-red-400 hover:bg-white/5">
            <ShieldAlert className="size-3.5" /> Report user
          </button>
        </div>
      )}
    </div>
  );
}

function NewChatModal({ currentUserId, onClose, onStart }: { currentUserId: string; onClose: () => void; onStart: (id: string) => void }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const query = q.trim();
    if (!query) { setResults([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const { data } = await supabase.from("profiles").select("*").ilike("full_name", `%${query}%`).neq("id", currentUserId).limit(20);
      setResults(data ?? []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, [q, currentUserId]);
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-background p-5 ring-1 ring-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold">Start a new conversation</h3>
          <button onClick={onClose} aria-label="Close"><X className="size-4" /></button>
        </div>
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people by name…"
          className="mb-3 w-full rounded-lg bg-white/5 px-3 py-2 text-sm ring-1 ring-white/10 outline-none focus:ring-accent-purple/40" />
        <div className="max-h-80 overflow-y-auto">
          {loading && <div className="p-4 text-center text-xs text-muted-foreground">Searching…</div>}
          {!loading && q && results.length === 0 && <div className="p-4 text-center text-xs text-muted-foreground">No people found</div>}
          {results.map((p) => (
            <button key={p.id} onClick={() => onStart(p.id)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-white/5">
              <div className="flex size-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                {(p.full_name ?? "?").slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold">{p.full_name ?? "Unknown"}</div>
                <div className="truncate text-xs text-muted-foreground">{p.headline ?? p.role}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function formatShort(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}
