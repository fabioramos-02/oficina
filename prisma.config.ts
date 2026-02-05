import 'dotenv/config'
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations'
  },
  datasource: {
    url: env('DATABASE_URL'),
    // @ts-expect-error - directUrl is not yet in the types but required for Supabase
    directUrl: env('DIRECT_URL'),
  },
});