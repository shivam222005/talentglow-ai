import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Conversation = Tables<"conversations">;
export type Message = Tables<"messages">;

export type ConversationWithPeer = Conversation & {
  peer: Profile | null;
  unread: number;
};

export async function listConversations(userId: string): Promise<ConversationWithPeer[]> {
  const { data: convs, error } = await supabase
    .from("conversations")
    .select("*")
    .or(`participant_a.eq.${userId},participant_b.eq.${userId}`)
    .order("last_message_at", { ascending: false });
  if (error) throw error;
  if (!convs || convs.length === 0) return [];

  const peerIds = Array.from(new Set(convs.map((c) => (c.participant_a === userId ? c.participant_b : c.participant_a))));
  const [{ data: peers }, { data: unread }] = await Promise.all([
    supabase.from("profiles").select("*").in("id", peerIds),
    supabase
      .from("messages")
      .select("conversation_id")
      .in("conversation_id", convs.map((c) => c.id))
      .is("read_at", null)
      .neq("sender_id", userId),
  ]);
  const peerMap = new Map((peers ?? []).map((p) => [p.id, p]));
  const unreadCounts = new Map<string, number>();
  for (const row of unread ?? []) {
    unreadCounts.set(row.conversation_id, (unreadCounts.get(row.conversation_id) ?? 0) + 1);
  }
  return convs.map((c) => ({
    ...c,
    peer: peerMap.get(c.participant_a === userId ? c.participant_b : c.participant_a) ?? null,
    unread: unreadCounts.get(c.id) ?? 0,
  }));
}

export async function listMessages(conversationId: string): Promise<Message[]> {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(500);
  if (error) throw error;
  return data ?? [];
}

export async function sendMessage(args: {
  conversationId: string;
  senderId: string;
  body?: string;
  attachment?: { url: string; type: string; name: string } | null;
}): Promise<Message> {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: args.conversationId,
      sender_id: args.senderId,
      body: args.body || null,
      attachment_url: args.attachment?.url ?? null,
      attachment_type: args.attachment?.type ?? null,
      attachment_name: args.attachment?.name ?? null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function markConversationRead(conversationId: string, userId: string) {
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", userId)
    .is("read_at", null);
}

export async function softDeleteMessage(messageId: string) {
  const { error } = await supabase
    .from("messages")
    .update({ deleted_at: new Date().toISOString(), body: null, attachment_url: null })
    .eq("id", messageId);
  if (error) throw error;
}

export async function setTyping(conversationId: string, userId: string) {
  await supabase.from("typing_indicators").upsert(
    { conversation_id: conversationId, user_id: userId, updated_at: new Date().toISOString() },
    { onConflict: "conversation_id,user_id" }
  );
}

export async function clearTyping(conversationId: string, userId: string) {
  await supabase.from("typing_indicators").delete().eq("conversation_id", conversationId).eq("user_id", userId);
}

export async function getOrCreateConversation(otherUserId: string): Promise<string> {
  const { data, error } = await supabase.rpc("get_or_create_conversation", { _other: otherUserId });
  if (error) throw error;
  return data as string;
}

export async function blockUser(blockerId: string, blockedId: string) {
  const { error } = await supabase.from("user_blocks").insert({ blocker_id: blockerId, blocked_id: blockedId });
  if (error && !error.message.includes("duplicate")) throw error;
}

export async function unblockUser(blockerId: string, blockedId: string) {
  const { error } = await supabase.from("user_blocks").delete().eq("blocker_id", blockerId).eq("blocked_id", blockedId);
  if (error) throw error;
}

export async function isBlocked(blockerId: string, blockedId: string) {
  const { data } = await supabase
    .from("user_blocks")
    .select("blocker_id")
    .eq("blocker_id", blockerId)
    .eq("blocked_id", blockedId)
    .maybeSingle();
  return !!data;
}

export async function reportUser(args: {
  reporterId: string;
  reportedId: string;
  messageId?: string;
  reason: string;
  details?: string;
}) {
  const { error } = await supabase.from("user_reports").insert({
    reporter_id: args.reporterId,
    reported_id: args.reportedId,
    message_id: args.messageId ?? null,
    reason: args.reason,
    details: args.details ?? null,
  });
  if (error) throw error;
}

export async function uploadAttachment(conversationId: string, file: File): Promise<{ url: string; type: string; name: string }> {
  const path = `${conversationId}/${crypto.randomUUID()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
  const { error } = await supabase.storage.from("chat-attachments").upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
  if (error) throw error;
  const { data } = await supabase.storage.from("chat-attachments").createSignedUrl(path, 60 * 60 * 24 * 7);
  return { url: data?.signedUrl ?? path, type: file.type, name: file.name };
}

export async function ensureOwnProfile(userId: string, meta: { email?: string; full_name?: string; role?: string }) {
  await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: meta.full_name ?? meta.email?.split("@")[0] ?? "User",
      role: meta.role ?? "student",
    },
    { onConflict: "id" }
  );
}
