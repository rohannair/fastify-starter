import fp from 'fastify-plugin'
import fastifySwagger, {
  type FastifyDynamicSwaggerOptions,
} from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

export default fp<FastifyDynamicSwaggerOptions>(async (app) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Nest Egg API',
        version: '1.0.0',
      },
      servers: [
        {
          url: 'http://localhost',
        },
      ],
    },
    transform: jsonSchemaTransform,
  })
  app.register(fastifySwaggerUI, {
    routePrefix: '/documentation',
  })
})
