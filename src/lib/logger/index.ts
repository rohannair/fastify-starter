export type Environments = 'development' | 'production' | 'test'

interface TransportOptions {
  destination: number
  colorize: boolean
  translateTime: string
  ignore: string
}

interface Transport {
  target: string
  options: TransportOptions
}

interface LoggerConfig {
  maxParamLength: number
  transport: Transport
}

const loggerConfig: LoggerConfig = {
  maxParamLength: 5000,
  transport: {
    target: 'pino-pretty',
    options: {
      destination: 1,
      colorize: true,
      translateTime: 'HH:MM:ss Z',
      ignore: 'pid,hostname,req.remoteAddress,req.remotePort',
    },
  },
}

export const envToLoggerConfig = (env: Environments) => {
  switch (env) {
    case 'test':
      return false
    case 'production':
      return 'trace'
    default:
      return loggerConfig
  }
}
