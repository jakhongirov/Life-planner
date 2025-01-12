CREATE TABLE users (
   id bigserial,
   chat_id bigint PRIMARY KEY,
   phone_number text,
   name text,
   create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payme (
   id bigserial PRiMARY KEY,
   chat_id int,
   payment text,
   state int DEFAULT 0,
   amount int,
   create_time bigint DEFAULT 0,
   perform_time bigint DEFAULT 0,
   cancel_time bigint DEFAULT 0,
   transaction text,
   reason int,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
   id bigserial PRiMARY KEY,
   click_id text,
   amount text,
   tarif text,
   chat_id int,
   merchant_id text,
   error text,
   error_note text,
   status text,
   transaction_create_at timestamptz DEFAULT CURRENT_TIMESTAMP
);