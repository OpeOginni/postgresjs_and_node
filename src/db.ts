import postgres from 'postgres'

const CONNECTION_URL = "postgresql://user:password@127.0.0.1:5432/db";

const PGHOST = "127.0.0.1";
const PGDATABASE = "db";
const PGUSER = "user";
const PGPASSWORD = "password";

// export const sql = postgres({ host: PGHOST, database: PGDATABASE, username: PGUSER, password: PGPASSWORD, port: 5432 });

export const sql = postgres(CONNECTION_URL);