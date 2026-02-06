import { sql } from '@/lib/db';
import { hashPassword, verifyPassword } from './password';

export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: Date;
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const passwordHash = await hashPassword(password);

  const result = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name || null})
    RETURNING id, email, name, created_at
  `;

  return result[0] as User;
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const result = await sql`
    SELECT id, email, name, password_hash, created_at
    FROM users
    WHERE email = ${email}
  `;

  return result[0] as (User & { password_hash: string }) | null;
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at
    FROM users
    WHERE id = ${id}
  `;

  return result[0] as User | null;
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const user = await getUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password_hash);

  if (!isValid) {
    return null;
  }

  // Don't return the password hash
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}
