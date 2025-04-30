/**
 * Schematic generation tools for KiCAD MCP server
 *
 * Provides tools for creating, modifying, and exporting schematics
 * using the kicad-skip library
 */
/**
 * Register all schematic-related tools with the provided MCP tool handler
 *
 * @param addTool Function to register tools with the MCP server
 * @param pythonPath Path to Python interpreter
 * @param scriptBasePath Base path for Python scripts
 */
export declare const registerSchematicTools: (addTool: Function, pythonPath: string, scriptBasePath: string) => void;
