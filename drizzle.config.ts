import type { Config } from 'drizzle-kit'
import { env } from './app/env'

export default {
  dialect: 'postgresql',
  schema: './src/lib/db/schema/*',
  out: './src/lib/db/migrations',
  dbCredentials: {
    url: env.DB_URL,
  },
  verbose: true,
  strict: true,
} satisfies Config
