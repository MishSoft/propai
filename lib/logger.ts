export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, data ? JSON.stringify(data) : "");
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, data ? JSON.stringify(data) : "");
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error instanceof Error ? error.stack : error);
  },
  security: (message: string, data?: any) => {
    console.warn(`[SECURITY_ALERT] [${new Date().toISOString()}] ${message}`, JSON.stringify(data));
  }
};
