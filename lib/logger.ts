// Structured logger — outputs JSON lines that Vercel captures and makes searchable.
// Use this in all API routes and server-side lib functions.
// Never use console.log directly in API routes — use log.info/warn/error.

type Level = "info" | "warn" | "error";

function write(level: Level, message: string, data?: Record<string, unknown>) {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(data ?? {}),
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const log = {
  info: (message: string, data?: Record<string, unknown>) =>
    write("info", message, data),
  warn: (message: string, data?: Record<string, unknown>) =>
    write("warn", message, data),
  error: (message: string, data?: Record<string, unknown>) =>
    write("error", message, data),
};
