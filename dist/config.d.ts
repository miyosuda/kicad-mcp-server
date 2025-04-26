/**
 * Configuration handling for KiCAD MCP server
 */
import { z } from 'zod';
/**
 * Server configuration schema
 */
declare const ConfigSchema: z.ZodObject<{
    name: z.ZodDefault<z.ZodString>;
    version: z.ZodDefault<z.ZodString>;
    description: z.ZodDefault<z.ZodString>;
    pythonPath: z.ZodOptional<z.ZodString>;
    kicadPath: z.ZodOptional<z.ZodString>;
    logLevel: z.ZodDefault<z.ZodEnum<["error", "warn", "info", "debug"]>>;
    logDir: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    description: string;
    version: string;
    logLevel: "error" | "warn" | "info" | "debug";
    pythonPath?: string | undefined;
    kicadPath?: string | undefined;
    logDir?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    version?: string | undefined;
    pythonPath?: string | undefined;
    kicadPath?: string | undefined;
    logLevel?: "error" | "warn" | "info" | "debug" | undefined;
    logDir?: string | undefined;
}>;
/**
 * Server configuration type
 */
export type Config = z.infer<typeof ConfigSchema>;
/**
 * Load configuration from file
 *
 * @param configPath Path to the configuration file (optional)
 * @returns Loaded and validated configuration
 */
export declare function loadConfig(configPath?: string): Promise<Config>;
export {};
