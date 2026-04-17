import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { query } from '../lib/db.js';
import { signJwt } from '../lib/jwt.js';

const USERNAME_MIN = 3;
const PASSWORD_MIN = 8;

function sanitizeUsername(username = '') {
  return username.trim().toLowerCase();
}

function buildAuthResponse(user) {
  const token = signJwt({
    sub: user.clerkId,
    username: user.username,
    authType: 'jwt',
  });

  return {
    token,
    user: {
      id: user.clerkId,
      username: user.username,
      firstName: user.username,
    },
  };
}

export const registerWithPassword = async (req, res) => {
  const username = sanitizeUsername(req.body?.username);
  const password = req.body?.password || '';

  if (username.length < USERNAME_MIN) {
    return res.status(400).json({ error: `Username must be at least ${USERNAME_MIN} characters.` });
  }

  if (password.length < PASSWORD_MIN) {
    return res.status(400).json({ error: `Password must be at least ${PASSWORD_MIN} characters.` });
  }

  try {
    const existingCredential = await query(
      `select 1 from "CredentialAuth" where "username" = $1 limit 1`,
      [username],
    );

    if (existingCredential.rowCount > 0) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }

    const userId = randomUUID();
    const authUserId = `local_${randomUUID()}`;
    const passwordHash = await bcrypt.hash(password, 10);

    const userResult = await query(
      `
        insert into "User" ("id", "clerkId", "username")
        values ($1, $2, $3)
        returning "id", "clerkId", "username"
      `,
      [userId, authUserId, username],
    );

    await query(
      `
        insert into "CredentialAuth" ("id", "userId", "username", "passwordHash")
        values ($1, $2, $3, $4)
      `,
      [randomUUID(), userId, username, passwordHash],
    );

    return res.status(201).json(buildAuthResponse(userResult.rows[0]));
  } catch (error) {
    console.error('[registerWithPassword] failed', error);
    return res.status(500).json({ error: error.message });
  }
};

export const loginWithPassword = async (req, res) => {
  const username = sanitizeUsername(req.body?.username);
  const password = req.body?.password || '';

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  try {
    const result = await query(
      `
        select u."id", u."clerkId", u."username", c."passwordHash"
        from "CredentialAuth" c
        join "User" u on u."id" = c."userId"
        where c."username" = $1
        limit 1
      `,
      [username],
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    return res.json(buildAuthResponse(user));
  } catch (error) {
    console.error('[loginWithPassword] failed', error);
    return res.status(500).json({ error: error.message });
  }
};
