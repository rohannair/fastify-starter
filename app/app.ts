import traps from '@dnlup/fastify-traps'
import sensible from '@fastify/sensible'
import cors from '@fastify/cors'
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import routes from './modules'
import { swaggerPlugin } from './plugins/swagger'

import { envToLogger } from './lib/logger'
import { formatUptime } from './lib/utils/time'
import { type Environments, env } from './env'
import { ZodError } from 'zod'

declare module 'fastify' {
  interface FastifyRequest {
    user: Partial<{
      id: string
      authRef: string
      email: string
      role: string
    }>
  }
}

export async function createApp() {
  const app = Fastify({
    // @ts-ignore
    logger: envToLogger(env.NODE_ENV),
  })

  app
    .setValidatorCompiler(validatorCompiler)
    .setSerializerCompiler(serializerCompiler)
    .register(traps)
    .register(sensible)
    .register(cors)
    .register(swaggerPlugin)
    .get('/', async () => {
      return { ok: true, uptime: formatUptime(process.uptime()) }
    })
    .get('/health', async () => {
      return { ok: true, uptime: formatUptime(process.uptime()) }
    })
    .get('/favicon.ico', async (_req, reply) => {
      return reply.code(404).send()
    })
    .register(routes, {
      prefix: '/api/v1',
    })
    .setErrorHandler((error, _request, reply) => {
      if (error instanceof ZodError) {
        const { issues, statusCode = 400 } = error
        return reply.status(statusCode).send({
          statusCode,
          error: 'Bad Request',
          issues: issues.map((issue) => ({
            field: issue.path.join('.'),
            // @ts-ignore
            expected: issue.expected,
            // @ts-ignore
            received: issue.received,
          })),
        })
      }

      console.error(error)
      reply.status(500).send({
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Something went wrong',
      })
    })

  return app
}
