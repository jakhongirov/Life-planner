CREATE TABLE users (
   id bigserial,
   chat_id bigint PRIMARY KEY,
   phone_number text,
   name text,
   step text,
   premium boolean DEFAULT false,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);