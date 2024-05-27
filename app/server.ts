import 'dotenv/config'

import { env } from './env'
import { createApp } from './app'

async function main() {
  try {
    const app = await createApp()
    await app.ready()
    await app.listen({
      host: '0.0.0.0',
      port: Number.parseInt(env.PORT),
    })
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
