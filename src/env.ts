import { z } from 'zod'

export type Environments = 'development' | 'production' | 'test'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().default('3009'),
  DB_URL: z.string().url().default('postgres://postgres@localhost:5432/dev_db'),
})

const parsedEnv = envSchema.safeParse(process.env)
if (!parsedEnv.success) {
  const errors = Object.keys(parsedEnv.error.flatten().fieldErrors).join('\n')
  console.error(`Missing or invalid environment variables:\n${errors}`)
  process.exit(1)
}

export const env = parsedEnv.data

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
