import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

// Load from .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createUsersTable() {
  console.log('Creating users table...');

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      stripe_customer_id VARCHAR(255),
      subscription_status VARCHAR(50) DEFAULT 'free',
      subscription_plan VARCHAR(50),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  console.log('Users table created!');

  // Create index on email
  await sql`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
  `;

  console.log('Index created!');
}

createUsersTable()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
