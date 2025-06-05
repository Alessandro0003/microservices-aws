import { defineConfig } from 'drizzle-kit'


export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
  schema: 'src/db/schemas/*',
  out: 'src/db/migrations',
  casing: 'snake_case',
})