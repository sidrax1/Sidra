export type LogLevel =
  | "debug"
  | "info"
  | "warn"
  | "error";

class Logger {
 private write(
   level: LogLevel,
   message: string,
   meta?: unknown
 ): void {
   const timestamp = new Date().toISOString();

      const payload = {
        timestamp,
        level,
        message,
        meta
      };

      switch (level) {
       case "debug":
        console.debug(payload);
        break;

       case "info":
        console.info(payload);
        break;

            case "warn":
             console.warn(payload);
             break;

            case "error":
             console.error(payload);
             break;
        }
    }

    debug(message: string, meta?: unknown): void {
      this.write("debug", message, meta);
    }

    info(message: string, meta?: unknown): void {
      this.write("info", message, meta);
    }

    warn(message: string, meta?: unknown): void {
      this.write("warn", message, meta);
    }

    error(message: string, meta?: unknown): void {
      this.write("error", message, meta);
    }
}

export const logger = new Logger();
