CREATE TABLE users (
   id bigserial,
   chat_id bigint PRIMARY KEY,
   phone_number text,
   name text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);