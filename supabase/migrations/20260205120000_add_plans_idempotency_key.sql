alter table plans
  add column if not exists idempotency_key text;
update plans
set idempotency_key = meta->>'idempotency_key'
where idempotency_key is null
  and meta ? 'idempotency_key';
create unique index if not exists plans_idempotency_key_uidx
  on plans (idempotency_key)
  where idempotency_key is not null;
