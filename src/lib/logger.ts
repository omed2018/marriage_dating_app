type LogLevel = "ERROR" | "WARN" | "INFO";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

class Logger {
  private buffer: LogEntry[] = [];

  private enqueue(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>
  ) {
    this.buffer.push({
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
    });
  }

  error(message: string, context?: Record<string, unknown>) {
    this.enqueue("ERROR", message, context);
    console.error(`[ERROR] ${message}`, context ?? "");
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.enqueue("WARN", message, context);
    console.warn(`[WARN] ${message}`, context ?? "");
  }

  info(message: string, context?: Record<string, unknown>) {
    this.enqueue("INFO", message, context);
    console.log(`[INFO] ${message}`, context ?? "");
  }

  async flushToFile() {
    if (typeof window !== "undefined" || this.buffer.length === 0) return;
    const entries = this.buffer.splice(0);
    const lines =
      entries
        .map((e) => JSON.stringify({ ...e, service: "marriage-app" }))
        .join("\n") + "\n";

    try {
      const { appendFile, mkdir } = await import("fs/promises");
      await mkdir("logs", { recursive: true }).catch(() => {});
      await appendFile("logs/app.log", lines);
    } catch {
      // silent fail in browser/edge environments
    }
  }
}

export const logger = new Logger();
