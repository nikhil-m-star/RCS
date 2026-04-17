import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

// In Prisma 7, PrismaClient must be constructed with an adapter 
// or accelerateUrl in many server environments.
const prisma = new PrismaClient({ adapter });

export default prisma;
