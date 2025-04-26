/**
 * Logger for KiCAD MCP server
 */
type LogLevel = 'error' | 'warn' | 'info' | 'debug';
/**
 * Logger class for KiCAD MCP server
 */
declare class Logger {
    private logLevel;
    private logDir;
    /**
     * Set the log level
     * @param level Log level to set
     */
    setLogLevel(level: LogLevel): void;
    /**
     * Set the log directory
     * @param dir Directory to store log files
     */
    setLogDir(dir: string): void;
    /**
     * Log an error message
     * @param message Message to log
     */
    error(message: string): void;
    /**
     * Log a warning message
     * @param message Message to log
     */
    warn(message: string): void;
    /**
     * Log an info message
     * @param message Message to log
     */
    info(message: string): void;
    /**
     * Log a debug message
     * @param message Message to log
     */
    debug(message: string): void;
    /**
     * Log a message with the specified level
     * @param level Log level
     * @param message Message to log
     */
    private log;
}
export declare const logger: Logger;
export {};
