CREATE TABLE bin (
  id serial PRIMARY KEY,
  endpoint char(12) UNIQUE NOT NULL,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE request (
  id serial PRIMARY KEY,
  bin_id int NOT NULL REFERENCES bin(id) ON DELETE CASCADE,
  method varchar(10) NOT NULL,
  path varchar(255),
  original_url TEXT,
  query_parameters jsonb,
  headers jsonb,
  received_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  mongo_request_id varchar(255),
  mongo_body_id varchar(255)
);