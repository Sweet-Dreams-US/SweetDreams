-- Drawn signatures: the signer draws with mouse or finger on the signing
-- page; the PNG (data URL) is stored with the agreement and frozen by the
-- immutability trigger once signed, alongside the typed-name record.
alter table public.agreements
  add column if not exists signature_image text;

comment on column public.agreements.signature_image is
  'Drawn signature as a PNG data URL, captured at signing. Frozen once signed.';

-- Recreate the immutability guard with signature_image in the frozen set.
create or replace function public.agreements_block_mutation()
returns trigger language plpgsql as $$
begin
  if new.rendered_text is distinct from old.rendered_text
     or new.content_sha256 is distinct from old.content_sha256
     or new.template_version is distinct from old.template_version
     or new.variables is distinct from old.variables
     or new.client_id is distinct from old.client_id
     or new.site_id is distinct from old.site_id then
    raise exception 'agreement content is immutable';
  end if;

  if old.status = 'signed' then
    if new.status is distinct from old.status
       or new.signed_at is distinct from old.signed_at
       or new.signer_name is distinct from old.signer_name
       or new.signer_ip is distinct from old.signer_ip
       or new.signer_user_agent is distinct from old.signer_user_agent
       or new.consents is distinct from old.consents
       or new.signed_content_sha256 is distinct from old.signed_content_sha256
       or new.signature_image is distinct from old.signature_image then
      raise exception 'signed agreements are immutable';
    end if;
  end if;

  return new;
end;
$$;
