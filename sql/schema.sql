DROP TABLE IF EXISTS public.users;

CREATE TABLE public.users (
  user_ID  SERIAL PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  password text NOT NULL
);