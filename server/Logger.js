import winston from 'winston'
import path from 'path'
import LogstashTransport from './LogstashTransport'

const format = [
  winston.format.metadata({ server: 'EXPRESS' }),
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
]
const options = {
  file: {
    level: 'info',
    filename: path.resolve(__dirname, 'logs/app.log'),
    handleExceptions: true,
    json: true,
    format: winston.format.combine(...format),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    // level: 'info',
    handleExceptions: true,
    json: true,
    format: winston.format.combine(winston.format.colorize(), ...format),
    colorize: false
  },
  logstash: {
    format: winston.format.combine(...format)
  }
}
export default ({ port = process.env.WINSTON_PORT, host = process.env.WINSTON_HOST }) =>
  winston.createLogger({
    level: process.env.NODE_ENV === 'development' ? 'verbose' : 'info',
    transports: [
      new winston.transports.File(options.file),
      new winston.transports.Console(options.console),
      new LogstashTransport({
        host,
        port,
        ...options.logstash
      })
    ],
    exitOnError: false // do not exit on handled exceptions
  })
