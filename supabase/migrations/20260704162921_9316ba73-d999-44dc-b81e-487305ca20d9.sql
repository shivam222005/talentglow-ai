-- Attachments are stored at path: {conversation_id}/{uuid-filename}
-- Only conversation participants can read; only participants can upload.

CREATE POLICY "Participants read chat attachments"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND public.is_conversation_participant(
      (regexp_split_to_array(name, '/'))[1]::uuid,
      auth.uid()
    )
  );

CREATE POLICY "Participants upload chat attachments"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'chat-attachments'
    AND public.is_conversation_participant(
      (regexp_split_to_array(name, '/'))[1]::uuid,
      auth.uid()
    )
  );

CREATE POLICY "Uploader deletes own chat attachments"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND owner = auth.uid()
  );