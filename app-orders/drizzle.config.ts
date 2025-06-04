import { defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be defined in the environment variables')
}

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  schema: 'src/db/schema/*',
  out: 'src/db/migrations',
  casing: 'snake_case',
})