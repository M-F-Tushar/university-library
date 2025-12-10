type LogLevel = 'error' | 'warn' | 'info' | 'debug'

interface LogEntry {
    level: LogLevel
    message: string
    timestamp: string
    context?: Record<string, unknown>
    error?: Error
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development'

    private formatLog(entry: LogEntry): string {
        const { level, message, timestamp, context, error } = entry
        let log = `[${timestamp}] [${level.toUpperCase()}] ${message}`

        if (context) {
            log += `\nContext: ${JSON.stringify(context, null, 2)}`
        }

        if (error) {
            log += `\nError: ${error.message}\nStack: ${error.stack}`
        }

        return log
    }

    private createLogEntry(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            error,
        }
    }

    error(message: string, error?: Error, context?: Record<string, unknown>) {
        const entry = this.createLogEntry('error', message, context, error)

        if (this.isDevelopment) {
            console.error(this.formatLog(entry))
        } else {
            // In production, send to external service (e.g., Sentry)
            console.error(entry)
            // Example: Sentry.captureException(error, { extra: context })
        }
    }

    warn(message: string, context?: Record<string, unknown>) {
        const entry = this.createLogEntry('warn', message, context)

        if (this.isDevelopment) {
            console.warn(this.formatLog(entry))
        } else {
            console.warn(entry)
        }
    }

    info(message: string, context?: Record<string, unknown>) {
        const entry = this.createLogEntry('info', message, context)

        if (this.isDevelopment) {
            console.info(this.formatLog(entry))
        } else {
            console.info(entry)
        }
    }

    debug(message: string, context?: Record<string, unknown>) {
        if (this.isDevelopment) {
            const entry = this.createLogEntry('debug', message, context)
            console.debug(this.formatLog(entry))
        }
    }
}

export const logger = new Logger()

