import { query } from './db.js';

export async function ensureAuthTables() {
  await query(`
    create table if not exists "CredentialAuth" (
      "id" text primary key,
      "userId" text not null unique references "User"("id") on delete cascade,
      "username" text not null unique,
      "passwordHash" text not null,
      "createdAt" timestamp not null default now()
    )
  `);
}
