import { config } from 'dotenv'
import { z } from 'zod'

// O NODE_ENV ja é preenchido sozinho quando rodamos o vistest, 
// então fiz um if que se ele for test rodar o .env.test ou se não o .env

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.number().default(3333),
})

const _env = envSchema.safeParse(process.env)   //faz a validação

if (_env.success === false) {
  console.error('Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables.')
}

export const env = _env.data