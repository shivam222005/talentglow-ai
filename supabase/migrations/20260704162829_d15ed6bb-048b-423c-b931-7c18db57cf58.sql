-- Revoke default PUBLIC execute on all our SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.bump_conversation_on_message() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.is_conversation_participant(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) FROM PUBLIC, anon;

-- Only the app-facing RPC needs signed-in execute
GRANT EXECUTE ON FUNCTION public.get_or_create_conversation(UUID) TO authenticated;
-- RLS policies invoke is_conversation_participant as the definer's role, not caller's,
-- so it doesn't need any grant.