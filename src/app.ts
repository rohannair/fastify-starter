import traps from '@dnlup/fastify-traps'
import cors from '@fastify/cors'
import sensible from '@fastify/sensible'
import { Kita } from '@kitajs/runtime'
import Fastify from 'fastify'
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { ZodError } from 'zod'
import { env } from './env'
import { envToLogger } from './lib/logger'
import routes from './modules'
import { swaggerPlugin } from './plugins/swagger'

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
    .register(Kita)
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
